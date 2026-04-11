"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ProductGate } from "@/components/portal/ProductGate";
import { TabNav } from "@/components/shared/TabNav";
import { SimpleLineChart } from "@/components/portal/SimpleLineChart";
import { useNewsletter } from "@/context/NewsletterContext";
import { dashboardMetrics, feedSources, getFeedSourcesByNewsletter, clickerGrowthData, domainGroups, type FeedSource } from "@/lib/mock-data";

type SourceFilter = "all" | "smart-product" | "paid" | "organic";

const filterLabels: Record<SourceFilter, string> = {
  all: "All Sources",
  "smart-product": "Smart Products",
  paid: "Paid",
  organic: "Organic",
};

function FeedStatusBadge({ status }: { status: FeedSource["feedStatus"] }) {
  if (status === "on") return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">Feed on</span>;
  if (status === "paused") return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700">Paused</span>;
  return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">Feed off</span>;
}

function SourcesTab({ sources }: { sources: FeedSource[] }) {
  const [filter, setFilter] = useState<SourceFilter>("all");

  const filtered = filter === "all" ? sources : sources.filter((s) => s.type === filter);
  const totalSources = sources.length;
  const totalSent = sources.reduce((s, src) => s + src.recordsSent, 0);
  const avgEng = sources.length > 0 ? (sources.reduce((s, src) => s + src.engRate, 0) / sources.length).toFixed(1) : "0";
  const avgCpes = sources.length > 0 ? (sources.reduce((s, src) => s + src.cpes, 0) / sources.length).toFixed(2) : "0";

  return (
    <div>
      {/* Overall Performance */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Overall Performance</h3>
        <div className="flex gap-1">
          {["7D", "30D", "60D", "90D", "All"].map((period) => (
            <button key={period} className={`px-3 py-1 text-xs font-medium rounded border ${
              period === "30D" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}>{period}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Total Sources" value={totalSources} />
        <SummaryCard title="Total Leads" value={totalSent.toLocaleString()} trend={{ value: "+55.4%", positive: true }} />
        <SummaryCard title="Engagement" value={`${avgEng}%`} trend={{ value: "-2.3%", positive: false }} />
        <SummaryCard title="CPES" value={`$${avgCpes}`} trend={{ value: "-4.3%", positive: true }} />
      </div>

      {/* Source Management */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">Source Management</h3>
          <p className="text-xs text-gray-500 mt-0.5">View, compare, and manage data sources powering your newsletters.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {(Object.keys(filterLabels) as SourceFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border ${
              filter === f ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {filterLabels[f]}
            <span className="ml-1 text-[10px] opacity-70">
              ({f === "all" ? sources.length : sources.filter((s) => s.type === f).length})
            </span>
          </button>
        ))}
      </div>

      {/* Sources table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Source</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Eng. Rate</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">CPL</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">CPES</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Available</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Records Sent</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Failed</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Volume</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Feed Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((src) => (
                <tr key={src.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                        src.type === "smart-product" ? "bg-blue-500" : src.type === "paid" ? "bg-purple-500" : "bg-green-500"
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{src.name}</p>
                        <p className="text-[10px] text-gray-400">{src.newsletter}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{src.engRate}%</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">${src.cpl.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">${src.cpes.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{src.available > 0 ? src.available.toLocaleString() : "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{src.recordsSent.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={src.recordsFailed > 0 ? "text-red-600 font-medium" : "text-gray-400"}>
                      {src.recordsFailed.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm font-medium ${src.volume >= 80 ? "text-green-600" : src.volume >= 40 ? "text-yellow-600" : "text-red-600"}`}>
                      {src.volume}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <FeedStatusBadge status={src.feedStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-200 text-sm text-gray-500">
          Showing {filtered.length} of {sources.length} sources
        </div>
      </div>
    </div>
  );
}

function FeedManagementTab() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ Gmail: true });
  const [viewMode, setViewMode] = useState<"domain" | "source">("domain");

  const toggle = (domain: string) => {
    setExpanded((prev) => ({ ...prev, [domain]: !prev[domain] }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">Feed Management</h3>
          <p className="text-xs text-gray-500 mt-0.5">Adjust feed volumes, pause sources, and monitor engagement trends.</p>
        </div>
        <div className="flex bg-gray-100 rounded-md p-0.5">
          <button
            onClick={() => setViewMode("domain")}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              viewMode === "domain" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            View by Domain Group
          </button>
          <button
            onClick={() => setViewMode("source")}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              viewMode === "source" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            View by Data Source
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {domainGroups.map((group) => {
          const isOpen = expanded[group.domain] ?? false;
          const totalVolume = group.sources.reduce((s, src) => s + src.volume, 0);

          return (
            <div key={group.domain} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Domain header — always visible */}
              <button
                onClick={() => toggle(group.domain)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="font-semibold text-gray-900">{group.domain}</span>
                </div>
                <div className="flex items-center gap-8 text-sm">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400">Engagement Rate</p>
                    <p className={`font-semibold ${group.engagementRate >= 8 ? "text-green-600" : group.engagementRate >= 5 ? "text-gray-700" : "text-red-600"}`}>
                      {group.engagementRate}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400">Data Fed</p>
                    <p className="text-gray-700">
                      <span className="text-green-600">&#9650;</span> {group.dataFed}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400">Optimal Volume</p>
                    <p className="font-semibold text-gray-900">{group.optimalVolume.toLocaleString()}</p>
                  </div>
                  <span className={`w-3 h-3 rounded-full ${group.engagementRate >= 7 ? "bg-green-500" : group.engagementRate >= 4 ? "bg-yellow-500" : "bg-red-500"}`} />
                </div>
              </button>

              {/* Expanded: source breakdown */}
              {isOpen && (
                <div className="border-t border-gray-200">
                  <div className="px-5 py-2 bg-gray-50">
                    <p className="text-xs font-semibold text-gray-500">Source Performance Breakdown</p>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="px-5 py-2 text-left text-[10px] font-semibold text-gray-400 uppercase">Source Name</th>
                        <th className="px-5 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase">Availability</th>
                        <th className="px-5 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase">Engagement Rate</th>
                        <th className="px-5 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase">Volume</th>
                        <th className="px-5 py-2 text-center text-[10px] font-semibold text-gray-400 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {group.sources.map((src, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-5 py-3 text-sm text-gray-900">{src.name}</td>
                          <td className="px-5 py-3 text-sm text-gray-700 text-right">{src.availability > 0 ? src.availability.toLocaleString() : "0"}</td>
                          <td className="px-5 py-3 text-right">
                            <span className={`text-sm font-medium ${src.engagementRate >= 10 ? "text-green-600" : "text-gray-700"}`}>
                              {src.engagementRate}%
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <input
                              type="number"
                              defaultValue={src.volume}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </td>
                          <td className="px-5 py-3 text-center">
                            <button className="text-gray-400 hover:text-gray-600" title="Pause source">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {/* Total row */}
                      <tr className="bg-gray-50 border-t border-gray-200">
                        <td className="px-5 py-3 text-sm font-semibold text-gray-900">Total</td>
                        <td className="px-5 py-3 text-sm font-semibold text-gray-900 text-right">
                          {group.sources.reduce((s, src) => s + src.availability, 0).toLocaleString()}
                        </td>
                        <td className="px-5 py-3"></td>
                        <td className="px-5 py-3 text-sm font-semibold text-green-600 text-right">
                          {totalVolume.toLocaleString()}
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-[10px] text-gray-400">Adjust volumes and click Save to apply changes.</p>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
                      <button className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700">Save Adjustments</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GrowthTab() {
  const chartData = clickerGrowthData.map((d) => ({ label: d.day, value: d.clickers }));

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Subscriber Growth Trend (30 Days)</h3>
        <SimpleLineChart data={chartData} height={250} />
      </div>
    </div>
  );
}

export default function PortalSmartFeedPage() {
  const { selectedNewsletter } = useNewsletter();
  const m = dashboardMetrics.productPulse.smartFeed;

  const sources = selectedNewsletter
    ? getFeedSourcesByNewsletter(selectedNewsletter.name)
    : feedSources;

  const subtitle = selectedNewsletter
    ? `Source management for ${selectedNewsletter.name}`
    : "View, compare, and manage all growth sources powering your newsletters";

  return (
    <ProductGate productKey="smartFeed">
    <div>
      <PageHeader title="Smart Feed" subtitle={subtitle} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Today" value={m.last24Hours.toLocaleString()} trend={{ value: "+1.8%", positive: true }} />
        <SummaryCard title="This Week" value={(m.last24Hours * 7).toLocaleString()} />
        <SummaryCard title="This Month" value={(m.last24Hours * 30).toLocaleString()} />
        <SummaryCard title="This Year" value={(m.last24Hours * 365).toLocaleString()} />
      </div>

      <TabNav
        tabs={[
          { label: "Sources", content: <SourcesTab sources={sources} /> },
          { label: "Feed Management", content: <FeedManagementTab /> },
          { label: "Growth", content: <GrowthTab /> },
        ]}
      />
    </div>
    </ProductGate>
  );
}
