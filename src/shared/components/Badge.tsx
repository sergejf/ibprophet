import { twJoin } from "tailwind-merge";

type BadgeColor = "green" | "yellow" | "red" | "blue" | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  className?: string;
}

const colorStyles: Record<BadgeColor, string> = {
  green: "bg-green-500/20 text-green-400 border-green-500/30",
  yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  red: "bg-red-500/20 text-red-400 border-red-500/30",
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  neutral: "bg-neutral-500/20 text-neutral-400 border-neutral-500/30",
};

export function Badge({ children, color = "neutral", className }: BadgeProps) {
  return (
    <span
      className={twJoin(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold",
        colorStyles[color],
        className,
      )}
    >
      {children}
    </span>
  );
}
