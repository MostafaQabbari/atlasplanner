import os
import httpx
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.middleware.auth import get_current_user

router = APIRouter()

EVENTS_SERVICE_URL = os.getenv("EVENTS_SERVICE_URL", "http://localhost:8080")


class SaveTripRequest(BaseModel):
    country: str
    city: str
    startDate: str
    endDate: str
    planJson: str
    matchScore: Optional[int] = None


def _auth_header(current_user: dict) -> str:
    return f"Bearer {current_user['raw_token']}"


@router.post("/save")
async def save_trip(request: SaveTripRequest, current_user: dict = Depends(get_current_user)):
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{EVENTS_SERVICE_URL}/api/trips/save",
            json=request.dict(),
            headers={"Authorization": _auth_header(current_user)},
            timeout=10.0,
        )
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)
    return resp.json()


@router.get("/")
async def get_trips(current_user: dict = Depends(get_current_user)):
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{EVENTS_SERVICE_URL}/api/trips",
            headers={"Authorization": _auth_header(current_user)},
            timeout=10.0,
        )
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)
    return resp.json()
