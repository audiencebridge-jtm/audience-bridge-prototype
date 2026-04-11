"use client";

interface DataPoint {
  label: string;
  value: number;
}

interface SimpleLineChartProps {
  data: DataPoint[];
  height?: number;
}

export function SimpleLineChart({ data, height = 200 }: SimpleLineChartProps) {
  if (data.length === 0) return null;

  const padding = { top: 20, right: 20, bottom: 30, left: 60 };
  const width = 800;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const values = data.map((d) => d.value);
  const min = Math.min(...values) * 0.95;
  const max = Math.max(...values) * 1.02;
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartW;
    const y = padding.top + chartH - ((d.value - min) / range) * chartH;
    return `${x},${y}`;
  });

  const polyline = points.join(" ");
  const areaPath = `M${points[0]} ${points.join(" L")} L${padding.left + chartW},${padding.top + chartH} L${padding.left},${padding.top + chartH} Z`;

  // Y-axis labels (5 ticks)
  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const val = min + (range * i) / 4;
    const y = padding.top + chartH - (i / 4) * chartH;
    return { val: Math.round(val).toLocaleString(), y };
  });

  // X-axis labels (show every 5th)
  const xLabels = data
    .map((d, i) => ({
      label: d.label,
      x: padding.left + (i / (data.length - 1)) * chartW,
    }))
    .filter((_, i) => i % 5 === 0 || i === data.length - 1);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTicks.map((tick) => (
        <line key={tick.val} x1={padding.left} y1={tick.y} x2={padding.left + chartW} y2={tick.y} stroke="#E5E7EB" strokeWidth="1" />
      ))}

      {/* Area fill */}
      <path d={areaPath} fill="url(#chartGradient)" />

      {/* Line */}
      <polyline points={polyline} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

      {/* Y-axis labels */}
      {yTicks.map((tick) => (
        <text key={tick.val} x={padding.left - 8} y={tick.y + 4} textAnchor="end" className="text-[10px] fill-gray-400">
          {tick.val}
        </text>
      ))}

      {/* X-axis labels */}
      {xLabels.map((item) => (
        <text key={item.label} x={item.x} y={padding.top + chartH + 20} textAnchor="middle" className="text-[10px] fill-gray-400">
          {item.label}
        </text>
      ))}
    </svg>
  );
}
