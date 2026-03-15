import { describe, it, expect } from "vitest";
import { analyseSubjects } from "./SubjectReport";
import type { IBSubject } from "wasp/entities";

// Minimal subject stubs matching seed-data names
function makeSubject(id: string, name: string, group: number): IBSubject {
  return { id, name, group, category: "BOTH" } as IBSubject;
}

const subjects: IBSubject[] = [
  makeSubject("1", "Chemistry", 4),
  makeSubject("2", "Biology", 4),
  makeSubject("3", "Mathematics: Analysis and Approaches", 5),
  makeSubject("4", "Physics", 4),
  makeSubject("5", "Psychology", 3),
  makeSubject("6", "English A: Literature", 1),
  makeSubject("7", "History", 3),
  makeSubject("8", "Economics", 3),
  makeSubject("9", "Business Management", 3),
  makeSubject("10", "Computer Science", 4),
  makeSubject("11", "Visual Arts", 6),
  makeSubject("12", "Theatre", 6),
  makeSubject("13", "Film", 6),
  makeSubject("14", "Mathematics: Applications and Interpretation", 5),
  makeSubject("15", "Global Politics", 3),
  makeSubject("16", "English A: Language and Literature", 1),
  makeSubject("17", "French A: Literature", 1),
];

describe("analyseSubjects", () => {
  it("returns empty feedback for no selection", () => {
    const result = analyseSubjects(subjects, [], []);
    expect(result.pros).toHaveLength(0);
    expect(result.cons).toHaveLength(0);
    expect(result.recommendations).toHaveLength(0);
  });

  it("praises HL Chem + HL Bio for medicine", () => {
    const result = analyseSubjects(subjects, ["1", "2", "3"], ["5", "6", "17"]);
    expect(result.pros.some((p) => p.includes("Medicine"))).toBe(true);
  });

  it("warns when Chem is SL but Bio is HL for medicine", () => {
    // HL: Bio, Maths AA, Psych; SL: Chem, English, History
    const result = analyseSubjects(subjects, ["2", "3", "5"], ["1", "6", "7"]);
    expect(result.cons.some((c) => c.includes("Medicine risk"))).toBe(true);
  });

  it("praises HL Maths AA + HL Physics for engineering", () => {
    const result = analyseSubjects(subjects, ["3", "4", "1"], ["6", "8", "9"]);
    expect(result.pros.some((p) => p.includes("Engineering"))).toBe(true);
  });

  it("warns about three essay-heavy HLs", () => {
    // HL: English Lit, History, Psych (all essay-heavy)
    const result = analyseSubjects(subjects, ["6", "7", "5"], ["14", "2", "17"]);
    expect(result.cons.some((c) => c.includes("essay workload"))).toBe(true);
  });

  it("warns about no quantitative subjects", () => {
    // HL: English Lit, History, Global Politics; SL: Theatre, Film, French
    const result = analyseSubjects(subjects, ["6", "7", "15"], ["12", "13", "17"]);
    expect(result.cons.some((c) => c.includes("No quantitative"))).toBe(true);
  });

  it("flags Maths AI with CS as potential issue", () => {
    // HL: CS, Maths AI, Physics; SL: ...
    const result = analyseSubjects(subjects, ["10", "14", "4"], ["6", "8", "17"]);
    expect(result.cons.some((c) => c.includes("Maths AI"))).toBe(true);
  });

  it("praises HL Econ + HL Maths AA for economics", () => {
    const result = analyseSubjects(subjects, ["8", "3", "6"], ["5", "2", "17"]);
    expect(result.pros.some((p) => p.includes("Economics"))).toBe(true);
  });

  it("shows incomplete selection nudge", () => {
    // 2 HL, 1 SL → should nudge for both
    const result = analyseSubjects(subjects, ["1", "2"], ["6"]);
    expect(result.recommendations.some((r) => r.includes("Higher Level"))).toBe(true);
    expect(result.recommendations.some((r) => r.includes("Standard Level"))).toBe(true);
  });

  it("warns about 4+ essay-heavy subjects total", () => {
    // HL: English Lit, History, Maths AA; SL: Psych, Economics, Global Politics
    // That's 5 essay-heavy subjects (ENG_LIT, HIST, PSYCH, ECON, GP)
    const result = analyseSubjects(subjects, ["6", "7", "3"], ["5", "8", "15"]);
    expect(result.cons.some((c) => c.includes("Essay-heavy combination"))).toBe(true);
  });

  it("warns about HL Business Management + HL Economics overlap", () => {
    // HL: BM, Econ, Maths AA; SL: English, History, Bio
    const result = analyseSubjects(subjects, ["9", "8", "3"], ["6", "7", "2"]);
    expect(result.cons.some((c) => c.includes("overlap"))).toBe(true);
  });

  it("recommends Biology for Psychology students", () => {
    // HL: Psych, History, English; SL: Maths AI, Film, French
    const result = analyseSubjects(subjects, ["5", "7", "6"], ["14", "13", "17"]);
    expect(result.recommendations.some((r) => r.includes("psychology") || r.includes("Psychology"))).toBe(true);
  });
});
