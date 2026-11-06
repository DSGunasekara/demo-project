# Colombo Weather

A single page showing the weather right now in Colombo, Sri Lanka.

## Language

**Location**:
The one place this app reports on: Colombo, Sri Lanka. There is exactly one; it is not user-selectable.
_Avoid_: City, place, region

**Current Conditions**:
A weather provider's modelled estimate of the weather at the Location for the present moment — not a reading from a physical weather station.
_Avoid_: Current weather, observation, live weather, reading

**Condition**:
The short human description of the sky and precipitation within the Current Conditions (e.g. "light rain", "partly cloudy").
_Avoid_: Summary, status, weather type

**Feels-like Temperature**:
The temperature as perceived by a person, accounting for humidity and wind, alongside the actual air temperature.
_Avoid_: Apparent temperature, heat index, real feel

**As-of Time**:
The moment the Current Conditions describe, always expressed in Colombo local time (Asia/Colombo).
_Avoid_: Updated at, timestamp, last refreshed

**Unavailable**:
The state shown when Current Conditions cannot be obtained; the page still renders without them.
_Avoid_: Error, offline, stale
