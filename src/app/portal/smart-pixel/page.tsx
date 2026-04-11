"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard } from "@/components/shared/MetricCard";
import { ProductGate } from "@/components/portal/ProductGate";
import { useNewsletter } from "@/context/NewsletterContext";
import { dashboardMetrics } from "@/lib/mock-data";

export default function PortalSmartPixelPage() {
  const { selectedNewsletter } = useNewsletter();
  const m = dashboardMetrics.productPulse.smartPixel;

  const subtitle = selectedNewsletter
    ? `Pixel tracking for ${selectedNewsletter.name}`
    : "Track pre-subscribe behavior to capture intent-rich visitors";

  return (
    <ProductGate productKey="smartPixel">
    <div>
      <PageHeader title="Smart Pixel" subtitle={subtitle} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="New Subs Today" value={m.today} trend={{ value: "+8%", positive: true }} />
        <SummaryCard title="This Week" value={m.thisWeek.toLocaleString()} />
        <SummaryCard title="This Month" value={m.thisMonth.toLocaleString()} />
        <SummaryCard title="All Time" value={m.allTime.toLocaleString()} />
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Top Performing Pages</h3>
        <p className="text-sm text-gray-500">Page-level tracking data will appear here once Smart Pixel is configured.</p>
      </div>
    </div>
    </ProductGate>
  );
}
