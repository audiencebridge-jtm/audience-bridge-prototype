"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { logEntries, newsletters } from "@/lib/mock-data";

export default function LogsPage() {
  const [productFilter, setProductFilter] = useState("All");
  const [responseFilter, setResponseFilter] = useState("All");

  const filtered = logEntries.filter((log) => {
    if (productFilter !== "All" && log.product !== productFilter) return false;
    if (responseFilter !== "All" && log.responseCode.toString() !== responseFilter) return false;
    return true;
  });

  const products = ["All", ...new Set(logEntries.map((l) => l.product))];
  const responses = ["All", ...new Set(logEntries.map((l) => l.responseCode.toString()))];

  return (
    <div>
      <PageHeader
        title="System Logs"
        subtitle="API activity across all products"
        actions={
          <button className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600">
            Export CSV
          </button>
        }
      />

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 font-medium">Product</label>
          <select value={productFilter} onChange={(e) => setProductFilter(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-md text-sm">
            {products.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 font-medium">Response</label>
          <select value={responseFilter} onChange={(e) => setResponseFilter(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-md text-sm">
            {responses.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Timestamp</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Newsletter</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ESP</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Cost</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Response</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-600 font-mono">{log.timestamp}</td>
                <td className="px-4 py-3 text-sm"><StatusBadge status="info" label={log.product} /></td>
                <td className="px-4 py-3 text-sm">
                  {(() => {
                    const nl = newsletters.find((n) => n.name === log.newsletter);
                    return nl ? (
                      <Link href={`/admin/newsletters/${nl.id}`} className="text-blue-600 hover:underline">{log.newsletter}</Link>
                    ) : (
                      <span className="text-gray-700">{log.newsletter}</span>
                    );
                  })()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{log.email}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{log.esp}</td>
                <td className="px-4 py-3 text-sm text-gray-700 text-right">${log.costPerLead.toFixed(2)}</td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge
                    status={log.responseCode === 200 ? "active" : log.responseCode === 429 ? "warning" : "error"}
                    label={`${log.responseCode} ${log.responseCode === 200 ? "OK" : log.responseCode === 429 ? "Rate Limited" : "Error"}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-gray-200 text-sm text-gray-500">
          Showing {filtered.length} of {logEntries.length} entries
        </div>
      </div>
    </div>
  );
}
