import { describe, expect, it } from "vitest";
import { describeCondition, toCurrentConditions } from "./current-conditions";

const sample = {
  timezone: "Asia/Colombo",
  current: {
    time: "2026-11-06T11:15",
    interval: 900,
    temperature_2m: 29.0,
    apparent_temperature: 36.1,
    relative_humidity_2m: 77,
    weather_code: 51,
    wind_speed_10m: 7.4,
    is_day: 1,
  },
};

describe("toCurrentConditions", () => {
  it("maps an Open-Meteo response to Current Conditions", () => {
    expect(toCurrentConditions(sample)).toEqual({
      temperatureC: 29.0,
      feelsLikeC: 36.1,
      humidityPercent: 77,
      windSpeedKmh: 7.4,
      condition: { label: "Light drizzle", icon: "🌦️" },
      asOfTime: "11:15",
    });
  });

  it("returns null when the response is not in Colombo time", () => {
    expect(toCurrentConditions({ ...sample, timezone: "GMT" })).toBeNull();
  });

  it.each([
    ["null", null],
    ["missing current block", { timezone: "Asia/Colombo" }],
    [
      "non-numeric temperature",
      { ...sample, current: { ...sample.current, temperature_2m: "hot" } },
    ],
    [
      "malformed time",
      { ...sample, current: { ...sample.current, time: "yesterday" } },
    ],
  ])("returns null for %s", (_name, input) => {
    expect(toCurrentConditions(input)).toBeNull();
  });
});

describe("describeCondition", () => {
  it("uses a moon for clear skies at night", () => {
    expect(describeCondition(0, false)).toEqual({ label: "Clear sky", icon: "🌙" });
    expect(describeCondition(0, true)).toEqual({ label: "Clear sky", icon: "☀️" });
  });

  it("describes thunderstorms", () => {
    expect(describeCondition(95, true).label).toBe("Thunderstorm");
  });

  it("falls back gracefully for unknown codes", () => {
    expect(describeCondition(42, true)).toEqual({ label: "Unknown", icon: "🌡️" });
  });
});
