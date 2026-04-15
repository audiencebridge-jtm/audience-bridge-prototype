"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard, MetricCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TimeRangeFilter, type TimeRange } from "@/components/shared/TimeRangeFilter";
import { FilterDropdown } from "@/components/shared/FilterDropdown";
import { dashboardMetrics, newsletters, type ProductInventory, getNewsletterMetricsForRange } from "@/lib/mock-data";
import { useAdminData } from "@/lib/admin-data-context";

function getPixelRate(units: number): number {
  if (units >= 50_000) return 0.10;
  if (units >= 10_000) return 0.15;
  return 0.25;
}

export default function SmartPixelPage() {
  const router = useRouter();
  const { companies } = useAdminData();
  const [range, setRange] = useState<TimeRange>("30d");
  const [newsletterFilter, setNewsletterFilter] = useState("all");

  const pixelNewsletters = newsletters.filter((n) => n.activeProducts.includes("Smart Pixel"));
  const metrics = dashboardMetrics.productPulse.smartPixel;

  const newsletterOptions = [
    { label: "All Newsletters", value: "all" },
    ...pixelNewsletters.map((n) => ({ label: `${n.name} (${n.companyName})`, value: n.id })),
  ];

  const filteredNewsletters = newsletterFilter === "all"
    ? pixelNewsletters
    : pixelNewsletters.filter((n) => n.id === newsletterFilter);

  const rangeLabel = { "24h": "Today", "7d": "This Week", "30d": "This Month", "90d": "This Quarter", "ytd": "Year to Date", "all": "All Time" }[range];

  const pixelCompanies = companies.filter((c) => c.products.smartPixel);
  const totalUsed = pixelCompanies.reduce((s, c) => s + (c.products.smartPixel?.unitsUsed ?? 0), 0);
  const totalRemaining = pixelCompanies.reduce((s, c) => s + (c.products.smartPixel?.remaining ?? 0), 0);
  const totalRevenue = pixelCompanies.reduce((s, c) => {
    const inv = c.products.smartPixel!;
    return s + inv.unitsUsed * getPixelRate(inv.unitsPurchased);
  }, 0);

  return (
    <div>
      <PageHeader title="Smart Pixel" subtitle="Track pre-subscribe behavior to capture intent-rich visitors" actions={<TimeRangeFilter value={range} onChange={setRange} />} />

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

      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Newsletter Metrics — {rangeLabel}
          <span className="text-gray-400 font-normal ml-2">({filteredNewsletters.length} newsletters)</span>
        </h3>
        <FilterDropdown label="Newsletter" value={newsletterFilter} options={newsletterOptions} onChange={setNewsletterFilter} />
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Newsletter</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Company</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Sent</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Delivery</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Open</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Click</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Eng. Rate</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Health</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredNewsletters.map((n) => {
              const m = getNewsletterMetricsForRange(n, range);
              return (
                <tr key={n.id} onClick={() => router.push(`/admin/newsletters/${n.id}`)} className="cursor-pointer hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{n.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{n.companyName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{m.sent.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium">
                    <span className={m.deliveryRate >= 97 ? "text-green-600" : m.deliveryRate >= 95 ? "text-yellow-600" : "text-red-600"}>{m.deliveryRate}%</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{m.openRate}%</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{m.clickRate}%</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold text-white ${
                      n.engagementRate >= 30 ? "bg-green-500" : n.engagementRate >= 20 ? "bg-yellow-500" : "bg-red-500"
                    }`}>{n.engagementRate}%</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block w-3 h-3 rounded-full ${
                      n.deliverabilityScore >= 97 ? "bg-green-500" : n.deliverabilityScore >= 95 ? "bg-yellow-500" : "bg-red-500"
                    }`} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
