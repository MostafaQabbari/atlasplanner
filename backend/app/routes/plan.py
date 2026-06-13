import os
import asyncio
import httpx
from typing import Optional
from fastapi import APIRouter, HTTPException
from app.models.schemas import PlanRequest, PlanResponse, DayPlan, DayActivity
from app.services import claude_service, weather_service

router = APIRouter()

VALID_TYPES = {"food", "culture", "nature", "event", "hidden_gem"}
UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY")

COUNTRY_CODES = {
    'Andorra':'AD','United Arab Emirates':'AE','Afghanistan':'AF',
    'Antigua and Barbuda':'AG','Albania':'AL','Armenia':'AM',
    'Angola':'AO','Argentina':'AR','Austria':'AT','Australia':'AU',
    'Azerbaijan':'AZ','Bosnia and Herzegovina':'BA','Barbados':'BB',
    'Bangladesh':'BD','Belgium':'BE','Burkina Faso':'BF','Bulgaria':'BG',
    'Bahrain':'BH','Benin':'BJ','Brunei':'BN','Bolivia':'BO',
    'Brazil':'BR','Bahamas':'BS','Bhutan':'BT','Botswana':'BW',
    'Belarus':'BY','Belize':'BZ','Canada':'CA','Congo':'CD',
    'Central African Republic':'CF','Switzerland':'CH','Ivory Coast':'CI',
    'Chile':'CL','Cameroon':'CM','China':'CN','Colombia':'CO',
    'Costa Rica':'CR','Cuba':'CU','Cabo Verde':'CV','Cyprus':'CY',
    'Czech Republic':'CZ','Germany':'DE','Djibouti':'DJ','Denmark':'DK',
    'Dominican Republic':'DO','Algeria':'DZ','Ecuador':'EC','Estonia':'EE',
    'Egypt':'EG','Eritrea':'ER','Spain':'ES','Ethiopia':'ET',
    'Finland':'FI','Fiji':'FJ','France':'FR','Gabon':'GA',
    'United Kingdom':'GB','Georgia':'GE','Ghana':'GH','Gambia':'GM',
    'Guinea':'GN','Equatorial Guinea':'GQ','Greece':'GR',
    'Guatemala':'GT','Guinea-Bissau':'GW','Guyana':'GY','Honduras':'HN',
    'Croatia':'HR','Haiti':'HT','Hungary':'HU','Indonesia':'ID',
    'Ireland':'IE','Israel':'IL','India':'IN','Iraq':'IQ','Iran':'IR',
    'Iceland':'IS','Italy':'IT','Jamaica':'JM','Jordan':'JO',
    'Japan':'JP','Kenya':'KE','Kyrgyzstan':'KG','Cambodia':'KH',
    'Comoros':'KM','South Korea':'KR','Kuwait':'KW','Kazakhstan':'KZ',
    'Laos':'LA','Lebanon':'LB','Liechtenstein':'LI','Sri Lanka':'LK',
    'Liberia':'LR','Lesotho':'LS','Lithuania':'LT','Luxembourg':'LU',
    'Latvia':'LV','Libya':'LY','Morocco':'MA','Moldova':'MD',
    'Madagascar':'MG','North Macedonia':'MK','Mali':'ML','Myanmar':'MM',
    'Mongolia':'MN','Mauritania':'MR','Malta':'MT','Mauritius':'MU',
    'Maldives':'MV','Malawi':'MW','Mexico':'MX','Malaysia':'MY',
    'Mozambique':'MZ','Namibia':'NA','Niger':'NE','Nigeria':'NG',
    'Nicaragua':'NI','Netherlands':'NL','Norway':'NO','Nepal':'NP',
    'New Zealand':'NZ','Oman':'OM','Panama':'PA','Peru':'PE',
    'Papua New Guinea':'PG','Philippines':'PH','Pakistan':'PK',
    'Poland':'PL','Palestine':'PS','Portugal':'PT','Paraguay':'PY',
    'Qatar':'QA','Romania':'RO','Serbia':'RS','Russia':'RU',
    'Rwanda':'RW','Saudi Arabia':'SA','Solomon Islands':'SB',
    'Sudan':'SD','Sweden':'SE','Singapore':'SG','Slovenia':'SI',
    'Slovakia':'SK','Sierra Leone':'SL','Senegal':'SN','Somalia':'SO',
    'Suriname':'SR','South Sudan':'SS','Sao Tome and Principe':'ST',
    'El Salvador':'SV','Syria':'SY','Eswatini':'SZ','Chad':'TD',
    'Togo':'TG','Thailand':'TH','Tajikistan':'TJ','Timor-Leste':'TL',
    'Turkmenistan':'TM','Tunisia':'TN','Turkey':'TR',
    'Trinidad and Tobago':'TT','Taiwan':'TW','Tanzania':'TZ',
    'Ukraine':'UA','Uganda':'UG','United States':'US','Uruguay':'UY',
    'Uzbekistan':'UZ','Venezuela':'VE','Vietnam':'VN','Vanuatu':'VU',
    'Samoa':'WS','Yemen':'YE','South Africa':'ZA','Zambia':'ZM',
    'Zimbabwe':'ZW',
}


def _weather_emoji(icon: str) -> str:
    if icon.startswith("01"):
        return "☀️"
    elif icon.startswith(("02", "03", "04")):
        return "⛅"
    elif icon.startswith(("09", "10")):
        return "🌧️"
    elif icon.startswith("11"):
        return "⛈️"
    elif icon.startswith("13"):
        return "❄️"
    elif icon.startswith("50"):
        return "🌫️"
    return "🌤️"


def _match_weather(forecast_list: list, date: str) -> Optional[str]:
    for day in forecast_list:
        if day["date"] == date:
            emoji = _weather_emoji(day.get("icon", ""))
            temp = round((day["temp_min"] + day["temp_max"]) / 2)
            desc = day.get("description", "").capitalize()
            return f"{emoji} {temp}°C · {desc}"
    return None


async def _fetch_unsplash(query: str) -> Optional[str]:
    if not UNSPLASH_ACCESS_KEY:
        return None
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "https://api.unsplash.com/search/photos",
                params={"query": query, "per_page": 1},
                headers={"Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"},
                timeout=5.0,
            )
            if resp.status_code == 200:
                data = resp.json()
                results = data.get("results", [])
                if results:
                    return results[0]["urls"]["regular"]
    except Exception:
        pass
    return None


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

        days: list[DayPlan] = []
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
                        google_maps_query=a.get("google_maps_query"),
                        opening_hours=a.get("opening_hours"),
                        opening_warning=a.get("opening_warning"),
                    ))
                days.append(DayPlan(
                    date=str(day.get("date", "")),
                    theme=str(day.get("theme", f"Day {i+1}")),
                    weather=day.get("weather"),
                    activities=activities,
                    events=day.get("events") or [],
                    typical_weather=day.get("typical_weather"),
                ))
            except Exception as day_err:
                print(f"[plan] Skipping day {i}: {day_err}")
                continue

        # Enrich days with weather + photos in parallel
        forecast_list: list = []
        try:
            forecast = await weather_service.get_forecast(request.city)
            forecast_list = forecast.get("forecast", [])
        except Exception as we:
            print(f"[plan] Weather fetch failed: {we}")

        async def fetch_photo(day: DayPlan) -> Optional[str]:
            return await _fetch_unsplash(f"{day.theme} {request.city} travel")

        photo_urls = await asyncio.gather(*[fetch_photo(d) for d in days])

        enriched_days = []
        for day, photo_url in zip(days, photo_urls):
            weather_str = day.weather or _match_weather(forecast_list, day.date)
            enriched_days.append(DayPlan(
                date=day.date,
                theme=day.theme,
                weather=weather_str,
                photo_url=photo_url,
                activities=day.activities,
                events=day.events,
                typical_weather=day.typical_weather,
            ))

        # Apply typical_weather fallback for days beyond forecast window
        for day in enriched_days:
            if not day.weather and day.typical_weather:
                day.weather = f"🌤️ {day.typical_weather} (seasonal)"

        # Enrich days with events from Java service
        try:
            events_base = os.getenv('EVENTS_SERVICE_URL', 'http://localhost:8080')
            code = COUNTRY_CODES.get(request.country, request.country[:2].upper())
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.get(
                    f"{events_base}/api/events/{code}",
                    params={
                        "startDate": request.travel_start,
                        "endDate": request.travel_end
                    }
                )
                if resp.status_code == 200:
                    all_events = resp.json()
                    events_by_date: dict = {}
                    for ev in all_events:
                        date = ev.get('date', '')
                        if not date:
                            continue
                        if date not in events_by_date:
                            events_by_date[date] = []
                        name = ev.get('name', '')
                        venue = ev.get('venue', '')
                        city_ev = ev.get('city', '')
                        url = ev.get('ticketUrl', '')
                        location_part = f" @ {venue}" if venue else ''
                        city_part = f", {city_ev}" if city_ev else ''
                        label = f"{name}{location_part}{city_part}"
                        events_by_date[date].append(f"{label}||{url}")
                    for day in enriched_days:
                        if day.date in events_by_date:
                            day.events = events_by_date[day.date][:3]
                    print(f"[plan] Events fetched: {sum(len(v) for v in events_by_date.values())} total")
                else:
                    print(f"[plan] Events returned {resp.status_code}")
        except Exception as ev_err:
            print(f"[plan] Events fetch skipped: {ev_err}")

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
            days=enriched_days,
            total_estimated_cost_eur=total,
            tips=tips,
        )
        print(f"[plan] Success: {len(enriched_days)} days, {sum(len(d.activities) for d in enriched_days)} activities")
        return response

    except Exception as e:
        import traceback
        print(f"[plan] FATAL ERROR: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Plan generation failed: {str(e)}")
