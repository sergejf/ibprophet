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
import { OptionsOpenScore } from "./OptionsOpenScore";
import { isFacilitating } from "../shared/facilitating";

/** Read hl/sl ids from sessionStorage so they survive navigation to /career/:id */
function readStoredIds(): { hl: string[]; sl: string[] } {
  try {
    const raw = sessionStorage.getItem("ibp-selection");
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { hl: [], sl: [] };
}

function storeIds(hl: string[], sl: string[]) {
  sessionStorage.setItem("ibp-selection", JSON.stringify({ hl, sl }));
}

const STEPS = [
  "Choose subjects",
  "Explore pathways",
  "Analyse combination",
  "Check requirements",
];

function StepIndicator({ reached }: { reached: number }) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = step < reached;
        const active = step === reached;
        return (
          <div key={step} className="flex items-center gap-1 sm:gap-2">
            {i > 0 && (
              <div
                className={`hidden h-px w-6 sm:block ${done || active ? "bg-primary-500/40" : "bg-neutral-700"}`}
              />
            )}
            <div className="flex items-center gap-1.5">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  active
                    ? "bg-primary-500 text-white"
                    : done
                      ? "bg-primary-500/20 text-primary-400"
                      : "bg-neutral-800 text-neutral-500"
                }`}
              >
                {done ? "\u2713" : step}
              </span>
              <span
                className={`hidden text-xs transition-colors sm:inline ${
                  active
                    ? "font-medium text-neutral-200"
                    : done
                      ? "text-primary-400"
                      : "text-neutral-500"
                }`}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SectionHeader({
  step,
  title,
  subtitle,
}: {
  step: number;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <span className="bg-primary-500/20 text-primary-400 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold">
        {step}
      </span>
      <div>
        <h3 className="text-lg font-semibold text-neutral-100">{title}</h3>
        <p className="text-sm text-neutral-500">{subtitle}</p>
      </div>
    </div>
  );
}

export function ExplorerPage() {
  useEffect(() => {
    document.title = "IB Prophet — IB Subject to Career Explorer";
    return () => {
      document.title = "IB Prophet";
    };
  }, []);
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

  const handleSelect = useCallback((subjectId: string, level: "hl" | "sl") => {
    setHlIds((prev) => prev.filter((id) => id !== subjectId));
    setSlIds((prev) => prev.filter((id) => id !== subjectId));

    if (level === "hl") {
      setHlIds((prev) => (prev.length < 3 ? [...prev, subjectId] : prev));
    } else {
      setSlIds((prev) => (prev.length < 3 ? [...prev, subjectId] : prev));
    }
  }, []);

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
  const isComplete = hlIds.length === 3 && slIds.length === 3;

  // Highest step the user has reached (drives the step indicator)
  // 1 = choosing subjects, 2 = pathways visible, 3 = analysis visible, 4 = requirements visible
  const reachedStep = isComplete
    ? 4
    : hasResults
      ? 3
      : allSelectedIds.length > 0
        ? 2
        : 1;

  const handleReset = useCallback(() => {
    setHlIds([]);
    setSlIds([]);
  }, []);

  // "Try an example" pre-fills a common IB combination
  const handleTryExample = useCallback(() => {
    if (!subjects) return;
    const find = (name: string) => subjects.find((s) => s.name === name)?.id;
    const exHl = [
      find("Chemistry"),
      find("Biology"),
      find("Mathematics: Analysis and Approaches"),
    ].filter(Boolean) as string[];
    const exSl = [
      find("English A: Literature"),
      find("History"),
      find("Spanish B"),
    ].filter(Boolean) as string[];
    setHlIds(exHl);
    setSlIds(exSl);
  }, [subjects]);

  return (
    <div className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-col gap-8 p-4 sm:p-6">
      {/* ── Hero ── */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-neutral-100">
          Explore Your Future
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-neutral-400">
          See how your International Baccalaureate Diploma subjects connect to
          university degrees and AI-ready careers. Pick{" "}
          <span className="font-medium text-orange-400">3 Higher Level</span>{" "}
          and <span className="font-medium text-sky-400">3 Standard Level</span>{" "}
          subjects to get started.
        </p>
        <p className="mx-auto mt-2 max-w-xl text-xs text-neutral-500">
          Built on data from the{" "}
          <a
            href="https://www.informedchoices.ac.uk/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-neutral-600 hover:text-neutral-400"
          >
            Russell Group <em>Informed Choices</em>
          </a>{" "}
          guide,{" "}
          <a
            href="https://www.ibo.org/programmes/diploma-programme/curriculum/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-neutral-600 hover:text-neutral-400"
          >
            IB Diploma Programme
          </a>{" "}
          curriculum,{" "}
          <a
            href="https://www.bls.gov/ooh/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-neutral-600 hover:text-neutral-400"
          >
            US Bureau of Labor Statistics
          </a>
          , and{" "}
          <a
            href="https://github.com/karpathy/jobs"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-neutral-600 hover:text-neutral-400"
          >
            AI career impact research
          </a>
          .
        </p>
        {allSelectedIds.length === 0 && subjects && (
          <button
            onClick={handleTryExample}
            className="text-primary-500 hover:text-primary-400 mt-3 text-sm font-medium transition-colors"
          >
            Try an example combination
          </button>
        )}
      </div>

      {/* ── Step indicator ── */}
      <StepIndicator reached={reachedStep} />

      {/* ── Step 1: Choose your subjects ── */}
      <section>
        <SectionHeader
          step={1}
          title="Choose your subjects"
          subtitle="Select 3 HL and 3 SL subjects from the IB Diploma"
        />
        {subjects && (
          <SubjectPicker
            subjects={subjects}
            hlIds={hlIds}
            slIds={slIds}
            onSelect={handleSelect}
            onDeselect={handleDeselect}
            onReset={handleReset}
          />
        )}
      </section>

      {/* ── Step 2: Explore pathways ── */}
      {hasResults && (
        <section>
          <SectionHeader
            step={2}
            title="Explore pathways"
            subtitle="How your subjects flow into university degrees and careers"
          />
          {/* View toggle — hidden on mobile (flow diagram needs a wide screen) */}
          <div className="mb-4 hidden items-center gap-3 md:flex">
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

          {/* Sankey only on md+ screens; mobile always gets list view */}
          {viewMode === "sankey" && (
            <div className="hidden md:block">
              <SankeyDiagram
                data={sankeyData}
                onPathwayClick={setSelectedPathwayId}
                onCareerClick={handleCareerClickById}
              />
            </div>
          )}
          {viewMode === "list" && (
            <div className="hidden md:block">
              <PathwayResults
                pathways={pathwayData.pathways}
                hlSubjectIds={hlIds}
                selectedSubjectIds={allSelectedIds}
                onCareerClick={handleCareerClick}
              />
            </div>
          )}
          <div className="md:hidden">
            <PathwayResults
              pathways={pathwayData.pathways}
              hlSubjectIds={hlIds}
              selectedSubjectIds={allSelectedIds}
              onCareerClick={handleCareerClick}
            />
          </div>
        </section>
      )}

      {/* ── Step 3: Analyse your combination ── */}
      {subjects && allSelectedIds.length > 0 && (
        <section>
          <SectionHeader
            step={3}
            title="Analyse your combination"
            subtitle="Strengths, limitations, and how many doors your subjects open"
          />
          <div className="card flex flex-col gap-5 p-5">
            <SubjectReport subjects={subjects} hlIds={hlIds} slIds={slIds} />
            {pathwayData && (
              <>
                <div className="border-dark-600 border-t" />
                <OptionsOpenScore
                  matchedPathwayNames={pathwayData.pathways.map((p) => p.name)}
                  facilitatingCount={
                    allSelectedIds.filter((id) => {
                      const s = subjects.find((sub) => sub.id === id);
                      return s
                        ? isFacilitating(s.name, hlIds.includes(id))
                        : false;
                    }).length
                  }
                />
              </>
            )}
            <p className="text-xs text-neutral-500">
              Based on UK university entry requirements, IB subject guidance,
              and the Russell Group <em>Informed Choices</em> guide. Always
              verify with your target universities.
            </p>
          </div>
        </section>
      )}

      {/* ── Step 4: Check requirements ── */}
      {isComplete && (
        <section>
          <SectionHeader
            step={4}
            title="Check requirements"
            subtitle="Where your predicted points place you and country-specific rules"
          />
          <div className="flex flex-col gap-6">
            <UniversityBenchmark hlIds={hlIds} slIds={slIds} />
            {subjects && (
              <CountryRequirements
                subjects={subjects}
                hlIds={hlIds}
                slIds={slIds}
              />
            )}
          </div>
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
