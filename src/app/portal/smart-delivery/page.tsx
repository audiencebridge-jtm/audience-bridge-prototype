"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TabNav } from "@/components/shared/TabNav";
import { ProductGate } from "@/components/portal/ProductGate";
import { useNewsletter } from "@/context/NewsletterContext";
import {
  feedDomains,
  deliveryHealthChecks,
  postmasterMetrics,
  deliverabilityScore,
} from "@/lib/mock-data";

function DomainStatsTab() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard title="Inbox Placement" value="94.1%" trend={{ value: "+1.2%", positive: true }} />
        <SummaryCard title="Bounce Rate" value="1.8%" trend={{ value: "-0.3%", positive: true }} />
        <SummaryCard title="Complaint Rate" value="0.02%" />
      </div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Domain Breakdown</h3>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Domain</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Volume</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Engagement Rate</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Health</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {feedDomains.map((d) => (
              <tr key={d.name} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{d.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700 text-right">{d.availability.toLocaleString()}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold text-white ${
                    d.engagementRate >= 30 ? "bg-green-500" : d.engagementRate >= 20 ? "bg-yellow-500" : "bg-red-500"
                  }`}>{d.engagementRate}%</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block w-3 h-3 rounded-full ${
                    d.engagementRate >= 25 ? "bg-green-500" : d.engagementRate >= 15 ? "bg-yellow-500" : "bg-red-500"
                  }`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PostmasterTab() {
  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Google Postmaster Tools</h3>
          <StatusBadge status="active" />
        </div>
        <p className="text-sm text-gray-500 mb-4">Connected and syncing domain reputation data.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Spam Rate" value={postmasterMetrics.spamRate} />
        <SummaryCard title="IP Reputation" value={postmasterMetrics.ipReputation} />
        <SummaryCard title="Domain Reputation" value={postmasterMetrics.domainReputation} />
        <SummaryCard title="Authentication" value={postmasterMetrics.authentication} />
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Reputation Trend</h3>
        <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-400">Postmaster data visualization</p>
        </div>
      </div>
    </div>
  );
}

function EmailDeliverabilityTab() {
  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Deliverability Score</p>
            <p className="text-5xl font-bold text-gray-900">{deliverabilityScore.score}<span className="text-2xl text-gray-400">/100</span></p>
          </div>
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
            <span className="text-2xl font-bold text-green-700">{deliverabilityScore.grade}</span>
          </div>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Sender Health Check</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {deliveryHealthChecks.map((check) => (
          <div key={check.label} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">{check.label}</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              check.status === "pass"
                ? "bg-green-50 text-green-700"
                : check.status === "warning"
                ? "bg-yellow-50 text-yellow-700"
                : "bg-red-50 text-red-700"
            }`}>
              {check.status === "pass" ? "Pass" : check.status === "warning" ? "Warning" : "Fail"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatWithChrisTab() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Chat with Chris</h3>
        <p className="text-xs text-gray-500">Live chat with your account manager</p>
      </div>
      <div className="p-5 min-h-[300px] bg-gray-50 space-y-3">
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">C</div>
          <div className="bg-white rounded-lg p-3 border border-gray-200 max-w-sm">
            <p className="text-sm text-gray-700">Hey! I&apos;m here to help with any deliverability questions. How can I assist you today?</p>
            <p className="text-[10px] text-gray-400 mt-1">Today, 9:00 AM</p>
          </div>
        </div>
      </div>
      <div className="px-5 py-3 border-t border-gray-200 flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          disabled
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 text-gray-400"
        />
        <button disabled className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md opacity-50 cursor-not-allowed">
          Send
        </button>
      </div>
    </div>
  );
}

export default function PortalSmartDeliveryPage() {
  const { selectedNewsletter } = useNewsletter();
  const subtitle = selectedNewsletter
    ? `Deliverability for ${selectedNewsletter.name}`
    : "Your email deliverability performance";

  return (
    <ProductGate productKey="smartDelivery">
    <div>
      <PageHeader
        title="Smart Delivery"
        subtitle={subtitle}
        actions={
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50">
              Generate PDF Report
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
              Analyze Email
            </button>
          </div>
        }
      />
      <TabNav
        tabs={[
          { label: "Domain Stats", content: <DomainStatsTab /> },
          { label: "Postmaster", content: <PostmasterTab /> },
          { label: "Email Deliverability", content: <EmailDeliverabilityTab /> },
          { label: "Chat with Chris", content: <ChatWithChrisTab /> },
        ]}
      />
    </div>
    </ProductGate>
  );
}
