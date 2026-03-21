import type { IBSubject } from "wasp/entities";
import { twJoin } from "tailwind-merge";

const groupColors: Record<number, string> = {
  1: "border-l-ib-1",
  2: "border-l-ib-2",
  3: "border-l-ib-3",
  4: "border-l-ib-4",
  5: "border-l-ib-5",
  6: "border-l-ib-6",
};

export const groupNames: Record<number, string> = {
  1: "Language & Literature",
  2: "Language Acquisition",
  3: "Individuals & Societies",
  4: "Sciences",
  5: "Mathematics",
  6: "The Arts",
};

type SelectionState = "hl" | "sl" | null;

interface SubjectCardProps {
  subject: IBSubject;
  selectionState: SelectionState;
  hlFull: boolean;
  slFull: boolean;
  /** "always" = always facilitating, "hl-only" = facilitating only at HL */
  facilitating?: "always" | "hl-only";
  onSelect: (level: "hl" | "sl") => void;
  onDeselect: () => void;
}

function FacilitatingBadge({ hlOnly }: { hlOnly?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 px-1.5 py-px text-[10px] font-medium text-amber-400"
      title="Facilitating subject — choosing 2+ keeps the widest range of university degrees open (Russell Group Informed Choices)"
    >
      ★ {hlOnly ? "Facilitating at HL" : "Facilitating"}
    </span>
  );
}

export function SubjectCard({
  subject,
  selectionState,
  hlFull,
  slFull,
  facilitating,
  onSelect,
  onDeselect,
}: SubjectCardProps) {
  const isSLOnly = subject.category === "SL_ONLY";

  if (selectionState) {
    return (
      <div
        className={twJoin(
          "card flex w-full flex-col gap-2 border-l-4 p-3",
          groupColors[subject.group],
          selectionState === "hl"
            ? "ring-2 ring-orange-500/70"
            : "ring-2 ring-sky-500/70",
        )}
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-neutral-100">
            {subject.name}
            {facilitating && (
              <FacilitatingBadge hlOnly={facilitating === "hl-only"} />
            )}
          </span>
          <span
            className={twJoin(
              "rounded-full px-2 py-0.5 text-xs font-bold",
              selectionState === "hl"
                ? "bg-orange-500/20 text-orange-400"
                : "bg-sky-500/20 text-sky-400",
            )}
          >
            {selectionState.toUpperCase()}
          </span>
        </div>
        <button
          onClick={onDeselect}
          className="self-start text-xs text-neutral-500 hover:text-neutral-300"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div
      className={twJoin(
        "card flex w-full flex-col gap-2 border-l-4 p-3",
        groupColors[subject.group],
      )}
    >
      <span className="flex items-center gap-1.5 text-sm font-semibold text-neutral-100">
        {subject.name}
        {facilitating && (
          <FacilitatingBadge hlOnly={facilitating === "hl-only"} />
        )}
      </span>
      <div className="flex gap-2">
        {!isSLOnly && (
          <button
            disabled={hlFull}
            onClick={() => onSelect("hl")}
            className={twJoin(
              "rounded-md px-3 py-1 text-xs font-semibold transition-colors",
              hlFull
                ? "bg-dark-700 cursor-not-allowed text-neutral-600"
                : "bg-orange-500/15 text-orange-400 hover:bg-orange-500/30",
            )}
          >
            + HL
          </button>
        )}
        <button
          disabled={slFull}
          onClick={() => onSelect("sl")}
          className={twJoin(
            "rounded-md px-3 py-1 text-xs font-semibold transition-colors",
            slFull
              ? "bg-dark-700 cursor-not-allowed text-neutral-600"
              : "bg-sky-500/15 text-sky-400 hover:bg-sky-500/30",
            isSLOnly && "ml-0",
          )}
        >
          + SL
        </button>
        {isSLOnly && (
          <span className="self-center text-xs text-neutral-600">SL only</span>
        )}
      </div>
    </div>
  );
}
