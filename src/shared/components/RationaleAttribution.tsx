/**
 * Provenance marker for a career's AI-exposure rationale.
 *
 * The dataset mixes analysis written for this project with rationales
 * reproduced from karpathy/jobs, so every rationale states which it is rather
 * than presenting both as ours. Typed as a string union instead of the Prisma
 * enum so it does not depend on a regenerated client.
 */
export type RationaleSource = "OWN" | "KARPATHY_JOBS";

const KARPATHY_URL = "https://github.com/karpathy/jobs";

export function RationaleAttribution({
  source,
  className = "",
}: {
  source: RationaleSource;
  className?: string;
}) {
  if (source === "OWN") {
    return (
      <p className={`text-xs text-neutral-500 ${className}`}>
        Our analysis, scored against the BLS occupational description.
      </p>
    );
  }

  return (
    <p className={`text-xs text-neutral-500 ${className}`}>
      Quoted from{" "}
      <a
        href={KARPATHY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary-400 hover:text-primary-300 underline"
      >
        karpathy/jobs
      </a>
      , not written by us.
    </p>
  );
}
