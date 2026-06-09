import os
import re
import json
import asyncio
import anthropic
from app.models.schemas import PersonalityProfile, CountryCard

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
MODEL = "claude-sonnet-4-6"


def extract_json(text: str):
    """Extract JSON from Claude response — handles markdown, truncation, and commentary."""
    text = text.strip()
    # Strip markdown fences
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text.strip()).strip()

    # Direct parse
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Find JSON object — try to fix truncation by closing open braces
    match = re.search(r"\{.*", text, re.DOTALL)
    if match:
        candidate = match.group()
        # Try direct parse first
        try:
            return json.loads(candidate)
        except json.JSONDecodeError:
            pass
        # Count open vs closed braces and add missing closing braces
        open_b = candidate.count("{")
        close_b = candidate.count("}")
        open_a = candidate.count("[")
        close_a = candidate.count("]")
        # Remove trailing incomplete line before closing
        lines = candidate.rstrip().split("\n")
        while lines and not lines[-1].strip().startswith('"') and lines[-1].strip() not in ["}", "]", "},", "],"]:
            lines.pop()
        candidate = "\n".join(lines)
        # Add missing closings
        candidate = candidate.rstrip().rstrip(",")
        candidate += "]" * max(0, open_a - close_a)
        candidate += "}" * max(0, open_b - close_b)
        try:
            return json.loads(candidate)
        except json.JSONDecodeError:
            pass

    # Find JSON array
    match = re.search(r"\[.*\]", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    raise ValueError(f"Cannot parse JSON. First 300 chars: {text[:300]}")


def _claude_sync(prompt: str, max_tokens: int) -> str:
    """Synchronous Claude call — always run via run_in_executor."""
    msg = client.messages.create(
        model=MODEL,
        max_tokens=max_tokens,
        messages=[{"role": "user", "content": prompt}],
    )
    return msg.content[0].text


async def call_claude(prompt: str, max_tokens: int = 1500) -> str:
    """Non-blocking async wrapper around sync Anthropic client."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, lambda: _claude_sync(prompt, max_tokens))


def build_recommendation_prompt(
    profile: PersonalityProfile,
    travel_start: str,
    travel_end: str,
    budget_eur: int,
    excluded_countries: list,
    nationality: str = "Unknown",
    origin_city: str = "",
    preferred_countries: list = [],
) -> str:
    avoid = ", ".join(profile.avoid) if profile.avoid else "nothing specific"
    excluded = ", ".join(excluded_countries) if excluded_countries else "none"
    interests = ", ".join(profile.interests) if profile.interests else "general travel"
    preferred = ", ".join(preferred_countries) if preferred_countries else "none"
    origin = origin_city if origin_city else "unspecified city"

    return f"""You are AtlasPlanner's AI travel expert. Recommend exactly 3 countries.

TRAVELER PASSPORT: {nationality}
FLYING FROM: {origin}
PREFERRED COUNTRIES (consider but do not force): {preferred}

TRAVELER: {profile.traveler_type}, {profile.pace} pace, traveling {profile.social}
INTERESTS: {interests}
AVOIDS: {avoid}
BUDGET STYLE: {profile.budget_style}
TRIP: {travel_start} to {travel_end}, total €{budget_eur}
EXCLUDE: {excluded}

For each recommended country, provide ACCURATE visa information specifically for {nationality} passport holders — visa-free, visa on arrival, e-visa, or embassy visa required. Include approximate cost if visa is required. Factor in geographic proximity from {origin} for travel feasibility.

CRITICAL: Your ENTIRE response must be a JSON array. Start with [ end with ]. Zero other text.

[
  {{
    "country": "string",
    "why_it_fits": "2-3 sentences",
    "weather_summary": "weather during those dates",
    "budget_fit": "perfect",
    "visa_info": "precise visa requirements for {nationality} passport holders",
    "currency": "currency and EUR rate",
    "best_cities": ["City1", "City2", "City3"],
    "wildcard_fact": "surprising fact",
    "match_score": 88
  }}
]

budget_fit = perfect OR tight OR comfortable (exactly one of these three words)
match_score = integer 0-100"""


def build_plan_prompt(
    profile: PersonalityProfile,
    country: str,
    city: str,
    travel_start: str,
    travel_end: str,
    budget_eur: int,
) -> str:
    from datetime import datetime
    try:
        d = (datetime.fromisoformat(travel_end) - datetime.fromisoformat(travel_start)).days
        num_days = min(max(d, 1), 4)
    except Exception:
        num_days = 3

    per_day = 2 if profile.pace in ("slow", "moderate") else 4
    avoid = ", ".join(profile.avoid) if profile.avoid else "nothing"
    interests = ", ".join(profile.interests) if profile.interests else "general"

    return f"""You are AtlasPlanner's itinerary builder. Create a {num_days}-day plan.

DESTINATION: {city}, {country}
DATES: {travel_start} to {travel_end}
TRAVELER: {profile.traveler_type}, {profile.pace} pace, {profile.social}
INTERESTS: {interests} | AVOIDS: {avoid}
BUDGET: €{budget_eur} total

RULES:
- Exactly {num_days} days
- Max {per_day} activities per day
- At least 1 food activity per day
- Mix hidden gems with classics
- Use SPECIFIC venue names (not "local market" but the actual market name)
- Include a local insider tip in each description
- Explain why a specific time is best for each activity
- estimated_cost_eur must be a real number (0 if free, never null)

CRITICAL: Your ENTIRE response must be a JSON object. Start with {{ end with }}. Zero other text.

{{
  "days": [
    {{
      "date": "2025-08-01",
      "theme": "Creative day title",
      "activities": [
        {{
          "time": "09:00",
          "title": "Activity name",
          "description": "What to do and why special — include insider tip and why this time is best",
          "location": "Specific venue name and neighborhood",
          "type": "culture",
          "estimated_cost_eur": 15.0,
          "google_maps_query": "Venue Name {city} {country}"
        }}
      ]
    }}
  ],
  "total_estimated_cost_eur": 350.0,
  "tips": ["Local tip 1", "Local tip 2", "Local tip 3"]
}}

type must be exactly one of: food, culture, nature, event, hidden_gem
estimated_cost_eur must be a number (0 if free)
google_maps_query must be: "venue name city" format for Google Maps search
Generate exactly {num_days} days. First day date: {travel_start}"""


async def get_country_recommendations(
    profile: PersonalityProfile,
    travel_start: str,
    travel_end: str,
    budget_eur: int,
    excluded_countries: list,
    nationality: str = "Unknown",
    origin_city: str = "",
    preferred_countries: list = [],
) -> list:
    prompt = build_recommendation_prompt(
        profile, travel_start, travel_end, budget_eur, excluded_countries,
        nationality=nationality, origin_city=origin_city, preferred_countries=preferred_countries,
    )
    print(f"[claude] Getting recommendations...")
    raw = await call_claude(prompt, max_tokens=1500)
    print(f"[claude] Got recommendations response, length: {len(raw)}")
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
    print(f"[claude] Generating plan for {city}, {country}...")
    raw = await call_claude(prompt, max_tokens=6000)
    print(f"[claude] Got plan response, length: {len(raw)}")
    result = extract_json(raw)

    # If Claude returned a list instead of the expected dict, wrap it
    if isinstance(result, list):
        result = {"days": result, "total_estimated_cost_eur": None, "tips": []}

    print(f"[claude] Parsed plan, days: {len(result.get('days', []))}")
    return result
