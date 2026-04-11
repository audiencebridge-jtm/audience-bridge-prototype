"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard } from "@/components/shared/MetricCard";
import { ProductGate } from "@/components/portal/ProductGate";
import { useNewsletter } from "@/context/NewsletterContext";
import { dashboardMetrics } from "@/lib/mock-data";

export default function PortalEmailValidationPage() {
  const { selectedNewsletter } = useNewsletter();
  const m = dashboardMetrics.productPulse.emailValidation;

  const subtitle = selectedNewsletter
    ? `Validation results for ${selectedNewsletter.name}`
    : "Validate email addresses for list hygiene";

  return (
    <ProductGate productKey="emailValidation">
    <div>
      <PageHeader title="Email Validation" subtitle={subtitle} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Last 5 Minutes" value={m.last5Min} />
        <SummaryCard title="Last Hour" value={m.lastHour} />
        <SummaryCard title="Last 24 Hours" value={m.last24Hours.toLocaleString()} />
        <SummaryCard title="Yesterday" value={m.yesterday.toLocaleString()} />
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Validation Results (Last 24h)</h3>
        <div className="space-y-3">
          {[
            { label: "Valid", pct: 82, color: "bg-green-500" },
            { label: "Invalid", pct: 12, color: "bg-red-500" },
            { label: "Risky", pct: 4, color: "bg-yellow-500" },
            { label: "Unknown", pct: 2, color: "bg-gray-400" },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center">
              <span className="text-sm text-gray-600 w-20">{item.label}</span>
              <div className="flex items-center gap-2 flex-1 ml-4">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
                <span className="text-sm font-medium text-gray-700 w-10 text-right">{item.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </ProductGate>
  );
}
