import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard } from "@/components/shared/MetricCard";
import { apiCredentials } from "@/lib/mock-data";

export default function PortalApiCredentialsPage() {
  return (
    <div>
      <PageHeader title="API Credentials" subtitle="Manage your API keys and webhooks" />

      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">API Key</h3>
          <div className="flex items-center gap-3">
            <code className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm font-mono text-gray-700">
              {apiCredentials.apiKey}
            </code>
            <button className="px-4 py-2.5 bg-white border border-gray-200 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50">
              Copy
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">API Secret</h3>
          <div className="flex items-center gap-3">
            <code className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm font-mono text-gray-700">
              {apiCredentials.apiSecret}
            </code>
            <button className="px-4 py-2.5 bg-white border border-gray-200 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50">
              Reveal
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Webhook URLs</h3>
          {apiCredentials.webhookUrls.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 mb-3">No webhook URLs configured</p>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                + Add Webhook URL
              </button>
            </div>
          ) : null}
        </div>

        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">API Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard title="Requests Today" value={apiCredentials.usage.requestsToday.toLocaleString()} />
          <SummaryCard title="Requests This Month" value={apiCredentials.usage.requestsThisMonth.toLocaleString()} />
          <SummaryCard title="Monthly Limit" value={apiCredentials.usage.limit.toLocaleString()} subtitle={`${((apiCredentials.usage.requestsThisMonth / apiCredentials.usage.limit) * 100).toFixed(1)}% used`} />
        </div>
      </div>
    </div>
  );
}
