"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TabNav } from "@/components/shared/TabNav";
import { DataTable } from "@/components/shared/DataTable";
import { getNewslettersByCompany, invoices, type ProductInventory } from "@/lib/mock-data";
import { useAdminData } from "@/lib/admin-data-context";

const productLabels: Record<string, string> = {
  smartLead: "Smart Lead", smartFeed: "Smart Feed", smartPixel: "Smart Pixel",
  smartDelivery: "Smart Delivery", smartReactivation: "Smart Reactivation",
};

const allProductKeys = ["smartLead", "smartFeed", "smartPixel", "smartDelivery", "smartReactivation"];

function getRate(key: string, units: number): number {
  if (key === "smartLead") return 0.50;
  if (key === "smartPixel") return units >= 50_000 ? 0.10 : units >= 10_000 ? 0.15 : 0.25;
  if (key === "smartReactivation") return 0.02;
  if (key === "smartFeed") return 0; // monthly
  if (key === "smartDelivery") return 0; // monthly
  return 0;
}

function getMRR(key: string, dailyUsage: number): number {
  if (key === "smartFeed") {
    if (dailyUsage >= 500) return 3_500;
    if (dailyUsage >= 200) return 1_500;
    if (dailyUsage >= 50) return 500;
    return 250;
  }
  if (key === "smartDelivery") return 2_000;
  return 0;
}

function isRecurring(key: string) { return key === "smartFeed" || key === "smartDelivery"; }

// ─── Inventory Card with Top Up ─────────────────────────────
function InventoryCard({ productKey, name, inv }: { productKey: string; name: string; inv: ProductInventory }) {
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpUnits, setTopUpUnits] = useState(10_000);
  const [topUpDone, setTopUpDone] = useState(false);

  const pct = inv.unitsPurchased > 0 ? (inv.unitsUsed / inv.unitsPurchased) * 100 : 0;
  const barColor = pct > 85 ? "bg-red-500" : pct > 60 ? "bg-yellow-500" : "bg-green-500";
  const daysColor = inv.estDaysRemaining === 0 ? "text-red-600" : inv.estDaysRemaining < 10 ? "text-yellow-600" : inv.estDaysRemaining < 30 ? "text-gray-700" : "text-green-600";
  const recurring = isRecurring(productKey);
  const rate = getRate(productKey, topUpUnits);
  const topUpCost = recurring ? getMRR(productKey, 200) : topUpUnits * rate;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900">{name}</h4>
        <div className="flex items-center gap-2">
          <StatusBadge status={inv.remaining === 0 ? "error" : inv.estDaysRemaining < 10 ? "warning" : "active"} label={inv.remaining === 0 ? "Depleted" : inv.estDaysRemaining < 10 ? "Low" : "Healthy"} />
          {!recurring && !showTopUp && (
            <button onClick={() => setShowTopUp(true)} className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100">Top Up</button>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{pct.toFixed(0)}% consumed</span>
          <span>{inv.remaining.toLocaleString()} remaining</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div><p className="text-xs text-gray-500">Purchased</p><p className="text-lg font-bold text-gray-900">{inv.unitsPurchased.toLocaleString()}</p></div>
        <div><p className="text-xs text-gray-500">Used</p><p className="text-lg font-bold text-gray-900">{inv.unitsUsed.toLocaleString()}</p></div>
        <div><p className="text-xs text-gray-500">Remaining</p><p className="text-lg font-bold text-gray-900">{inv.remaining.toLocaleString()}</p></div>
        <div><p className="text-xs text-gray-500">Daily Usage</p><p className="text-lg font-bold text-gray-900">{inv.dailyUsage.toLocaleString()}</p></div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
        <span className="text-sm text-gray-600">Est. Days Remaining</span>
        <span className={`text-2xl font-bold ${daysColor}`}>{inv.estDaysRemaining}</span>
      </div>

      {/* Top Up form */}
      {showTopUp && !topUpDone && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="text-sm font-semibold text-gray-900 mb-3">Add Inventory</h5>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">Additional Units</label>
              <input type="number" value={topUpUnits} onChange={(e) => setTopUpUnits(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Cost</p>
              <p className="text-lg font-bold text-gray-900">${topUpCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              <p className="text-[10px] text-gray-400">${rate.toFixed(2)}/unit</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => setShowTopUp(false)} className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button onClick={() => setTopUpDone(true)} className="px-3 py-1.5 text-xs text-white bg-blue-600 rounded-md hover:bg-blue-700">Confirm Top Up</button>
          </div>
        </div>
      )}
      {topUpDone && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center text-sm text-green-700">
          {topUpUnits.toLocaleString()} units added — invoice generated
        </div>
      )}
    </div>
  );
}

// ─── Activate Product Form ──────────────────────────────────
function ActivateProductForm({ activeKeys, onClose }: { activeKeys: string[]; onClose: () => void }) {
  const available = allProductKeys.filter((k) => !activeKeys.includes(k));
  const [selected, setSelected] = useState(available[0] || "");
  const [units, setUnits] = useState(10_000);
  const [dailyUsage, setDailyUsage] = useState(100);
  const [done, setDone] = useState(false);

  const recurring = isRecurring(selected);
  const rate = getRate(selected, units);
  const cost = recurring ? getMRR(selected, dailyUsage) : units * rate;

  if (done) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <svg className="w-10 h-10 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm font-medium text-green-800">{productLabels[selected]} activated with {recurring ? `$${cost.toLocaleString()}/mo` : `${units.toLocaleString()} units`}</p>
        <button onClick={onClose} className="mt-3 px-4 py-2 text-xs text-white bg-green-600 rounded-md hover:bg-green-700">Done</button>
      </div>
    );
  }

  if (available.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-sm text-gray-500">
        All products are already active for this company.
        <button onClick={onClose} className="ml-2 text-blue-600 hover:underline">Close</button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900">Activate Product</h4>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm">Cancel</button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Product</label>
          <select value={selected} onChange={(e) => setSelected(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
            {available.map((k) => <option key={k} value={k}>{productLabels[k]}</option>)}
          </select>
        </div>
        {!recurring && (
          <div>
            <label className="block text-sm text-gray-700 mb-1">Units to Purchase</label>
            <input type="number" value={units} onChange={(e) => setUnits(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
          </div>
        )}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Est. Daily Usage</label>
          <input type="number" value={dailyUsage} onChange={(e) => setDailyUsage(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </div>
        {/* Pricing summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{productLabels[selected]}</span>
            <span className="font-semibold text-gray-900">
              {recurring ? `$${cost.toLocaleString()}/mo` : `${units.toLocaleString()} units × $${rate.toFixed(2)} = $${cost.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            </span>
          </div>
          {!recurring && dailyUsage > 0 && (
            <p className="text-xs text-gray-400 mt-1">Est. {(units / dailyUsage).toFixed(0)} days at {dailyUsage}/day</p>
          )}
        </div>
        <button onClick={() => setDone(true)} className="w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Activate {productLabels[selected]}
        </button>
      </div>
    </div>
  );
}

// ─── Add Newsletter Form ────────────────────────────────────
function AddNewsletterForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center text-sm text-green-700">
        Newsletter &quot;{name}&quot; created — ready to configure products.
        <button onClick={onClose} className="ml-2 text-green-800 font-medium hover:underline">Done</button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
      <h4 className="font-semibold text-gray-900 mb-3">Add Newsletter</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Newsletter Name *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Morning Brief" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Integration</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option>Sailthru</option><option>Beehiiv</option><option>Iterable</option><option>Customer.io</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Est. Subscribers</label>
          <input type="number" placeholder="50000" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-3">
        <button onClick={onClose} className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
        <button onClick={() => name && setDone(true)} className={`px-3 py-1.5 text-xs text-white rounded-md ${name ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}>Add Newsletter</button>
      </div>
    </div>
  );
}

// ─── Generate Invoice ───────────────────────────────────────
function GenerateInvoice({ companyName, productEntries }: { companyName: string; productEntries: [string, ProductInventory][] }) {
  const [sent, setSent] = useState(false);

  const lineItems = productEntries.map(([key, inv]) => {
    const recurring = isRecurring(key);
    const rate = getRate(key, inv.unitsPurchased);
    const mrr = getMRR(key, inv.dailyUsage);
    const amount = recurring ? mrr : inv.unitsPurchased * rate;
    return { name: productLabels[key], units: inv.unitsPurchased, rate, amount, recurring, mrr };
  });
  const total = lineItems.reduce((s, li) => s + li.amount, 0);

  if (sent) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <svg className="w-10 h-10 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm font-medium text-green-800">Invoice sent to {companyName}</p>
        <p className="text-xs text-green-600 mt-1">Total: ${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-900">Invoice Preview</h4>
          <p className="text-xs text-gray-500">{companyName} · {new Date().toLocaleDateString()}</p>
        </div>
        <StatusBadge status="pending" label="Draft" />
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-5 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
            <th className="px-5 py-2 text-right text-xs font-semibold text-gray-500 uppercase">Qty / Type</th>
            <th className="px-5 py-2 text-right text-xs font-semibold text-gray-500 uppercase">Rate</th>
            <th className="px-5 py-2 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {lineItems.map((li) => (
            <tr key={li.name}>
              <td className="px-5 py-3 text-sm text-gray-900">{li.name}</td>
              <td className="px-5 py-3 text-sm text-gray-600 text-right">{li.recurring ? "Monthly" : li.units.toLocaleString() + " units"}</td>
              <td className="px-5 py-3 text-sm text-gray-600 text-right">{li.recurring ? `$${li.mrr.toLocaleString()}/mo` : `$${li.rate.toFixed(2)}/unit`}</td>
              <td className="px-5 py-3 text-sm font-medium text-gray-900 text-right">${li.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-50 border-t border-gray-200">
            <td colSpan={3} className="px-5 py-3 text-sm font-semibold text-gray-900 text-right">Total</td>
            <td className="px-5 py-3 text-lg font-bold text-gray-900 text-right">${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
          </tr>
        </tfoot>
      </table>
      <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-2">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">Download PDF</button>
        <button onClick={() => setSent(true)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Send Invoice</button>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────
export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { companies } = useAdminData();
  const company = companies.find((c) => c.id === id);
  const [showActivateProduct, setShowActivateProduct] = useState(false);
  const [showAddNewsletter, setShowAddNewsletter] = useState(false);
  const [showGenerateInvoice, setShowGenerateInvoice] = useState(false);

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
                <div className="flex justify-end">
                  <button onClick={() => setShowActivateProduct(true)} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">+ Activate Product</button>
                </div>
                {showActivateProduct && (
                  <ActivateProductForm activeKeys={productEntries.map(([k]) => k)} onClose={() => setShowActivateProduct(false)} />
                )}
                {productEntries.length === 0 && !showActivateProduct ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-sm text-gray-500">
                    No active products — click &quot;Activate Product&quot; to get started.
                  </div>
                ) : (
                  productEntries.map(([key, inv]) => (
                    <InventoryCard key={key} productKey={key} name={productLabels[key] || key} inv={inv} />
                  ))
                )}
              </div>
            ),
          },
          {
            label: "Newsletters",
            content: (
              <div>
                <div className="flex justify-end mb-4">
                  <button onClick={() => setShowAddNewsletter(true)} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">+ Add Newsletter</button>
                </div>
                {showAddNewsletter && <AddNewsletterForm onClose={() => setShowAddNewsletter(false)} />}
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
              </div>
            ),
          },
          {
            label: "Billing",
            content: (
              <div>
                <div className="flex justify-end mb-4">
                  <button onClick={() => setShowGenerateInvoice(!showGenerateInvoice)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Generate Invoice</button>
                </div>
                {showGenerateInvoice && (
                  <div className="mb-6">
                    <GenerateInvoice companyName={company.name} productEntries={productEntries} />
                  </div>
                )}
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Invoice History</h4>
                <DataTable
                  columns={[
                    { key: "id", label: "Invoice" },
                    { key: "date", label: "Date" },
                    { key: "amount", label: "Amount", align: "right" as const, render: (r: Record<string, unknown>) => `$${(r.amount as number).toLocaleString()}` },
                    { key: "status", label: "Status", render: (r: Record<string, unknown>) => <StatusBadge status={r.status as "paid"} /> },
                  ]}
                  data={companyInvoices as unknown as Record<string, unknown>[]}
                />
              </div>
            ),
          },
          {
            label: "Details",
            content: (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
