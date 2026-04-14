import Link from "next/link";
import { Users, Package, DollarSign, Activity } from "lucide-react";
import { companies, getCompanyHealthStatus, getLowestInventory, dashboardMetrics } from "@/lib/mock-data";

type HealthStatus = "green" | "yellow" | "red";

interface HealthIndicator {
  icon: typeof Users;
  label: string;
  value: string;
  status: HealthStatus;
  href?: string;
}

function computeAdminHealth(): HealthIndicator[] {
  // Clients health
  const healthCounts = { healthy: 0, warning: 0, critical: 0 };
  companies.forEach((c) => healthCounts[getCompanyHealthStatus(c)]++);
  const totalClients = companies.length;
  const healthyClients = healthCounts.healthy;
  const clientStatus: HealthStatus = healthCounts.critical > 0 ? "red" : healthCounts.warning > 0 ? "yellow" : "green";

  // Inventory — find lowest across all companies
  let minDays = Infinity;
  let alertCount = 0;
  companies.forEach((c) => {
    const lowest = getLowestInventory(c);
    if (lowest) {
      if (lowest.days < minDays) minDays = lowest.days;
      if (lowest.days < 10) alertCount++;
    }
  });
  const inventoryStatus: HealthStatus = alertCount > 0 ? "red" : minDays < 30 ? "yellow" : "green";
  const inventoryValue = alertCount > 0 ? `${alertCount} alert${alertCount > 1 ? "s" : ""}` : "Healthy";

  // Revenue — today's run rate
  const { eventsToday } = dashboardMetrics.systemMetrics;
  const revenueStatus: HealthStatus = "green"; // simplified — would compare to target in prod
  const revenueValue = `${eventsToday.sent.toLocaleString()} sent`;

  // System — API health
  const hasErrors = dashboardMetrics.alerts.some((a) => a.type === "error");
  const systemStatus: HealthStatus = hasErrors ? "red" : "green";
  const systemValue = hasErrors ? "Issues detected" : "All systems go";

  return [
    { icon: Users, label: "Clients", value: `${healthyClients} of ${totalClients} healthy`, status: clientStatus, href: "/admin/companies" },
    { icon: Package, label: "Inventory", value: inventoryValue, status: inventoryStatus },
    { icon: DollarSign, label: "Today", value: revenueValue, status: revenueStatus, href: "/admin/reporting" },
    { icon: Activity, label: "System", value: systemValue, status: systemStatus, href: "/admin/system/logs" },
  ];
}

const statusColors: Record<HealthStatus, string> = {
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
};

export function AdminHealthBar() {
  const indicators = computeAdminHealth();

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
