"use client";

import { useState } from "react";

interface Tab {
  label: string;
  icon?: string;
  content: React.ReactNode;
}

interface TabNavProps {
  tabs: Tab[];
  defaultTab?: number;
}

export function TabNav({ tabs, defaultTab = 0 }: TabNavProps) {
  const [active, setActive] = useState(defaultTab);

  return (
    <div>
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              active === i
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs[active]?.content}</div>
    </div>
  );
}
