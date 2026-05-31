import httpx

WIKIPEDIA_API = "https://en.wikipedia.org/api/rest_v1"
REST_COUNTRIES_API = "https://restcountries.com/v3.1"


async def get_city_summary(city: str) -> dict:
    """Get Wikipedia summary for a city."""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{WIKIPEDIA_API}/page/summary/{city.replace(' ', '_')}",
            headers={"User-Agent": "AtlasPlanner/1.0"},
        )
        if response.status_code != 200:
            return {"city": city, "summary": "No summary available.", "image_url": None}

        data = response.json()

    return {
        "city": city,
        "summary": data.get("extract", ""),
        "image_url": data.get("thumbnail", {}).get("source"),
    }


async def get_country_info(country: str) -> dict:
    """Get country metadata from REST Countries API (no key needed)."""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{REST_COUNTRIES_API}/name/{country}",
            params={"fields": "name,currencies,languages,flags,capital,region,population"},
        )
        if response.status_code != 200:
            return {"country": country}

        data = response.json()[0]

    currencies = data.get("currencies", {})
    currency_info = [
        f"{v['name']} ({k})" for k, v in currencies.items()
    ] if currencies else []

    languages = list(data.get("languages", {}).values())

    return {
        "country": country,
        "capital": data.get("capital", ["Unknown"])[0],
        "region": data.get("region", ""),
        "population": data.get("population", 0),
        "currencies": currency_info,
        "languages": languages,
        "flag_url": data.get("flags", {}).get("png"),
    }
