"use client";

import Link from "next/link";
import { Shield, Package, Layers, TrendingUp } from "lucide-react";
import { getNewslettersByCompany, getCompanyById, portalProducts } from "@/lib/mock-data";

type HealthStatus = "green" | "yellow" | "red";

interface HealthIndicator {
  icon: typeof Shield;
  label: string;
  value: string;
  status: HealthStatus;
  href?: string;
}

function computeHealth(): HealthIndicator[] {
  const newsletters = getNewslettersByCompany("1");
  const company = getCompanyById("1")!;

  // Deliverability — aggregate domain rep
  const repCounts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  newsletters.forEach((n) => repCounts[n.domainRep]++);
  const deliverabilityStatus: HealthStatus =
    repCounts.LOW > 0 ? "red" : repCounts.MEDIUM > newsletters.length / 2 ? "yellow" : "green";
  const deliverabilityValue =
    deliverabilityStatus === "green" ? "Healthy" : deliverabilityStatus === "yellow" ? "Mixed" : "Needs Attention";

  // Inventory — min days remaining across active products
  const inventoryProducts = [company.products.smartLead, company.products.smartPixel, company.products.smartFeed].filter(Boolean);
  const minDays = inventoryProducts.length > 0 ? Math.min(...inventoryProducts.map((p) => p!.estDaysRemaining)) : 999;
  const inventoryStatus: HealthStatus = minDays < 10 ? "red" : minDays < 30 ? "yellow" : "green";
  const inventoryValue = minDays < 999 ? `${Math.round(minDays)}d min` : "N/A";

  // Product Coverage
  const activeCount = portalProducts.filter((p) => p.status === "active" || p.status === "trial").length;
  const totalCount = portalProducts.length;
  const coverageStatus: HealthStatus = activeCount >= totalCount - 1 ? "green" : activeCount >= totalCount / 2 ? "yellow" : "red";
  const coverageValue = `${activeCount} of ${totalCount}`;

  // Growth — aggregate subscriber trend
  const avgGrowth = newsletters.reduce((s, n) => s + n.growth, 0) / newsletters.length;
  const growthStatus: HealthStatus = avgGrowth > 1 ? "green" : avgGrowth > 0 ? "yellow" : "red";
  const growthValue = avgGrowth > 0 ? `+${avgGrowth.toFixed(1)}%` : `${avgGrowth.toFixed(1)}%`;

  return [
    { icon: Shield, label: "Deliverability", value: deliverabilityValue, status: deliverabilityStatus },
    { icon: Package, label: "Inventory", value: inventoryValue, status: inventoryStatus },
    { icon: Layers, label: "Products", value: coverageValue, status: coverageStatus, href: "/portal/products" },
    { icon: TrendingUp, label: "Growth", value: growthValue, status: growthStatus },
  ];
}

const statusColors: Record<HealthStatus, string> = {
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
};

export function AccountHealthBar() {
  const indicators = computeHealth();

  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-4 mb-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
      <div className="flex flex-wrap items-center gap-6">
        {indicators.map((ind) => {
          const Icon = ind.icon;
          const content = (
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon className="w-4 h-4 text-gray-400 shrink-0" />
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-gray-500">{ind.label}</span>
                <span className="text-sm font-semibold text-gray-900">{ind.value}</span>
                <span className={`w-2 h-2 rounded-full shrink-0 ${statusColors[ind.status]}`} />
              </div>
            </div>
          );

          if (ind.href) {
            return (
              <Link key={ind.label} href={ind.href} className="hover:opacity-80 transition-opacity">
                {content}
              </Link>
            );
          }

          return <div key={ind.label}>{content}</div>;
        })}
      </div>
    </div>
  );
}
