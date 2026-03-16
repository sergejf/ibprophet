import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuery, getCareer } from "wasp/client/operations";
import { Link } from "wasp/client/router";
import { Badge } from "../shared/components/Badge";
import { SalaryBar } from "../shared/components/SalaryBar";
import { AIExposureGauge } from "../shared/components/AIExposureGauge";
import { aiResilienceLabels } from "../shared/ai-exposure";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

export function CareerPage() {
  const { slug } = useParams<{ slug: string }>();
  const {
    data: career,
    isLoading,
    error,
  } = useQuery(getCareer, { slug: slug! }, { enabled: !!slug });
  const [rationaleOpen, setRationaleOpen] = useState(false);

  // Dynamic page title
  useEffect(() => {
    if (career) {
      document.title = `${career.name} — IB Career Guide · IB Prophet`;
    }
    return () => {
      document.title = "IB Prophet";
    };
  }, [career]);

  // Occupation JSON-LD structured data
  useEffect(() => {
    if (!career) return;
    const jsonLd: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Occupation",
      name: career.name,
      description: career.description,
      estimatedSalary: [
        {
          "@type": "MonetaryAmountDistribution",
          name: "US",
          currency: "USD",
          percentile10: career.salaryStartUS,
          median: career.salaryMidUS,
        },
        {
          "@type": "MonetaryAmountDistribution",
          name: "UK",
          currency: "GBP",
          percentile10: career.salaryStartUK,
          median: career.salaryMidUK,
        },
      ],
    };
    if (career.educationRequired) {
      jsonLd.educationRequirements = {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: career.educationRequired,
      };
    }
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [career]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-neutral-400">
        Loading...
      </div>
    );
  }

  if (error || !career) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-neutral-400">
        <p>Career not found.</p>
        <Link to="/" className="text-primary-500 hover:text-primary-400">
          ← Back to explorer
        </Link>
      </div>
    );
  }

  const pros: string[] = JSON.parse(career.pros);
  const cons: string[] = JSON.parse(career.cons);
  const ai = aiResilienceLabels[career.aiResilience];
  const maxSalary = Math.max(career.salaryMidUS, career.salaryMidUK);
  const growthColor =
    career.growthPercent10Y > 10
      ? "text-green-400"
      : career.growthPercent10Y >= 0
        ? "text-yellow-400"
        : "text-red-400";

  return (
    <div className="mx-auto flex w-full max-w-(--breakpoint-md) flex-col gap-6 p-6">
      <Link to="/" className="text-primary-500 hover:text-primary-400 text-sm">
        ← Back to explorer
      </Link>

      <div className="card p-6">
        <div className="flex items-start justify-between">
          <h1 className="text-primary-500 text-2xl font-bold">{career.name}</h1>
          <Badge color={ai.color}>{ai.text}</Badge>
        </div>

        <p className="mt-3 text-neutral-300">{career.description}</p>

        {/* AI & Automation */}
        {career.aiExposure != null && (
          <div className="mt-6 flex flex-col gap-3">
            <h2 className="text-sm font-semibold tracking-wider text-neutral-400 uppercase">
              AI & Automation
            </h2>
            <AIExposureGauge score={career.aiExposure} />
            {career.aiExposureRationale && (
              <div>
                <button
                  onClick={() => setRationaleOpen(!rationaleOpen)}
                  className="text-sm text-neutral-400 hover:text-neutral-300"
                >
                  {rationaleOpen ? "Hide analysis" : "Read analysis"}{" "}
                  {rationaleOpen ? "\u25BE" : "\u25B8"}
                </button>
                {rationaleOpen && (
                  <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                    {career.aiExposureRationale}
                  </p>
                )}
              </div>
            )}
            <p className="text-xs text-neutral-500">
              Score measures how AI changes the work, not job loss risk.
            </p>
          </div>
        )}

        {/* US Labor Market */}
        {career.blsMedianSalaryUS != null && (
          <div className="mt-6 flex flex-col gap-3">
            <h2 className="text-sm font-semibold tracking-wider text-neutral-400 uppercase">
              US Labor Market (BLS)
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="bg-dark-700 rounded-lg p-3">
                <div className="text-lg font-bold text-neutral-100">
                  ${formatNumber(career.blsMedianSalaryUS)}
                </div>
                <div className="text-xs text-neutral-500">Median salary</div>
              </div>
              {career.employmentUS != null && (
                <div className="bg-dark-700 rounded-lg p-3">
                  <div className="text-lg font-bold text-neutral-100">
                    {formatNumber(career.employmentUS)}
                  </div>
                  <div className="text-xs text-neutral-500">US jobs</div>
                </div>
              )}
              {career.projectedGrowthUS && (
                <div className="bg-dark-700 rounded-lg p-3">
                  <div className="text-lg font-bold text-neutral-100">
                    {career.projectedGrowthUS}
                  </div>
                  <div className="text-xs text-neutral-500">Growth outlook</div>
                </div>
              )}
              {career.educationRequired && (
                <div className="bg-dark-700 rounded-lg p-3">
                  <div className="text-lg font-bold text-neutral-100">
                    {career.educationRequired}
                  </div>
                  <div className="text-xs text-neutral-500">
                    Education required
                  </div>
                </div>
              )}
            </div>
            {career.blsUrl && (
              <p className="text-xs text-neutral-500">
                Source:{" "}
                <a
                  href={career.blsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-500 hover:text-primary-400 underline"
                >
                  BLS Occupational Outlook Handbook
                </a>
              </p>
            )}
          </div>
        )}

        {/* Salary */}
        <div className="mt-6 flex flex-col gap-3">
          <h2 className="text-sm font-semibold tracking-wider text-neutral-400 uppercase">
            Entry & Mid-Career Salary
          </h2>
          {career.blsMedianSalaryUS != null && (
            <p className="text-xs text-neutral-500">
              Hand-researched estimates for this specific career path. May
              differ from the BLS median above, which covers the broader
              occupation category across all experience levels.
            </p>
          )}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <SalaryBar
              label="US Entry"
              value={career.salaryStartUS}
              maxValue={maxSalary}
              currency="$"
            />
            <SalaryBar
              label="UK Entry"
              value={career.salaryStartUK}
              maxValue={maxSalary}
              color="bg-blue-500"
              currency="£"
            />
            <SalaryBar
              label="US Mid-Career"
              value={career.salaryMidUS}
              maxValue={maxSalary}
              currency="$"
            />
            <SalaryBar
              label="UK Mid-Career"
              value={career.salaryMidUK}
              maxValue={maxSalary}
              color="bg-blue-500"
              currency="£"
            />
          </div>
        </div>

        {/* Growth */}
        <div className="mt-6 flex items-center gap-2">
          <span className="text-sm font-semibold tracking-wider text-neutral-400 uppercase">
            10-Year Growth Outlook:
          </span>
          <span className={`text-lg font-bold ${growthColor}`}>
            {career.growthPercent10Y > 0 ? "+" : ""}
            {career.growthPercent10Y}%
          </span>
        </div>

        {/* Pros / Cons */}
        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <h2 className="mb-2 text-sm font-semibold tracking-wider text-green-400 uppercase">
              Pros
            </h2>
            <ul className="space-y-2 text-sm text-neutral-300">
              {pros.map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-green-400">+</span> {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-2 text-sm font-semibold tracking-wider text-red-400 uppercase">
              Cons
            </h2>
            <ul className="space-y-2 text-sm text-neutral-300">
              {cons.map((c, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-red-400">-</span> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Related Pathways */}
      {career.pathwayLinks.length > 0 && (
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-200">
            University Pathways Leading Here
          </h2>
          <div className="flex flex-col gap-4">
            {career.pathwayLinks.map((pl) => (
              <div
                key={pl.id}
                className="border-dark-600 bg-dark-700 rounded-lg border p-4"
              >
                <h3 className="font-semibold text-orange-400">
                  {pl.pathway.name}
                </h3>
                <p className="mt-1 text-sm text-neutral-400">
                  {pl.pathway.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {pl.pathway.subjectLinks.map((sl) => (
                    <Badge
                      key={sl.id}
                      color={sl.hlRequired ? "yellow" : "blue"}
                    >
                      {sl.subject.name}
                      {sl.hlRequired ? " (HL)" : ""}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
