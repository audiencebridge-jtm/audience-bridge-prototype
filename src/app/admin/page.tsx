"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard } from "@/components/shared/MetricCard";
import { AlertsPanel } from "@/components/admin/AlertsPanel";
import { TimeRangeFilter, type TimeRange } from "@/components/shared/TimeRangeFilter";
import { FilterDropdown } from "@/components/shared/FilterDropdown";
import {
  dashboardMetrics, companies, newsletters, generateInventoryAlerts, getCompanyHealthStatus,
  getProductPulseForRange, getSystemEventsForRange, getNewsletterMetricsForRange,
  scaleForRange,
} from "@/lib/mock-data";

const LEAD_RATE = 0.50;
const MATCH_RATE = 0.02;
const DELIVERY_MRR = 2_000;

function getFeedMRR(dailyUsage: number): number {
  if (dailyUsage >= 500) return 3_500;
  if (dailyUsage >= 200) return 1_500;
  if (dailyUsage >= 50) return 500;
  return 250;
}

const productOptions = [
  { label: "All Products", value: "all" },
  { label: "Smart Lead", value: "Smart Lead" },
  { label: "Smart Pixel", value: "Smart Pixel" },
  { label: "Smart Feed", value: "Smart Feed" },
  { label: "Smart Delivery", value: "Smart Delivery" },
  { label: "Smart Reactivation", value: "Smart Reactivation" },
];

const companyOptions = [
  { label: "All Companies", value: "all" },
  ...companies.map((c) => ({ label: c.name, value: c.id })),
];

export default function AdminDashboard() {
  const [range, setRange] = useState<TimeRange>("30d");
  const [productFilter, setProductFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");

  const alerts = generateInventoryAlerts(companies);
  const attentionCompanies = companies.filter((c) => getCompanyHealthStatus(c) !== "healthy");

  // Filtered newsletters
  const filteredNewsletters = newsletters.filter((n) => {
    if (companyFilter !== "all" && n.companyId !== companyFilter) return false;
    if (productFilter !== "all" && !n.activeProducts.includes(productFilter)) return false;
    return true;
  });

  // Recurring revenue
  const feedMRR = companies.reduce((s, c) => c.products.smartFeed ? s + getFeedMRR(c.products.smartFeed.dailyUsage) : s, 0);
  const deliveryMRR = companies.filter((c) => c.products.smartDelivery).length * DELIVERY_MRR;
  const recurringMRR = feedMRR + deliveryMRR;

  // Scaled product metrics
  const pulse = getProductPulseForRange(range);
  const events = getSystemEventsForRange(range);

  // Total revenue for selected range
  const usageRevenue = pulse.smartLeads.revenue + pulse.smartPixel.revenue + pulse.smartReactivation.revenue;
  const rangeLabel = { "24h": "Today", "7d": "This Week", "30d": "This Month", "90d": "This Quarter", "ytd": "Year to Date", "all": "All Time" }[range];
  // Recurring revenue scaled to range
  const recurringForRange = range === "24h" ? recurringMRR / 30 : range === "7d" ? recurringMRR / 4.33 : range === "30d" ? recurringMRR : range === "90d" ? recurringMRR * 3 : range === "ytd" ? recurringMRR * 3.43 : recurringMRR * 8;
  const totalRevenue = usageRevenue + recurringForRange;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Audience Bridge Admin Overview"
        actions={<TimeRangeFilter value={range} onChange={setRange} />}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-5">
        <FilterDropdown label="Product" value={productFilter} options={productOptions} onChange={setProductFilter} />
        <FilterDropdown label="Company" value={companyFilter} options={companyOptions} onChange={setCompanyFilter} />
        {(productFilter !== "all" || companyFilter !== "all") && (
          <button
            onClick={() => { setProductFilter("all"); setCompanyFilter("all"); }}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Revenue Summary */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Revenue — {rangeLabel}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <p className="text-xs text-gray-400 mt-1">{rangeLabel}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500">Usage Revenue</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">${usageRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <p className="text-xs text-gray-400 mt-1">Lead + Pixel + Reactivation</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500">Recurring Revenue</p>
          <p className="text-2xl font-bold text-green-600 mt-1">${recurringForRange.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <p className="text-xs text-gray-400 mt-1">Feed + Delivery</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500">MRR</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">${recurringMRR.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">Current monthly recurring</p>
        </div>
      </div>

      {/* Product Pulse */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Product Pulse — {rangeLabel}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          { name: "Smart Lead", units: pulse.smartLeads.units, revenue: pulse.smartLeads.revenue, rate: `$${LEAD_RATE}/lead`, href: "/admin/products/smart-lead" },
          { name: "Smart Pixel", units: pulse.smartPixel.units, revenue: pulse.smartPixel.revenue, rate: "$0.10–0.25/match", href: "/admin/products/smart-pixel" },
          { name: "Smart Reactivation", units: pulse.smartReactivation.units, revenue: pulse.smartReactivation.revenue, rate: `$${MATCH_RATE}/match`, href: "/admin/products/smart-reactivation" },
          { name: "Smart Feed", units: pulse.smartFeed.units, revenue: feedMRR, rate: "MRR", href: "/admin/products/smart-feed" },
        ].map((p) => (
          <Link key={p.name} href={p.href} className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all">
            <h4 className="text-sm font-semibold text-gray-500 mb-3">{p.name}</h4>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-2xl font-bold text-blue-600">{p.units.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">Units ({rangeLabel})</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">${p.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                <p className="text-[10px] text-gray-400">Revenue ({rangeLabel})</p>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
              <p className="text-xs text-gray-400">{p.rate}</p>
              <span className="text-xs text-blue-600 font-medium">View Details →</span>
            </div>
          </Link>
        ))}

        {/* Smart Delivery — retainer */}
        <Link href="/admin/products/smart-delivery" className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all">
          <h4 className="text-sm font-semibold text-gray-500 mb-4">Smart Delivery</h4>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-3xl font-bold text-blue-600">{companies.filter((c) => c.products.smartDelivery).length}</p>
              <p className="text-xs text-gray-400 mt-1">Active Clients</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">${deliveryMRR.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">MRR</p>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-4 pt-3 flex items-center justify-between">
            <p className="text-xs text-gray-400">${DELIVERY_MRR.toLocaleString()}/mo per client</p>
            <span className="text-xs text-blue-600 font-medium">View Details →</span>
          </div>
        </Link>
      </div>

      {/* System Events */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">System Events — {rangeLabel}</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500">Emails Sent</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{events.sent.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500">Opens</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{events.opens.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500">Clicks</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{events.clicks.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500">Click Events</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{events.clickEvents.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500">Partner Signals</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{events.partnerSignals.toLocaleString()}</p>
        </div>
      </div>

      {/* Newsletter Performance Table */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Newsletter Performance — {rangeLabel}
        <span className="text-gray-400 font-normal ml-2">({filteredNewsletters.length} newsletters)</span>
      </h2>
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto mb-6">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Newsletter</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Company</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Sent</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Delivery</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Open</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Click</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Unsub</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Spam</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Eng. Rate</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Health</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredNewsletters.map((n) => {
              const m = getNewsletterMetricsForRange(n, range);
              return (
                <tr key={n.id} className="hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => window.location.href = `/admin/newsletters/${n.id}`}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{n.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{n.companyName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{m.sent.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium">
                    <span className={m.deliveryRate >= 97 ? "text-green-600" : m.deliveryRate >= 95 ? "text-yellow-600" : "text-red-600"}>{m.deliveryRate}%</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{m.openRate}%</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{m.clickRate}%</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={n.unsubRate >= 0.05 ? "text-red-600" : "text-gray-700"}>{n.unsubRate}%</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={n.spamRate >= 0.03 ? "text-red-600" : "text-gray-700"}>{n.spamRate}%</span>
                  </td>
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

      {/* Alerts */}
      <div className="mb-6">
        <AlertsPanel alerts={alerts} />
      </div>

      {/* Companies Needing Attention */}
      {attentionCompanies.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Companies Needing Attention</h2>
          <div className="flex flex-wrap gap-2">
            {attentionCompanies.map((c) => {
              const health = getCompanyHealthStatus(c);
              return (
                <Link key={c.id} href={`/admin/companies/${c.id}`}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors hover:shadow-sm ${
                    health === "critical" ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100" : "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                  }`}>
                  <span className={`w-2 h-2 rounded-full ${health === "critical" ? "bg-red-500" : "bg-yellow-500"}`} />
                  {c.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
