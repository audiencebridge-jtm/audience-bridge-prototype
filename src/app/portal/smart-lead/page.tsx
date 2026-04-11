"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard } from "@/components/shared/MetricCard";
import { ProductGate } from "@/components/portal/ProductGate";
import { useNewsletter } from "@/context/NewsletterContext";
import { smartLeadSources } from "@/lib/mock-data";

export default function PortalSmartLeadPage() {
  const { selectedNewsletter } = useNewsletter();

  const sources = selectedNewsletter
    ? smartLeadSources.filter((s) => s.newsletter === selectedNewsletter.name)
    : smartLeadSources;

  const totalPurchased = sources.reduce((s, r) => s + r.totalPurchased, 0);
  const totalDelivered = sources.reduce((s, r) => s + r.delivered, 0);
  const totalRemaining = sources.reduce((s, r) => s + r.remaining, 0);
  const avgCPL = sources.length > 0 ? sources.reduce((s, r) => s + r.costPerLead, 0) / sources.length : 0;

  const subtitle = selectedNewsletter
    ? `Lead acquisition for ${selectedNewsletter.name}`
    : "Your lead acquisition performance";

  return (
    <ProductGate productKey="smartLead">
    <div>
      <PageHeader title="Smart Lead" subtitle={subtitle} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Total Units Purchased" value={totalPurchased.toLocaleString()} />
        <SummaryCard title="Leads Delivered" value={totalDelivered.toLocaleString()} trend={{ value: "+18%", positive: true }} />
        <SummaryCard title="Units Remaining" value={totalRemaining.toLocaleString()} />
        <SummaryCard title="Avg Cost per Lead" value={`$${avgCPL.toFixed(2)}`} />
      </div>

      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Source Breakdown</h3>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Source</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Purchased</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Delivered</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Remaining</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Daily Usage</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Est. Days Left</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Cost/Lead</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sources.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">
                  No Smart Lead sources for this newsletter
                </td>
              </tr>
            ) : (
              sources.map((source) => (
                <tr key={source.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{source.newsletter}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{source.totalPurchased.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{source.delivered.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{source.remaining.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{source.dailyUsage}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={source.daysRemaining < 35 ? "text-red-600 font-semibold" : "text-gray-700"}>
                      {source.daysRemaining}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">${source.costPerLead.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    </ProductGate>
  );
}
