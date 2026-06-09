import os
import time
import httpx

AMADEUS_CLIENT_ID = os.getenv("AMADEUS_CLIENT_ID", "")
AMADEUS_CLIENT_SECRET = os.getenv("AMADEUS_CLIENT_SECRET", "")
AMADEUS_BASE = "https://test.api.amadeus.com"

_token_cache: dict = {"token": None, "expires_at": 0}


async def _get_token() -> str | None:
    if not AMADEUS_CLIENT_ID or not AMADEUS_CLIENT_SECRET:
        return None
    if _token_cache["token"] and time.time() < _token_cache["expires_at"]:
        return _token_cache["token"]
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{AMADEUS_BASE}/v1/security/oauth2/token",
                data={
                    "grant_type": "client_credentials",
                    "client_id": AMADEUS_CLIENT_ID,
                    "client_secret": AMADEUS_CLIENT_SECRET,
                },
                timeout=10.0,
            )
            resp.raise_for_status()
            data = resp.json()
            _token_cache["token"] = data["access_token"]
            _token_cache["expires_at"] = time.time() + data.get("expires_in", 1799) - 60
            return _token_cache["token"]
    except Exception as e:
        print(f"[flight] Token error: {e}")
        return None


async def _city_to_iata(keyword: str, token: str) -> str | None:
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{AMADEUS_BASE}/v1/reference-data/locations",
                params={"subType": "CITY", "keyword": keyword, "page[limit]": 1},
                headers={"Authorization": f"Bearer {token}"},
                timeout=10.0,
            )
            resp.raise_for_status()
            data = resp.json()
            locations = data.get("data", [])
            if locations:
                return locations[0].get("iataCode")
    except Exception as e:
        print(f"[flight] IATA lookup error for {keyword}: {e}")
    return None


async def get_flight_estimate(
    origin_city: str,
    destination_country: str,
    travel_date: str,
) -> dict | None:
    if not origin_city or not destination_country:
        return None

    token = await _get_token()
    if not token:
        return None

    try:
        origin_iata, dest_iata = await _city_to_iata(origin_city, token), None
        # Use country capital / main city for destination
        dest_iata = await _city_to_iata(destination_country, token)

        if not origin_iata or not dest_iata:
            return None

        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{AMADEUS_BASE}/v2/shopping/flight-offers",
                params={
                    "originLocationCode": origin_iata,
                    "destinationLocationCode": dest_iata,
                    "departureDate": travel_date,
                    "adults": 1,
                    "max": 3,
                    "currencyCode": "EUR",
                },
                headers={"Authorization": f"Bearer {token}"},
                timeout=15.0,
            )
            resp.raise_for_status()
            data = resp.json()
            offers = data.get("data", [])
            if not offers:
                return None

            prices = [float(o["price"]["total"]) for o in offers]
            cheapest = min(prices)
            typical = sum(prices) / len(prices)
            first = offers[0]
            airline = first.get("validatingAirlineCodes", [""])[0]
            seg = first["itineraries"][0]["segments"][0]
            duration_str = first["itineraries"][0].get("duration", "PT0H")
            hours = 0.0
            import re
            m = re.search(r"PT(\d+)H", duration_str)
            if m:
                hours = float(m.group(1))
            m2 = re.search(r"(\d+)M", duration_str)
            if m2:
                hours += float(m2.group(1)) / 60

            return {
                "cheapest_eur": round(cheapest, 2),
                "typical_eur": round(typical, 2),
                "airline": airline,
                "duration_hours": round(hours, 1),
                "origin_iata": origin_iata,
                "dest_iata": dest_iata,
            }
    except Exception as e:
        print(f"[flight] Estimate error: {e}")
        return None
