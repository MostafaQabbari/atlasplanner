from fastapi import APIRouter, Query
from app.services import flight_service

router = APIRouter()


@router.get("/estimate")
async def estimate_flight(
    from_city: str = Query(default="", alias="from"),
    to: str = "",
    date: str = "",
):
    result = await flight_service.get_flight_estimate(
        origin_city=from_city,
        destination_country=to,
        travel_date=date,
    )
    return result
