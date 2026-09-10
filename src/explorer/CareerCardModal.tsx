import type { Career } from "wasp/entities";
import { Link } from "wasp/client/router";
import { Dialog } from "../shared/components/Dialog";
import { Badge } from "../shared/components/Badge";
import { SalaryBar } from "../shared/components/SalaryBar";
import { aiResilienceLabels } from "../shared/ai-exposure";
import { RationaleAttribution } from "../shared/components/RationaleAttribution";

interface CareerCardModalProps {
  career: Career | null;
  open: boolean;
  onClose: () => void;
}

export function CareerCardModal({
  career,
  open,
  onClose,
}: CareerCardModalProps) {
  if (!career) return null;

  const pros: string[] = JSON.parse(career.pros);
  const cons: string[] = JSON.parse(career.cons);
  const ai = aiResilienceLabels[career.aiResilience];
  const badgeText =
    career.aiExposure != null ? `${ai.text} (${career.aiExposure}/9)` : ai.text;
  const maxSalary = Math.max(career.salaryMidUS, career.salaryMidUK);
  const growthColor =
    career.growthPercent10Y > 10
      ? "text-green-400"
      : career.growthPercent10Y >= 0
        ? "text-yellow-400"
        : "text-red-400";

  const rationaleTeaser =
    career.aiExposureRationale && career.aiExposureRationale.length > 100
      ? career.aiExposureRationale.slice(0, 100) + "..."
      : career.aiExposureRationale;

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="flex w-full flex-col gap-4 overflow-y-auto p-6">
        <div className="flex items-start justify-between">
          <h2 className="text-primary-500 text-xl font-bold">{career.name}</h2>
          <Badge color={ai.color}>{badgeText}</Badge>
        </div>

        <p className="text-sm text-neutral-300">{career.description}</p>

        {rationaleTeaser && (
          <div>
            <p className="text-xs leading-relaxed text-neutral-400 italic">
              {rationaleTeaser}
            </p>
            {career.rationaleSource === "KARPATHY_JOBS" && (
              <RationaleAttribution
                source={career.rationaleSource}
                className="mt-1"
              />
            )}
          </div>
        )}

        {career.educationRequired && (
          <Badge color="blue">{career.educationRequired}</Badge>
        )}

        {/* Salary bars */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
            Salary
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <SalaryBar
              label="US Start"
              value={career.salaryStartUS}
              maxValue={maxSalary}
              currency="$"
            />
            <SalaryBar
              label="UK Start"
              value={career.salaryStartUK}
              maxValue={maxSalary}
              color="bg-blue-500"
              currency="£"
            />
            <SalaryBar
              label="US Mid"
              value={career.salaryMidUS}
              maxValue={maxSalary}
              currency="$"
            />
            <SalaryBar
              label="UK Mid"
              value={career.salaryMidUK}
              maxValue={maxSalary}
              color="bg-blue-500"
              currency="£"
            />
          </div>
        </div>

        {/* Growth */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
            10Y Growth:
          </span>
          <span className={`font-bold ${growthColor}`}>
            {career.growthPercent10Y > 0 ? "+" : ""}
            {career.growthPercent10Y}%
          </span>
        </div>

        {/* Pros / Cons */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="mb-1 text-xs font-semibold tracking-wider text-green-400 uppercase">
              Pros
            </h3>
            <ul className="space-y-1 text-sm text-neutral-300">
              {pros.map((p, i) => (
                <li key={i} className="flex gap-1.5">
                  <span className="text-green-400">+</span> {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-1 text-xs font-semibold tracking-wider text-red-400 uppercase">
              Cons
            </h3>
            <ul className="space-y-1 text-sm text-neutral-300">
              {cons.map((c, i) => (
                <li key={i} className="flex gap-1.5">
                  <span className="text-red-400">-</span> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Link
          to="/career/:slug"
          params={{ slug: career.slug }}
          className="text-primary-500 hover:text-primary-400 text-center text-sm"
        >
          View full details →
        </Link>
      </div>
    </Dialog>
  );
}
