"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard, MetricCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TimeRangeFilter, type TimeRange } from "@/components/shared/TimeRangeFilter";
import { FilterDropdown } from "@/components/shared/FilterDropdown";
import { newsletters, companies, type Newsletter, getNewsletterMetricsForRange } from "@/lib/mock-data";

const DELIVERY_MRR = 2_000;

export default function SmartDeliveryPage() {
  const router = useRouter();
  const [range, setRange] = useState<TimeRange>("24h");
  const [newsletterFilter, setNewsletterFilter] = useState("all");

  const deliveryNewsletters = newsletters.filter((n) => n.activeProducts.includes("Smart Delivery") || n.activeProducts.includes("Smart Feed"));
  const deliveryCompanies = companies.filter((c) => c.products.smartDelivery);

  const newsletterOptions = [
    { label: "All Newsletters", value: "all" },
    ...deliveryNewsletters.map((n) => ({ label: `${n.name} (${n.companyName})`, value: n.id })),
  ];

  const filteredNewsletters = newsletterFilter === "all"
    ? deliveryNewsletters
    : deliveryNewsletters.filter((n) => n.id === newsletterFilter);

  const totalMRR = deliveryCompanies.length * DELIVERY_MRR;
  const totalSubscribers = deliveryCompanies.reduce((s, c) => s + c.totalSubscribers, 0);

  const rangeLabel = { "24h": "Last 24 Hours", "7d": "Last 7 Days", "30d": "Last 30 Days", "90d": "Last 90 Days", "ytd": "Year to Date", "all": "All Time" }[range];

  return (
    <div>
      <PageHeader
        title="Smart Delivery"
        subtitle="Diagnose. Deliver. Dominate. Get your emails to inbox and engage."
        actions={<TimeRangeFilter value={range} onChange={setRange} />}
      />

      {/* Revenue & Business KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Monthly Recurring Revenue" value={`$${totalMRR.toLocaleString()}`} subtitle={`${deliveryCompanies.length} clients @ $${DELIVERY_MRR.toLocaleString()}/mo`} />
        <SummaryCard title="Active Clients" value={deliveryCompanies.length} />
        <SummaryCard title="Subscribers Managed" value={totalSubscribers.toLocaleString()} />
        <SummaryCard title="Avg Inbox Placement" value="94.1%" trend={{ value: "+1.2%", positive: true }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Overall Delivery Rate" value="97.2%" trend={{ value: "+0.3%", positive: true }} />
        <SummaryCard title="Bounce Rate" value="1.8%" trend={{ value: "-0.2%", positive: true }} />
        <SummaryCard title="Complaint Rate" value="0.02%" trend={{ value: "-0.01%", positive: true }} />
        <SummaryCard title="Newsletters Monitored" value={deliveryNewsletters.length} />
      </div>

      <MetricCard
        title="Delivery Operations"
        metrics={[
          { label: "Active Clients", value: deliveryCompanies.length, color: "text-green-600" },
          { label: "Retainer/Client", value: `$${DELIVERY_MRR.toLocaleString()}`, color: "text-blue-600" },
          { label: "Annual Revenue", value: `$${(totalMRR * 12).toLocaleString()}`, color: "text-green-600" },
        ]}
      />

      {/* Client Breakdown */}
      {deliveryCompanies.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-3">Client Breakdown</h3>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Company</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Subscribers</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Newsletters</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">MRR</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deliveryCompanies.map((c) => (
                  <tr key={c.id} onClick={() => router.push(`/admin/companies/${c.id}`)} className="cursor-pointer hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{c.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">{c.totalSubscribers.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">{c.newsletters.length}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right font-medium">${DELIVERY_MRR.toLocaleString()}/mo</td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Newsletter filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Delivery Metrics — {rangeLabel}
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
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Unsub</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Spam</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Growth</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Eng. Rate</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Health</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredNewsletters.map((n: Newsletter) => {
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
