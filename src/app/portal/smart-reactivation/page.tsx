"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard } from "@/components/shared/MetricCard";
import { TabNav } from "@/components/shared/TabNav";
import { ProductGate } from "@/components/portal/ProductGate";
import { useNewsletter } from "@/context/NewsletterContext";
import {
  reactivationRecords,
  reactivatedSubscribers,
  reactivationSettings,
} from "@/lib/mock-data";

function UploadTab() {
  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Upload Dormant Subscribers</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
          <div className="text-gray-400 mb-3">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">Drag & drop your CSV file here, or click to browse</p>
          <p className="text-xs text-gray-400">Expected format: email, first_name, last_name</p>
          <input type="file" accept=".csv" className="hidden" />
        </div>
        <button disabled className="mt-4 px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md opacity-50 cursor-not-allowed">
          Upload
        </button>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Match Criteria</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Match Method</label>
            <input type="text" readOnly value={reactivationSettings.matchCriteria} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Min Dormant Days</label>
            <input type="text" readOnly value={reactivationSettings.minDormantDays} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Re-engagement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Re-engagement Window</label>
            <input type="text" readOnly value={reactivationSettings.reEngagementWindow} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Auto-reactivate</label>
            <input type="text" readOnly value={reactivationSettings.autoReactivate ? "Enabled" : "Disabled"} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Notifications</h3>
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={reactivationSettings.notifyOnMatch} readOnly className="w-4 h-4 text-blue-600 rounded" />
          <span className="text-sm text-gray-700">Notify me when new matches are found</span>
        </label>
      </div>
    </div>
  );
}

function MatchesTab({ records }: { records: typeof reactivationRecords }) {
  const totalDormant = records.reduce((s, r) => s + r.dormantRecords, 0);
  const totalMatched = records.reduce((s, r) => s + r.matchedRecords, 0);
  const recoveryRate = totalDormant > 0 ? ((totalMatched / totalDormant) * 100).toFixed(1) : "0";

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard title="Dormant Records" value={totalDormant.toLocaleString()} />
        <SummaryCard title="Matched / Recovered" value={totalMatched.toLocaleString()} trend={{ value: "+22%", positive: true }} />
        <SummaryCard title="Recovery Rate" value={`${recoveryRate}%`} />
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Newsletter</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Dormant</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Matched</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Recovery Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((r, i) => {
              const rate = r.dormantRecords > 0 ? ((r.matchedRecords / r.dormantRecords) * 100).toFixed(1) : "0";
              return (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.newsletter}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{r.dormantRecords.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{r.matchedRecords.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={Number(rate) > 10 ? "text-green-600 font-semibold" : "text-gray-500"}>{rate}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReActivatedTab() {
  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Newsletter</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Re-activated</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reactivatedSubscribers.map((sub) => (
              <tr key={sub.email + sub.reactivatedDate} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-mono text-gray-700">{sub.email}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{sub.newsletter}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{sub.reactivatedDate}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{sub.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function PortalSmartReactivationPage() {
  const { selectedNewsletter } = useNewsletter();
  const myRecords = selectedNewsletter
    ? reactivationRecords.filter((r) => r.newsletter === selectedNewsletter.name)
    : reactivationRecords.filter((r) => r.company === "Daily Trends Media");

  const subtitle = selectedNewsletter
    ? `Reactivation for ${selectedNewsletter.name}`
    : "Turn dormant subscribers back into engaged subscribers";

  return (
    <ProductGate productKey="smartReactivation">
    <div>
      <PageHeader title="Smart Reactivation" subtitle={subtitle} />
      <TabNav
        defaultTab={2}
        tabs={[
          { label: "Upload", content: <UploadTab /> },
          { label: "Settings", content: <SettingsTab /> },
          { label: "Matches", content: <MatchesTab records={myRecords} /> },
          { label: "Re-Activated", content: <ReActivatedTab /> },
        ]}
      />
    </div>
    </ProductGate>
  );
}
