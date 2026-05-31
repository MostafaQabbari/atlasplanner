from fastapi import APIRouter, HTTPException
from app.services.country_service import get_city_summary, get_country_info

router = APIRouter()


@router.get("/city/{city}")
async def city_info(city: str):
    try:
        return await get_city_summary(city)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/country/{country}")
async def country_info(country: str):
    try:
        return await get_country_info(country)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
