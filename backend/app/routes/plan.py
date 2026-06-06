from fastapi import APIRouter, HTTPException
from app.models.schemas import PlanRequest, PlanResponse, DayPlan, DayActivity
from app.services import claude_service

router = APIRouter()

VALID_TYPES = {"food", "culture", "nature", "event", "hidden_gem"}


@router.post("/", response_model=PlanResponse)
async def generate_plan(request: PlanRequest) -> PlanResponse:
    print(f"[plan] Request: {request.city}, {request.country}, {request.travel_start} to {request.travel_end}")
    try:
        plan_data = await claude_service.generate_travel_plan(
            profile=request.profile,
            country=request.country,
            city=request.city,
            travel_start=request.travel_start,
            travel_end=request.travel_end,
            budget_eur=request.budget_eur,
        )
        print(f"[plan] Plan data received, days: {len(plan_data.get('days', []))}")

        days = []
        for i, day in enumerate(plan_data.get("days", [])):
            try:
                activities = []
                for a in day.get("activities", []):
                    act_type = str(a.get("type", "culture")).lower().replace(" ", "_")
                    if act_type not in VALID_TYPES:
                        act_type = "culture"
                    cost = a.get("estimated_cost_eur")
                    try:
                        cost = float(cost) if cost is not None else None
                    except (TypeError, ValueError):
                        cost = None
                    activities.append(DayActivity(
                        time=str(a.get("time", "09:00")),
                        title=str(a.get("title", "Activity")),
                        description=str(a.get("description", "")),
                        location=str(a.get("location", "")),
                        type=act_type,
                        estimated_cost_eur=cost,
                    ))
                days.append(DayPlan(
                    date=str(day.get("date", "")),
                    theme=str(day.get("theme", f"Day {i+1}")),
                    weather=day.get("weather"),
                    activities=activities,
                    events=day.get("events") or [],
                ))
            except Exception as day_err:
                print(f"[plan] Skipping day {i}: {day_err}")
                continue

        total = plan_data.get("total_estimated_cost_eur")
        try:
            total = float(total) if total is not None else None
        except (TypeError, ValueError):
            total = None

        tips = plan_data.get("tips") or []
        tips = [str(t) for t in tips if t]

        response = PlanResponse(
            country=request.country,
            city=request.city,
            days=days,
            total_estimated_cost_eur=total,
            tips=tips,
        )
        print(f"[plan] Success: {len(days)} days, {sum(len(d.activities) for d in days)} activities")
        return response

    except Exception as e:
        import traceback
        print(f"[plan] FATAL ERROR: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Plan generation failed: {str(e)}")