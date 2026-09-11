import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  component: Index,
});

function useTime() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return now;
}

function ClockHand(props: {
  deg: number;
  lengthPct: number;
  widthPx: number;
  cls: string;
}) {
  return (
    <div
      className={`absolute left-1/2 top-1/2 origin-bottom rounded-full ${props.cls}`}
      style={{
        height: `${props.lengthPct}%`,
        width: props.widthPx,
        transform: `translateX(-50%) translateY(-100%) rotate(${props.deg}deg)`,
        transformOrigin: "center 100%",
      }}
    />
  );
}

function ClockFace({ date }: { date: Date }) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const hourDeg = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;
  const minuteDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
  const secondDeg = (seconds / 60) * 360;

  return (
    <div className="relative aspect-square h-64 rounded-full border-4 border-stone-900 bg-white shadow-xl sm:h-80">
      {/* Tick marks */}
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          className="pointer-events-none absolute inset-0"
          style={{ transform: `rotate(${i * 6}deg)` }}
        >
          <div
            className={`absolute left-1/2 top-2 -ml-px h-2.5 rounded ${
              i % 5 === 0 ? "w-[2.5px] bg-stone-900" : "w-px bg-stone-300"
            }`}
          />
        </div>
      ))}

      {/* Numbers */}
      <div className="absolute left-1/2 top-[18%] -translate-x-1/2 font-serif text-xl font-semibold text-stone-800 sm:text-2xl">
        12
      </div>
      <div className="absolute right-[24%] top-1/2 -translate-y-1/2 font-serif text-xl font-semibold text-stone-800 sm:text-2xl">
        3
      </div>
      <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 font-serif text-xl font-semibold text-stone-800 sm:text-2xl">
        6
      </div>
      <div className="absolute left-[24%] top-1/2 -translate-y-1/2 font-serif text-xl font-semibold text-stone-800 sm:text-2xl">
        9
      </div>

      {/* Hands */}
      <ClockHand deg={hourDeg} lengthPct={24} widthPx={5} cls="bg-stone-900" />
      <ClockHand deg={minuteDeg} lengthPct={34} widthPx={3.5} cls="bg-stone-600" />
      <ClockHand deg={secondDeg} lengthPct={44} widthPx={2} cls="bg-red-600" />

      {/* Center pin */}
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600 ring-2 ring-white" />
    </div>
  );
}

function DigitalClock({ date }: { date: Date }) {
  const formatted = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const weekday = date.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="text-center">
      <p className="font-mono text-5xl font-bold tabular-nums tracking-tight text-stone-900 sm:text-6xl">
        {formatted}
      </p>
      <p className="mt-2 text-lg capitalize text-stone-500">{weekday}</p>
    </div>
  );
}

function Index() {
  const now = useTime();

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-10 px-6"
      style={{ backgroundColor: "#fcfbf8" }}
    >
      <h1 className="text-sm uppercase tracking-[0.3em] text-stone-400">Local Time</h1>
      <ClockFace date={now} />
      <DigitalClock date={now} />
    </div>
  );
}
