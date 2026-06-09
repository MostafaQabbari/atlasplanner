<!-- # 🌍 AtlasPlanner

> AI-powered travel planner that recommends countries and builds personalized itineraries based on your personality, travel dates, and budget.

## ✨ Features

- 🧠 **Personality Quiz** → builds your unique traveler DNA
- 🗺️ **AI Country Recommendations** → based on personality + season + budget
- 📅 **Day-by-day Itinerary** → with real venues, events, and hidden gems
- 🌤️ **Weather Forecast** → per travel day at your destination
- 🎭 **Local Events** → from Ticketmaster & Eventbrite
- 🐳 **Fully Dockerized** → one command to run everything

## 🏗️ Architecture

```
Frontend (React + TypeScript)
        ↓
Backend (Python FastAPI) ← Main AI orchestrator
        ↓              ↓
Events Service     External APIs
(Java Spring Boot) (Claude, OpenWeather,
                    Wikipedia, Google Places,
                    REST Countries, Unsplash)
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, TailwindCSS |
| Backend | Python 3.11, FastAPI |
| Microservice | Java 17, Spring Boot |
| AI | Anthropic Claude API |
| Containerization | Docker, Docker Compose |

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Python 3.11+
- Java 17+

### Run with Docker
```bash
git clone https://github.com/MostafaQabbari/atlasplanner.git
cd atlasplanner
cp .env.example .env
# Fill in your API keys in .env
docker-compose up --build
```

### Run locally (development)

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Events Service:**
```bash
cd events-service
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🔑 API Keys Required

| API | Free Tier | Link |
|-----|-----------|------|
| Anthropic Claude | $5 free credit | [console.anthropic.com](https://console.anthropic.com) |
| OpenWeatherMap | 1000 calls/day | [openweathermap.org](https://openweathermap.org/api) |
| Google Places | $200/month credit | [console.cloud.google.com](https://console.cloud.google.com) |
| Ticketmaster | Free dev tier | [developer.ticketmaster.com](https://developer.ticketmaster.com) |
| Unsplash | 50 req/hour | [unsplash.com/developers](https://unsplash.com/developers) |
| REST Countries | No key needed | Free |
| Wikipedia | No key needed | Free |

## 📁 Project Structure

```
atlasplanner/
├── backend/              # Python FastAPI
│   ├── main.py
│   ├── requirements.txt
│   └── app/
│       ├── routes/       # API endpoints
│       ├── services/     # Business logic + API calls
│       └── models/       # Pydantic schemas
├── events-service/       # Java Spring Boot
│   ├── pom.xml
│   └── src/
├── frontend/             # React + TypeScript
│   ├── src/
│   └── package.json
└── docker-compose.yml
```

## 🗺️ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/quiz` | Submit personality quiz |
| POST | `/api/recommend` | Get AI country recommendations |
| POST | `/api/plan` | Generate full itinerary |
| GET | `/api/weather/{city}` | Get weather forecast |
| GET | `/api/places/{city}` | Get attractions |
| GET | `/api/events/{country}` | Get local events (via Java service) |

## 👨‍💻 Author

**Mostafa Saad** — [github.com/MostafaQabbari](https://github.com/MostafaQabbari)

## 📄 License

MIT -->
# 🌍 AtlasPlanner

> AI-powered travel planner that learns your personality, recommends perfect destinations, and builds a complete day-by-day itinerary — with real weather, local events, venue photos, and Google Maps links.

Built as a portfolio project targeting EU Blue Card positions in Germany. Demonstrates a production-grade polyglot microservices architecture: Python + Java + TypeScript + PostgreSQL + Docker.

---

## ✨ What It Does

1. **Personality Quiz** — 10 questions that map your travel DNA: pace, vibe, accommodation style, food philosophy, what you avoid, and how you photograph the world.
2. **Nationality-aware recommendations** — AI picks 3 destinations with accurate visa requirements for *your specific passport*, real budget fit, and weather for your exact travel dates.
3. **Day-by-day itinerary** — Real venue names, insider tips, hidden gems, and the best time to visit each spot. Not "local market" — the actual market's name.
4. **Live weather per day** — OpenWeatherMap forecast matched to each day of your plan.
5. **Local events** — Ticketmaster events happening while you're there, shown inside the relevant plan day.
6. **Google Maps links** — Every activity has a "📍 View on Maps" button that opens the exact venue.
7. **Save & dashboard** — Save plans to PostgreSQL, view them on your personal dashboard.
8. **Customize plan** — Slide-in panel: add more food, slow the pace, request hidden gems only, add a day trip. Regenerate with Claude instantly.

---

## 🏗️ Architecture

```
React 18 + TypeScript (port 5173)
           │
           │  REST/JSON + JWT Bearer
           ▼
Python FastAPI (port 8000)  ──────► Anthropic Claude API
           │                ──────► OpenWeatherMap API
           │                ──────► Unsplash API
           │                ──────► Google Places API
           │                ──────► Wikipedia (no key)
           │
           │  HTTP proxy (httpx)
           ▼
Java Spring Boot (port 8080) ─────► Ticketmaster API
           │
           │  JPA / Hibernate
           ▼
PostgreSQL 16 (port 5433 host / 5432 internal)
```

All four services run on a shared Docker bridge network (`atlasplanner-net`). FastAPI never touches PostgreSQL directly — it always proxies through Spring Boot, preserving data ownership boundaries.

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React, TypeScript, Vite, Tailwind CSS, Framer Motion | React 18, TS 5 |
| Backend | Python, FastAPI, Uvicorn, Pydantic v2, httpx | Python 3.11 |
| Auth & Data | Java, Spring Boot, Spring Security, JJWT, JPA | Java 17, SB 3.2 |
| Database | PostgreSQL | 16 |
| AI | Anthropic Claude | claude-sonnet-4-6 |
| Containerization | Docker, Docker Compose | — |
| Fonts | Playfair Display (headings), DM Sans (body) | — |

---

## 🚀 Getting Started

### Prerequisites

- Docker Desktop (includes Docker Compose)
- Node.js 18+ (for local frontend dev)
- Python 3.11 (for local backend dev)
- Java 17 + Maven (for local events-service dev)

### Run Everything with Docker (Recommended)

```bash
git clone https://github.com/MostafaQabbari/atlasplanner.git
cd atlasplanner

# Copy env file and fill in your API keys
cp .env.example .env
# Edit .env with your keys

docker-compose up --build
```

Open **http://localhost:5173** — the full stack is live.

> ⚠️ First build takes 5–10 minutes (downloads base images, compiles Java). Subsequent starts are fast.

### Run Locally (Development — Faster Iteration)

**Terminal 1 — PostgreSQL only via Docker:**
```bash
docker-compose up postgres
```

**Terminal 2 — Spring Boot events service:**
```bash
cd events-service
./mvnw spring-boot:run          # Mac/Linux
.\mvnw.cmd spring-boot:run      # Windows
```

**Terminal 3 — Python FastAPI backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

**Terminal 4 — React frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` and fill in your keys:

```env
# AI (required — all core features depend on this)
ANTHROPIC_API_KEY=

# Weather (required — shown per travel day in the plan)
OPENWEATHER_API_KEY=

# Photos (required — country cards and landing page)
UNSPLASH_ACCESS_KEY=

# Events (required — local events in the plan)
TICKETMASTER_API_KEY=

# Places (optional — venue enrichment)
GOOGLE_PLACES_API_KEY=

# Database
DB_USER=atlas_user
DB_PASSWORD=atlas_pass
DB_NAME=atlasplanner
DB_HOST=postgres
DB_PORT=5432

# Auth
JWT_SECRET=your-long-random-secret-here
JWT_EXPIRY_HOURS=168

# Services
EVENTS_SERVICE_URL=http://localhost:8080
VITE_API_BASE_URL=http://localhost:8000
VITE_UNSPLASH_ACCESS_KEY=   # same as UNSPLASH_ACCESS_KEY
```

### Where to Get Each Key

| API | Free Tier | Sign Up |
|-----|-----------|---------|
| Anthropic Claude | $5 free credit | [console.anthropic.com](https://console.anthropic.com) |
| OpenWeatherMap | 1,000 calls/day | [openweathermap.org/api](https://openweathermap.org/api) |
| Unsplash | 50 requests/hour | [unsplash.com/developers](https://unsplash.com/developers) |
| Ticketmaster | 5,000 calls/day | [developer.ticketmaster.com](https://developer.ticketmaster.com) |
| Google Places | $200/month free credit | [console.cloud.google.com](https://console.cloud.google.com) |

---

## 📁 Project Structure

```
atlasplanner/
│
├── backend/                        # Python FastAPI — AI orchestrator
│   ├── main.py                     # App entry point, CORS, router registration
│   ├── requirements.txt
│   └── app/
│       ├── routes/
│       │   ├── quiz.py             # POST /api/quiz/ — maps answers → PersonalityProfile
│       │   ├── recommend.py        # POST /api/recommend/ — Claude + enrichment
│       │   ├── plan.py             # POST /api/plan/ — Claude day-by-day itinerary
│       │   ├── weather.py          # GET /api/weather/{city}
│       │   ├── places.py           # GET /api/places/city/{city}
│       │   ├── trips.py            # GET/POST /api/trips/ — proxies to Spring Boot
│       │   └── auth.py             # POST /api/auth/* — proxies to Spring Boot
│       ├── services/
│       │   ├── claude_service.py   # Anthropic SDK wrapper + prompt builders
│       │   ├── weather_service.py  # OpenWeatherMap integration
│       │   └── country_service.py  # Wikipedia + REST Countries
│       └── models/
│           └── schemas.py          # Pydantic models (all request/response types)
│
├── events-service/                 # Java Spring Boot — auth + data persistence
│   ├── pom.xml
│   └── src/main/java/com/atlasplanner/events/
│       ├── controller/
│       │   ├── AuthController.java     # POST /api/auth/signup, /signin
│       │   ├── TripController.java     # POST /api/trips/save, GET /api/trips/
│       │   └── EventsController.java   # GET /api/events/{countryCode}
│       ├── model/
│       │   ├── User.java               # JPA entity
│       │   ├── SavedTrip.java          # JPA entity
│       │   └── Event.java              # Ticketmaster event model
│       ├── service/
│       │   ├── AuthService.java        # BCrypt + JJWT
│       │   ├── TripService.java        # CRUD for saved trips
│       │   └── EventsService.java      # Ticketmaster API client
│       └── security/
│           ├── JwtService.java
│           ├── JwtAuthFilter.java
│           └── SecurityConfig.java
│
├── frontend/                       # React 18 + TypeScript
│   ├── index.html                  # Loads Playfair Display + DM Sans fonts
│   ├── public/
│   │   └── favicon.svg             # Planet earth SVG
│   └── src/
│       ├── App.tsx                 # Root: auth state, screen router, navbar, auth modal
│       ├── main.tsx
│       ├── index.css               # Global styles + keyframe animations
│       ├── context/
│       │   └── QuizContext.tsx     # Global quiz state (profile, recommendations, plan)
│       ├── pages/
│       │   ├── LandingPage.tsx     # Hero, destination pills, features grid
│       │   ├── QuizPage.tsx        # 10-question quiz + TripDetailsForm
│       │   ├── RecommendationsPage.tsx  # 3 country cards with MatchScoreRing
│       │   ├── PlanPage.tsx        # Day accordions, customize panel, save button
│       │   └── SignInPage.tsx      # Redirect page (auth is modal in App.tsx)
│       ├── components/
│       │   ├── quiz/               # ProgressBar, QuestionCard, TripDetailsForm, LoadingScreen
│       │   ├── recommendations/    # CountryCardComponent, MatchScoreRing, ProfileBadge
│       │   └── plan/               # DayCard, PlanLoading, PlanSummary, activityConfig
│       ├── services/
│       │   └── api.ts              # Axios instance, interceptors, all API calls
│       └── types/
│           └── index.ts            # TypeScript interfaces for all domain objects
│
└── docker-compose.yml              # 4-service stack on atlasplanner-net bridge
```

---

## 🗺️ API Reference

### FastAPI Backend (port 8000)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/quiz/` | No | Submit answers → PersonalityProfile |
| POST | `/api/recommend/` | No | Profile + dates → 3 CountryCards from Claude |
| POST | `/api/plan/` | No | Destination + profile → TravelPlan from Claude |
| GET | `/api/weather/{city}` | No | 5-day forecast from OpenWeatherMap |
| GET | `/api/places/city/{city}` | No | City summary from Wikipedia |
| GET | `/api/places/country/{country}` | No | Country info + flag |
| POST | `/api/auth/signup` | No | Proxy to Spring Boot → JWT |
| POST | `/api/auth/signin` | No | Proxy to Spring Boot → JWT |
| GET | `/api/trips/` | Bearer JWT | Proxy to Spring Boot → user's saved trips |
| POST | `/api/trips/save` | Bearer JWT | Proxy to Spring Boot → save plan |

### Spring Boot Events Service (port 8080)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | BCrypt hash + store + return JWT |
| POST | `/api/auth/signin` | No | BCrypt verify + return JWT |
| POST | `/api/trips/save` | Bearer JWT | Persist trip + plan JSON to PostgreSQL |
| GET | `/api/trips/` | Bearer JWT | Fetch user's saved trips |
| GET | `/api/events/{countryCode}` | No | Ticketmaster events by country + dates |
| GET | `/api/events/health` | No | Health check |

### Interactive Docs
- FastAPI Swagger UI: **http://localhost:8000/docs**
- FastAPI ReDoc: **http://localhost:8000/redoc**

---

## 🗃️ Database Schema

PostgreSQL 16 managed by Spring Boot / Hibernate (`ddl-auto=update`):

```sql
-- Users (auth)
users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email        VARCHAR(255) UNIQUE NOT NULL,
  name         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,   -- BCrypt
  created_at   TIMESTAMP DEFAULT NOW()
)

-- Saved trips
saved_trips (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  country      VARCHAR(100),
  city         VARCHAR(100),
  start_date   VARCHAR(20),
  end_date     VARCHAR(20),
  match_score  INTEGER,
  plan_json    TEXT,                     -- full TravelPlan serialized
  saved_at     TIMESTAMP DEFAULT NOW()
)
```

> ⚠️ **Production note:** `ddl-auto=update` is used for development convenience. Before deploying with real users, migrate to Flyway with versioned SQL migration files.

---

## 🐛 Known Issues & Workarounds

| Issue | Cause | Fix |
|-------|-------|-----|
| Plan generation 500 error | Claude response truncated (too many tokens) | `max_tokens=6000` in `claude_service.py` |
| Plan fails for detailed cities | JSON > 16,000 chars cut mid-object | `extract_json()` repairs truncated JSON |
| Auth 500 when running locally | `EVENTS_SERVICE_URL` set to Docker hostname | Change to `http://localhost:8080` in `.env` |
| Logout on page navigation | Auth state in separate pages, not App root | Auth modal lives in `App.tsx`, not separate pages |
| Claude returns list instead of dict | Claude wraps plan in array | `isinstance(result, list)` check wraps it |

---

## 🔄 Data Flow — End to End

```
User fills quiz (10 questions)
  → POST /api/quiz/
  → PersonalityProfile returned + stored in QuizContext

User sets dates + budget → clicks "Find my destination"
  → POST /api/recommend/
  → Claude generates 3 CountryCards (JSON)
  → Each card enriched in parallel (flag, city summary)
  → 3 cards shown with animated MatchScoreRing

User picks a country → selects city → "Build my plan"
  → POST /api/plan/
  → Claude generates day-by-day itinerary (JSON)
  → PlanPage renders DayCard per day with timeline activities
  → Each activity has type icon, cost badge, Google Maps link
  → Customize panel: regenerate with modifications

User clicks "Save Trip"
  → POST /api/trips/save (FastAPI, auth-protected)
  → FastAPI validates JWT locally
  → Proxied to Spring Boot → PostgreSQL
```

---

## 📋 What's Built vs What's Next

### ✅ Fully Working
- Complete quiz flow with personality profiling
- AI country recommendations with match scores and visa info
- Full day-by-day plan generation with real venue names
- Authentication (sign up, sign in, JWT, keep me logged in)
- Save trip to PostgreSQL
- Customize plan panel (8 options, regenerate with Claude)
- Activity type icons (food / culture / nature / event / hidden gem)
- Local events via Ticketmaster
- Planet earth favicon
- Docker Compose full stack
- Graceful error handling + fallback to demo data
- Metastable failure prevention (async semaphore on Claude calls)
- JSON truncation repair for large city plans

### 🔧 Partially Built (code exists, not fully wired)
- Weather service (OpenWeatherMap exists but not shown per plan day)
- Google Places (route exists, not integrated in UI)
- Unsplash photos (key added, not yet fetching in UI)
- Trips dashboard (save works, viewing saved trips not yet in UI)
- Auth proxy (works but validates via network call, could be local JWT)

### 📌 Next Steps (Priority Order)

**1. Show weather on plan days** — `weather_service.py` exists, match forecast dates to plan days, show "☀️ 27°C · Sunny" badge on each DayCard header.

**2. Dashboard page** — Fetch saved trips from `/api/trips/`, display as cards, "View plan" loads saved JSON back into QuizContext.

**3. Unsplash photos** — Country card banner photos from Unsplash search API. Landing page hero photos from Unsplash random endpoint.

**4. Google Maps links** — `google_maps_query` field already in plan prompt, add "📍 View on Maps" button opening `maps.google.com/search?q=...` in new tab.

**5. Profile page** — Display traveler personality from last quiz, trip stats (countries visited, trips saved), settings (logout, clear history).

**6. Nationality in quiz** — Add nationality selector step (alphabetical dropdown) before quiz questions, pass to recommendation prompt for accurate visa info.

**7. Origin city + flight estimate** — Ask user which city they fly from, call Amadeus free API for cheapest flight estimate, show in plan stats bar.

**8. Deploy** — Frontend → Vercel, Backend + Spring Boot → Railway, PostgreSQL → Railway managed database. Add live URL to GitHub README and CV.

---

## 🧱 Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| FastAPI proxies auth to Spring Boot | Spring Boot owns the database — data sovereignty principle |
| Sync Anthropic client via `run_in_executor` | Anthropic SDK is sync-only; wrapping prevents event loop blocking |
| `extract_json()` with truncation repair | Claude occasionally truncates JSON at token limits; defensive parsing prevents 500s |
| JWT stored in localStorage (with sessionStorage fallback) | "Keep me logged in" checkbox controls which storage is used |
| Docker Compose bridge network | Services communicate via DNS names (`events-service:8080`) not IPs |
| `ddl-auto=update` for development | Acceptable for portfolio — Flyway migration required before production |

---

## 👨‍💻 Author

**Mostafa Qabbari** — Full-stack developer based in Leipzig, Germany  
[github.com/MostafaQabbari](https://github.com/MostafaQabbari)  
Stack: TypeScript · Node.js · Python · Java · React · PostgreSQL · Docker

---

## 📄 License

MIT — free to use, fork, and learn from.