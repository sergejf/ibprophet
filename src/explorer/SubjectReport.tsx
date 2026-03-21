import { useMemo } from "react";
import type { IBSubject } from "wasp/entities";
import {
  ALWAYS_FACILITATING,
  FACILITATING_AT_HL,
} from "../shared/facilitating";

interface SubjectReportProps {
  subjects: IBSubject[];
  hlIds: string[];
  slIds: string[];
}

interface Feedback {
  pros: string[];
  cons: string[];
  recommendations: string[];
}

/* ── Subject name helpers ── */

const MATHS_AA = "Mathematics: Analysis and Approaches";
const MATHS_AI = "Mathematics: Applications and Interpretation";
const CHEM = "Chemistry";
const BIO = "Biology";
const PHYS = "Physics";
const CS = "Computer Science";
const ECON = "Economics";
const BM = "Business Management";
const PSYCH = "Psychology";
const HIST = "History";
const GP = "Global Politics";
const ENG_LL = "English A: Language and Literature";
const ENG_LIT = "English A: Literature";
const VIS_ARTS = "Visual Arts";
const THEATRE = "Theatre";
const FILM = "Film";
const MUSIC = "Music";
const DANCE = "Dance";
const DT = "Design Technology";
const ESS = "Environmental Systems and Societies";
const SEHS = "Sports, Exercise and Health Science";
const GEOG = "Geography";

const SCIENCES = [CHEM, BIO, PHYS, CS, ESS, SEHS, DT];
const ESSAY_HEAVY = [ENG_LL, ENG_LIT, HIST, GP, PSYCH, ECON];
const ARTS = [VIS_ARTS, THEATRE, FILM, MUSIC, DANCE];
const QUANTITATIVE = [MATHS_AA, MATHS_AI, PHYS, CS, ECON];
const GROUP_A_LANGS = [
  ENG_LL,
  ENG_LIT,
  "French A: Literature",
  "Italian A: Literature",
  "German A: Literature",
  "Japanese A: Literature",
  "Russian A: Literature",
  "Chinese A: Literature",
  "Turkish A: Literature",
  "Vietnamese A: Literature",
  "Hebrew A: Literature",
];

function has(names: string[], name: string): boolean {
  return names.includes(name);
}

function isHL(hlNames: string[], name: string): boolean {
  return hlNames.includes(name);
}

function count(names: string[], pool: string[]): number {
  return names.filter((n) => pool.includes(n)).length;
}

export function analyseSubjects(
  subjects: IBSubject[],
  hlIds: string[],
  slIds: string[],
): Feedback {
  const pros: string[] = [];
  const cons: string[] = [];
  const recommendations: string[] = [];

  const byId = new Map(subjects.map((s) => [s.id, s]));
  const hlNames = hlIds.map((id) => byId.get(id)?.name ?? "").filter(Boolean);
  const slNames = slIds.map((id) => byId.get(id)?.name ?? "").filter(Boolean);
  const allNames = [...hlNames, ...slNames];

  const hlCount = hlNames.length;
  const slCount = slNames.length;

  // Need at least some selection to give feedback
  if (hlCount === 0 && slCount === 0) return { pros, cons, recommendations };

  /* ── Common subject checks ── */
  const hasHLChem = isHL(hlNames, CHEM);
  const hasHLBio = isHL(hlNames, BIO);
  const hasChem = has(allNames, CHEM);
  const hasBio = has(allNames, BIO);
  const hasHLMathsAA = isHL(hlNames, MATHS_AA);
  const hasHLPhys = isHL(hlNames, PHYS);
  const hasMathsAA = has(allNames, MATHS_AA);
  const hasMathsAI = has(allNames, MATHS_AI);
  const hasPhys = has(allNames, PHYS);

  /* ═══ FACILITATING SUBJECTS (Russell Group "Informed Choices") ═══ */

  const facilitatingHL = hlNames.filter(
    (n) => ALWAYS_FACILITATING.has(n) || FACILITATING_AT_HL.has(n),
  );
  const facilitatingSL = slNames.filter((n) => ALWAYS_FACILITATING.has(n));
  const facilitatingCount = facilitatingHL.length + facilitatingSL.length;

  if (facilitatingCount === 0 && allNames.length >= 3) {
    cons.push(
      "You haven't chosen any facilitating subjects. The Russell Group recommends at least two to keep the widest range of degree courses open.",
    );
  } else if (facilitatingCount === 1) {
    recommendations.push(
      "Adding a second facilitating subject significantly widens your university options.",
    );
  } else if (facilitatingHL.length >= 2) {
    pros.push(
      `You have ${facilitatingHL.length} facilitating subjects at HL, giving you strong access to selective university courses.`,
    );
  }

  /* ═══ CLASSIC ARCHETYPE DETECTION ═══ */

  if (
    has(allNames, CHEM) &&
    has(allNames, BIO) &&
    (has(allNames, PHYS) || has(allNames, MATHS_AA))
  ) {
    pros.push(
      "Classic science combination — opens Medicine, Biomedical Sciences, Pharmacy, and Veterinary Science.",
    );
  } else if (
    has(allNames, CHEM) &&
    has(allNames, BIO) &&
    !has(allNames, PHYS)
  ) {
    pros.push(
      "Biological/Life Sciences focus — ideal for Medicine, Dentistry, Veterinary, and Biochemistry degrees.",
    );
  }

  if (
    hasHLMathsAA &&
    hasHLPhys &&
    !has(allNames, CHEM) &&
    !has(allNames, BIO)
  ) {
    pros.push(
      "Physical Sciences focus — strong for Engineering, Physics, and Mathematics degrees.",
    );
  }

  /* ═══ GEOGRAPHY COMBOS ═══ */

  if (has(allNames, GEOG) && (hasBio || hasChem)) {
    pros.push(
      "Geography with a science subject opens pathways in Environmental Science and Geography degrees.",
    );
  }

  /* ═══ PATHWAY-SPECIFIC CHECKS ═══ */

  // Medicine
  if (hasHLChem && hasHLBio) {
    pros.push(
      "Strong foundation for Medicine — HL Chemistry and HL Biology meet the entry requirements for most medical schools.",
    );
  } else if (hasHLChem && hasBio) {
    pros.push(
      "Good for Medicine — HL Chemistry is essential, and Biology (even at SL) supports your application.",
    );
  } else if (hasChem && hasBio && !hasHLChem) {
    cons.push(
      "Medicine risk — most medical schools require Chemistry at Higher Level, not Standard Level.",
    );
    recommendations.push(
      "If you're considering Medicine, move Chemistry to HL. Most UK and international medical schools will not accept SL Chemistry.",
    );
  }

  // Engineering
  if (hasHLMathsAA && hasHLPhys) {
    pros.push(
      "Excellent for Engineering — HL Maths AA and HL Physics is exactly what top engineering programmes require.",
    );
  } else if (hasHLMathsAA && hasPhys) {
    pros.push(
      "Good base for Engineering — HL Maths AA is key. Consider moving Physics to HL for the most competitive programmes.",
    );
  }

  // Computer Science pathway
  const hasCS = has(allNames, CS);
  const hasHLCS = isHL(hlNames, CS);

  if (hasHLCS && hasHLMathsAA) {
    pros.push(
      "Strong for Computer Science degrees — HL Maths AA provides the algorithmic foundation that CS programmes expect.",
    );
  } else if (hasCS && !hasMathsAA && hasMathsAI) {
    cons.push(
      "Computer Science caution — some top universities do not accept Maths AI for CS degrees. Maths AA is strongly preferred.",
    );
    recommendations.push(
      "If Computer Science is a target, check whether your preferred universities accept Maths AI. Many, especially in the UK, require Maths AA.",
    );
  }

  // Economics / Business
  if (isHL(hlNames, ECON) && hasHLMathsAA) {
    pros.push(
      "Competitive for Economics — HL Economics with HL Maths AA is the gold standard for selective economics programmes.",
    );
  } else if (isHL(hlNames, ECON) && !hasMathsAA && hasMathsAI) {
    recommendations.push(
      "For competitive economics degrees (e.g. LSE, Oxbridge), Maths AA is preferred over Maths AI. Check your target university requirements.",
    );
  }

  // Law
  const essayHLCount = count(hlNames, ESSAY_HEAVY);
  const hasHLLangA = hlNames.some((n) => GROUP_A_LANGS.includes(n));
  const hasHLHist = isHL(hlNames, HIST);
  const hasHLGP = isHL(hlNames, GP);

  if (essayHLCount >= 2 && hasHLLangA) {
    pros.push(
      "Well-suited for Law — your essay-based HLs develop the critical thinking and argumentation skills law schools value.",
    );
  }

  if (hasHLHist || hasHLGP) {
    if (has(allNames, ECON) || hasHLLangA) {
      pros.push(
        "Solid humanities breadth — History/Politics paired with analytical subjects prepares you for law, diplomacy, and policy-related degrees.",
      );
    }
  }

  /* ═══ WORKLOAD & BALANCE CHECKS ═══ */

  const essayCount = count(allNames, ESSAY_HEAVY);

  // Too many essay-heavy HLs
  if (essayHLCount >= 3) {
    cons.push(
      "Heavy essay workload — three essay-intensive HLs means overlapping deadlines for IAs, extended reading, and exam prep. This can lead to burnout.",
    );
    recommendations.push(
      "Consider swapping one essay-heavy HL for a more quantitative or creative subject to balance your workload and develop a broader skill set.",
    );
  } else if (essayCount >= 4) {
    cons.push(
      "Essay-heavy combination — with four or more essay-based subjects (HL + SL combined), you'll face overlapping coursework deadlines and heavy reading loads throughout the year.",
    );
  }

  // Three very demanding STEM HLs
  const hardStemHL = count(hlNames, [MATHS_AA, PHYS, CHEM]);
  if (hardStemHL === 3) {
    cons.push(
      "Very demanding HL trio — Maths AA, Physics, and Chemistry together at HL creates a crushing workload with simultaneous problem sets and IA deadlines.",
    );
    recommendations.push(
      "This combination is manageable but challenging. Make sure you're confident in all three subjects and plan your IA timeline carefully. Consider whether one of these could work at SL instead.",
    );
  }

  // No quantitative subject at all
  const hasAnyQuant = allNames.some((n) => QUANTITATIVE.includes(n));
  if (allNames.length >= 3 && !hasAnyQuant) {
    cons.push(
      "No quantitative subjects — dropping all maths and analytical subjects limits your options for STEM, business, psychology, and economics degrees.",
    );
    recommendations.push(
      "Include at least SL Maths (AA or AI) to keep doors open. Many universities expect recent mathematical study, even for non-STEM degrees like Architecture or Psychology.",
    );
  }

  // No science at all
  const scienceCount = count(allNames, SCIENCES);
  if (
    allNames.length >= 4 &&
    scienceCount === 0 &&
    !hasMathsAA &&
    !hasMathsAI
  ) {
    cons.push(
      "No science or maths — this severely narrows your university options. Even humanities-oriented students benefit from at least one science or maths at SL.",
    );
  }

  // No essay-based subject
  if (allNames.length >= 4 && essayCount === 0) {
    recommendations.push(
      "Consider adding an essay-based subject. Universities value written communication skills, and essay subjects strengthen your Extended Essay preparation.",
    );
  }

  // Business Management + Economics overlap
  if (has(allNames, BM) && has(allNames, ECON)) {
    if (isHL(hlNames, BM) && isHL(hlNames, ECON)) {
      cons.push(
        "Significant overlap — HL Business Management and HL Economics cover similar territory (market structures, strategy, micro/macro concepts). Universities may view this as narrow rather than broad.",
      );
      recommendations.push(
        "Consider keeping one at HL and replacing the other with a contrasting subject (e.g. a science, maths, or language) to demonstrate breadth.",
      );
    }
  }

  // Psychology without Biology
  if (has(allNames, PSYCH) && !hasBio) {
    recommendations.push(
      "Many psychology degrees have a biological component. Adding Biology (even at SL) strengthens applications to neuroscience and clinical psychology programmes.",
    );
  }

  // Arts in Group 6 when STEM-oriented
  const artsCount = count(allNames, ARTS);
  const stemSubjectCount = count(allNames, [
    MATHS_AA,
    MATHS_AI,
    PHYS,
    CHEM,
    BIO,
    CS,
    DT,
  ]);
  if (artsCount >= 1 && stemSubjectCount >= 3) {
    recommendations.push(
      "You have a STEM-heavy profile but include an arts subject. If aiming for science or engineering degrees, consider replacing it with a second science or humanities subject — many universities prefer applicants with two sciences.",
    );
  }

  /* ═══ SUBJECT DIVERSITY & BREADTH ═══ */

  // All arts HLs
  const artsHLCount = count(hlNames, ARTS);
  if (artsHLCount === 3) {
    cons.push(
      "All-arts HL combination — while strong for pure arts degrees, this closes doors to psychology, business, architecture, and other courses that expect quantitative study.",
    );
    recommendations.push(
      "If you're certain about arts, this works. But if there's any chance you'll explore other fields, swap one arts HL for a humanities or science subject.",
    );
  }

  // Good breadth
  const groupsRepresented = new Set(
    allNames
      .map((n) => {
        const subj = subjects.find((s) => s.name === n);
        return subj?.group;
      })
      .filter(Boolean),
  );
  if (groupsRepresented.size >= 5 && hlCount === 3 && slCount === 3) {
    pros.push(
      "Good subject breadth — your combination spans multiple IB groups, giving you the diverse skill set universities look for.",
    );
  }

  // Maths AI vs AA awareness
  if (hasMathsAI && !hasMathsAA) {
    const hasSTEMambition =
      has(allNames, PHYS) || has(allNames, CS) || has(allNames, CHEM);
    if (hasSTEMambition) {
      cons.push(
        "Maths AI with STEM subjects — some top universities do not accept Maths AI for science, engineering, or computer science degrees. Maths AA is strongly preferred.",
      );
      recommendations.push(
        "Check your target universities' requirements. If any require Maths AA, consider switching before it's too late.",
      );
    }
  }

  // Non-facilitating HL warning
  if (hlCount === 3 && facilitatingHL.length === 0) {
    const hlHasOnlyArtsOrNiche = hlNames.every(
      (n) => ARTS.includes(n) || n === ESS || n === SEHS || n === DT,
    );
    if (hlHasOnlyArtsOrNiche) {
      cons.push(
        "All three HL subjects are non-facilitating — selective universities may not accept this combination for many degree courses.",
      );
    }
  }

  /* ═══ TRADE-OFF WEAKNESSES ═══ */

  // STEM-heavy with no essay subjects
  const coreSTEM = [MATHS_AA, MATHS_AI, PHYS, CHEM, BIO, CS];
  const stemHLs = count(hlNames, coreSTEM);
  if (stemHLs >= 2 && essayCount === 0 && allNames.length >= 4) {
    cons.push(
      "All STEM, no essay subjects — strong for science degrees, but leaves you without the essay and critical analysis skills that broaden your university options. Some medical schools also value evidence of written communication.",
    );
  }

  // Humanities-heavy with no science or maths
  if (
    essayHLCount >= 2 &&
    scienceCount === 0 &&
    !hasMathsAA &&
    !hasMathsAI &&
    allNames.length >= 4
  ) {
    cons.push(
      "Heavy humanities focus — excellent for arts and social science degrees, but you lack the scientific or mathematical foundation needed for any STEM pivot.",
    );
  }

  // ESS as sole science
  if (
    has(allNames, ESS) &&
    !hasChem &&
    !hasBio &&
    !hasPhys &&
    !hasCS &&
    allNames.length >= 4
  ) {
    cons.push(
      "Environmental Systems and Societies is not accepted as a standalone science by most Russell Group universities. If you're aiming for science degrees, you'll need Biology, Chemistry, or Physics alongside it.",
    );
  }

  // SEHS as sole science
  if (
    has(allNames, SEHS) &&
    !hasChem &&
    !hasBio &&
    !hasPhys &&
    !hasCS &&
    !has(allNames, ESS) &&
    allNames.length >= 4
  ) {
    cons.push(
      "Sports, Exercise and Health Science is viewed as a supporting subject, not a core science, by selective universities. Consider adding Biology, Chemistry, or Physics for broader access to science degrees.",
    );
  }

  // Maths AI SL limitations (broader than just STEM)
  if (
    hasMathsAI &&
    !hasMathsAA &&
    !has(allNames, PHYS) &&
    !hasCS &&
    !has(allNames, CHEM)
  ) {
    if (has(allNames, PSYCH) || has(allNames, ECON) || has(allNames, BM)) {
      cons.push(
        "Mathematics: Applications and Interpretation at SL is the minimum mathematical preparation — it may limit options for degrees with quantitative components such as Psychology, Economics, and Architecture.",
      );
    }
  }

  // Two Group 3 subjects at HL (potential overlap)
  const group3Subjects = [ECON, HIST, BM, PSYCH, GP, GEOG];
  const group3HLCount = count(hlNames, group3Subjects);
  if (group3HLCount >= 2 && !(isHL(hlNames, BM) && isHL(hlNames, ECON))) {
    // BM+Econ overlap already handled separately above
    cons.push(
      "Two Individuals & Societies subjects at HL — some universities prefer one Group 3 subject paired with a contrasting discipline to demonstrate intellectual breadth.",
    );
  }

  // Strong science combo but no essay HL — specific Medicine trade-off
  if (hasHLChem && hasHLBio && !hasHLLangA && essayHLCount === 0) {
    cons.push(
      "Your science HLs are excellent for Medicine, but no essay-based HL may weaken applications at universities that value evidence of written communication and critical thinking skills.",
    );
  }

  /* ═══ POSITIVE COMBO PATTERNS ═══ */

  // Arts + English combo
  if (artsHLCount >= 1 && hasHLLangA) {
    pros.push(
      "Creative strength — arts subjects paired with strong English develop the portfolio, analytical, and communication skills valued by creative degree programmes.",
    );
  }

  // Sciences + Maths for STEM
  const stemHLCount = count(hlNames, [MATHS_AA, PHYS, CHEM, BIO, CS]);
  if (stemHLCount >= 2 && (hasMathsAA || hasMathsAI)) {
    pros.push(
      "Strong STEM profile — multiple science HLs with maths gives you access to a wide range of science and technology degrees.",
    );
  }

  // Psychology + Biology
  if (has(allNames, PSYCH) && hasBio) {
    pros.push(
      "Psychology and Biology complement each other well — this combination supports psychology, neuroscience, and health science degrees.",
    );
  }

  // Business + Economics
  if (has(allNames, BM) && has(allNames, ECON)) {
    pros.push(
      "Business Management and Economics together build a strong foundation for business, finance, and management degrees.",
    );
  }

  // ESS for environmental pathways
  if (has(allNames, ESS) && (hasBio || hasChem)) {
    pros.push(
      "Environmental Systems with a science subject opens pathways in environmental science, sustainability, and geography degrees.",
    );
  }

  // Sports Science
  if (has(allNames, SEHS) && hasBio) {
    pros.push(
      "Sports Science paired with Biology is excellent preparation for sports science, physiotherapy, and kinesiology degrees.",
    );
  }

  // Design Technology
  if (has(allNames, DT) && (hasPhys || has(allNames, VIS_ARTS))) {
    pros.push(
      "Design Technology combines well with your other subjects for engineering, architecture, or product design pathways.",
    );
  }

  /* ═══ INCOMPLETE SELECTION NUDGE ═══ */

  if (hlCount > 0 && hlCount < 3) {
    recommendations.push(
      `You've selected ${hlCount}/3 Higher Level subjects. Add ${3 - hlCount} more to see a complete analysis.`,
    );
  }
  if (slCount > 0 && slCount < 3) {
    recommendations.push(
      `You've selected ${slCount}/3 Standard Level subjects. Add ${3 - slCount} more to complete your combination.`,
    );
  }

  return { pros, cons, recommendations };
}

/* ── Icons ── */

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-red-400"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M10 2a6 6 0 00-4 10.472V14a1 1 0 001 1h6a1 1 0 001-1v-1.528A6 6 0 0010 2zm-2 15a1 1 0 001 1h2a1 1 0 001-1v-1H8v1z" />
    </svg>
  );
}

/* ── Component ── */

export function SubjectReport({ subjects, hlIds, slIds }: SubjectReportProps) {
  const feedback = useMemo(
    () => analyseSubjects(subjects, hlIds, slIds),
    [subjects, hlIds, slIds],
  );

  const { pros, cons, recommendations } = feedback;
  const hasContent =
    pros.length > 0 || cons.length > 0 || recommendations.length > 0;

  if (!hasContent) return null;

  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-neutral-100">
        Combination Analysis
      </h3>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Strengths */}
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
          <h4 className="mb-2 text-sm font-semibold text-emerald-400">
            Strengths
          </h4>
          {pros.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {pros.map((p, i) => (
                <li key={i} className="flex gap-2 text-sm text-neutral-300">
                  <CheckIcon />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-500">
              No specific strengths identified yet. Select more subjects to see
              how your combination performs.
            </p>
          )}
        </div>

        {/* Limitations */}
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
          <h4 className="mb-2 text-sm font-semibold text-red-400">
            Limitations
          </h4>
          {cons.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {cons.map((c, i) => (
                <li key={i} className="flex gap-2 text-sm text-neutral-300">
                  <AlertIcon />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-500">
              No significant limitations found with your current selection.
            </p>
          )}
        </div>

        {/* Recommendations */}
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <h4 className="mb-2 text-sm font-semibold text-amber-400">
            Recommendations
          </h4>
          {recommendations.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {recommendations.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-neutral-300">
                  <LightbulbIcon />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-500">
              No additional recommendations at this time.
            </p>
          )}
        </div>
      </div>

      {/* Source attribution moved to shared card footer in ExplorerPage */}
    </div>
  );
}
