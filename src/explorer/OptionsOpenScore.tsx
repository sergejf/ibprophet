/** All 20 pathway names from seed data, in display order */
const ALL_PATHWAYS = [
  "Computer Science",
  "Medicine",
  "Economics & Finance",
  "Engineering",
  "Law",
  "Psychology",
  "Business & Management",
  "Architecture",
  "International Relations",
  "Environmental Science",
  "Film & Media Studies",
  "Music Performance & Production",
  "Education",
  "Marketing & Communications",
  "English & Creative Writing",
  "History & Politics",
  "Biology & Life Sciences",
  "Sociology & Social Work",
  "Sports Science",
  "Design & Visual Arts",
];

interface OptionsOpenScoreProps {
  matchedPathwayNames: string[];
  facilitatingCount: number;
}

export function OptionsOpenScore({
  matchedPathwayNames,
  facilitatingCount,
}: OptionsOpenScoreProps) {
  const matched = new Set(matchedPathwayNames);
  const total = ALL_PATHWAYS.length;
  const matchedCount = matched.size;
  const percent = Math.round((matchedCount / total) * 100);

  const barColor =
    matchedCount >= 15
      ? "bg-green-500"
      : matchedCount >= 10
        ? "bg-yellow-500"
        : "bg-amber-500";
  const textColor =
    matchedCount >= 15
      ? "text-green-400"
      : matchedCount >= 10
        ? "text-yellow-400"
        : "text-amber-400";

  const facilitatingMsg =
    facilitatingCount === 0
      ? "Consider adding facilitating subjects to keep more doors open."
      : facilitatingCount === 1
        ? "Adding a second facilitating subject widens your options significantly."
        : `Good breadth — ${facilitatingCount} facilitating subjects keeps many degree courses available.`;

  // Sort: matched first, then closed
  const open = ALL_PATHWAYS.filter((p) => matched.has(p));
  const closed = ALL_PATHWAYS.filter((p) => !matched.has(p));

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-bold text-neutral-100">Options Open</h3>

      <div className="flex items-center gap-3">
        <div className="bg-dark-700 h-2 flex-1 overflow-hidden rounded-full">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className={`text-sm font-semibold ${textColor}`}>
          {matchedCount}/{total}
        </span>
      </div>

      <p className="text-sm text-neutral-300">
        Your subjects connect to{" "}
        <span className={`font-semibold ${textColor}`}>
          {matchedCount} of {total}
        </span>{" "}
        university pathways.
      </p>

      {/* Pathway pills */}
      <div className="flex flex-wrap gap-1.5">
        {open.map((name) => (
          <span
            key={name}
            className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-400"
          >
            {name}
          </span>
        ))}
        {closed.map((name) => (
          <span
            key={name}
            className="rounded-full bg-neutral-500/10 px-2 py-0.5 text-xs text-neutral-600"
          >
            {name}
          </span>
        ))}
      </div>

      <p className="text-xs text-neutral-500">{facilitatingMsg}</p>
    </div>
  );
}
