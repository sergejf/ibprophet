export interface SankeyNode {
  id: string;
  label: string;
  color: string;
  nodeType: "subject" | "pathway" | "career";
  entityId: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

interface SubjectInfo {
  id: string;
  name: string;
  group: number;
}

interface PathwayInfo {
  id: string;
  name: string;
  subjectLinks: {
    subjectId: string;
    weight: number;
    hlRequired: boolean;
    subject: SubjectInfo;
  }[];
  careerLinks: {
    careerId: string;
    weight: number;
    career: { id: string; name: string };
  }[];
}

interface BuildSankeyInput {
  pathways: PathwayInfo[];
  hlSubjectIds: string[];
  selectedSubjectIds: string[];
}

const GROUP_COLORS: Record<number, string> = {
  1: "#60a5fa", // Studies in Language & Literature — blue
  2: "#f472b6", // Language Acquisition — pink
  3: "#a78bfa", // Individuals & Societies — purple
  4: "#34d399", // Sciences — emerald
  5: "#fb923c", // Mathematics — orange
  6: "#f87171", // The Arts — red
};

const PATHWAY_COLOR = "#f59e0b";
const CAREER_COLOR = "#22c55e";

export function truncateLabel(name: string, max = 28): string {
  if (name.length <= max) return name;
  return name.slice(0, max - 1).trimEnd() + "…";
}

export function buildSankeyData(input: BuildSankeyInput): SankeyData {
  const { pathways, hlSubjectIds, selectedSubjectIds } = input;

  const nodeMap = new Map<string, SankeyNode>();
  const links: SankeyLink[] = [];

  for (const pathway of pathways) {
    const pathwayNodeId = `p-${pathway.id}`;

    // Filter subject links to only selected subjects, respecting HL requirements
    const validSubjectLinks = pathway.subjectLinks.filter(
      (sl) =>
        selectedSubjectIds.includes(sl.subjectId) &&
        (!sl.hlRequired || hlSubjectIds.includes(sl.subjectId)),
    );

    if (validSubjectLinks.length === 0) continue;

    // Combination bonus: when multiple selected subjects feed the same pathway,
    // boost each link's value to reflect synergy.
    const matchCount = validSubjectLinks.length;
    const comboMultiplier = matchCount >= 3 ? 2 : matchCount >= 2 ? 1.5 : 1;

    // Add pathway node
    nodeMap.set(pathwayNodeId, {
      id: pathwayNodeId,
      label: pathway.name,
      color: PATHWAY_COLOR,
      nodeType: "pathway",
      entityId: pathway.id,
    });

    // Add subject nodes and links with combo-boosted values
    for (const sl of validSubjectLinks) {
      const subjectNodeId = `s-${sl.subjectId}`;
      if (!nodeMap.has(subjectNodeId)) {
        nodeMap.set(subjectNodeId, {
          id: subjectNodeId,
          label: sl.subject.name,
          color: GROUP_COLORS[sl.subject.group] ?? "#94a3b8",
          nodeType: "subject",
          entityId: sl.subjectId,
        });
      }
      links.push({
        source: subjectNodeId,
        target: pathwayNodeId,
        value: Math.round(sl.weight * comboMultiplier),
      });
    }

    // Career links are also boosted by how well the subjects match the pathway
    for (const cl of pathway.careerLinks) {
      const careerNodeId = `c-${cl.careerId}`;
      if (!nodeMap.has(careerNodeId)) {
        nodeMap.set(careerNodeId, {
          id: careerNodeId,
          label: cl.career.name,
          color: CAREER_COLOR,
          nodeType: "career",
          entityId: cl.careerId,
        });
      }
      links.push({
        source: pathwayNodeId,
        target: careerNodeId,
        value: Math.round(cl.weight * comboMultiplier),
      });
    }
  }

  return {
    nodes: [...nodeMap.values()],
    links,
  };
}
