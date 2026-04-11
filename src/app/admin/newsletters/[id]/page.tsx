"use client";

import { use } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TabNav } from "@/components/shared/TabNav";
import { getNewsletterById } from "@/lib/mock-data";

export default function NewsletterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const newsletter = getNewsletterById(id);

  if (!newsletter) {
    return <div className="p-8 text-gray-500">Newsletter not found</div>;
  }

  return (
    <div>
      <div className="mb-2">
        <Link href="/admin/newsletters" className="text-sm text-blue-600 hover:underline">
          ← Back to Newsletters
        </Link>
      </div>
      <PageHeader
        title={newsletter.name}
        subtitle={`${newsletter.companyName} · ${newsletter.integration}`}
        actions={<StatusBadge status={newsletter.status} />}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Subscribers" value={newsletter.subscribers.toLocaleString()} trend={{ value: "+5.2%", positive: true }} />
        <SummaryCard title="30-Day Clickers" value={newsletter.thirtyDayClickers.toLocaleString()} />
        <SummaryCard title="Engagement Rate" value={`${newsletter.engagementRate}%`} trend={{ value: "+1.3%", positive: true }} />
        <SummaryCard title="Active Products" value={newsletter.activeProducts.length} />
      </div>

      <TabNav
        tabs={[
          {
            label: "Overview",
            content: (
              <div className="space-y-6">
                {/* Details + Products */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Newsletter Details</h3>
                    <dl className="space-y-3">
                      <div className="flex justify-between"><dt className="text-sm text-gray-500">Owner</dt><dd className="text-sm text-gray-900">{newsletter.owner}</dd></div>
                      <div className="flex justify-between"><dt className="text-sm text-gray-500">Integration</dt><dd className="text-sm text-gray-900">{newsletter.integration}</dd></div>
                      <div className="flex justify-between"><dt className="text-sm text-gray-500">Company</dt><dd className="text-sm text-gray-900">{newsletter.companyName}</dd></div>
                      <div className="flex justify-between"><dt className="text-sm text-gray-500">Created</dt><dd className="text-sm text-gray-900">{newsletter.createdAt}</dd></div>
                    </dl>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Active Products</h3>
                    <div className="space-y-2">
                      {newsletter.activeProducts.map((product) => (
                        <div key={product} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <span className="text-sm font-medium text-gray-900">{product}</span>
                          <StatusBadge status="active" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Delivery Stats */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Delivery Performance</h3>
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
              </div>
            ),
          },
          {
            label: "Activity Log",
            content: (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { action: `Smart Lead delivered 253 leads to ${newsletter.name}`, time: "2 hours ago" },
                    { action: `Smart Feed processed 42 records for ${newsletter.name}`, time: "5 hours ago" },
                    { action: `Engagement rate updated to ${newsletter.engagementRate}%`, time: "1 day ago" },
                    { action: `Smart Reactivation matched 145 records for ${newsletter.name}`, time: "1 day ago" },
                  ].map((entry, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-700">{entry.action}</span>
                      <span className="text-xs text-gray-400 shrink-0 ml-4">{entry.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
