"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { notifications, groupNotifications, type NotificationGroup, type NotificationSeverity } from "@/lib/mock-data";
import { AlertTriangle, AlertCircle, TrendingUp, Info, ChevronDown, ChevronRight } from "lucide-react";

const severityConfig: Record<NotificationSeverity, { label: string; icon: typeof AlertCircle; bg: string; border: string; dot: string; text: string }> = {
  action_needed: { label: "Action Needed", icon: AlertCircle, bg: "bg-red-50", border: "border-red-200", dot: "bg-red-500", text: "text-red-700" },
  heads_up: { label: "Heads Up", icon: AlertTriangle, bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500", text: "text-amber-700" },
  good_news: { label: "Good News", icon: TrendingUp, bg: "bg-green-50", border: "border-green-200", dot: "bg-green-500", text: "text-green-700" },
  info: { label: "Info", icon: Info, bg: "bg-gray-50", border: "border-gray-200", dot: "bg-gray-400", text: "text-gray-600" },
};

function GroupCard({ group }: { group: NotificationGroup }) {
  const [expanded, setExpanded] = useState(false);
  const config = severityConfig[group.severity];
  const Icon = config.icon;

  return (
    <div className={`rounded-lg border ${config.border} ${group.unreadCount > 0 ? config.bg : "bg-white"} overflow-hidden shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]`}>
      {/* Collapsed header */}
      <div className="flex items-start gap-3 p-4">
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.text}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-gray-900">{group.title}</h3>
            {group.unreadCount > 0 && (
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${config.bg} ${config.text}`}>
                {group.unreadCount} new
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">{group.summary}</p>
          <p className="text-[10px] text-gray-400 mt-1">{group.items[0].timestamp}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {group.actionHref && (
            <Link
              href={group.actionHref}
              className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                group.severity === "action_needed"
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : group.severity === "heads_up"
                  ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {group.actionLabel || "View"}
            </Link>
          )}
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

      {/* Expanded detail rows */}
      {expanded && group.items.length > 1 && (
        <div className="border-t border-gray-100">
          {group.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 last:border-b-0">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.read ? "bg-gray-300" : config.dot}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-xs ${item.read ? "text-gray-500" : "text-gray-700"}`}>
                  {item.detail || item.message}
                </p>
                {item.newsletter && (
                  <p className="text-[10px] text-gray-400">{item.newsletter}</p>
                )}
              </div>
              <span className="text-[10px] text-gray-400 shrink-0">{item.timestamp.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PortalNotificationsPage() {
  const groups = groupNotifications(notifications);
  const unreadTotal = notifications.filter((n) => !n.read).length;

  // Split by severity tier
  const actionNeeded = groups.filter((g) => g.severity === "action_needed");
  const headsUp = groups.filter((g) => g.severity === "heads_up");
  const goodNews = groups.filter((g) => g.severity === "good_news");
  const info = groups.filter((g) => g.severity === "info");

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={unreadTotal > 0 ? `${unreadTotal} unread across ${groups.length} topics` : "All caught up"}
      />

      <div className="space-y-6">
        {/* Action Needed */}
        {actionNeeded.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">Action Needed</h2>
            <div className="space-y-2">
              {actionNeeded.map((g) => <GroupCard key={g.category} group={g} />)}
            </div>
          </div>
        )}

        {/* Heads Up */}
        {headsUp.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">Heads Up</h2>
            <div className="space-y-2">
              {headsUp.map((g) => <GroupCard key={g.category} group={g} />)}
            </div>
          </div>
        )}

        {/* Good News */}
        {goodNews.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Good News</h2>
            <div className="space-y-2">
              {goodNews.map((g) => <GroupCard key={g.category} group={g} />)}
            </div>
          </div>
        )}

        {/* Info */}
        {info.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Info</h2>
            <div className="space-y-2">
              {info.map((g) => <GroupCard key={g.category} group={g} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
