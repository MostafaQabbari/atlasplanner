from fastapi import APIRouter, HTTPException
from app.models.schemas import PlanRequest, PlanResponse, DayPlan, DayActivity
from app.services import claude_service, weather_service

router = APIRouter()


@router.post("/", response_model=PlanResponse)
async def generate_plan(request: PlanRequest) -> PlanResponse:
    """Generate a full day-by-day itinerary for a chosen destination."""
    try:
        plan_data = await claude_service.generate_travel_plan(
            profile=request.profile,
            country=request.country,
            city=request.city,
            travel_start=request.travel_start,
            travel_end=request.travel_end,
            budget_eur=request.budget_eur,
        )

        days = [
            DayPlan(
                date=day["date"],
                theme=day["theme"],
                activities=[DayActivity(**a) for a in day["activities"]],
            )
            for day in plan_data.get("days", [])
        ]

        return PlanResponse(
            country=request.country,
            city=request.city,
            days=days,
            total_estimated_cost_eur=plan_data.get("total_estimated_cost_eur"),
            tips=plan_data.get("tips", []),
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
