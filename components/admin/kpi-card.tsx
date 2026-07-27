export default function KpiCard({
  label,
  value,
  change,
  trend,
}: {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}) {
  return (
    <div className="bg-white border border-[var(--color-border-soft)] rounded-xl p-6">
      <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider mb-2">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
      <p className={`text-xs mt-1 ${trend === "up" ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}>
        {change}
      </p>
    </div>
  );
}
