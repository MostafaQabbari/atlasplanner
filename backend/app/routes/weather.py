from fastapi import APIRouter, HTTPException
from app.services.weather_service import get_forecast, get_current_weather

router = APIRouter()


@router.get("/{city}")
async def forecast(city: str):
    try:
        return await get_forecast(city)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{city}/current")
async def current(city: str):
    try:
        return await get_current_weather(city)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
