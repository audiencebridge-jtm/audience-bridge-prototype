"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface MobileNavProps {
  children: React.ReactNode;
}

export function MobileNav({ children }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Hamburger button — mobile only */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white border border-gray-200 rounded-lg p-2 shadow-sm"
        aria-label="Open menu"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar wrapper */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:z-auto
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Close button inside sidebar — mobile only */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-3 z-50 lg:hidden text-gray-400 hover:text-gray-600"
          aria-label="Close menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </>
  );
}
