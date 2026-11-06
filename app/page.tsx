import { Suspense } from "react";
import { LOCATION } from "@/lib/current-conditions";
import { getCurrentConditions } from "@/lib/get-current-conditions";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-16 font-sans dark:bg-black">
      <main className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/[.06] dark:bg-zinc-900 dark:ring-white/[.08]">
        <h1 className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {LOCATION.name}, Sri Lanka
        </h1>
        <Suspense fallback={<ConditionsSkeleton />}>
          <Conditions />
        </Suspense>
      </main>
    </div>
  );
}

async function Conditions() {
  const conditions = await getCurrentConditions();

  if (!conditions) {
    return (
      <p className="mt-6 text-zinc-600 dark:text-zinc-400" role="status">
        Weather is unavailable right now. Please try again in a moment.
      </p>
    );
  }

  const stats = [
    { label: "Feels like", value: `${Math.round(conditions.feelsLikeC)}°C` },
    { label: "Humidity", value: `${Math.round(conditions.humidityPercent)}%` },
    { label: "Wind", value: `${Math.round(conditions.windSpeedKmh)} km/h` },
  ];

  return (
    <>
      <div className="mt-4 flex items-center gap-4">
        <span className="text-6xl" aria-hidden>
          {conditions.condition.icon}
        </span>
        <div>
          <p className="text-5xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {Math.round(conditions.temperatureC)}°C
          </p>
          <p className="mt-1 text-lg text-zinc-600 dark:text-zinc-300">
            {conditions.condition.label}
          </p>
        </div>
      </div>
      <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-black/[.06] pt-6 dark:border-white/[.08]">
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="text-xs text-zinc-500 dark:text-zinc-400">{s.label}</dt>
            <dd className="mt-1 font-medium text-black dark:text-zinc-50">{s.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-xs text-zinc-500 dark:text-zinc-400">
        As of {conditions.asOfTime} Colombo time · Data from Open-Meteo
      </p>
    </>
  );
}

function ConditionsSkeleton() {
  return (
    <div className="mt-4 animate-pulse" aria-busy>
      <div className="h-14 w-40 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
      <div className="mt-8 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
    </div>
  );
}
