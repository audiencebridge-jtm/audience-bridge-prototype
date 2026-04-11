"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { companies, getCompanyHealthStatus, getLowestInventory, type Company, type ProductInventory } from "@/lib/mock-data";

type HealthFilter = "all" | "critical" | "warning" | "healthy";
type StatusFilter = "all" | "active" | "trial" | "suspended";

export default function CompaniesPage() {
  const router = useRouter();
  const [healthFilter, setHealthFilter] = useState<HealthFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const needsAttention = companies.filter((c) => getCompanyHealthStatus(c) !== "healthy").length;
  const totalProducts = companies.reduce((s, c) => s + Object.keys(c.products).length, 0);
  const allInventories = companies.flatMap((c) => Object.values(c.products) as ProductInventory[]);
  const avgDays = allInventories.length > 0
    ? (allInventories.reduce((s, inv) => s + inv.estDaysRemaining, 0) / allInventories.length).toFixed(0)
    : "0";

  let filtered = companies.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (healthFilter !== "all" && getCompanyHealthStatus(c) !== healthFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Sort: critical first, then warning, then healthy
  const healthOrder = { critical: 0, warning: 1, healthy: 2 };
  filtered = [...filtered].sort((a, b) => healthOrder[getCompanyHealthStatus(a)] - healthOrder[getCompanyHealthStatus(b)]);

  const productLabels: Record<string, string> = {
    smartLead: "Lead", smartFeed: "Feed", smartPixel: "Pixel",
    smartDelivery: "Delivery", smartReactivation: "Reactivation",
  };

  return (
    <div>
      <PageHeader title="Companies" subtitle="Operational overview of all publisher accounts" />

      {/* Summary Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Total Companies" value={companies.length} />
        <SummaryCard title="Needs Attention" value={needsAttention} subtitle={needsAttention > 0 ? "inventory alerts" : "all clear"} />
        <SummaryCard title="Active Products" value={totalProducts} />
        <SummaryCard title="Avg Days Remaining" value={avgDays} subtitle="across all inventories" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 font-medium">Health</label>
          <div className="flex gap-1">
            {(["all", "critical", "warning", "healthy"] as HealthFilter[]).map((h) => (
              <button
                key={h}
                onClick={() => setHealthFilter(h)}
                className={`px-3 py-1 text-xs font-medium rounded border capitalize ${
                  healthFilter === h ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 font-medium">Status</label>
          <div className="flex gap-1">
            {(["all", "active", "trial", "suspended"] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 text-xs font-medium rounded border capitalize ${
                  statusFilter === s ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search companies..."
          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-xs"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase w-12"></th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Company</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Owner</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Products</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Lowest Inventory</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Newsletters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((company) => {
                const health = getCompanyHealthStatus(company);
                const lowest = getLowestInventory(company);
                return (
                  <tr
                    key={company.id}
                    onClick={() => router.push(`/admin/companies/${company.id}`)}
                    className="cursor-pointer hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                        health === "critical" ? "bg-red-500" : health === "warning" ? "bg-yellow-500" : "bg-green-500"
                      }`} />
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{company.name}</p>
                      <p className="text-xs text-gray-400">{company.plan} · {company.integration}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {company.owner.split(" ")[0]}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(Object.entries(company.products) as [string, ProductInventory][]).map(([key, inv]) => {
                          const prodHealth = inv.remaining === 0 ? "error" : inv.estDaysRemaining < 10 ? "warning" : "active";
                          return (
                            <StatusBadge key={key} status={prodHealth} label={productLabels[key] || key} />
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {lowest ? (
                        <span className={`font-medium ${
                          lowest.days === 0 ? "text-red-600" : lowest.days < 10 ? "text-yellow-600" : lowest.days < 30 ? "text-gray-700" : "text-green-600"
                        }`}>
                          {lowest.product}: {lowest.days}d
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={company.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">
                      {company.newsletters.length}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-200 text-sm text-gray-500">
          Showing {filtered.length} of {companies.length} companies
        </div>
      </div>
    </div>
  );
}
