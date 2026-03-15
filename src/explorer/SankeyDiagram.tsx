import { ResponsiveSankey } from "@nivo/sankey";
import type { SankeyData, MatchTier } from "./sankey-utils";
import { truncateLabel } from "./sankey-utils";

const TIER_LABEL_COLORS: Record<MatchTier, string> = {
  strong: "#86efac",   // green-300
  moderate: "#fde047",  // yellow-300
  stretch: "#9ca3af",   // gray-400
};

interface SankeyDiagramProps {
  data: SankeyData;
  onPathwayClick: (pathwayId: string) => void;
  onCareerClick: (careerId: string) => void;
}

export function SankeyDiagram({
  data,
  onPathwayClick,
  onCareerClick,
}: SankeyDiagramProps) {
  if (data.nodes.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-neutral-500">
        Select subjects above to see your pathway map
      </div>
    );
  }

  const height = Math.max(500, data.nodes.length * 55);

  return (
    <div className="flex flex-col gap-0">
      {/* Column headings */}
      <div className="flex items-center px-1" style={{ marginLeft: 180, marginRight: 180 }}>
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Your IB Subjects
        </span>
        <span className="mx-auto text-xs font-semibold uppercase tracking-wider text-neutral-400">
          University Pathways
          <span className="ml-1.5 text-[10px] font-normal normal-case text-neutral-500">
            (click to explore)
          </span>
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Careers
          <span className="ml-1.5 text-[10px] font-normal normal-case text-neutral-500">
            (click to explore)
          </span>
        </span>
      </div>

      {/* Career fit legend */}
      <div className="flex justify-end gap-3 px-1 pb-1" style={{ marginRight: 180 }}>
        <span className="flex items-center gap-1 text-[10px] text-neutral-500">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500" /> Strong fit
        </span>
        <span className="flex items-center gap-1 text-[10px] text-neutral-500">
          <span className="inline-block h-2 w-2 rounded-full bg-yellow-500" /> Possible
        </span>
        <span className="flex items-center gap-1 text-[10px] text-neutral-500">
          <span className="inline-block h-2 w-2 rounded-full bg-gray-500" /> Stretch
        </span>
      </div>

      <div className="w-full" style={{ height }}>
        <ResponsiveSankey
          data={{
            nodes: data.nodes.map((n) => ({
              id: n.id,
              label: n.label,
              nodeColor: n.color,
              nodeType: n.nodeType,
              entityId: n.entityId,
              matchTier: n.matchTier,
            })),
            links: data.links,
          }}
          margin={{ top: 10, right: 180, bottom: 30, left: 180 }}
          align="justify"
          colors={(node: any) => node.nodeColor || "#666"}
          nodeOpacity={1}
          nodeHoverOthersOpacity={0.2}
          nodeThickness={18}
          nodeSpacing={24}
          nodeBorderWidth={0}
          nodeBorderRadius={3}
          linkOpacity={0.55}
          linkHoverOthersOpacity={0.1}
          linkContract={3}
          linkBlendMode="screen"
          enableLinkGradient
          labelPosition="outside"
          labelOrientation="horizontal"
          labelPadding={16}
          labelTextColor={(node: any) => {
            if (node.id?.startsWith?.("c-")) {
              const tier: MatchTier = node.matchTier ?? "strong";
              return TIER_LABEL_COLORS[tier];
            }
            if (node.id?.startsWith?.("p-")) return "#fcd34d";
            return "#e5e5e5";
          }}
          label={(node: any) => {
            const text = truncateLabel(node.label || node.id);
            return text;
          }}
          nodeTooltip={({ node }: any) => {
            const tierLabels: Record<string, string> = {
              strong: "Strong fit",
              moderate: "Possible",
              stretch: "Stretch",
            };
            const tierHint = node.matchTier ? ` · ${tierLabels[node.matchTier]}` : "";
            return (
              <div className="rounded-lg border border-dark-600 bg-dark-800 px-3 py-2 text-sm text-neutral-100 shadow-xl">
                <span className="font-semibold" style={{ color: node.color }}>
                  {node.label}
                </span>
                <span className="ml-2 text-xs text-neutral-400">
                  {node.nodeType === "subject"
                    ? "IB Subject"
                    : node.nodeType === "pathway"
                      ? "Click to view pathway"
                      : `Click to explore${tierHint}`}
                </span>
              </div>
            );
          }}
          linkTooltip={({ link }: any) => {
            const strength =
              link.value >= 6 ? "Strong" : link.value >= 3 ? "Moderate" : "Weak";
            return (
              <div className="rounded-lg border border-dark-600 bg-dark-800 px-3 py-2 text-sm text-neutral-100 shadow-xl">
                <span style={{ color: link.source.color }}>
                  {link.source.label}
                </span>
                <span className="mx-2 text-neutral-500">→</span>
                <span style={{ color: link.target.color }}>
                  {link.target.label}
                </span>
                <span className="ml-2 text-xs text-neutral-400">
                  ({strength})
                </span>
              </div>
            );
          }}
          onClick={(nodeOrLink: any) => {
            const nodeId = nodeOrLink.id;
            if (typeof nodeId !== "string") return;
            if (nodeId.startsWith("p-")) {
              onPathwayClick(nodeId.slice(2));
            } else if (nodeId.startsWith("c-")) {
              onCareerClick(nodeId.slice(2));
            }
          }}
          theme={{
            text: { fill: "#e5e5e5" },
            tooltip: {
              container: {
                background: "#1c1c27",
                color: "#e5e5e5",
                borderRadius: "8px",
                border: "1px solid #333345",
              },
            },
          }}
        />
      </div>
    </div>
  );
}
