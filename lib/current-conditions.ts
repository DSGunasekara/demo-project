/** Colombo, Sri Lanka — the one Location this app reports on. */
export const LOCATION = {
  name: "Colombo",
  latitude: 6.9271,
  longitude: 79.8612,
  timeZone: "Asia/Colombo",
} as const;

export type Condition = { label: string; icon: string };

/** A provider's modelled estimate of the weather at the Location right now. */
export type CurrentConditions = {
  temperatureC: number;
  feelsLikeC: number;
  humidityPercent: number;
  windSpeedKmh: number;
  condition: Condition;
  /** HH:mm in Colombo local time. */
  asOfTime: string;
};

// WMO weather interpretation codes, as used by Open-Meteo.
const CONDITIONS: Record<number, Condition> = {
  0: { label: "Clear sky", icon: "☀️" },
  1: { label: "Mainly clear", icon: "🌤️" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Fog", icon: "🌫️" },
  48: { label: "Freezing fog", icon: "🌫️" },
  51: { label: "Light drizzle", icon: "🌦️" },
  53: { label: "Drizzle", icon: "🌦️" },
  55: { label: "Heavy drizzle", icon: "🌧️" },
  56: { label: "Freezing drizzle", icon: "🌧️" },
  57: { label: "Freezing drizzle", icon: "🌧️" },
  61: { label: "Light rain", icon: "🌦️" },
  63: { label: "Rain", icon: "🌧️" },
  65: { label: "Heavy rain", icon: "🌧️" },
  66: { label: "Freezing rain", icon: "🌧️" },
  67: { label: "Freezing rain", icon: "🌧️" },
  71: { label: "Light snow", icon: "🌨️" },
  73: { label: "Snow", icon: "🌨️" },
  75: { label: "Heavy snow", icon: "🌨️" },
  77: { label: "Snow grains", icon: "🌨️" },
  80: { label: "Light showers", icon: "🌦️" },
  81: { label: "Showers", icon: "🌧️" },
  82: { label: "Violent showers", icon: "🌧️" },
  85: { label: "Snow showers", icon: "🌨️" },
  86: { label: "Heavy snow showers", icon: "🌨️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
  96: { label: "Thunderstorm with hail", icon: "⛈️" },
  99: { label: "Thunderstorm with hail", icon: "⛈️" },
};

export function describeCondition(code: number, isDay: boolean): Condition {
  const condition = CONDITIONS[code];
  if (!condition) return { label: "Unknown", icon: "🌡️" };
  if (code === 0 && !isDay) return { ...condition, icon: "🌙" };
  return condition;
}

const isNumber = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);

/**
 * Converts an Open-Meteo forecast response (requested with
 * `timezone=Asia/Colombo`) into Current Conditions, or null if it is
 * not in the expected shape.
 */
export function toCurrentConditions(response: unknown): CurrentConditions | null {
  if (typeof response !== "object" || response === null) return null;
  const { timezone, current } = response as Record<string, unknown>;
  if (timezone !== LOCATION.timeZone) return null;
  if (typeof current !== "object" || current === null) return null;

  const c = current as Record<string, unknown>;
  const time = typeof c.time === "string" ? /T(\d{2}:\d{2})/.exec(c.time) : null;
  if (
    !time ||
    !isNumber(c.temperature_2m) ||
    !isNumber(c.apparent_temperature) ||
    !isNumber(c.relative_humidity_2m) ||
    !isNumber(c.wind_speed_10m) ||
    !isNumber(c.weather_code)
  ) {
    return null;
  }

  return {
    temperatureC: c.temperature_2m,
    feelsLikeC: c.apparent_temperature,
    humidityPercent: c.relative_humidity_2m,
    windSpeedKmh: c.wind_speed_10m,
    condition: describeCondition(c.weather_code, c.is_day !== 0),
    asOfTime: time[1],
  };
}
