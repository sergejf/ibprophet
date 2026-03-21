import { useState } from "react";
import type { IBSubject } from "wasp/entities";
import { twJoin } from "tailwind-merge";
import { getSubjectInfo } from "../shared/subject-info";

const groupTopBorder: Record<number, string> = {
  1: "border-t-ib-1",
  2: "border-t-ib-2",
  3: "border-t-ib-3",
  4: "border-t-ib-4",
  5: "border-t-ib-5",
  6: "border-t-ib-6",
};

const groupChipBg: Record<number, string> = {
  1: "bg-ib-1/15 text-ib-1",
  2: "bg-ib-2/15 text-ib-2",
  3: "bg-ib-3/15 text-ib-3",
  4: "bg-ib-4/15 text-ib-4",
  5: "bg-ib-5/15 text-ib-5",
  6: "bg-ib-6/15 text-ib-6",
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

function GroupChip({ group }: { group: number }) {
  return (
    <span
      className={twJoin(
        "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
        groupChipBg[group],
      )}
      title={`Group ${group}: ${groupNames[group]}`}
    >
      {group}
    </span>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-700/50 text-neutral-400 transition-colors hover:bg-red-500/20 hover:text-red-400"
      title="Remove subject"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="h-3 w-3"
      >
        <path
          fillRule="evenodd"
          d="M3.28 2.22a.75.75 0 0 0-1.06 1.06L6.94 8l-4.72 4.72a.75.75 0 1 0 1.06 1.06L8 9.06l4.72 4.72a.75.75 0 1 0 1.06-1.06L9.06 8l4.72-4.72a.75.75 0 0 0-1.06-1.06L8 6.94 3.28 2.22Z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}

function InfoPanel({
  description,
  iboUrl,
  onClose,
}: {
  description: string;
  iboUrl: string;
  onClose: () => void;
}) {
  return (
    <div className="bg-dark-700/50 mt-1 rounded-lg px-2.5 py-2">
      <p className="text-xs leading-relaxed text-neutral-400">{description}</p>
      <div className="mt-1.5 flex items-center justify-between">
        <a
          href={iboUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-neutral-500 transition-colors hover:text-neutral-300"
        >
          Read more on ibo.org
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-3 w-3"
          >
            <path
              fillRule="evenodd"
              d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
        </a>
        <button
          onClick={onClose}
          className="text-[11px] text-neutral-600 transition-colors hover:text-neutral-400"
        >
          close
        </button>
      </div>
    </div>
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
  const [infoOpen, setInfoOpen] = useState(false);
  const info = getSubjectInfo(subject.name);
  const hasInfo = !!info;

  const subjectNameEl = (
    <span
      className={twJoin(
        "text-sm font-semibold text-neutral-100",
        hasInfo &&
          "cursor-help border-b border-dashed border-neutral-600 transition-colors hover:border-neutral-400",
        hasInfo && infoOpen && "border-solid border-neutral-400",
      )}
      onClick={hasInfo ? () => setInfoOpen(!infoOpen) : undefined}
    >
      {subject.name}
    </span>
  );

  if (selectionState) {
    return (
      <div
        className={twJoin(
          "card flex w-full flex-col gap-2 border-t-[3px] p-3 transition-all duration-200",
          groupTopBorder[subject.group],
          selectionState === "hl"
            ? "scale-[1.02] bg-orange-500/5 ring-1 ring-orange-500/60"
            : "scale-[1.02] bg-sky-500/5 ring-1 ring-sky-500/60",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <span className="flex flex-wrap items-center gap-1.5">
            {subjectNameEl}
            {facilitating && (
              <FacilitatingBadge hlOnly={facilitating === "hl-only"} />
            )}
          </span>
          <div className="flex shrink-0 items-center gap-1.5">
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
            <RemoveButton onClick={onDeselect} />
          </div>
        </div>
        {infoOpen && info && (
          <InfoPanel
            description={info.description}
            iboUrl={info.iboUrl}
            onClose={() => setInfoOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={twJoin(
        "card flex w-full flex-col gap-2 border-t-[3px] p-3 transition-all duration-200 active:scale-[0.97]",
        groupTopBorder[subject.group],
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex flex-wrap items-center gap-1.5">
          {subjectNameEl}
          {facilitating && (
            <FacilitatingBadge hlOnly={facilitating === "hl-only"} />
          )}
        </span>
        <GroupChip group={subject.group} />
      </div>
      {infoOpen && info && (
        <InfoPanel
          description={info.description}
          iboUrl={info.iboUrl}
          onClose={() => setInfoOpen(false)}
        />
      )}
      <div className="flex gap-2">
        {!isSLOnly && (
          <button
            disabled={hlFull}
            onClick={() => onSelect("hl")}
            className={twJoin(
              "rounded-full px-3 py-1 text-xs font-semibold transition-all duration-150 active:scale-95",
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
            "rounded-full px-3 py-1 text-xs font-semibold transition-all duration-150 active:scale-95",
            slFull
              ? "bg-dark-700 cursor-not-allowed text-neutral-600"
              : "bg-sky-500/15 text-sky-400 hover:bg-sky-500/30",
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
