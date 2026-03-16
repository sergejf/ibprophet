import type { Career } from "wasp/entities";
import { Dialog } from "../shared/components/Dialog";
import { exposureColor } from "../shared/ai-exposure";

interface SubjectLink {
  subjectId: string;
  weight: number;
  hlRequired: boolean;
  subject: { id: string; name: string; group: number };
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

interface PathwayDetailPanelProps {
  pathway: Pathway | null;
  hlSubjectIds: string[];
  selectedSubjectIds: string[];
  open: boolean;
  onClose: () => void;
  onCareerClick: (career: Career) => void;
}

function scorePathway(
  pathway: Pathway,
  hlSubjectIds: string[],
  selectedSubjectIds: string[],
) {
  const validLinks = pathway.subjectLinks.filter(
    (sl) =>
      selectedSubjectIds.includes(sl.subjectId) &&
      (!sl.hlRequired || hlSubjectIds.includes(sl.subjectId)),
  );

  const score = validLinks.reduce(
    (sum, sl) =>
      sum + sl.weight * (hlSubjectIds.includes(sl.subjectId) ? 1.5 : 1),
    0,
  );

  const maxScore = pathway.subjectLinks.reduce(
    (sum, sl) => sum + sl.weight * 1.5,
    0,
  );

  return {
    validLinks,
    percent: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
  };
}

const strengthLabel = (percent: number) => {
  if (percent >= 70)
    return {
      text: "Strong match",
      color: "text-green-400",
      bar: "bg-green-500",
    };
  if (percent >= 40)
    return {
      text: "Good match",
      color: "text-yellow-400",
      bar: "bg-yellow-500",
    };
  return {
    text: "Partial match",
    color: "text-neutral-400",
    bar: "bg-neutral-500",
  };
};

export function PathwayDetailPanel({
  pathway,
  hlSubjectIds,
  selectedSubjectIds,
  open,
  onClose,
  onCareerClick,
}: PathwayDetailPanelProps) {
  if (!pathway) return null;

  const { validLinks, percent } = scorePathway(
    pathway,
    hlSubjectIds,
    selectedSubjectIds,
  );
  const strength = strengthLabel(percent);

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="flex w-full flex-col gap-4 overflow-y-auto p-6">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-xl font-bold text-amber-400">{pathway.name}</h2>
          <span className={`shrink-0 text-xs font-semibold ${strength.color}`}>
            {strength.text}
          </span>
        </div>

        <p className="text-sm text-neutral-300">{pathway.description}</p>

        {/* Match bar */}
        <div className="flex items-center gap-3">
          <div className="bg-dark-700 h-2 flex-1 overflow-hidden rounded-full">
            <div
              className={`h-full rounded-full transition-all duration-500 ${strength.bar}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-neutral-400">
            {percent}%
          </span>
        </div>

        {/* Contributing subjects */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            Your matching subjects
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {validLinks.map((sl) => (
              <span
                key={sl.subjectId}
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  hlSubjectIds.includes(sl.subjectId)
                    ? "bg-orange-500/15 text-orange-400"
                    : "bg-sky-500/15 text-sky-400"
                }`}
              >
                {sl.subject.name}
                <span className="ml-1 text-neutral-500">
                  {hlSubjectIds.includes(sl.subjectId) ? "HL" : "SL"}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Career outcomes */}
        {pathway.careerLinks.length > 0 && (
          <div className="border-dark-600 flex flex-col gap-2 border-t pt-4">
            <h3 className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
              Career paths
            </h3>
            <div className="flex flex-wrap gap-2">
              {pathway.careerLinks.map((cl) => {
                const dotColor =
                  cl.career.aiExposure != null
                    ? {
                        green: "bg-green-500",
                        yellow: "bg-yellow-500",
                        red: "bg-red-500",
                      }[exposureColor(cl.career.aiExposure)]
                    : "bg-neutral-500";
                return (
                  <button
                    key={cl.careerId}
                    onClick={() => onCareerClick(cl.career)}
                    className="flex items-center gap-1.5 rounded-lg bg-green-500/10 px-3 py-1.5 text-sm font-medium text-green-400 transition-colors hover:bg-green-500/20"
                  >
                    <span
                      className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`}
                    />
                    {cl.career.name} →
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
