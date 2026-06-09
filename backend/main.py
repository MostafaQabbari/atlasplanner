import os
from dotenv import load_dotenv

load_dotenv()  # ← must be before ALL other imports so env vars are available

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import quiz, recommend, plan, weather, places, trips, auth, flights

app = FastAPI(
    title="AtlasPlanner API",
    description="AI-powered travel planner backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        os.getenv("FRONTEND_URL", "http://localhost:5173"),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(quiz.router,       prefix="/api/quiz",       tags=["Quiz"])
app.include_router(recommend.router,  prefix="/api/recommend",  tags=["Recommendations"])
app.include_router(plan.router,       prefix="/api/plan",       tags=["Plan"])
app.include_router(weather.router,    prefix="/api/weather",    tags=["Weather"])
app.include_router(places.router,     prefix="/api/places",     tags=["Places"])
app.include_router(trips.router,      prefix="/api/trips",      tags=["Trips"])
app.include_router(auth.router,       prefix="/api/auth",       tags=["Auth"])
app.include_router(flights.router,    prefix="/api/flights",    tags=["Flights"])


@app.on_event("startup")
async def validate_env():
    required = [
        "ANTHROPIC_API_KEY",
        "OPENWEATHER_API_KEY",
        "UNSPLASH_ACCESS_KEY",
        "GOOGLE_PLACES_API_KEY",
        "EVENTS_SERVICE_URL",
    ]
    missing = [k for k in required if not os.getenv(k)]
    if missing:
        print(f"WARNING: Missing env vars: {missing}")


@app.get("/")
def root():
    return {"message": "AtlasPlanner API is running 🌍"}
