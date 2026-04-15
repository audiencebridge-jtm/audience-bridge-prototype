"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard, MetricCard } from "@/components/shared/MetricCard";
import { TimeRangeFilter, type TimeRange } from "@/components/shared/TimeRangeFilter";
import { FilterDropdown } from "@/components/shared/FilterDropdown";
import { dashboardMetrics, newsletters, getNewsletterMetricsForRange } from "@/lib/mock-data";
import { useAdminData } from "@/lib/admin-data-context";

const LEAD_RATE = 0.50;

export default function SmartLeadPage() {
  const router = useRouter();
  const { companies } = useAdminData();
  const [range, setRange] = useState<TimeRange>("30d");
  const [newsletterFilter, setNewsletterFilter] = useState("all");

  const metrics = dashboardMetrics.productPulse.smartLeads;
  const leadNewsletters = newsletters.filter((n) => n.activeProducts.includes("Smart Lead"));
  const leadCompanies = companies.filter((c) => c.products.smartLead);

  const newsletterOptions = [
    { label: "All Newsletters", value: "all" },
    ...leadNewsletters.map((n) => ({ label: `${n.name} (${n.companyName})`, value: n.id })),
  ];

  const filteredNewsletters = newsletterFilter === "all"
    ? leadNewsletters
    : leadNewsletters.filter((n) => n.id === newsletterFilter);

  const activeClients = leadCompanies.filter((c) => (c.products.smartLead?.dailyUsage ?? 0) >= 5).length;
  const pausedClients = leadCompanies.filter((c) => (c.products.smartLead?.dailyUsage ?? 0) < 5).length;
  const totalUsed = leadCompanies.reduce((s, c) => s + (c.products.smartLead?.unitsUsed ?? 0), 0);
  const avgDailyUsage = leadCompanies.reduce((s, c) => s + (c.products.smartLead?.dailyUsage ?? 0), 0);
  const avgCPL = totalUsed > 0 ? (totalUsed * LEAD_RATE) / totalUsed : 0;
  const mrr = avgDailyUsage * 30 * LEAD_RATE;

  // Revenue per time period
  const revToday = metrics.today * LEAD_RATE;
  const revWeek = metrics.thisWeek * LEAD_RATE;
  const revMonth = metrics.thisMonth * LEAD_RATE;
  const revAllTime = metrics.allTime * LEAD_RATE;

  return (
    <div>
      <PageHeader
        title="Smart Lead"
        subtitle="Recommend audience-targeted newsletter subscribers for deeper activation"
      />

      {/* Business KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Active Clients" value={activeClients} />
        <SummaryCard title="Paused Clients" value={pausedClients} subtitle={pausedClients > 0 ? "usage < 5/day" : undefined} />
        <SummaryCard title="Est. MRR" value={`$${mrr.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} trend={{ value: "+12%", positive: true }} />
        <SummaryCard title="Avg CPL" value={`$${avgCPL.toFixed(2)}`} />
      </div>

      {/* Activity + Revenue */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500">Today</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.today.toLocaleString()}</p>
          <p className="text-sm text-green-600 font-medium mt-1">${revToday.toLocaleString(undefined, { maximumFractionDigits: 0 })} revenue</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500">This Week</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.thisWeek.toLocaleString()}</p>
          <p className="text-sm text-green-600 font-medium mt-1">${revWeek.toLocaleString(undefined, { maximumFractionDigits: 0 })} revenue</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500">This Month</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.thisMonth.toLocaleString()}</p>
          <p className="text-sm text-green-600 font-medium mt-1">${revMonth.toLocaleString(undefined, { maximumFractionDigits: 0 })} revenue</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500">All Time</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.allTime.toLocaleString()}</p>
          <p className="text-sm text-green-600 font-medium mt-1">${revAllTime.toLocaleString(undefined, { maximumFractionDigits: 0 })} revenue</p>
        </div>
      </div>

      <MetricCard
        title="Lead Operations"
        metrics={[
          { label: "Active Sources", value: leadCompanies.filter((c) => (c.products.smartLead?.dailyUsage ?? 0) >= 5).length, color: "text-green-600" },
          { label: "Newsletters Using", value: leadNewsletters.length, color: "text-blue-600" },
          { label: "Avg Daily (all clients)", value: avgDailyUsage, color: "text-blue-500" },
          { label: "Rate/Lead", value: `$${LEAD_RATE.toFixed(2)}`, color: "text-gray-600" },
        ]}
      />

      {/* Newsletter Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-6 mb-3">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Newsletter Metrics
          <span className="text-gray-400 font-normal ml-2">({filteredNewsletters.length} newsletters)</span>
        </h3>
        <div className="flex items-center gap-4">
          <TimeRangeFilter value={range} onChange={setRange} />
          <FilterDropdown label="Newsletter" value={newsletterFilter} options={newsletterOptions} onChange={setNewsletterFilter} />
        </div>
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
