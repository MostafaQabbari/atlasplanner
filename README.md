# 🌍 AtlasPlanner

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

MIT
