from pydantic import BaseModel
from typing import Optional, List


# ── Quiz ──────────────────────────────────────────
class QuizAnswer(BaseModel):
    question_id: str
    answer: str


class QuizSubmission(BaseModel):
    answers: list[QuizAnswer]


class PersonalityProfile(BaseModel):
    traveler_type: str          # e.g. "Adventure Seeker", "Culture Lover"
    pace: str                   # "slow", "moderate", "fast"
    social: str                 # "solo", "couple", "group"
    interests: list[str]        # ["food", "history", "nature", ...]
    avoid: list[str]            # ["crowds", "museums", "beaches", ...]
    budget_style: str           # "backpacker", "mid-range", "luxury"
    nationality: str = "Unknown"
    duration: Optional[str] = None
    accommodation: Optional[str] = None
    language_comfort: Optional[str] = None
    scenery: Optional[str] = None
    safety_priority: Optional[str] = None
    raw_answers: list[QuizAnswer]


# ── Recommendation Request ─────────────────────────
class RecommendRequest(BaseModel):
    profile: PersonalityProfile
    travel_start: str           # ISO date e.g. "2025-08-01"
    travel_end: str             # ISO date e.g. "2025-08-14"
    budget_eur: int             # total budget in EUR
    excluded_countries: Optional[list[str]] = []
    nationality: str = "Unknown"
    origin_city: str = ""
    preferred_countries: List[str] = []


class CountryCard(BaseModel):
    country: str
    why_it_fits: str
    weather_summary: str
    budget_fit: str             # "perfect", "tight", "comfortable"
    visa_info: str
    currency: str
    best_cities: list[str]
    wildcard_fact: str
    image_url: Optional[str] = None
    match_score: int            # 0-100


class RecommendResponse(BaseModel):
    recommendations: list[CountryCard]


# ── Plan Request ───────────────────────────────────
class PlanRequest(BaseModel):
    profile: PersonalityProfile
    country: str
    city: str
    travel_start: str
    travel_end: str
    budget_eur: int
    customizations: List[str] = []


class DayActivity(BaseModel):
    time: str
    title: str
    description: str
    location: str
    type: str                   # "food", "culture", "nature", "event", "hidden_gem"
    estimated_cost_eur: Optional[float] = None
    google_maps_query: Optional[str] = None
    opening_hours: Optional[str] = None
    opening_warning: Optional[str] = None


class DayPlan(BaseModel):
    date: str
    weather: Optional[str] = None
    photo_url: Optional[str] = None
    theme: str
    activities: list[DayActivity]
    events: Optional[list[str]] = []
    typical_weather: Optional[str] = None


class PlanResponse(BaseModel):
    country: str
    city: str
    days: list[DayPlan]
    total_estimated_cost_eur: Optional[float] = None
    tips: list[str]
