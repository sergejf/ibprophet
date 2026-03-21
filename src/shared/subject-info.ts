/**
 * Official IBO subject descriptions (paraphrased) and curriculum page URLs.
 *
 * IBO base: https://www.ibo.org/programmes/diploma-programme/curriculum/
 * Language-specific subjects (e.g. "French A: Literature") share a page with
 * the generic course type (e.g. "Language A: literature").
 */

const IBO_BASE = "https://www.ibo.org/programmes/diploma-programme/curriculum/";

interface SubjectInfo {
  description: string;
  iboPath: string;
}

/** Map from exact seed-data subject name → info. */
const SUBJECT_INFO: Record<string, SubjectInfo> = {
  // ── Group 1: Language & Literature ──────────────────────────────
  "English A: Language and Literature": {
    description:
      "Explore the relationship between language, culture and meaning through literary and non-literary texts, developing analytical and communication skills.",
    iboPath: "language-and-literature/language-a-language-and-literature/",
  },
  "English A: Literature": {
    description:
      "Study works of literature from various periods, genres and contexts. Develop skills in literary analysis, critical thinking and written expression.",
    iboPath: "language-and-literature/language-a-literature/",
  },
  "French A: Literature": {
    description:
      "Study works of literature from various periods, genres and contexts. Develop skills in literary analysis, critical thinking and written expression.",
    iboPath: "language-and-literature/language-a-literature/",
  },
  "Italian A: Literature": {
    description:
      "Study works of literature from various periods, genres and contexts. Develop skills in literary analysis, critical thinking and written expression.",
    iboPath: "language-and-literature/language-a-literature/",
  },
  "German A: Literature": {
    description:
      "Study works of literature from various periods, genres and contexts. Develop skills in literary analysis, critical thinking and written expression.",
    iboPath: "language-and-literature/language-a-literature/",
  },
  "Japanese A: Literature": {
    description:
      "Study works of literature from various periods, genres and contexts. Develop skills in literary analysis, critical thinking and written expression.",
    iboPath: "language-and-literature/language-a-literature/",
  },
  "Russian A: Literature": {
    description:
      "Study works of literature from various periods, genres and contexts. Develop skills in literary analysis, critical thinking and written expression.",
    iboPath: "language-and-literature/language-a-literature/",
  },
  "Chinese A: Literature": {
    description:
      "Study works of literature from various periods, genres and contexts. Develop skills in literary analysis, critical thinking and written expression.",
    iboPath: "language-and-literature/language-a-literature/",
  },
  "Turkish A: Literature": {
    description:
      "Study works of literature from various periods, genres and contexts. Develop skills in literary analysis, critical thinking and written expression.",
    iboPath: "language-and-literature/language-a-literature/",
  },
  "Vietnamese A: Literature": {
    description:
      "Study works of literature from various periods, genres and contexts. Develop skills in literary analysis, critical thinking and written expression.",
    iboPath: "language-and-literature/language-a-literature/",
  },
  "Hebrew A: Literature": {
    description:
      "Study works of literature from various periods, genres and contexts. Develop skills in literary analysis, critical thinking and written expression.",
    iboPath: "language-and-literature/language-a-literature/",
  },

  // ── Group 2: Language Acquisition ───────────────────────────────
  "English B": {
    description:
      "Develop practical communication skills in an additional language through authentic texts and cultural exploration, available at SL and HL.",
    iboPath: "language-acquisition/language-b/",
  },
  "Spanish B": {
    description:
      "Develop practical communication skills in an additional language through authentic texts and cultural exploration, available at SL and HL.",
    iboPath: "language-acquisition/language-b/",
  },
  "French B": {
    description:
      "Develop practical communication skills in an additional language through authentic texts and cultural exploration, available at SL and HL.",
    iboPath: "language-acquisition/language-b/",
  },
  "German B": {
    description:
      "Develop practical communication skills in an additional language through authentic texts and cultural exploration, available at SL and HL.",
    iboPath: "language-acquisition/language-b/",
  },
  "Italian B": {
    description:
      "Develop practical communication skills in an additional language through authentic texts and cultural exploration, available at SL and HL.",
    iboPath: "language-acquisition/language-b/",
  },
  "Chinese B": {
    description:
      "Develop practical communication skills in an additional language through authentic texts and cultural exploration, available at SL and HL.",
    iboPath: "language-acquisition/language-b/",
  },
  "Russian B": {
    description:
      "Develop practical communication skills in an additional language through authentic texts and cultural exploration, available at SL and HL.",
    iboPath: "language-acquisition/language-b/",
  },
  "Spanish Ab Initio": {
    description:
      "Begin learning a new language from scratch, building foundational communication skills for everyday situations across listening, speaking, reading and writing.",
    iboPath: "language-acquisition/language-ab-initio/",
  },
  "French Ab Initio": {
    description:
      "Begin learning a new language from scratch, building foundational communication skills for everyday situations across listening, speaking, reading and writing.",
    iboPath: "language-acquisition/language-ab-initio/",
  },
  "Mandarin Ab Initio": {
    description:
      "Begin learning a new language from scratch, building foundational communication skills for everyday situations across listening, speaking, reading and writing.",
    iboPath: "language-acquisition/language-ab-initio/",
  },

  // ── Group 3: Individuals & Societies ────────────────────────────
  Economics: {
    description:
      "Examine how societies allocate scarce resources, exploring microeconomics, macroeconomics, international trade and development through real-world case studies.",
    iboPath: "individuals-and-societies/economics/",
  },
  History: {
    description:
      "Investigate key historical events, movements and leaders through source analysis, developing skills in critical evaluation, argumentation and historical thinking.",
    iboPath: "individuals-and-societies/history/",
  },
  "Business Management": {
    description:
      "Explore how businesses operate and make decisions, covering organisation, finance, marketing, human resources and operations management.",
    iboPath: "individuals-and-societies/business-and-management/",
  },
  Psychology: {
    description:
      "Study human behaviour and mental processes through biological, cognitive and sociocultural approaches, combining theory with experimental research methods.",
    iboPath: "individuals-and-societies/psychology/",
  },
  "Global Politics": {
    description:
      "Analyse power, sovereignty and international relations through contemporary political issues, human rights, development and conflict resolution.",
    iboPath: "individuals-and-societies/global-politics/",
  },
  Geography: {
    description:
      "Examine the relationship between people and environments through physical and human geography, population dynamics and global resource management.",
    iboPath: "individuals-and-societies/geography/",
  },

  // ── Group 4: Sciences ──────────────────────────────────────────
  "Environmental Systems and Societies": {
    description:
      "An interdisciplinary subject combining environmental science with social perspectives on sustainability, conservation and resource management.",
    iboPath: "sciences/environmental-systems-and-societies/",
  },
  "Sports, Exercise and Health Science": {
    description:
      "Study the science of human performance, exercise physiology, biomechanics and health, combining theory with practical investigation.",
    iboPath: "sciences/sports-exercise-and-health-science/",
  },
  Biology: {
    description:
      "Explore living organisms from molecular to ecosystem level, combining theoretical understanding with experimental investigation of life processes.",
    iboPath: "sciences/biology/",
  },
  Chemistry: {
    description:
      "Study matter, its properties and transformations at the atomic and molecular level, developing practical skills through laboratory investigation.",
    iboPath: "sciences/chemistry/",
  },
  Physics: {
    description:
      "Investigate fundamental laws governing the universe, from mechanics and waves to electromagnetism and nuclear physics, through theory and experiment.",
    iboPath: "sciences/physics/",
  },
  "Computer Science": {
    description:
      "Develop computational thinking and problem-solving skills through programming, data structures, algorithms and system design.",
    iboPath: "sciences/computer-science/",
  },
  "Design Technology": {
    description:
      "Apply design thinking and technology to create practical solutions, exploring materials, manufacturing processes and sustainable innovation.",
    iboPath: "sciences/design-technology/",
  },

  // ── Group 5: Mathematics ───────────────────────────────────────
  "Mathematics: Analysis and Approaches": {
    description:
      "A rigorous course emphasising algebraic methods, calculus and mathematical proof, suited for students planning mathematics-heavy university courses.",
    iboPath: "mathematics/",
  },
  "Mathematics: Applications and Interpretation": {
    description:
      "Focuses on mathematical modelling, statistics and technology-driven problem solving, suited for students in social sciences, design or natural sciences.",
    iboPath: "mathematics/",
  },

  // ── Group 6: The Arts ──────────────────────────────────────────
  "Visual Arts": {
    description:
      "Create and analyse visual artworks, developing technical skills and conceptual understanding across a range of media, forms and artistic traditions.",
    iboPath: "the-arts/visual-arts/",
  },
  Music: {
    description:
      "Explore music through performance, composition and analysis, developing theoretical knowledge and practical skills across diverse musical traditions.",
    iboPath: "the-arts/music/",
  },
  Theatre: {
    description:
      "Engage with theatre as performers, directors and researchers, exploring dramatic theory, world theatre traditions and collaborative creative processes.",
    iboPath: "the-arts/theatre/",
  },
  Film: {
    description:
      "Study film as both an art form and communication medium, developing skills in filmmaking, analysis and critical evaluation of cinematic works.",
    iboPath: "the-arts/film/",
  },
  Dance: {
    description:
      "Explore dance as a performing art through composition, performance and analysis, developing technique and understanding of diverse dance traditions.",
    iboPath: "the-arts/dance/",
  },
};

export function getSubjectInfo(
  name: string,
): { description: string; iboUrl: string } | null {
  const info = SUBJECT_INFO[name];
  if (!info) return null;
  return { description: info.description, iboUrl: IBO_BASE + info.iboPath };
}
