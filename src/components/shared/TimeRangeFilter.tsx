"use client";

import { useState } from "react";

export type TimeRange = "24h" | "7d" | "30d" | "90d" | "ytd" | "all";

const presets: { label: string; value: TimeRange }[] = [
  { label: "24h", value: "24h" },
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "90d", value: "90d" },
  { label: "YTD", value: "ytd" },
  { label: "All Time", value: "all" },
];

interface TimeRangeFilterProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function TimeRangeFilter({ value, onChange }: TimeRangeFilterProps) {
  return (
    <div className="inline-flex items-center bg-gray-100 rounded-lg p-0.5">
      {presets.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            value === p.value
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
