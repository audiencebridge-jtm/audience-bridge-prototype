"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NewsletterSelector } from "@/components/portal/NewsletterSelector";
import { MobileNav } from "@/components/shared/MobileNav";
import { portalProducts, notifications } from "@/lib/mock-data";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Newspaper,
  Package,
  MousePointerClick,
  UserPlus,
  Rss,
  Send,
  RefreshCw,
  ShieldCheck,
  CreditCard,
  Key,
  Building2,
  Bell,
  ArrowRightLeft,
} from "lucide-react";

// Build product status lookup from mock data
const productStatusMap = new Map(
  portalProducts.map((p) => [p.key, { status: p.status, trialDaysRemaining: p.trialDaysRemaining }])
);

// Map nav hrefs to product keys for badge lookup
const hrefToProductKey: Record<string, string> = {
  "/portal/smart-pixel": "smartPixel",
  "/portal/smart-lead": "smartLead",
  "/portal/smart-feed": "smartFeed",
  "/portal/smart-delivery": "smartDelivery",
  "/portal/smart-reactivation": "smartReactivation",
  "/portal/email-validation": "emailValidation",
};

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navSections: { heading: string | null; items: NavItem[] }[] = [
  {
    heading: null,
    items: [
      { label: "Dashboard", href: "/portal", icon: LayoutDashboard },
      { label: "My Newsletters", href: "/portal/newsletters", icon: Newspaper },
      { label: "Products", href: "/portal/products", icon: Package },
    ],
  },
  {
    heading: "Products",
    items: [
      { label: "Smart Pixel", href: "/portal/smart-pixel", icon: MousePointerClick },
      { label: "Smart Lead", href: "/portal/smart-lead", icon: UserPlus },
      { label: "Smart Feed", href: "/portal/smart-feed", icon: Rss },
      { label: "Smart Delivery", href: "/portal/smart-delivery", icon: Send },
      { label: "Smart Reactivation", href: "/portal/smart-reactivation", icon: RefreshCw },
      { label: "Email Validation", href: "/portal/email-validation", icon: ShieldCheck },
    ],
  },
  {
    heading: "Account",
    items: [
      { label: "Billing", href: "/portal/billing", icon: CreditCard },
      { label: "API Credentials", href: "/portal/api-credentials", icon: Key },
      { label: "Company Info", href: "/portal/settings", icon: Building2 },
      { label: "Notifications", href: "/portal/notifications", icon: Bell },
    ],
  },
];

// Show newsletter selector when viewing a product page
const productPaths = ["/portal/smart-", "/portal/email-validation"];
function showNewsletterSelector(pathname: string) {
  return productPaths.some((p) => pathname.startsWith(p));
}

const unreadNotificationCount = notifications.filter((n) => !n.read).length;

function NotificationBadge({ href }: { href: string }) {
  if (href !== "/portal/notifications" || unreadNotificationCount === 0) return null;
  return (
    <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-500 text-white min-w-[20px] text-center">
      {unreadNotificationCount}
    </span>
  );
}

function ProductBadge({ href }: { href: string }) {
  const productKey = hrefToProductKey[href];
  if (!productKey) return null;

  const productInfo = productStatusMap.get(productKey);
  if (!productInfo) return null;

  if (productInfo.status === "trial") {
    return (
      <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
        Trial
      </span>
    );
  }

  if (productInfo.status === "available") {
    return (
      <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
        Try
      </span>
    );
  }

  return null;
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
      <div className="px-5 py-5 border-b border-gray-200">
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
              {section.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors border-l-2 ${
                        active
                          ? "bg-[#E5F5FF] text-[#0097FF] font-medium border-[#0097FF]"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${active ? "text-[#0097FF]" : "text-gray-400"}`} />
                      <span className="truncate">{item.label}</span>
                      <ProductBadge href={item.href} />
                      <NotificationBadge href={item.href} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="px-5 py-3 border-t border-gray-200">
        <Link href="/admin" className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#0097FF] transition-colors">
          <ArrowRightLeft className="w-3.5 h-3.5" />
          Switch to Admin
        </Link>
      </div>
    </aside>
    </MobileNav>
  );
}
