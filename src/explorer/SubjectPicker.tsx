import type { IBSubject } from "wasp/entities";
import { SubjectCard, groupNames } from "./SubjectCard";

interface SubjectPickerProps {
  subjects: IBSubject[];
  hlIds: string[];
  slIds: string[];
  onSelect: (subjectId: string, level: "hl" | "sl") => void;
  onDeselect: (subjectId: string) => void;
}

const groupColorDot: Record<number, string> = {
  1: "bg-ib-1",
  2: "bg-ib-2",
  3: "bg-ib-3",
  4: "bg-ib-4",
  5: "bg-ib-5",
  6: "bg-ib-6",
};

export function SubjectPicker({
  subjects,
  hlIds,
  slIds,
  onSelect,
  onDeselect,
}: SubjectPickerProps) {
  const groups = new Map<number, IBSubject[]>();
  for (const s of subjects) {
    const list = groups.get(s.group) || [];
    list.push(s);
    groups.set(s.group, list);
  }

  const getSelectionState = (id: string) => {
    if (hlIds.includes(id)) return "hl" as const;
    if (slIds.includes(id)) return "sl" as const;
    return null;
  };

  const hlFull = hlIds.length >= 3;
  const slFull = slIds.length >= 3;
  const totalSelected = hlIds.length + slIds.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Progress bar */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-orange-500" />
            <span className="text-neutral-400">
              Higher Level{" "}
              <strong className="text-orange-400">{hlIds.length}/3</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-sky-500" />
            <span className="text-neutral-400">
              Standard Level{" "}
              <strong className="text-sky-400">{slIds.length}/3</strong>
            </span>
          </div>
        </div>
        <div className="bg-dark-700 flex h-2 overflow-hidden rounded-full">
          <div
            className="bg-orange-500 transition-all duration-300"
            style={{ width: `${(hlIds.length / 6) * 100}%` }}
          />
          <div
            className="bg-sky-500 transition-all duration-300"
            style={{ width: `${(slIds.length / 6) * 100}%` }}
          />
        </div>
        {totalSelected === 6 && (
          <p className="text-sm font-medium text-green-400">
            All 6 subjects selected — scroll down to see your Pathway Map
          </p>
        )}
      </div>

      {/* Subjects grouped by IB group with headers */}
      {[...groups.entries()]
        .sort(([a], [b]) => a - b)
        .map(([groupNum, groupSubjects]) => (
          <div key={groupNum} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${groupColorDot[groupNum]}`}
              />
              <h3 className="text-sm font-semibold text-neutral-300">
                Group {groupNum}: {groupNames[groupNum]}
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {groupSubjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  selectionState={getSelectionState(subject.id)}
                  hlFull={hlFull}
                  slFull={slFull}
                  onSelect={(level) => onSelect(subject.id, level)}
                  onDeselect={() => onDeselect(subject.id)}
                />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
