"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard, MetricCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { dashboardMetrics, newsletters, companies, type ProductInventory } from "@/lib/mock-data";

function getPixelRate(units: number): number {
  if (units >= 50_000) return 0.10;
  if (units >= 10_000) return 0.15;
  return 0.25;
}

export default function SmartPixelPage() {
  const router = useRouter();
  const pixelNewsletters = newsletters.filter((n) => n.activeProducts.includes("Smart Pixel"));
  const metrics = dashboardMetrics.productPulse.smartPixel;

  const pixelCompanies = companies.filter((c) => c.products.smartPixel);
  const totalUsed = pixelCompanies.reduce((s, c) => s + (c.products.smartPixel?.unitsUsed ?? 0), 0);
  const totalRemaining = pixelCompanies.reduce((s, c) => s + (c.products.smartPixel?.remaining ?? 0), 0);
  const totalRevenue = pixelCompanies.reduce((s, c) => {
    const inv = c.products.smartPixel!;
    return s + inv.unitsUsed * getPixelRate(inv.unitsPurchased);
  }, 0);

  return (
    <div>
      <PageHeader title="Smart Pixel" subtitle="Track pre-subscribe behavior to capture intent-rich visitors" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Revenue (All Time)" value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`} trend={{ value: "+8%", positive: true }} />
        <SummaryCard title="Active Clients" value={pixelCompanies.length} />
        <SummaryCard title="Total Pixels Used" value={totalUsed.toLocaleString()} />
        <SummaryCard title="Total Remaining" value={totalRemaining.toLocaleString()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="New Subs Today" value={metrics.today} trend={{ value: "+8%", positive: true }} />
        <SummaryCard title="This Week" value={metrics.thisWeek.toLocaleString()} />
        <SummaryCard title="This Month" value={metrics.thisMonth.toLocaleString()} />
        <SummaryCard title="All Time" value={metrics.allTime.toLocaleString()} />
      </div>

      <MetricCard
        title="Pixel Installations"
        metrics={[
          { label: "Active Pixels", value: pixelNewsletters.length, color: "text-green-600" },
          { label: "Total Newsletters", value: newsletters.length, color: "text-gray-500" },
        ]}
      />

      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-3">Client Breakdown</h3>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Company</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Purchased</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Used</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Remaining</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Daily Usage</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Est. Days Left</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Rate</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Revenue</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Health</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pixelCompanies.map((c) => {
              const inv = c.products.smartPixel!;
              const rate = getPixelRate(inv.unitsPurchased);
              const rev = inv.unitsUsed * rate;
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
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">${rate.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right font-medium">${rev.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={health} label={health === "error" ? "Depleted" : health === "warning" ? "Low" : "Healthy"} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Active Pixel Installations</h3>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Newsletter</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Company</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Subscribers</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Eng. Rate</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pixelNewsletters.map((n) => (
              <tr key={n.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{n.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{n.companyName}</td>
                <td className="px-4 py-3 text-sm text-gray-700 text-right">{n.subscribers.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-gray-700 text-right">{n.engagementRate}%</td>
                <td className="px-4 py-3 text-center"><StatusBadge status="active" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
