interface SalaryBarProps {
  label: string;
  value: number;
  maxValue: number;
  color?: string;
  currency?: "$" | "£";
}

function formatSalary(value: number, currency: string): string {
  if (value >= 1000) {
    return `${currency}${Math.round(value / 1000)}k`;
  }
  return `${currency}${value}`;
}

export function SalaryBar({
  label,
  value,
  maxValue,
  color = "bg-primary-500",
  currency = "$",
}: SalaryBarProps) {
  const widthPercent = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs text-neutral-400">
        <span>{label}</span>
        <span className="font-semibold text-neutral-200">
          {formatSalary(value, currency)}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-dark-700">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${widthPercent}%` }}
        />
      </div>
    </div>
  );
}
