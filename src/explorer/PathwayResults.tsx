import type { Career } from "wasp/entities";

interface SubjectLink {
  subjectId: string;
  weight: number;
  hlRequired: boolean;
  subject: { id: string; name: string };
}

interface CareerLink {
  careerId: string;
  weight: number;
  career: Career;
}

interface Pathway {
  id: string;
  name: string;
  description: string;
  subjectLinks: SubjectLink[];
  careerLinks: CareerLink[];
}

interface PathwayScore {
  pathway: Pathway;
  matchingSubjects: { name: string; weight: number; isHl: boolean }[];
  score: number;
  maxPossibleScore: number;
  percent: number;
}

interface PathwayResultsProps {
  pathways: Pathway[];
  hlSubjectIds: string[];
  selectedSubjectIds: string[];
  onCareerClick: (career: Career) => void;
}

function scorePathways(
  pathways: Pathway[],
  hlSubjectIds: string[],
  selectedSubjectIds: string[],
): PathwayScore[] {
  return pathways
    .map((pathway) => {
      const validLinks = pathway.subjectLinks.filter(
        (sl) =>
          selectedSubjectIds.includes(sl.subjectId) &&
          (!sl.hlRequired || hlSubjectIds.includes(sl.subjectId)),
      );

      const matchingSubjects = validLinks.map((sl) => ({
        name: sl.subject.name,
        weight: sl.weight,
        isHl: hlSubjectIds.includes(sl.subjectId),
      }));

      // Score: sum of weights, with HL subjects counting 1.5x
      const score = validLinks.reduce(
        (sum, sl) =>
          sum + sl.weight * (hlSubjectIds.includes(sl.subjectId) ? 1.5 : 1),
        0,
      );

      // Max possible: sum all link weights at 1.5x (as if all were HL)
      const maxPossibleScore = pathway.subjectLinks.reduce(
        (sum, sl) => sum + sl.weight * 1.5,
        0,
      );

      const percent = maxPossibleScore > 0 ? Math.round((score / maxPossibleScore) * 100) : 0;

      return { pathway, matchingSubjects, score, maxPossibleScore, percent };
    })
    .filter((ps) => ps.matchingSubjects.length >= 1)
    .sort((a, b) => b.score - a.score);
}

const strengthLabel = (percent: number) => {
  if (percent >= 70) return { text: "Strong match", color: "text-green-400" };
  if (percent >= 40) return { text: "Good match", color: "text-yellow-400" };
  return { text: "Partial match", color: "text-neutral-400" };
};

const strengthBarColor = (percent: number) => {
  if (percent >= 70) return "bg-green-500";
  if (percent >= 40) return "bg-yellow-500";
  return "bg-neutral-500";
};

export function PathwayResults({
  pathways,
  hlSubjectIds,
  selectedSubjectIds,
  onCareerClick,
}: PathwayResultsProps) {
  const scored = scorePathways(pathways, hlSubjectIds, selectedSubjectIds);

  if (scored.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-neutral-500">
        Select subjects above to discover matching pathways
      </div>
    );
  }

  // Split into strong combos (2+ subjects) and single-subject matches
  const combos = scored.filter((s) => s.matchingSubjects.length >= 2);
  const singles = scored.filter((s) => s.matchingSubjects.length === 1);

  return (
    <div className="flex flex-col gap-6">
      {combos.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-neutral-200">
            Your subject combination unlocks
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {combos.map((ps) => (
              <PathwayCard key={ps.pathway.id} data={ps} onCareerClick={onCareerClick} />
            ))}
          </div>
        </div>
      )}

      {singles.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-neutral-500">
            Also related
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {singles.map((ps) => (
              <PathwayCardCompact key={ps.pathway.id} data={ps} onCareerClick={onCareerClick} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PathwayCard({
  data,
  onCareerClick,
}: {
  data: PathwayScore;
  onCareerClick: (career: Career) => void;
}) {
  const { pathway, matchingSubjects, percent } = data;
  const strength = strengthLabel(percent);
  const barColor = strengthBarColor(percent);

  return (
    <div className="card flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-base font-bold text-neutral-100">{pathway.name}</h4>
        <span className={`shrink-0 text-xs font-semibold ${strength.color}`}>
          {strength.text}
        </span>
      </div>

      <p className="text-xs text-neutral-400">{pathway.description}</p>

      {/* Match bar */}
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-dark-700">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-neutral-400">{percent}%</span>
      </div>

      {/* Contributing subjects */}
      <div className="flex flex-wrap gap-1.5">
        {matchingSubjects.map((s) => (
          <span
            key={s.name}
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              s.isHl
                ? "bg-orange-500/15 text-orange-400"
                : "bg-sky-500/15 text-sky-400"
            }`}
          >
            {s.name}
          </span>
        ))}
      </div>

      {/* Career outcomes */}
      {pathway.careerLinks.length > 0 && (
        <div className="flex flex-col gap-1.5 border-t border-dark-600 pt-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Career paths
          </span>
          <div className="flex flex-wrap gap-2">
            {pathway.careerLinks.map((cl) => (
              <button
                key={cl.careerId}
                onClick={() => onCareerClick(cl.career)}
                className="rounded-lg bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400 transition-colors hover:bg-green-500/20"
              >
                {cl.career.name} →
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PathwayCardCompact({
  data,
  onCareerClick,
}: {
  data: PathwayScore;
  onCareerClick: (career: Career) => void;
}) {
  const { pathway, matchingSubjects } = data;

  return (
    <div className="card flex flex-col gap-2 p-3 opacity-75">
      <h4 className="text-sm font-semibold text-neutral-200">{pathway.name}</h4>
      <div className="flex flex-wrap gap-1">
        {matchingSubjects.map((s) => (
          <span
            key={s.name}
            className="text-xs text-neutral-500"
          >
            via {s.name}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {pathway.careerLinks.map((cl) => (
          <button
            key={cl.careerId}
            onClick={() => onCareerClick(cl.career)}
            className="text-xs text-green-500/70 hover:text-green-400"
          >
            {cl.career.name} →
          </button>
        ))}
      </div>
    </div>
  );
}
