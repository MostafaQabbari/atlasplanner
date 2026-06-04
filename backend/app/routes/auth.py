import os
import httpx
from fastapi import APIRouter, HTTPException, Request

router = APIRouter()

EVENTS_SERVICE_URL = os.getenv("EVENTS_SERVICE_URL", "http://localhost:8080")


@router.post("/signup")
async def signup(request: Request):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{EVENTS_SERVICE_URL}/api/auth/signup", json=body, timeout=10.0)
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)
    return resp.json()


@router.post("/signin")
async def signin(request: Request):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{EVENTS_SERVICE_URL}/api/auth/signin", json=body, timeout=10.0)
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)
    return resp.json()
