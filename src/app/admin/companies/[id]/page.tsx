"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TabNav } from "@/components/shared/TabNav";
import { DataTable } from "@/components/shared/DataTable";
import { getCompanyById, getNewslettersByCompany, invoices, type ProductInventory } from "@/lib/mock-data";

const productLabels: Record<string, string> = {
  smartLead: "Smart Lead", smartFeed: "Smart Feed", smartPixel: "Smart Pixel",
  smartDelivery: "Smart Delivery", smartReactivation: "Smart Reactivation",
};

function InventoryCard({ name, inv }: { name: string; inv: ProductInventory }) {
  const pct = inv.unitsPurchased > 0 ? (inv.unitsUsed / inv.unitsPurchased) * 100 : 0;
  const barColor = pct > 85 ? "bg-red-500" : pct > 60 ? "bg-yellow-500" : "bg-green-500";
  const daysColor = inv.estDaysRemaining === 0 ? "text-red-600" : inv.estDaysRemaining < 10 ? "text-yellow-600" : inv.estDaysRemaining < 30 ? "text-gray-700" : "text-green-600";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900">{name}</h4>
        <StatusBadge status={inv.remaining === 0 ? "error" : inv.estDaysRemaining < 10 ? "warning" : "active"} label={inv.remaining === 0 ? "Depleted" : inv.estDaysRemaining < 10 ? "Low" : "Healthy"} />
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{pct.toFixed(0)}% consumed</span>
          <span>{inv.remaining.toLocaleString()} remaining</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Purchased</p>
          <p className="text-lg font-bold text-gray-900">{inv.unitsPurchased.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Used</p>
          <p className="text-lg font-bold text-gray-900">{inv.unitsUsed.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Remaining</p>
          <p className="text-lg font-bold text-gray-900">{inv.remaining.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Daily Usage</p>
          <p className="text-lg font-bold text-gray-900">{inv.dailyUsage.toLocaleString()}</p>
        </div>
      </div>

      {/* Est. Days Remaining callout */}
      <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
        <span className="text-sm text-gray-600">Est. Days Remaining</span>
        <span className={`text-2xl font-bold ${daysColor}`}>{inv.estDaysRemaining}</span>
      </div>
    </div>
  );
}

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const company = getCompanyById(id);

  if (!company) {
    return <div className="p-8 text-gray-500">Company not found</div>;
  }

  const companyNewsletters = getNewslettersByCompany(id);
  const companyInvoices = invoices.filter((inv) => inv.company === company.name);
  const productEntries = Object.entries(company.products) as [string, ProductInventory][];

  return (
    <div>
      <div className="mb-2">
        <Link href="/admin/companies" className="text-sm text-blue-600 hover:underline">← Back to Companies</Link>
      </div>
      <PageHeader
        title={company.name}
        subtitle={`${company.plan} plan · ${company.integration} · Owner: ${company.owner}`}
        actions={<StatusBadge status={company.status} />}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Newsletters" value={company.newsletters.length} />
        <SummaryCard title="Total Subscribers" value={company.totalSubscribers.toLocaleString()} />
        <SummaryCard title="Active Products" value={productEntries.length} />
        <SummaryCard title="Member Since" value={company.createdAt} />
      </div>

      <TabNav
        tabs={[
          {
            label: "Products & Inventory",
            content: (
              <div className="space-y-4">
                {productEntries.length === 0 ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-sm text-gray-500">
                    No active products
                  </div>
                ) : (
                  productEntries.map(([key, inv]) => (
                    <InventoryCard key={key} name={productLabels[key] || key} inv={inv} />
                  ))
                )}
              </div>
            ),
          },
          {
            label: "Newsletters",
            content: (
              <DataTable
                columns={[
                  { key: "name", label: "Newsletter" },
                  { key: "subscribers", label: "Subscribers", align: "right" as const, render: (r: Record<string, unknown>) => (r.subscribers as number).toLocaleString() },
                  { key: "engagementRate", label: "Eng. Rate", align: "right" as const, render: (r: Record<string, unknown>) => `${r.engagementRate}%` },
                  { key: "status", label: "Status", render: (r: Record<string, unknown>) => <StatusBadge status={r.status as "active"} /> },
                ]}
                data={companyNewsletters as unknown as Record<string, unknown>[]}
                onRowClick={(row) => router.push(`/admin/newsletters/${row.id}`)}
              />
            ),
          },
          {
            label: "Billing",
            content: (
              <DataTable
                columns={[
                  { key: "id", label: "Invoice" },
                  { key: "date", label: "Date" },
                  { key: "amount", label: "Amount", align: "right" as const, render: (r: Record<string, unknown>) => `$${(r.amount as number).toLocaleString()}` },
                  { key: "status", label: "Status", render: (r: Record<string, unknown>) => <StatusBadge status={r.status as "paid"} /> },
                ]}
                data={companyInvoices as unknown as Record<string, unknown>[]}
              />
            ),
          },
          {
            label: "Details",
            content: (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <dl className="grid grid-cols-2 gap-4">
                  <div><dt className="text-sm text-gray-500">Contact Email</dt><dd className="text-sm text-gray-900">{company.contactEmail}</dd></div>
                  <div><dt className="text-sm text-gray-500">Integration</dt><dd className="text-sm text-gray-900">{company.integration}</dd></div>
                  <div><dt className="text-sm text-gray-500">Owner</dt><dd className="text-sm text-gray-900">{company.owner}</dd></div>
                  <div><dt className="text-sm text-gray-500">Products</dt><dd className="text-sm text-gray-900">{company.customerType.join(", ")}</dd></div>
                  <div><dt className="text-sm text-gray-500">Created</dt><dd className="text-sm text-gray-900">{company.createdAt}</dd></div>
                  <div><dt className="text-sm text-gray-500">Status</dt><dd><StatusBadge status={company.status} /></dd></div>
                </dl>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
