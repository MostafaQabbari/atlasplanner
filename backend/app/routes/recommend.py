import asyncio
from fastapi import APIRouter, HTTPException
from app.models.schemas import RecommendRequest, RecommendResponse
from app.services import claude_service, weather_service, country_service

router = APIRouter()


@router.post("/", response_model=RecommendResponse)
async def recommend_countries(request: RecommendRequest) -> RecommendResponse:
    """
    Core AI endpoint: takes personality profile + trip details,
    returns top 3 country recommendations with enriched data.
    """
    try:
        # Step 1: Ask Claude for country recommendations
        recommendations = await claude_service.get_country_recommendations(
            profile=request.profile,
            travel_start=request.travel_start,
            travel_end=request.travel_end,
            budget_eur=request.budget_eur,
            excluded_countries=request.excluded_countries or [],
        )

        # Step 2: Enrich each country in parallel
        async def enrich(card):
            country_info, city_summary = await asyncio.gather(
                country_service.get_country_info(card.country),
                country_service.get_city_summary(card.best_cities[0]) if card.best_cities else asyncio.sleep(0),
            )
            # Attach flag as image if no Unsplash image
            if not card.image_url and isinstance(country_info, dict):
                card.image_url = country_info.get("flag_url")
            return card

        enriched = await asyncio.gather(*[enrich(card) for card in recommendations])

        return RecommendResponse(recommendations=list(enriched))

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
