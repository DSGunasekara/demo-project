import { cacheLife } from "next/cache";
import {
  LOCATION,
  toCurrentConditions,
  type CurrentConditions,
} from "./current-conditions";

const OPEN_METEO_URL =
  "https://api.open-meteo.com/v1/forecast?" +
  new URLSearchParams({
    latitude: String(LOCATION.latitude),
    longitude: String(LOCATION.longitude),
    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day",
    timezone: LOCATION.timeZone,
  });

/**
 * Current Conditions for the Location, or null when Unavailable.
 *
 * Success is cached for ~10 minutes (Open-Meteo updates every 15).
 * Failure uses the short `seconds` profile, which Next.js treats as a
 * request-time hole, so an Unavailable result is never baked into the
 * prerendered page and the next request retries.
 */
export async function getCurrentConditions(): Promise<CurrentConditions | null> {
  "use cache";

  try {
    const res = await fetch(OPEN_METEO_URL, { signal: AbortSignal.timeout(5000) });
    const conditions = res.ok ? toCurrentConditions(await res.json()) : null;
    if (conditions) {
      cacheLife({ stale: 300, revalidate: 600, expire: 3600 });
      return conditions;
    }
  } catch {
    // fall through to Unavailable
  }

  cacheLife("seconds");
  return null;
}
