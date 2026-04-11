import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard, MetricCard } from "@/components/shared/MetricCard";
import { dashboardMetrics } from "@/lib/mock-data";

export default function EmailValidationPage() {
  const metrics = dashboardMetrics.productPulse.emailValidation;

  // Email validation is bundled with Smart Lead — revenue tracked there
  const totalValidated = metrics.last24Hours * 30; // approximate monthly
  const validRate = 82;

  return (
    <div>
      <PageHeader title="Email Validation" subtitle="Validate email addresses for list hygiene and deliverability" />

      {/* Business KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Revenue" value="Bundled" subtitle="Included with Smart Lead" />
        <SummaryCard title="Validation Rate" value={`${validRate}%`} subtitle="of all emails pass" />
        <SummaryCard title="Est. Monthly Volume" value={totalValidated.toLocaleString()} />
        <SummaryCard title="Invalid Catch Rate" value="12%" trend={{ value: "-1.2%", positive: true }} subtitle="vs last month" />
      </div>

      {/* Product Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Last 5 Minutes" value={metrics.last5Min} />
        <SummaryCard title="Last Hour" value={metrics.lastHour} />
        <SummaryCard title="Last 24 Hours" value={metrics.last24Hours.toLocaleString()} />
        <SummaryCard title="Yesterday" value={metrics.yesterday.toLocaleString()} />
      </div>

      <MetricCard
        title="Validation Operations"
        metrics={[
          { label: "Avg/Hour", value: Math.round(metrics.last24Hours / 24).toLocaleString(), color: "text-blue-600" },
          { label: "All Time", value: "2.1M", color: "text-green-600" },
          { label: "Accuracy", value: "99.4%", color: "text-green-500" },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
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
                <span className="text-sm text-gray-600">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Upload for Validation</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-sm text-gray-600">Drop a CSV file to validate email addresses</p>
            <button className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
              Select File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
