from __future__ import annotations

import os
import time
from typing import Any, Optional

import httpx
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

DEFAULT_KEYS = (
    "sk_c975e19bcd2a660d47f0394a38c36b49ba47ac55,"
    "sk_1ec9f184450d9cb1d49f1da6d7d1615183f0aa3c,"
    "sk_5579c001283809da7684dd3f0f07d98f0b783522,"
    "sk_fad0ba345b42c5975afd30d292b34ccdce133150,"
    "sk_508930c62a8ea2ea6fd7817ba34ed6933bd0dcb5,"
    "sk_2f030cb63910be80e808c2874a976b1ba8f6fb63"
)
KEYS = [k.strip() for k in os.environ.get("TWEET_API_KEYS", DEFAULT_KEYS).split(",") if k.strip()]
BASE = "https://api.tweetapi.com"

app = FastAPI(title="rialo-x-proxy")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["*"],
)

_state = {"index": 0}
_exhausted: set[int] = set()
_cache: dict[str, dict[str, Any]] = {}


def _next_key() -> Optional[tuple[int, str]]:
    n = len(KEYS)
    for i in range(n):
        idx = (_state["index"] + i) % n
        if idx not in _exhausted:
            _state["index"] = idx
            return idx, KEYS[idx]
    return None


async def _call(path: str, params: dict[str, Any]) -> tuple[int, dict[str, Any]]:
    cache_key = f"{path}?{sorted(params.items())}"
    hit = _cache.get(cache_key)
    if hit and time.time() - hit["at"] < hit["ttl"]:
        return hit["status"], hit["body"]

    last: Optional[tuple[int, dict[str, Any]]] = None
    timeout = httpx.Timeout(connect=10.0, read=70.0, write=10.0, pool=10.0)
    async with httpx.AsyncClient(timeout=timeout) as client:
        for _ in range(len(KEYS)):
            picked = _next_key()
            if not picked:
                break
            idx, key = picked
            try:
                resp = await client.get(BASE + path, params=params, headers={"X-API-Key": key})
                if resp.status_code in (401, 403, 429):
                    _exhausted.add(idx)
                    _state["index"] = (idx + 1) % len(KEYS)
                    last = (resp.status_code, _safe_json(resp))
                    continue
                if resp.status_code >= 500:
                    return resp.status_code, _safe_json(resp)
                body = _safe_json(resp)
                ttl = 120 if resp.is_success else 5
                _cache[cache_key] = {"at": time.time(), "ttl": ttl, "status": resp.status_code, "body": body}
                return resp.status_code, body
            except httpx.HTTPError as exc:
                _state["index"] = (idx + 1) % len(KEYS)
                last = (504, {"error": str(exc)})
    if last:
        return last
    return 503, {"error": "all api keys exhausted"}


def _safe_json(resp: httpx.Response) -> dict[str, Any]:
    try:
        return resp.json()
    except Exception:
        return {"error": "non-json response", "text": resp.text[:500]}


@app.get("/")
async def root() -> dict[str, str]:
    return {"service": "rialo-x-proxy"}


@app.get("/healthz")
async def health() -> dict[str, Any]:
    return {
        "keys_total": len(KEYS),
        "keys_exhausted": len(_exhausted),
        "cache_size": len(_cache),
    }


@app.get("/api/x/profile")
async def x_profile(username: str = Query("RialoHQ")) -> JSONResponse:
    status, body = await _call("/tw-v2/user/by-username", {"username": username})
    return JSONResponse(status_code=status, content=body)


@app.get("/api/x/tweets")
async def x_tweets(userId: str = Query(...), cursor: Optional[str] = None) -> JSONResponse:
    params: dict[str, Any] = {"userId": userId}
    if cursor:
        params["cursor"] = cursor
    status, body = await _call("/tw-v2/user/tweets", params)
    return JSONResponse(status_code=status, content=body)
