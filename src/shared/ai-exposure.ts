export function deriveAIResilience(
  exposure: number | null,
): "GREEN" | "YELLOW" | "RED" {
  if (exposure === null) return "YELLOW";
  if (exposure <= 3) return "GREEN";
  if (exposure <= 6) return "YELLOW";
  return "RED";
}

export function exposureLabel(exposure: number): string {
  if (exposure <= 3) return "Low AI Exposure";
  if (exposure <= 6) return "Moderate AI Exposure";
  return "High AI Exposure";
}

export function exposureColor(exposure: number): "green" | "yellow" | "red" {
  if (exposure <= 3) return "green";
  if (exposure <= 6) return "yellow";
  return "red";
}

export const aiResilienceLabels: Record<
  string,
  { text: string; color: "green" | "yellow" | "red" }
> = {
  GREEN: { text: "AI-Resilient", color: "green" },
  YELLOW: { text: "AI-Augmented", color: "yellow" },
  RED: { text: "AI-Exposed", color: "red" },
};
