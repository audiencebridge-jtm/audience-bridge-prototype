import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard, SummaryCard } from "@/components/shared/MetricCard";
import { dashboardMetrics } from "@/lib/mock-data";

export default function ApiEventsPage() {
  const { systemMetrics } = dashboardMetrics;

  return (
    <div>
      <PageHeader title="API & Events" subtitle="System-wide event tracking and API metrics" />

      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Events Today</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard title="Sent" value={systemMetrics.eventsToday.sent.toLocaleString()} />
        <SummaryCard title="Opens" value={systemMetrics.eventsToday.opens.toLocaleString()} />
        <SummaryCard title="Clicks" value={systemMetrics.eventsToday.clicks.toLocaleString()} />
      </div>

      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Click Events</h3>
      <div className="mb-6">
        <MetricCard
          title="Click Events"
          metrics={[
            { label: "Today", value: systemMetrics.clickEvents.today, color: "text-blue-600" },
            { label: "This Week", value: systemMetrics.clickEvents.thisWeek, color: "text-blue-500" },
            { label: "This Month", value: systemMetrics.clickEvents.thisMonth, color: "text-green-600" },
            { label: "All Time", value: systemMetrics.clickEvents.allTime, color: "text-yellow-600" },
          ]}
        />
      </div>

      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Partner Click Signals</h3>
      <div className="mb-6">
        <MetricCard
          title="Real-time Partner Click Signals"
          metrics={[
            { label: "Today", value: systemMetrics.partnerClickSignals.today, color: "text-blue-600" },
            { label: "This Week", value: systemMetrics.partnerClickSignals.thisWeek, color: "text-blue-500" },
            { label: "This Month", value: systemMetrics.partnerClickSignals.thisMonth, color: "text-green-600" },
            { label: "All Time", value: systemMetrics.partnerClickSignals.allTime, color: "text-yellow-600" },
          ]}
        />
      </div>

      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">CTO Partners</h3>
      <MetricCard
        title="CTO Partners"
        metrics={[
          { label: "Today", value: systemMetrics.ctoPartners.today, color: "text-blue-600" },
          { label: "This Week", value: systemMetrics.ctoPartners.thisWeek, color: "text-blue-500" },
          { label: "This Month", value: systemMetrics.ctoPartners.thisMonth, color: "text-green-600" },
          { label: "All Time", value: systemMetrics.ctoPartners.allTime, color: "text-yellow-600" },
        ]}
      />
    </div>
  );
}
