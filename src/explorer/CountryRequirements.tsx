import { useMemo, useState } from "react";
import type { IBSubject } from "wasp/entities";

interface CountryRequirementsProps {
  subjects: IBSubject[];
  hlIds: string[];
  slIds: string[];
}

interface Check {
  label: string;
  passed: boolean;
  detail: string;
}

/* ── Germany IB Diploma recognition rules (source: DAAD / KMK resolution) ── */

const NATURAL_SCIENCES = ["Biology", "Chemistry", "Physics"];

const GROUP_3_SOCIAL = [
  "History", "Economics", "Psychology", "Business Management", "Global Politics",
];

const RECOGNISED_SUBJECTS = [
  // Groups 1-5 all subjects are recognised. Group 6 recognised list:
  "Visual Arts", "Music", "Theatre", "Film", "Dance",
  "Computer Science", "Design Technology",
  "Environmental Systems and Societies",
  "Sports, Exercise and Health Science",
];

function isLanguageA(name: string): boolean {
  return name.includes("A: Literature") || name.includes("A: Language and Literature");
}

function isLanguageB(name: string): boolean {
  return name.includes(" B") && !name.includes("Ab Initio");
}

function isLanguageAbInitio(name: string): boolean {
  return name.includes("Ab Initio");
}

function evaluateGermany(
  subjects: IBSubject[],
  hlIds: string[],
  slIds: string[],
): Check[] {
  const checks: Check[] = [];
  const byId = new Map(subjects.map((s) => [s.id, s]));
  const hlNames = hlIds.map((id) => byId.get(id)?.name ?? "").filter(Boolean);
  const slNames = slIds.map((id) => byId.get(id)?.name ?? "").filter(Boolean);
  const allNames = [...hlNames, ...slNames];

  // 1. Two languages from groups 1 & 2 (A or B level, not Ab Initio)
  const langAorB = allNames.filter(
    (n) => isLanguageA(n) || isLanguageB(n),
  );
  const hasAbInitio = allNames.some(isLanguageAbInitio);
  checks.push({
    label: "Two languages (A or B level)",
    passed: langAorB.length >= 2,
    detail:
      langAorB.length >= 2
        ? `You have ${langAorB.length} qualifying languages.`
        : `You have ${langAorB.length}. Germany requires 2 languages at level A or B (Ab Initio does not count).${hasAbInitio ? " Your Ab Initio language does not qualify." : ""}`,
  });

  // 2. At least one foreign language at HL (Language A or B HL)
  const foreignLangHL = hlNames.filter(
    (n) => isLanguageA(n) || isLanguageB(n),
  );
  checks.push({
    label: "Foreign language at HL",
    passed: foreignLangHL.length >= 1,
    detail:
      foreignLangHL.length >= 1
        ? `${foreignLangHL[0]} at HL satisfies this.`
        : "Germany requires at least one foreign language studied as Language A or B at Higher Level.",
  });

  // 3. Social science from Group 3
  const hasSocialScience = allNames.some((n) => GROUP_3_SOCIAL.includes(n));
  checks.push({
    label: "Social science (Group 3)",
    passed: hasSocialScience,
    detail: hasSocialScience
      ? `You have a Group 3 subject.`
      : "You must include a social science from Group 3 (History, Economics, Psychology, etc.).",
  });

  // 4. Natural science from Group 4 (Biology, Chemistry, or Physics)
  const hasNatScience = allNames.some((n) => NATURAL_SCIENCES.includes(n));
  checks.push({
    label: "Natural science (Bio/Chem/Physics)",
    passed: hasNatScience,
    detail: hasNatScience
      ? "You have a qualifying natural science."
      : "Germany requires Biology, Chemistry, or Physics. Other Group 4 subjects (ESS, CS, DT) don't satisfy this.",
  });

  // 5. Mathematics requirement
  const hasMathsAA = allNames.includes("Mathematics: Analysis and Approaches");
  const hasMathsAI = allNames.includes("Mathematics: Applications and Interpretation");
  const mathsHLAA = hlNames.includes("Mathematics: Analysis and Approaches");
  const mathsHLAI = hlNames.includes("Mathematics: Applications and Interpretation");
  const mathsHL = mathsHLAA || mathsHLAI;

  if (mathsHL) {
    checks.push({
      label: "Mathematics",
      passed: true,
      detail: "Maths at HL grants unrestricted university access for all subjects in Germany.",
    });
  } else if (hasMathsAA || hasMathsAI) {
    checks.push({
      label: "Mathematics",
      passed: true,
      detail: "Maths at SL is accepted, but access may be restricted — STEM fields typically require HL. Check your school's listing in the KMK agreement for full access.",
    });
  } else {
    checks.push({
      label: "Mathematics",
      passed: false,
      detail: "Germany requires a mathematics subject. Include Maths AA or AI.",
    });
  }

  // 6. HL must include a language, maths, or natural science (from 2025)
  const hlHasLangMathSci = hlNames.some(
    (n) =>
      isLanguageA(n) ||
      isLanguageB(n) ||
      n.includes("Mathematics") ||
      NATURAL_SCIENCES.includes(n),
  );
  checks.push({
    label: "HL includes language, maths, or science",
    passed: hlHasLangMathSci,
    detail: hlHasLangMathSci
      ? "Your HL subjects include at least one language, maths, or natural science."
      : "From 2025, at least one of your 3 HL subjects must be a language, mathematics, or natural science (Biology/Chemistry/Physics).",
  });

  // 7. Minimum 24 points (informational — we can't calculate this but note it)
  checks.push({
    label: "Minimum 24 IB points",
    passed: true, // Can't verify, assume student aims for this
    detail: "All subjects must score at least 4/7. A score of 3 can be compensated by a 5 in another subject at the same or higher level.",
  });

  return checks;
}

/* ── Component ── */

const COUNTRIES = [
  { code: "DE", name: "Germany", flag: "🇩🇪" },
] as const;

export function CountryRequirements({
  subjects,
  hlIds,
  slIds,
}: CountryRequirementsProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>("DE");

  const isComplete = hlIds.length === 3 && slIds.length === 3;

  const checks = useMemo(() => {
    if (!isComplete) return [];
    if (selectedCountry === "DE") {
      return evaluateGermany(subjects, hlIds, slIds);
    }
    return [];
  }, [subjects, hlIds, slIds, selectedCountry, isComplete]);

  if (!isComplete) return null;

  const passCount = checks.filter((c) => c.passed).length;
  const allPassed = passCount === checks.length;

  return (
    <section className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-neutral-100">
          Country Requirements
        </h3>
        <div className="flex gap-1">
          {COUNTRIES.map((c) => (
            <button
              key={c.code}
              onClick={() => setSelectedCountry(c.code)}
              className={`rounded-lg px-3 py-1 text-sm transition-colors ${
                selectedCountry === c.code
                  ? "bg-primary-500/20 text-primary-500"
                  : "bg-dark-700 text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {c.flag} {c.name}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-4 text-sm text-neutral-400">
        Does your IB diploma meet {COUNTRIES.find((c) => c.code === selectedCountry)?.name}'s
        university admission requirements?
      </p>

      {/* Summary badge */}
      <div className="mb-4 flex items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            allPassed
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-amber-500/15 text-amber-400"
          }`}
        >
          {allPassed
            ? "All requirements met"
            : `${passCount}/${checks.length} requirements met`}
        </span>
      </div>

      {/* Checklist */}
      <div className="flex flex-col gap-2">
        {checks.map((check, i) => (
          <div
            key={i}
            className={`flex gap-3 rounded-lg px-3 py-2.5 ${
              check.passed
                ? "bg-emerald-500/5 border border-emerald-500/15"
                : "bg-red-500/5 border border-red-500/15"
            }`}
          >
            <span className="mt-0.5 shrink-0 text-sm">
              {check.passed ? (
                <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </span>
            <div>
              <span className={`text-sm font-medium ${check.passed ? "text-emerald-300" : "text-red-300"}`}>
                {check.label}
              </span>
              <p className="mt-0.5 text-xs text-neutral-400">{check.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-neutral-500">
        Source: DAAD / KMK resolution (2025 onwards). This is for guidance only — verify with your target university.
      </p>
    </section>
  );
}
