"use client";

interface FilterDropdownProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

export function FilterDropdown({ label, value, options, onChange }: FilterDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-gray-500">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
