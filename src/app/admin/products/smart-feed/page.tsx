"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard, MetricCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { dashboardMetrics, newsletters, companies } from "@/lib/mock-data";

// Monthly SaaS pricing tiers based on usage
function getFeedMRR(dailyUsage: number): number {
  if (dailyUsage >= 500) return 3_500;
  if (dailyUsage >= 200) return 1_500;
  if (dailyUsage >= 50) return 500;
  return 250;
}

export default function SmartFeedPage() {
  const router = useRouter();
  const feedNewsletters = newsletters.filter((n) => n.activeProducts.includes("Smart Feed"));
  const metrics = dashboardMetrics.productPulse.smartFeed;
  const feedCompanies = companies.filter((c) => c.products.smartFeed);

  const totalMRR = feedCompanies.reduce((s, c) => s + getFeedMRR(c.products.smartFeed?.dailyUsage ?? 0), 0);
  const totalUsed = feedCompanies.reduce((s, c) => s + (c.products.smartFeed?.unitsUsed ?? 0), 0);
  const totalRemaining = feedCompanies.reduce((s, c) => s + (c.products.smartFeed?.remaining ?? 0), 0);

  return (
    <div>
      <PageHeader title="Smart Feed" subtitle="Optimized list feeder for maximum daily growth" />

      {/* Revenue & Business KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Monthly Recurring Revenue" value={`$${totalMRR.toLocaleString()}`} trend={{ value: "+10%", positive: true }} subtitle="/month" />
        <SummaryCard title="Active Clients" value={feedCompanies.length} />
        <SummaryCard title="Total Feed Used" value={totalUsed.toLocaleString()} />
        <SummaryCard title="Total Remaining" value={totalRemaining.toLocaleString()} />
      </div>

      {/* Product Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Last 5 Minutes" value={metrics.last5Min} />
        <SummaryCard title="Last Hour" value={metrics.lastHour} />
        <SummaryCard title="Last 24 Hours" value={metrics.last24Hours.toLocaleString()} />
        <SummaryCard title="Yesterday" value={metrics.yesterday.toLocaleString()} />
      </div>

      <MetricCard
        title="Feed Operations"
        metrics={[
          { label: "Active Feeds", value: feedNewsletters.length, color: "text-green-600" },
          { label: "Total Newsletters", value: newsletters.length, color: "text-gray-500" },
          { label: "Avg MRR/Client", value: `$${(totalMRR / (feedCompanies.length || 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: "text-blue-600" },
        ]}
      />

      {/* Client Breakdown */}
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-3">Client Breakdown</h3>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Company</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Units Purchased</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Used</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Remaining</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Daily Usage</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Est. Days Left</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">MRR</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Health</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {feedCompanies.map((c) => {
              const inv = c.products.smartFeed!;
              const mrr = getFeedMRR(inv.dailyUsage);
              const health = inv.remaining === 0 ? "error" : inv.estDaysRemaining < 10 ? "warning" : "active";
              return (
                <tr key={c.id} onClick={() => router.push(`/admin/companies/${c.id}`)} className="cursor-pointer hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{c.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{inv.unitsPurchased.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{inv.unitsUsed.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{inv.remaining.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{inv.dailyUsage}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={inv.estDaysRemaining < 10 ? "text-red-600 font-semibold" : inv.estDaysRemaining < 30 ? "text-yellow-600" : "text-gray-700"}>
                      {inv.estDaysRemaining}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right font-medium">${mrr.toLocaleString()}/mo</td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={health} label={health === "error" ? "Depleted" : health === "warning" ? "Low" : "Healthy"} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Active Feeds by Newsletter</h3>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Newsletter</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Company</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Subscribers</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {feedNewsletters.map((n) => (
              <tr key={n.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{n.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{n.companyName}</td>
                <td className="px-4 py-3 text-sm text-gray-700 text-right">{n.subscribers.toLocaleString()}</td>
                <td className="px-4 py-3 text-center"><StatusBadge status="active" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
