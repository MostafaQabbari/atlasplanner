from fastapi import APIRouter
from app.models.schemas import QuizSubmission, PersonalityProfile

router = APIRouter()

# Personality mapping logic based on quiz answers
INTEREST_MAP = {
    "street_food": "food",
    "fine_dining": "food",
    "museums": "culture",
    "temples": "culture",
    "hiking": "nature",
    "beaches": "beaches",
    "nightlife": "nightlife",
    "markets": "local_life",
    "architecture": "culture",
}


@router.post("/", response_model=PersonalityProfile)
async def submit_quiz(submission: QuizSubmission) -> PersonalityProfile:
    """
    Process quiz answers and return a personality profile.
    This maps raw answers into a structured traveler DNA.
    """
    answers = {a.question_id: a.answer for a in submission.answers}

    # Determine traveler type
    activity = answers.get("activity", "culture")
    pace_answer = answers.get("pace", "moderate")
    social_answer = answers.get("social", "couple")
    budget_answer = answers.get("budget", "mid-range")
    avoid_answer = answers.get("avoid", "none")

    type_map = {
        "hiking": "Adventure Seeker",
        "museums": "Culture Lover",
        "beaches": "Beach & Relax",
        "street_food": "Food Explorer",
        "nightlife": "Social Butterfly",
        "markets": "Local Immersion",
        "architecture": "Culture Lover",
    }
    traveler_type = type_map.get(activity, "Explorer")

    interests = [INTEREST_MAP.get(activity, activity)]
    if answers.get("secondary"):
        interests.append(INTEREST_MAP.get(answers["secondary"], answers["secondary"]))

    avoid = [avoid_answer] if avoid_answer != "none" else []

    return PersonalityProfile(
        traveler_type=traveler_type,
        pace=pace_answer,
        social=social_answer,
        interests=interests,
        avoid=avoid,
        budget_style=budget_answer,
        raw_answers=submission.answers,
    )
