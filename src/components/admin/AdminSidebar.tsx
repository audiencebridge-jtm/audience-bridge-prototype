"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navSections: { heading: string; items: { label: string; href: string }[] }[] = [
  {
    heading: "Overview",
    items: [{ label: "Dashboard", href: "/admin" }],
  },
  {
    heading: "Customers",
    items: [
      { label: "Newsletters", href: "/admin/newsletters" },
      { label: "Companies", href: "/admin/companies" },
    ],
  },
  {
    heading: "Products",
    items: [
      { label: "Smart Pixel", href: "/admin/products/smart-pixel" },
      { label: "Smart Lead", href: "/admin/products/smart-lead" },
      { label: "Smart Feed", href: "/admin/products/smart-feed" },
      { label: "Smart Delivery", href: "/admin/products/smart-delivery" },
      { label: "Smart Reactivation", href: "/admin/products/smart-reactivation" },
      { label: "Email Validation", href: "/admin/products/email-validation" },
    ],
  },
  {
    heading: "System",
    items: [
      { label: "Logs", href: "/admin/system/logs" },
      { label: "API & Events", href: "/admin/system/api-events" },
    ],
  },
  {
    heading: "Settings",
    items: [{ label: "Admin Users", href: "/admin/settings/users" }],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="px-5 py-4 border-b border-gray-200">
        <Link href="/admin" className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/ab-logo-horizontal.svg" alt="Audience Bridge" className="h-8" />
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.heading}>
            <p className="px-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {section.heading}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`block px-2 py-2 text-sm rounded-md transition-colors ${
                      isActive(item.href)
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="px-5 py-3 border-t border-gray-200">
        <Link href="/portal" className="text-xs text-gray-400 hover:text-blue-600 transition-colors">
          Switch to Client Portal →
        </Link>
      </div>
    </aside>
  );
}
