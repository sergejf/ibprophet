import { exposureLabel } from "../ai-exposure";

interface AIExposureGaugeProps {
  score: number;
}

const segmentColors = [
  "bg-green-500",
  "bg-green-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-yellow-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-red-500",
  "bg-red-500",
];

export function AIExposureGauge({ score }: AIExposureGaugeProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-neutral-100">{score}</span>
        <span className="text-xs font-medium text-neutral-400">/9</span>
        <span className="text-sm text-neutral-300">{exposureLabel(score)}</span>
      </div>
      <div className="flex gap-1">
        {segmentColors.map((color, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-sm ${i < score ? color : "bg-dark-700"}`}
          />
        ))}
      </div>
    </div>
  );
}
