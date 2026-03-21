export type MatchTier = "strong" | "moderate" | "stretch";

export interface SankeyNode {
  id: string;
  label: string;
  color: string;
  nodeType: "subject" | "pathway" | "career";
  entityId: string;
  matchTier?: MatchTier;
}

export type LinkType = "essential" | "recommended" | "useful";

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
  linkType?: LinkType;
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
const CAREER_COLORS: Record<MatchTier, string> = {
  strong: "#22c55e", // green-500 — strong fit
  moderate: "#eab308", // yellow-500 — possible
  stretch: "#6b7280", // gray-500 — stretch
};

export function truncateLabel(name: string, max = 48): string {
  if (name.length <= max) return name;
  return name.slice(0, max - 1).trimEnd() + "…";
}

export function buildSankeyData(input: BuildSankeyInput): SankeyData {
  const { pathways, hlSubjectIds, selectedSubjectIds } = input;

  const nodeMap = new Map<string, SankeyNode>();
  const links: SankeyLink[] = [];

  // Track incoming link values per career node for match-tier calculation
  const careerIncoming = new Map<string, number>();

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
      const lt: LinkType =
        sl.weight === 3 && sl.hlRequired
          ? "essential"
          : sl.weight === 3
            ? "recommended"
            : "useful";
      links.push({
        source: subjectNodeId,
        target: pathwayNodeId,
        value: Math.round(sl.weight * comboMultiplier),
        linkType: lt,
      });
    }

    // Career links are also boosted by how well the subjects match the pathway
    for (const cl of pathway.careerLinks) {
      const careerNodeId = `c-${cl.careerId}`;
      const linkValue = Math.round(cl.weight * comboMultiplier);
      if (!nodeMap.has(careerNodeId)) {
        nodeMap.set(careerNodeId, {
          id: careerNodeId,
          label: cl.career.name,
          color: CAREER_COLORS.strong, // placeholder, assigned below
          nodeType: "career",
          entityId: cl.careerId,
        });
      }
      careerIncoming.set(
        careerNodeId,
        (careerIncoming.get(careerNodeId) ?? 0) + linkValue,
      );
      links.push({
        source: pathwayNodeId,
        target: careerNodeId,
        value: linkValue,
      });
    }
  }

  // Assign match tiers to career nodes using a hybrid of absolute and relative scoring.
  // Absolute thresholds ensure that weakly-connected careers (e.g. Engineer for a
  // humanities student) don't appear as "strong fit" just because nothing else scores higher.
  const incomingValues = [...careerIncoming.values()];
  const maxIncoming = Math.max(...incomingValues, 1);

  for (const [nodeId, total] of careerIncoming) {
    const ratio = total / maxIncoming;
    // Strong: high relative share AND meaningful absolute value
    // Moderate: decent relative share OR reasonable absolute value
    // Stretch: weakly connected — career is reachable but unlikely given subject choices
    const tier: MatchTier =
      ratio >= 0.45 && total >= 3
        ? "strong"
        : ratio >= 0.2 || total >= 2
          ? "moderate"
          : "stretch";
    const node = nodeMap.get(nodeId);
    if (node) {
      node.color = CAREER_COLORS[tier];
      node.matchTier = tier;
    }
  }

  return {
    nodes: [...nodeMap.values()],
    links,
  };
}
