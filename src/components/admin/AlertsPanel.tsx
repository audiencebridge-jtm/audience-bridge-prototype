import Link from "next/link";
import { StatusBadge } from "../shared/StatusBadge";

interface Alert {
  type: "warning" | "error" | "info";
  message: string;
  link: string;
}

export function AlertsPanel({ alerts }: { alerts: Alert[] }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-500 mb-3">Alerts & Action Items</h3>
      <div className="space-y-2">
        {alerts.map((alert, i) => (
          <Link
            key={i}
            href={alert.link}
            className="flex items-start gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
          >
            <StatusBadge status={alert.type} />
            <span className="text-sm text-gray-700">{alert.message}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
