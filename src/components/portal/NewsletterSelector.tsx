"use client";

import { useState, useRef, useEffect } from "react";
import { useNewsletter } from "@/context/NewsletterContext";

export function NewsletterSelector() {
  const { selectedNewsletterId, setSelectedNewsletterId, selectedNewsletter, newsletters } = useNewsletter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const displayName = selectedNewsletter ? selectedNewsletter.name : "All Newsletters";

  return (
    <div className="px-3 py-3" ref={ref}>
      <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 px-1">
        Newsletter
      </label>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md border transition-colors text-left ${
          selectedNewsletter
            ? "bg-blue-50 border-blue-200 text-blue-700"
            : "bg-gray-50 border-gray-200 text-gray-700"
        } hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {selectedNewsletter && (
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
          )}
          <span className="truncate">{displayName}</span>
        </div>
        <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden z-50 relative">
          {/* All Newsletters option */}
          <button
            onClick={() => { setSelectedNewsletterId(null); setOpen(false); }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
              !selectedNewsletterId ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="w-4 text-center">
              {!selectedNewsletterId && (
                <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            All Newsletters
          </button>

          <div className="border-t border-gray-100" />

          {/* Newsletter list */}
          <div className="max-h-64 overflow-y-auto">
            {newsletters.map((nl) => (
              <button
                key={nl.id}
                onClick={() => { setSelectedNewsletterId(nl.id); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                  selectedNewsletterId === nl.id ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="w-4 text-center shrink-0">
                  {selectedNewsletterId === nl.id && (
                    <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span className="truncate">{nl.name}</span>
                <span className="ml-auto text-[10px] text-gray-400 shrink-0">{nl.subscribers.toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
