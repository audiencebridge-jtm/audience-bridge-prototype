import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { invoices } from "@/lib/mock-data";

export default function PortalBillingPage() {
  const myInvoices = invoices.filter((i) => i.company === "Daily Trends Media");

  return (
    <div>
      <PageHeader title="Billing" subtitle="Your plan, usage, and invoices" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard title="Current Plan" value="Enterprise" subtitle="$4,500/month" />
        <SummaryCard title="Usage This Period" value="65%" subtitle="Smart Lead units, validations" />
        <SummaryCard title="Next Billing Date" value="May 1, 2026" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Usage Breakdown</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Smart Lead Units</span>
              <span className="text-gray-900 font-medium">3,850 / 5,000</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: "77%" }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Email Validations</span>
              <span className="text-gray-900 font-medium">18,200 / 50,000</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: "36%" }} />
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Invoice History</h3>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Invoice</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {myInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{inv.id}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{inv.date}</td>
                <td className="px-4 py-3 text-sm text-gray-700 text-right">${inv.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-center"><StatusBadge status={inv.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
