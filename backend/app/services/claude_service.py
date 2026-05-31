import os
import json
import anthropic
from app.models.schemas import PersonalityProfile, CountryCard, DayPlan

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


def build_recommendation_prompt(
    profile: PersonalityProfile,
    travel_start: str,
    travel_end: str,
    budget_eur: int,
    excluded_countries: list[str],
) -> str:
    return f"""
You are AtlasPlanner's AI travel expert. Based on the traveler profile and constraints below,
recommend exactly 3 countries that are the best fit.

TRAVELER PROFILE:
- Type: {profile.traveler_type}
- Pace: {profile.pace}
- Travel style: {profile.social}
- Interests: {', '.join(profile.interests)}
- Wants to avoid: {', '.join(profile.avoid)}
- Budget style: {profile.budget_style}

TRIP DETAILS:
- Travel dates: {travel_start} to {travel_end}
- Total budget: €{budget_eur}
- Excluded countries: {', '.join(excluded_countries) if excluded_countries else 'None'}

Consider: weather/season during those dates, budget fit, personality match, visa ease for EU/German residents.

Respond ONLY with a valid JSON array of exactly 3 objects. No preamble, no markdown, no extra text.
Each object must have these exact keys:
{{
  "country": "string",
  "why_it_fits": "2-3 sentences explaining personality match",
  "weather_summary": "what weather to expect during those dates",
  "budget_fit": "perfect | tight | comfortable",
  "visa_info": "visa requirements for German passport holders",
  "currency": "local currency name and rough EUR exchange",
  "best_cities": ["city1", "city2", "city3"],
  "wildcard_fact": "one surprising or delightful fact about traveling there",
  "match_score": 0-100
}}
"""


def build_plan_prompt(
    profile: PersonalityProfile,
    country: str,
    city: str,
    travel_start: str,
    travel_end: str,
    budget_eur: int,
) -> str:
    return f"""
You are AtlasPlanner's AI itinerary builder. Create a detailed day-by-day travel plan.

TRAVELER PROFILE:
- Type: {profile.traveler_type}
- Pace: {profile.pace}
- Travel style: {profile.social}
- Interests: {', '.join(profile.interests)}
- Wants to avoid: {', '.join(profile.avoid)}

TRIP DETAILS:
- Destination: {city}, {country}
- Dates: {travel_start} to {travel_end}
- Total budget: €{budget_eur}

Rules:
- Match the traveler's pace (slow = max 2-3 activities/day, fast = 4-5)
- Include hidden gems, not just tourist traps (unless profile likes popular spots)
- Add at least one local food experience per day
- Include estimated costs in EUR
- Give each day a creative theme name

Respond ONLY with valid JSON. No preamble, no markdown, no extra text.
Format:
{{
  "days": [
    {{
      "date": "YYYY-MM-DD",
      "theme": "string",
      "activities": [
        {{
          "time": "09:00",
          "title": "string",
          "description": "string",
          "location": "string",
          "type": "food | culture | nature | event | hidden_gem",
          "estimated_cost_eur": 0.0
        }}
      ]
    }}
  ],
  "total_estimated_cost_eur": 0.0,
  "tips": ["tip1", "tip2", "tip3"]
}}
"""


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

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1500,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = message.content[0].text.strip()
    data = json.loads(raw)

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

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=3000,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = message.content[0].text.strip()
    return json.loads(raw)
