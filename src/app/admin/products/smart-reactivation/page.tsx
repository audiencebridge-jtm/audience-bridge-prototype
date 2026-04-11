"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard, MetricCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { dashboardMetrics, companies, reactivationRecords } from "@/lib/mock-data";

const MATCH_RATE = 0.02;

export default function SmartReactivationPage() {
  const router = useRouter();
  const metrics = dashboardMetrics.productPulse.smartReactivation;
  const reactivationCompanies = companies.filter((c) => c.products.smartReactivation);

  const totalDormant = reactivationRecords.reduce((s, r) => s + r.dormantRecords, 0);
  const totalMatched = reactivationRecords.reduce((s, r) => s + r.matchedRecords, 0);
  const overallRate = totalDormant > 0 ? ((totalMatched / totalDormant) * 100).toFixed(1) : "0";
  const totalRevenue = totalMatched * MATCH_RATE;

  // Group records by company for the client breakdown
  const companyStats = reactivationCompanies.map((c) => {
    const records = reactivationRecords.filter((r) => r.company === c.name);
    const dormant = records.reduce((s, r) => s + r.dormantRecords, 0);
    const matched = records.reduce((s, r) => s + r.matchedRecords, 0);
    const inv = c.products.smartReactivation!;
    return { company: c, dormant, matched, inv };
  });

  return (
    <div>
      <PageHeader title="Smart Reactivation" subtitle="Turn dormant subscribers back into engaged subscribers" />

      {/* Revenue & Business KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Revenue (All Time)" value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} trend={{ value: "+15%", positive: true }} />
        <SummaryCard title="Active Clients" value={reactivationCompanies.length} />
        <SummaryCard title="Total Matches" value={totalMatched.toLocaleString()} />
        <SummaryCard title="Overall Recovery Rate" value={`${overallRate}%`} />
      </div>

      {/* Product Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Matches Today" value={metrics.today.toLocaleString()} trend={{ value: "+15%", positive: true }} />
        <SummaryCard title="This Week" value={metrics.thisWeek.toLocaleString()} />
        <SummaryCard title="This Month" value={metrics.thisMonth.toLocaleString()} />
        <SummaryCard title="All Time" value={metrics.allTime.toLocaleString()} />
      </div>

      <MetricCard
        title="Reactivation Operations"
        metrics={[
          { label: "Active Clients", value: reactivationCompanies.length, color: "text-green-600" },
          { label: "Rate/Match", value: `$${MATCH_RATE.toFixed(2)}`, color: "text-blue-600" },
          { label: "Total Dormant Pool", value: totalDormant.toLocaleString(), color: "text-gray-500" },
          { label: "Daily Matches", value: metrics.today.toLocaleString(), color: "text-blue-500" },
        ]}
      />

      {/* Client Breakdown */}
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-3">Client Breakdown</h3>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Company</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Purchased</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Matched</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Remaining</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Daily Usage</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Est. Days Left</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Revenue</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Health</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {companyStats.map(({ company, matched, inv }) => {
              const rev = matched * MATCH_RATE;
              const health = inv.remaining === 0 ? "error" : inv.estDaysRemaining < 10 ? "warning" : "active";
              return (
                <tr key={company.id} onClick={() => router.push(`/admin/companies/${company.id}`)} className="cursor-pointer hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{company.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{inv.unitsPurchased.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{inv.unitsUsed.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{inv.remaining.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{inv.dailyUsage.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={inv.estDaysRemaining < 10 ? "text-red-600 font-semibold" : inv.estDaysRemaining < 30 ? "text-yellow-600" : "text-gray-700"}>
                      {inv.estDaysRemaining}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right font-medium">${rev.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={health} label={health === "error" ? "Depleted" : health === "warning" ? "Low" : "Healthy"} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Newsletter-Level Detail */}
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Newsletter-Level Detail</h3>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Newsletter</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Company</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Dormant</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Matched</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Recovery Rate</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reactivationRecords.map((r, i) => {
              const rate = r.dormantRecords > 0 ? ((r.matchedRecords / r.dormantRecords) * 100).toFixed(1) : "0";
              return (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.newsletter}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{r.company}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{r.dormantRecords.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{r.matchedRecords.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={Number(rate) > 10 ? "text-green-600 font-semibold" : "text-gray-500"}>{rate}%</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">${(r.matchedRecords * MATCH_RATE).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
