"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { TimeRangeFilter, type TimeRange } from "@/components/shared/TimeRangeFilter";
import { FilterDropdown } from "@/components/shared/FilterDropdown";
import {
  newsletters, type Newsletter,
  getProductPulseForRange, getNewsletterMetricsForRange,
  scaleForRange,
} from "@/lib/mock-data";
import { useAdminData } from "@/lib/admin-data-context";

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

export default function ReportingPage() {
  const router = useRouter();
  const { companies } = useAdminData();

  const companyOptions = [
    { label: "All Companies", value: "all" },
    ...companies.map((c) => ({ label: c.name, value: c.id })),
  ];
  const [range, setRange] = useState<TimeRange>("30d");
  const [productFilter, setProductFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [newsletterFilter, setNewsletterFilter] = useState("all");

  // Build newsletter options based on current company/product filters
  const availableNewsletters = newsletters.filter((n) => {
    if (companyFilter !== "all" && n.companyId !== companyFilter) return false;
    if (productFilter !== "all" && !n.activeProducts.includes(productFilter)) return false;
    return true;
  });

  const newsletterOptions = [
    { label: "All Newsletters", value: "all" },
    ...availableNewsletters.map((n) => ({ label: `${n.name} (${n.companyName})`, value: n.id })),
  ];

  // Final filtered list
  const filteredNewsletters = availableNewsletters.filter((n) => {
    if (newsletterFilter !== "all" && n.id !== newsletterFilter) return false;
    return true;
  });

  const rangeLabel = { "24h": "Today", "7d": "This Week", "30d": "This Month", "90d": "This Quarter", "ytd": "Year to Date", "all": "All Time" }[range];

  // Scaled metrics
  const pulse = getProductPulseForRange(range);

  // Revenue
  const feedMRR = companies.reduce((s, c) => c.products.smartFeed ? s + getFeedMRR(c.products.smartFeed.dailyUsage) : s, 0);
  const deliveryMRR_total = companies.filter((c) => c.products.smartDelivery).length * DELIVERY_MRR;
  const recurringMRR = feedMRR + deliveryMRR_total;
  const recurringForRange = range === "24h" ? recurringMRR / 30 : range === "7d" ? recurringMRR / 4.33 : range === "30d" ? recurringMRR : range === "90d" ? recurringMRR * 3 : range === "ytd" ? recurringMRR * 3.43 : recurringMRR * 8;
  const usageRevenue = pulse.smartLeads.revenue + pulse.smartPixel.revenue + pulse.smartReactivation.revenue;
  const totalRevenue = usageRevenue + recurringForRange;

  // Aggregate newsletter stats for filtered set
  const totalSent = filteredNewsletters.reduce((s, n) => s + getNewsletterMetricsForRange(n, range).sent, 0);
  const avgDeliveryRate = filteredNewsletters.length > 0
    ? filteredNewsletters.reduce((s, n) => s + n.deliveryRate, 0) / filteredNewsletters.length : 0;
  const avgOpenRate = filteredNewsletters.length > 0
    ? filteredNewsletters.reduce((s, n) => s + n.openRate, 0) / filteredNewsletters.length : 0;
  const avgClickRate = filteredNewsletters.length > 0
    ? filteredNewsletters.reduce((s, n) => s + n.clickRate, 0) / filteredNewsletters.length : 0;

  return (
    <div>
      <PageHeader
        title="Reporting"
        subtitle="Cross-product performance analytics"
        actions={<TimeRangeFilter value={range} onChange={setRange} />}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <FilterDropdown label="Product" value={productFilter} options={productOptions} onChange={(v) => { setProductFilter(v); setNewsletterFilter("all"); }} />
        <FilterDropdown label="Company" value={companyFilter} options={companyOptions} onChange={(v) => { setCompanyFilter(v); setNewsletterFilter("all"); }} />
        <FilterDropdown label="Newsletter" value={newsletterFilter} options={newsletterOptions} onChange={setNewsletterFilter} />
        {(productFilter !== "all" || companyFilter !== "all" || newsletterFilter !== "all") && (
          <button
            onClick={() => { setProductFilter("all"); setCompanyFilter("all"); setNewsletterFilter("all"); }}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Aggregate KPIs */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Summary — {rangeLabel}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500">Total Revenue</p>
          <p className="text-xl font-bold text-gray-900 mt-1">${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500">Emails Sent</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{totalSent.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500">Avg Delivery Rate</p>
          <p className="text-xl font-bold text-green-600 mt-1">{avgDeliveryRate.toFixed(1)}%</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500">Avg Open Rate</p>
          <p className="text-xl font-bold text-blue-600 mt-1">{avgOpenRate.toFixed(1)}%</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500">Avg Click Rate</p>
          <p className="text-xl font-bold text-blue-600 mt-1">{avgClickRate.toFixed(1)}%</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500">Newsletters</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{filteredNewsletters.length}</p>
        </div>
      </div>

      {/* Product Breakdown */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Product Breakdown — {rangeLabel}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { name: "Smart Lead", units: pulse.smartLeads.units, revenue: pulse.smartLeads.revenue, label: "leads delivered" },
          { name: "Smart Pixel", units: pulse.smartPixel.units, revenue: pulse.smartPixel.revenue, label: "pixels matched" },
          { name: "Smart Reactivation", units: pulse.smartReactivation.units, revenue: pulse.smartReactivation.revenue, label: "records reactivated" },
          { name: "Smart Feed", units: pulse.smartFeed.units, revenue: feedMRR, label: "records fed" },
        ].map((p) => (
          <div key={p.name} className="bg-white rounded-lg border border-gray-200 p-5">
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">{p.name}</h4>
            <p className="text-2xl font-bold text-gray-900">{p.units.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-0.5">{p.label}</p>
            <div className="border-t border-gray-100 mt-3 pt-3">
              <p className="text-lg font-bold text-green-600">${p.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              <p className="text-xs text-gray-400">revenue ({rangeLabel.toLowerCase()})</p>
            </div>
          </div>
        ))}
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
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Growth</th>
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
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={n.unsubRate >= 0.05 ? "text-red-600" : "text-gray-700"}>{n.unsubRate}%</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={n.spamRate >= 0.03 ? "text-red-600" : "text-gray-700"}>{n.spamRate}%</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={n.growth >= 0 ? "text-green-600" : "text-red-600"}>{n.growth >= 0 ? "+" : ""}{n.growth}%</span>
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
    </div>
  );
}
