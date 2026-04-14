"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, AlertTriangle, Info, ChevronDown, ChevronRight } from "lucide-react";

interface Alert {
  type: "warning" | "error" | "info";
  message: string;
  link: string;
}

interface AlertGroup {
  severity: "error" | "warning" | "info";
  title: string;
  summary: string;
  items: Alert[];
  primaryLink: string;
  actionLabel: string;
}

function groupAlerts(alerts: Alert[]): AlertGroup[] {
  const errors = alerts.filter((a) => a.type === "error");
  const warnings = alerts.filter((a) => a.type === "warning");
  const infos = alerts.filter((a) => a.type === "info");

  const groups: AlertGroup[] = [];

  if (errors.length > 0) {
    // Sub-group errors by type
    const inventoryErrors = errors.filter((a) => a.message.includes("depleted"));
    const apiErrors = errors.filter((a) => a.message.includes("API") || a.message.includes("429") || a.message.includes("500"));
    const otherErrors = errors.filter((a) => !inventoryErrors.includes(a) && !apiErrors.includes(a));

    if (inventoryErrors.length > 0) {
      groups.push({
        severity: "error",
        title: `${inventoryErrors.length} depleted inventor${inventoryErrors.length > 1 ? "ies" : "y"}`,
        summary: inventoryErrors.map((a) => a.message.split(" — ")[0]).join(", "),
        items: inventoryErrors,
        primaryLink: inventoryErrors[0].link,
        actionLabel: "Fix Now",
      });
    }
    if (apiErrors.length > 0) {
      groups.push({
        severity: "error",
        title: `${apiErrors.length} API issue${apiErrors.length > 1 ? "s" : ""}`,
        summary: apiErrors[0].message,
        items: apiErrors,
        primaryLink: apiErrors[0].link,
        actionLabel: "View Logs",
      });
    }
    if (otherErrors.length > 0) {
      groups.push({
        severity: "error",
        title: `${otherErrors.length} critical issue${otherErrors.length > 1 ? "s" : ""}`,
        summary: otherErrors[0].message,
        items: otherErrors,
        primaryLink: otherErrors[0].link,
        actionLabel: "Fix Now",
      });
    }
  }

  if (warnings.length > 0) {
    const inventoryWarnings = warnings.filter((a) => a.message.includes("running low") || a.message.includes("stalled"));
    const otherWarnings = warnings.filter((a) => !inventoryWarnings.includes(a));

    if (inventoryWarnings.length > 0) {
      const companyNames = [...new Set(inventoryWarnings.map((a) => a.message.split(" — ")[0]))];
      groups.push({
        severity: "warning",
        title: `${inventoryWarnings.length} inventory alert${inventoryWarnings.length > 1 ? "s" : ""} across ${companyNames.length} compan${companyNames.length > 1 ? "ies" : "y"}`,
        summary: companyNames.join(", "),
        items: inventoryWarnings,
        primaryLink: inventoryWarnings[0].link,
        actionLabel: "Review",
      });
    }
    if (otherWarnings.length > 0) {
      groups.push({
        severity: "warning",
        title: `${otherWarnings.length} warning${otherWarnings.length > 1 ? "s" : ""}`,
        summary: otherWarnings[0].message,
        items: otherWarnings,
        primaryLink: otherWarnings[0].link,
        actionLabel: "Review",
      });
    }
  }

  if (infos.length > 0) {
    groups.push({
      severity: "info",
      title: `${infos.length} notice${infos.length > 1 ? "s" : ""}`,
      summary: infos[0].message,
      items: infos,
      primaryLink: infos[0].link,
      actionLabel: "View",
    });
  }

  return groups;
}

const severityConfig = {
  error: { icon: AlertCircle, bg: "bg-red-50", border: "border-red-200", text: "text-red-700", dot: "bg-red-500", btnBg: "bg-red-600 text-white hover:bg-red-700" },
  warning: { icon: AlertTriangle, bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-500", btnBg: "bg-amber-100 text-amber-800 hover:bg-amber-200" },
  info: { icon: Info, bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-600", dot: "bg-gray-400", btnBg: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
};

function AlertGroupCard({ group }: { group: AlertGroup }) {
  const [expanded, setExpanded] = useState(false);
  const config = severityConfig[group.severity];
  const Icon = config.icon;

  return (
    <div className={`rounded-lg border ${config.border} ${config.bg} overflow-hidden shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]`}>
      <div className="flex items-start gap-3 p-4">
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.text}`} />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">{group.title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{group.summary}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={group.primaryLink}
            className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${config.btnBg}`}
          >
            {group.actionLabel}
          </Link>
          {group.items.length > 1 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <span>{group.items.length}</span>
            </button>
          )}
        </div>
      </div>

      {expanded && group.items.length > 1 && (
        <div className="border-t border-gray-100">
          {group.items.map((item, i) => (
            <Link
              key={i}
              href={item.link}
              className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 last:border-b-0 hover:bg-white/50 transition-colors"
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
              <span className="text-xs text-gray-600 flex-1">{item.message}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminGroupedAlerts({ alerts }: { alerts: Alert[] }) {
  const groups = groupAlerts(alerts);

  if (groups.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Alerts & Action Items</h2>
      <div className="space-y-2">
        {groups.map((group, i) => (
          <AlertGroupCard key={i} group={group} />
        ))}
      </div>
    </div>
  );
}
