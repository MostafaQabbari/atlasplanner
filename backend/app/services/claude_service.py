import os
import re
import json
import asyncio
import anthropic
from app.models.schemas import PersonalityProfile, CountryCard, DayPlan

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


def extract_json(text: str):
    """Robustly extract JSON from Claude's response even if it adds markdown or commentary."""
    text = text.strip()

    # Remove markdown code fences if present: ```json ... ``` or ``` ... ```
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text.strip())
    text = text.strip()

    # Try direct parse first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Try to find a JSON array
    match = re.search(r"\[.*\]", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    # Try to find a JSON object
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    raise ValueError(f"Could not extract JSON from response. First 300 chars: {text[:300]}")


def build_recommendation_prompt(
    profile: PersonalityProfile,
    travel_start: str,
    travel_end: str,
    budget_eur: int,
    excluded_countries: list[str],
) -> str:
    return f"""You are AtlasPlanner's AI travel expert. Based on the traveler profile below, recommend exactly 3 countries.

TRAVELER PROFILE:
- Type: {profile.traveler_type}
- Pace: {profile.pace}
- Travel style: {profile.social}
- Interests: {', '.join(profile.interests)}
- Wants to avoid: {', '.join(profile.avoid) if profile.avoid else 'Nothing specific'}
- Budget style: {profile.budget_style}

TRIP DETAILS:
- Travel dates: {travel_start} to {travel_end}
- Total budget: €{budget_eur}
- Excluded countries: {', '.join(excluded_countries) if excluded_countries else 'None'}

Consider weather/season, budget fit, personality match, and visa ease for German passport holders.

IMPORTANT: Your entire response must be ONLY a JSON array. Start with [ and end with ]. No markdown, no code fences, no explanation before or after.

Return exactly this structure:
[
  {{
    "country": "string",
    "why_it_fits": "2-3 sentences explaining personality match",
    "weather_summary": "what weather to expect during those dates",
    "budget_fit": "perfect",
    "visa_info": "visa requirements for German passport holders",
    "currency": "local currency name and rough EUR exchange",
    "best_cities": ["city1", "city2", "city3"],
    "wildcard_fact": "one surprising or delightful fact about traveling there",
    "match_score": 92
  }}
]

budget_fit must be exactly one of: perfect, tight, comfortable
match_score must be a number between 0 and 100"""


def build_plan_prompt(
    profile: PersonalityProfile,
    country: str,
    city: str,
    travel_start: str,
    travel_end: str,
    budget_eur: int,
) -> str:
    return f"""You are AtlasPlanner's AI itinerary builder. Create a day-by-day travel plan.

TRAVELER PROFILE:
- Type: {profile.traveler_type}
- Pace: {profile.pace}
- Travel style: {profile.social}
- Interests: {', '.join(profile.interests)}
- Wants to avoid: {', '.join(profile.avoid) if profile.avoid else 'Nothing specific'}

TRIP DETAILS:
- Destination: {city}, {country}
- Dates: {travel_start} to {travel_end}
- Total budget: €{budget_eur}

Rules:
- slow pace = max 2-3 activities/day, fast = 4-5 activities/day
- Include at least one local food experience per day
- Include hidden gems, not just tourist traps
- Include estimated costs in EUR
- Give each day a creative theme name

IMPORTANT: Your entire response must be ONLY a JSON object. Start with {{ and end with }}. No markdown, no code fences, no explanation.

Return exactly this structure:
{{
  "days": [
    {{
      "date": "YYYY-MM-DD",
      "theme": "Creative day theme",
      "activities": [
        {{
          "time": "09:00",
          "title": "Activity name",
          "description": "What to do and why it's special",
          "location": "Specific location name",
          "type": "culture",
          "estimated_cost_eur": 15.0
        }}
      ]
    }}
  ],
  "total_estimated_cost_eur": 450.0,
  "tips": ["tip1", "tip2", "tip3"]
}}

type must be exactly one of: food, culture, nature, event, hidden_gem"""


async def get_country_recommendations(
    profile: PersonalityProfile,
    travel_start: str,
    travel_end: str,
    budget_eur: int,
    excluded_countries: list[str],
) -> list[CountryCard]:
    prompt = build_recommendation_prompt(
        profile, travel_start, travel_end, budget_eur, excluded_countries
    )

    # Run sync client in thread pool to avoid blocking the async event loop
    message = await asyncio.get_event_loop().run_in_executor(
        None,
        lambda: client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1500,
            messages=[{"role": "user", "content": prompt}],
        ),
    )

    raw = message.content[0].text
    data = extract_json(raw)

    return [CountryCard(**item) for item in data]


async def generate_travel_plan(
    profile: PersonalityProfile,
    country: str,
    city: str,
    travel_start: str,
    travel_end: str,
    budget_eur: int,
) -> dict:
    prompt = build_plan_prompt(
        profile, country, city, travel_start, travel_end, budget_eur
    )

    # Run sync client in thread pool to avoid blocking the async event loop
    message = await asyncio.get_event_loop().run_in_executor(
        None,
        lambda: client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=3000,
            messages=[{"role": "user", "content": prompt}],
        ),
    )

    raw = message.content[0].text
    return extract_json(raw)