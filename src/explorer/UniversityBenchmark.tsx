import { useState } from "react";

interface UniversityBenchmarkProps {
  hlIds: string[];
  slIds: string[];
}

/** Russell Group universities with IB point ranges and HL requirements (source: uniadmissions.co.uk) */
const RUSSELL_GROUP = [
  { name: "Cambridge", low: 41, high: 42, hl: "7,7,6" },
  { name: "Oxford", low: 38, high: 40, hl: "6,6,6 – 7,7,6" },
  { name: "Imperial", low: 38, high: 40, hl: "7,6,6" },
  { name: "UCL", low: 34, high: 40, hl: "16–20 total" },
  { name: "LSE", low: 37, high: 38, hl: "6,6,6 – 7,6,6" },
  { name: "Edinburgh", low: 34, high: 39, hl: "6,5,5 – 6,6,6" },
  { name: "King's College London", low: 33, high: 39, hl: "16–20 total" },
  { name: "Durham", low: 36, high: 38, hl: "6,6,5 – 7,7,6" },
  { name: "Bristol", low: 31, high: 38, hl: "15–18 total" },
  { name: "Manchester", low: 30, high: 38, hl: "5,5,4 – 7,7,6" },
  { name: "Glasgow", low: 34, high: 38, hl: "6,5,5 – 6,6,6" },
  { name: "Exeter", low: 32, high: 38, hl: "6,5,5 – 7,6,6" },
  { name: "Warwick", low: 32, high: 39, hl: "up to 7,6,6" },
  { name: "Southampton", low: 30, high: 38, hl: "15 total – 7,6,6" },
  { name: "Sheffield", low: 32, high: 38, hl: "varies by course" },
  { name: "Leeds", low: 34, high: 36, hl: "5,5,5" },
  { name: "Nottingham", low: 28, high: 36, hl: "5,5,5 – 7,6,6" },
  { name: "Cardiff", low: 31, high: 36, hl: "6,6,5 – 6,6,6" },
  { name: "Liverpool", low: 30, high: 36, hl: "no HL below 4" },
  { name: "Birmingham", low: 32, high: 32, hl: "5,5,5 – 7,7,7" },
  { name: "Queen Mary London", low: 30, high: 37, hl: "5,5,5 – 6,6,6" },
  { name: "York", low: 31, high: 36, hl: "up to 6 in HL" },
  { name: "Newcastle", low: 30, high: 34, hl: "5,5,5" },
  { name: "Queen's Belfast", low: 29, high: 37, hl: "5,5,5 – 6,6,6" },
];

/** Worldwide tier data (source: num8ers.com) */
const TIERS = [
  { label: "Ivy League / Oxbridge", range: "40–42", min: 40, color: "text-purple-400", bg: "bg-purple-500" },
  { label: "Top-tier global", range: "38–39", min: 38, color: "text-blue-400", bg: "bg-blue-500" },
  { label: "Strong competitive", range: "34–37", min: 34, color: "text-emerald-400", bg: "bg-emerald-500" },
  { label: "Solid mid-tier", range: "30–33", min: 30, color: "text-yellow-400", bg: "bg-yellow-500" },
  { label: "Minimum diploma", range: "24–29", min: 24, color: "text-neutral-400", bg: "bg-neutral-500" },
];

function getTier(points: number) {
  for (const tier of TIERS) {
    if (points >= tier.min) return tier;
  }
  return TIERS[TIERS.length - 1];
}

export function UniversityBenchmark({ hlIds, slIds }: UniversityBenchmarkProps) {
  const [predictedPoints, setPredictedPoints] = useState<number | null>(null);
  const [showUnis, setShowUnis] = useState(false);

  const hlCount = hlIds.length;
  const slCount = slIds.length;
  const isComplete = hlCount === 3 && slCount === 3;

  if (!isComplete) return null;

  const tier = predictedPoints !== null ? getTier(predictedPoints) : null;

  const reachableUnis = predictedPoints !== null
    ? RUSSELL_GROUP.filter((u) => predictedPoints >= u.low).length
    : 0;

  return (
    <section className="card p-5">
      <h3 className="mb-3 text-lg font-bold text-neutral-100">
        University Benchmark
      </h3>
      <p className="mb-4 text-sm text-neutral-400">
        Enter your predicted or target IB total points (24–45) to see where you stand.
      </p>

      {/* Points input */}
      <div className="mb-4 flex items-center gap-3">
        <label htmlFor="ib-points" className="text-sm font-medium text-neutral-300">
          Predicted IB points
        </label>
        <input
          id="ib-points"
          type="number"
          min={24}
          max={45}
          placeholder="e.g. 36"
          className="w-20 rounded-lg border border-dark-600 bg-dark-700 px-3 py-1.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-primary-500 focus:outline-none"
          onChange={(e) => {
            const v = parseInt(e.target.value);
            setPredictedPoints(v >= 24 && v <= 45 ? v : null);
          }}
        />
        {predictedPoints !== null && tier && (
          <span className={`text-sm font-semibold ${tier.color}`}>
            {tier.label} ({tier.range} pts)
          </span>
        )}
      </div>

      {predictedPoints !== null && tier && (
        <>
          {/* Visual tier bar */}
          <div className="mb-4 flex flex-col gap-1.5">
            <div className="flex gap-0.5">
              {TIERS.slice().reverse().map((t) => {
                const isActive = predictedPoints >= t.min;
                const isCurrent = t.label === tier.label;
                return (
                  <div
                    key={t.label}
                    className={`flex-1 rounded-sm py-1 text-center text-[10px] font-medium transition-all ${
                      isActive
                        ? `${t.bg}/30 ${t.color}`
                        : "bg-dark-700 text-neutral-600"
                    } ${isCurrent ? "ring-1 ring-white/30" : ""}`}
                  >
                    {t.range}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-neutral-500">
              <span>24 pts</span>
              <span>45 pts</span>
            </div>
          </div>

          {/* Russell Group summary */}
          <div className="mb-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary-500">{reachableUnis}</span>
            <span className="text-sm text-neutral-300">
              of {RUSSELL_GROUP.length} Russell Group universities have courses accepting {predictedPoints} points
            </span>
          </div>

          <button
            onClick={() => setShowUnis(!showUnis)}
            className="mb-3 text-sm text-primary-500 hover:text-primary-400"
          >
            {showUnis ? "Hide" : "Show"} Russell Group breakdown
          </button>

          {showUnis && (
            <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
              {RUSSELL_GROUP.map((u) => {
                const inRange = predictedPoints >= u.low;
                const competitive = predictedPoints >= u.high;
                return (
                  <div
                    key={u.name}
                    className={`flex flex-col gap-0.5 rounded-lg px-3 py-2 text-sm ${
                      competitive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : inRange
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-dark-700 text-neutral-500"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{u.name}</span>
                      <span className="text-xs">
                        {competitive ? "Competitive" : inRange ? "In range" : `Need ${u.low}+`}
                      </span>
                    </div>
                    <span className="text-[10px] opacity-70">
                      HL: {u.hl}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <p className="mt-3 text-xs text-neutral-500">
            Point ranges vary by course. Source: uniadmissions.co.uk, num8ers.com. Always check specific course requirements.
          </p>
        </>
      )}
    </section>
  );
}
