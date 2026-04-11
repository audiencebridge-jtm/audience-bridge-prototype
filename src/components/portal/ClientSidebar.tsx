"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NewsletterSelector } from "@/components/portal/NewsletterSelector";
import { MobileNav } from "@/components/shared/MobileNav";

const navSections = [
  {
    heading: null,
    items: [
      { label: "Dashboard", href: "/portal" },
      { label: "My Newsletters", href: "/portal/newsletters" },
      { label: "Products", href: "/portal/products" },
    ],
  },
  {
    heading: "Products",
    items: [
      { label: "Smart Pixel", href: "/portal/smart-pixel" },
      { label: "Smart Lead", href: "/portal/smart-lead" },
      { label: "Smart Feed", href: "/portal/smart-feed" },
      { label: "Smart Delivery", href: "/portal/smart-delivery" },
      { label: "Smart Reactivation", href: "/portal/smart-reactivation" },
      { label: "Email Validation", href: "/portal/email-validation" },
    ],
  },
  {
    heading: "Account",
    items: [
      { label: "Billing", href: "/portal/billing" },
      { label: "API Credentials", href: "/portal/api-credentials" },
      { label: "Company Info", href: "/portal/settings" },
      { label: "Notifications", href: "/portal/notifications" },
    ],
  },
];

// Show newsletter selector when viewing a product page
const productPaths = ["/portal/smart-", "/portal/email-validation"];
function showNewsletterSelector(pathname: string) {
  return productPaths.some((p) => pathname.startsWith(p));
}

export function ClientSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/portal") return pathname === "/portal";
    return pathname.startsWith(href);
  };

  return (
    <MobileNav>
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col h-screen overflow-y-auto">
      <div className="px-5 py-4 border-b border-gray-200">
        <Link href="/portal" className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/ab-logo-horizontal.svg" alt="Audience Bridge" className="h-8" />
        </Link>
        <p className="text-xs text-gray-400 mt-1.5">Daily Trends Media</p>
      </div>

      {/* Newsletter selector — only on product pages */}
      {showNewsletterSelector(pathname) && <NewsletterSelector />}

      <nav className="flex-1 px-3 py-4 space-y-5">
        {navSections.map((section, si) => (
          <div key={si}>
            {section.heading && (
              <p className="px-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {section.heading}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block px-3 py-2 text-sm rounded-md transition-colors ${
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
        <Link href="/admin" className="text-xs text-gray-400 hover:text-blue-600 transition-colors">
          Switch to Admin →
        </Link>
      </div>
    </aside>
    </MobileNav>
  );
}
