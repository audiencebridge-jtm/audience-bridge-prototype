"use client";

import { use } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TabNav } from "@/components/shared/TabNav";
import { SimpleLineChart } from "@/components/portal/SimpleLineChart";
import { getNewsletterById, clickerGrowthData } from "@/lib/mock-data";

export default function PortalNewsletterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const newsletter = getNewsletterById(id);

  if (!newsletter) return <div className="p-8 text-gray-500">Newsletter not found</div>;

  const chartData = clickerGrowthData.map((d) => ({ label: d.day, value: d.clickers }));

  return (
    <div>
      <div className="mb-2">
        <Link href="/portal/newsletters" className="text-sm text-blue-600 hover:underline">← Back to My Newsletters</Link>
      </div>
      <PageHeader title={newsletter.name} actions={<StatusBadge status={newsletter.status} />} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Subscribers" value={newsletter.subscribers.toLocaleString()} trend={{ value: "+5.2%", positive: true }} />
        <SummaryCard title="30-Day Clickers" value={newsletter.thirtyDayClickers.toLocaleString()} />
        <SummaryCard title="Engagement Rate" value={`${newsletter.engagementRate}%`} />
        <SummaryCard title="Active Products" value={newsletter.activeProducts.length} />
      </div>

      <TabNav
        tabs={[
          {
            label: "Overview",
            content: (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">30 Day Clickers Growth</h3>
                  <SimpleLineChart data={chartData} height={200} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-700">97.4%</p>
                    <p className="text-sm text-gray-500 mt-1">Delivery Rate</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-700">1.8%</p>
                    <p className="text-sm text-gray-500 mt-1">Bounce Rate</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-700">0.02%</p>
                    <p className="text-sm text-gray-500 mt-1">Complaint Rate</p>
                  </div>
                </div>
              </div>
            ),
          },
          {
            label: "Products",
            content: (
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
                {newsletter.activeProducts.map((p) => (
                  <div key={p} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium">{p}</span>
                    <StatusBadge status="active" />
                  </div>
                ))}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
