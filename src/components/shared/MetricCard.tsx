"use client";

interface MetricCardProps {
  title: string;
  metrics: { label: string; value: string | number; color?: string }[];
}

export function MetricCard({ title, metrics }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-gray-500 mb-3">{title}</h3>
      <div className="flex flex-wrap items-end gap-4 sm:gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="flex flex-col">
            <span className={`text-lg sm:text-2xl font-bold ${m.color || "text-blue-600"}`}>
              {typeof m.value === "number" ? m.value.toLocaleString() : m.value}
            </span>
            <span className="text-[10px] sm:text-xs text-gray-400 mt-1">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: string; positive: boolean };
}

export function SummaryCard({ title, value, subtitle, trend }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
      <h3 className="text-xs sm:text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <div className="flex items-center gap-2 mt-1">
        {trend && (
          <span className={`text-xs sm:text-sm font-medium ${trend.positive ? "text-green-600" : "text-red-500"}`}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
        )}
        {subtitle && <span className="text-xs sm:text-sm text-gray-400">{subtitle}</span>}
      </div>
    </div>
  );
}
