import { useState, useMemo, useCallback, useEffect } from "react";
import {
  useQuery,
  getSubjects,
  getPathwaysForSubjects,
} from "wasp/client/operations";
import type { Career } from "wasp/entities";
import { SubjectPicker } from "./SubjectPicker";
import { SubjectReport } from "./SubjectReport";
import { PathwayResults } from "./PathwayResults";
import { CareerCardModal } from "./CareerCardModal";
import { SankeyDiagram } from "./SankeyDiagram";
import { PathwayDetailPanel } from "./PathwayDetailPanel";
import { buildSankeyData } from "./sankey-utils";
import { UniversityBenchmark } from "./UniversityBenchmark";
import { CountryRequirements } from "./CountryRequirements";

/** Read hl/sl ids from sessionStorage so they survive navigation to /career/:id */
function readStoredIds(): { hl: string[]; sl: string[] } {
  try {
    const raw = sessionStorage.getItem("ibp-selection");
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { hl: [], sl: [] };
}

function storeIds(hl: string[], sl: string[]) {
  sessionStorage.setItem("ibp-selection", JSON.stringify({ hl, sl }));
}

export function ExplorerPage() {
  const stored = readStoredIds();
  const [hlIds, setHlIds] = useState<string[]>(stored.hl);
  const [slIds, setSlIds] = useState<string[]>(stored.sl);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [selectedPathwayId, setSelectedPathwayId] = useState<string | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<"sankey" | "list">("sankey");

  // Persist selection to sessionStorage
  useEffect(() => {
    storeIds(hlIds, slIds);
  }, [hlIds, slIds]);

  const { data: subjects } = useQuery(getSubjects);

  const allSelectedIds = useMemo(() => [...hlIds, ...slIds], [hlIds, slIds]);

  const { data: pathwayData } = useQuery(
    getPathwaysForSubjects,
    { subjectIds: allSelectedIds, hlSubjectIds: hlIds },
    { enabled: allSelectedIds.length > 0 },
  );

  const sankeyData = useMemo(() => {
    if (!pathwayData) return { nodes: [], links: [] };
    return buildSankeyData({
      pathways: pathwayData.pathways,
      hlSubjectIds: hlIds,
      selectedSubjectIds: allSelectedIds,
    });
  }, [pathwayData, hlIds, allSelectedIds]);

  const selectedPathway = useMemo(() => {
    if (!selectedPathwayId || !pathwayData) return null;
    return pathwayData.pathways.find((p) => p.id === selectedPathwayId) ?? null;
  }, [selectedPathwayId, pathwayData]);

  const handleSelect = useCallback(
    (subjectId: string, level: "hl" | "sl") => {
      setHlIds((prev) => prev.filter((id) => id !== subjectId));
      setSlIds((prev) => prev.filter((id) => id !== subjectId));

      if (level === "hl") {
        setHlIds((prev) => (prev.length < 3 ? [...prev, subjectId] : prev));
      } else {
        setSlIds((prev) => (prev.length < 3 ? [...prev, subjectId] : prev));
      }
    },
    [],
  );

  const handleDeselect = useCallback((subjectId: string) => {
    setHlIds((prev) => prev.filter((id) => id !== subjectId));
    setSlIds((prev) => prev.filter((id) => id !== subjectId));
  }, []);

  const handleCareerClick = useCallback((career: Career) => {
    setSelectedCareer(career);
  }, []);

  const handleCareerClickById = useCallback(
    (careerId: string) => {
      if (!pathwayData) return;
      for (const p of pathwayData.pathways) {
        const cl = p.careerLinks.find((cl) => cl.careerId === careerId);
        if (cl) {
          setSelectedCareer(cl.career);
          return;
        }
      }
    },
    [pathwayData],
  );

  const hasResults = allSelectedIds.length > 0 && pathwayData;

  return (
    <div className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-col gap-8 p-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-neutral-100">
          Explore Your Future
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-neutral-400">
          In the IB Diploma you choose{" "}
          <span className="font-medium text-orange-400">3 Higher Level</span>{" "}
          subjects (studied in depth) and{" "}
          <span className="font-medium text-sky-400">3 Standard Level</span>{" "}
          subjects. Pick yours below to discover the university pathways and
          careers they unlock.
        </p>
      </div>

      {subjects && (
        <SubjectPicker
          subjects={subjects}
          hlIds={hlIds}
          slIds={slIds}
          onSelect={handleSelect}
          onDeselect={handleDeselect}
        />
      )}

      {subjects && allSelectedIds.length > 0 && (
        <SubjectReport subjects={subjects} hlIds={hlIds} slIds={slIds} />
      )}

      <UniversityBenchmark hlIds={hlIds} slIds={slIds} />

      {subjects && (
        <CountryRequirements subjects={subjects} hlIds={hlIds} slIds={slIds} />
      )}

      {hasResults && (
        <section className="flex flex-col gap-4">
          {/* View toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode("sankey")}
              className={`text-sm font-medium transition-colors ${
                viewMode === "sankey"
                  ? "text-primary-500"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              Flow diagram
            </button>
            <span className="text-neutral-600">|</span>
            <button
              onClick={() => setViewMode("list")}
              className={`text-sm font-medium transition-colors ${
                viewMode === "list"
                  ? "text-primary-500"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              List view
            </button>
          </div>

          {viewMode === "sankey" ? (
            <SankeyDiagram
              data={sankeyData}
              onPathwayClick={setSelectedPathwayId}
              onCareerClick={handleCareerClickById}
            />
          ) : (
            <PathwayResults
              pathways={pathwayData.pathways}
              hlSubjectIds={hlIds}
              selectedSubjectIds={allSelectedIds}
              onCareerClick={handleCareerClick}
            />
          )}
        </section>
      )}

      <PathwayDetailPanel
        pathway={selectedPathway}
        hlSubjectIds={hlIds}
        selectedSubjectIds={allSelectedIds}
        open={!!selectedPathway}
        onClose={() => setSelectedPathwayId(null)}
        onCareerClick={(career) => {
          setSelectedPathwayId(null);
          setSelectedCareer(career);
        }}
      />

      <CareerCardModal
        career={selectedCareer}
        open={!!selectedCareer}
        onClose={() => setSelectedCareer(null)}
      />
    </div>
  );
}
