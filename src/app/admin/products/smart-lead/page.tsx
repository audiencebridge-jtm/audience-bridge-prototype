"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard, MetricCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TabNav } from "@/components/shared/TabNav";
import { TimeRangeFilter, type TimeRange } from "@/components/shared/TimeRangeFilter";
import { FilterDropdown } from "@/components/shared/FilterDropdown";
import { dashboardMetrics, newsletters, companies, getNewslettersByCompany, getNewsletterMetricsForRange, scaleForRange } from "@/lib/mock-data";

const LEAD_RATE = 0.50;

function CustomersTab() {
  const router = useRouter();
  const leadCompanies = companies.filter((c) => c.products.smartLead);

  return (
    <div className="space-y-6">
      {leadCompanies.map((c) => {
        const inv = c.products.smartLead!;
        const rev = inv.unitsUsed * LEAD_RATE;
        const health = inv.remaining === 0 ? "error" : inv.estDaysRemaining < 10 ? "warning" : "active";
        const companyNewsletters = getNewslettersByCompany(c.id).filter((n) => n.activeProducts.includes("Smart Lead"));

        return (
          <div key={c.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Company header */}
            <div
              onClick={() => router.push(`/admin/companies/${c.id}`)}
              className="px-5 py-4 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div>
                <h4 className="font-semibold text-gray-900">{c.name}</h4>
                <p className="text-xs text-gray-400 mt-0.5">{c.plan} · {c.integration} · {c.owner}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">${rev.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className="text-[10px] text-gray-400">revenue</p>
                </div>
                <StatusBadge status={health} label={health === "error" ? "Depleted" : health === "warning" ? "Low" : "Healthy"} />
              </div>
            </div>

            {/* Inventory strip */}
            <div className="px-5 py-3 bg-gray-50 grid grid-cols-5 gap-4 text-center border-b border-gray-100">
              <div><p className="text-xs text-gray-500">Purchased</p><p className="text-sm font-bold text-gray-900">{inv.unitsPurchased.toLocaleString()}</p></div>
              <div><p className="text-xs text-gray-500">Delivered</p><p className="text-sm font-bold text-gray-900">{inv.unitsUsed.toLocaleString()}</p></div>
              <div><p className="text-xs text-gray-500">Remaining</p><p className="text-sm font-bold text-gray-900">{inv.remaining.toLocaleString()}</p></div>
              <div><p className="text-xs text-gray-500">Daily Usage</p><p className="text-sm font-bold text-gray-900">{inv.dailyUsage}</p></div>
              <div>
                <p className="text-xs text-gray-500">Days Left</p>
                <p className={`text-sm font-bold ${inv.estDaysRemaining < 10 ? "text-red-600" : inv.estDaysRemaining < 30 ? "text-yellow-600" : "text-gray-900"}`}>
                  {inv.estDaysRemaining}
                </p>
              </div>
            </div>

            {/* Newsletters table */}
            {companyNewsletters.length > 0 && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-5 py-2 text-left text-[10px] font-semibold text-gray-400 uppercase">Newsletter</th>
                    <th className="px-5 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase">Subscribers</th>
                    <th className="px-5 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase">30-Day Clickers</th>
                    <th className="px-5 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase">Eng. Rate</th>
                    <th className="px-5 py-2 text-center text-[10px] font-semibold text-gray-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {companyNewsletters.map((nl) => (
                    <tr key={nl.id} className="hover:bg-gray-50">
                      <td className="px-5 py-2.5 text-sm text-gray-700">{nl.name}</td>
                      <td className="px-5 py-2.5 text-sm text-gray-600 text-right">{nl.subscribers.toLocaleString()}</td>
                      <td className="px-5 py-2.5 text-sm text-gray-600 text-right">{nl.thirtyDayClickers.toLocaleString()}</td>
                      <td className="px-5 py-2.5 text-sm text-gray-600 text-right">{nl.engagementRate}%</td>
                      <td className="px-5 py-2.5 text-center"><StatusBadge status={nl.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
}

function PerformanceTab() {
  const router = useRouter();
  const leadCompanies = companies.filter((c) => c.products.smartLead);

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase w-12"></th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Company</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Daily Usage</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Inventory Used</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Days Left</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Revenue</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Avg CPL</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Health</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leadCompanies
              .sort((a, b) => (a.products.smartLead?.estDaysRemaining ?? 999) - (b.products.smartLead?.estDaysRemaining ?? 999))
              .map((c) => {
                const inv = c.products.smartLead!;
                const pctUsed = inv.unitsPurchased > 0 ? (inv.unitsUsed / inv.unitsPurchased) * 100 : 0;
                const rev = inv.unitsUsed * LEAD_RATE;
                const health = inv.remaining === 0 ? "error" : inv.estDaysRemaining < 10 ? "warning" : inv.dailyUsage < 5 ? "paused" : "active";
                const healthDot = health === "error" ? "bg-red-500" : health === "warning" ? "bg-yellow-500" : health === "paused" ? "bg-gray-400" : "bg-green-500";

                return (
                  <tr key={c.id} onClick={() => router.push(`/admin/companies/${c.id}`)} className="cursor-pointer hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${healthDot}`} />
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.plan}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">{inv.dailyUsage}/day</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${pctUsed > 85 ? "bg-red-500" : pctUsed > 60 ? "bg-yellow-500" : "bg-green-500"}`}
                            style={{ width: `${Math.min(pctUsed, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-10 text-right">{pctUsed.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span className={inv.estDaysRemaining < 10 ? "text-red-600 font-semibold" : inv.estDaysRemaining < 30 ? "text-yellow-600" : "text-gray-700"}>
                        {inv.estDaysRemaining}d
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right font-medium">${rev.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">${LEAD_RATE.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge
                        status={health === "paused" ? "paused" : health}
                        label={health === "error" ? "Depleted" : health === "warning" ? "Low" : health === "paused" ? "Stalled" : "Healthy"}
                      />
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

export default function SmartLeadPage() {
  const router = useRouter();
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

  const rangeLabel = { "24h": "Today", "7d": "This Week", "30d": "This Month", "90d": "This Quarter", "ytd": "Year to Date", "all": "All Time" }[range];

  return (
    <div>
      <PageHeader
        title="Smart Lead"
        subtitle="Recommend audience-targeted newsletter subscribers for deeper activation"
        actions={<TimeRangeFilter value={range} onChange={setRange} />}
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

      <div className="mt-6">
        <TabNav
          tabs={[
            { label: "Customers", content: <CustomersTab /> },
            { label: "Performance", content: <PerformanceTab /> },
          ]}
        />
      </div>

      {/* Newsletter Delivery Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-6 mb-3">
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
