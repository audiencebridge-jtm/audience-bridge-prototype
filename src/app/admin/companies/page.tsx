"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { companies, getCompanyHealthStatus, getLowestInventory, type Company, type ProductInventory } from "@/lib/mock-data";

type HealthFilter = "all" | "critical" | "warning" | "healthy";
type StatusFilter = "all" | "active" | "trial" | "suspended";

function AddCompanyModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center" onClick={(e) => e.stopPropagation()}>
          <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Company Created</h3>
          <p className="text-sm text-gray-600 mb-4">{name} has been added. Next, add newsletters and activate products.</p>
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Add New Company</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Company Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Acme Publishing" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Contact Email *</label>
            <input type="email" placeholder="team@company.com" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Plan</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Starter</option>
                <option>Growth</option>
                <option>Enterprise</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Integration</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Sailthru</option>
                <option>Beehiiv</option>
                <option>Iterable</option>
                <option>Customer.io</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Account Owner</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Justin Merrell</option>
              <option>Chris Miquel</option>
            </select>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
          <button onClick={() => name && setSubmitted(true)} className={`px-4 py-2 text-sm font-medium text-white rounded-md ${name ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}>Create Company</button>
        </div>
      </div>
    </div>
  );
}

export default function CompaniesPage() {
  const router = useRouter();
  const [healthFilter, setHealthFilter] = useState<HealthFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [showAddCompany, setShowAddCompany] = useState(false);

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
      <PageHeader
        title="Companies"
        subtitle="Operational overview of all publisher accounts"
        actions={<button onClick={() => setShowAddCompany(true)} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">+ Add Company</button>}
      />

      {showAddCompany && <AddCompanyModal onClose={() => setShowAddCompany(false)} />}

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
