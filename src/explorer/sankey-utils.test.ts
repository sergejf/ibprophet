import { describe, it, expect } from "vitest";
import { buildSankeyData, truncateLabel } from "./sankey-utils";

describe("buildSankeyData", () => {
  const mockInput = {
    pathways: [
      {
        id: "p1",
        name: "Computer Science",
        subjectLinks: [
          {
            subjectId: "s1",
            weight: 3,
            hlRequired: true,
            subject: { id: "s1", name: "Maths HL", group: 5 },
          },
          {
            subjectId: "s2",
            weight: 2,
            hlRequired: false,
            subject: { id: "s2", name: "Physics", group: 4 },
          },
        ],
        careerLinks: [
          {
            careerId: "c1",
            weight: 3,
            career: { id: "c1", name: "Software Engineer" },
          },
        ],
      },
    ],
    hlSubjectIds: ["s1"],
    selectedSubjectIds: ["s1", "s2"],
  };

  it("builds nodes and links for valid subjects", () => {
    const result = buildSankeyData(mockInput);
    expect(result.nodes).toHaveLength(4); // s1, s2, p1, c1
    expect(result.links).toHaveLength(3); // s1→p1, s2→p1, p1→c1
  });

  it("filters out hlRequired subjects not in HL", () => {
    const result = buildSankeyData({
      ...mockInput,
      hlSubjectIds: [], // Maths not in HL
    });
    // Only s2→p1 subject link, plus p1→c1
    expect(result.links).toHaveLength(2);
    expect(result.nodes).toHaveLength(3); // s2, p1, c1
  });

  it("returns empty data when no subjects selected", () => {
    const result = buildSankeyData({
      ...mockInput,
      selectedSubjectIds: [],
    });
    expect(result.nodes).toHaveLength(0);
    expect(result.links).toHaveLength(0);
  });

  it("prefixes node IDs to avoid collisions", () => {
    const result = buildSankeyData(mockInput);
    const ids = result.nodes.map((n) => n.id);
    expect(ids).toContain("s-s1");
    expect(ids).toContain("p-p1");
    expect(ids).toContain("c-c1");
  });

  it("assigns nodeType to each node", () => {
    const result = buildSankeyData(mockInput);
    const byId = Object.fromEntries(result.nodes.map((n) => [n.id, n]));
    expect(byId["s-s1"].nodeType).toBe("subject");
    expect(byId["s-s2"].nodeType).toBe("subject");
    expect(byId["p-p1"].nodeType).toBe("pathway");
    expect(byId["c-c1"].nodeType).toBe("career");
  });

  it("assigns entityId without prefix", () => {
    const result = buildSankeyData(mockInput);
    const byId = Object.fromEntries(result.nodes.map((n) => [n.id, n]));
    expect(byId["s-s1"].entityId).toBe("s1");
    expect(byId["p-p1"].entityId).toBe("p1");
    expect(byId["c-c1"].entityId).toBe("c1");
  });

  it("colors subjects by IB group", () => {
    const result = buildSankeyData(mockInput);
    const byId = Object.fromEntries(result.nodes.map((n) => [n.id, n]));
    expect(byId["s-s1"].color).toBe("#fb923c"); // group 5 — orange
    expect(byId["s-s2"].color).toBe("#34d399"); // group 4 — emerald
  });

  it("colors pathways amber and careers green", () => {
    const result = buildSankeyData(mockInput);
    const byId = Object.fromEntries(result.nodes.map((n) => [n.id, n]));
    expect(byId["p-p1"].color).toBe("#f59e0b");
    expect(byId["c-c1"].color).toBe("#22c55e");
  });
});

describe("truncateLabel", () => {
  it("returns short labels unchanged", () => {
    expect(truncateLabel("Physics")).toBe("Physics");
  });

  it("truncates long labels with ellipsis", () => {
    const long = "Mathematics: Analysis and Approaches";
    const result = truncateLabel(long, 28);
    expect(result.length).toBeLessThanOrEqual(28);
    expect(result.endsWith("…")).toBe(true);
  });

  it("respects custom max length", () => {
    const result = truncateLabel("A very long subject name here", 10);
    expect(result.length).toBeLessThanOrEqual(10);
  });
});
