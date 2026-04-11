import { PageHeader } from "@/components/shared/PageHeader";
import { notifications } from "@/lib/mock-data";

const typeStyles: Record<string, { bg: string; dot: string }> = {
  success: { bg: "bg-green-50", dot: "bg-green-500" },
  warning: { bg: "bg-yellow-50", dot: "bg-yellow-500" },
  error: { bg: "bg-red-50", dot: "bg-red-500" },
  info: { bg: "bg-blue-50", dot: "bg-blue-500" },
};

export default function PortalNotificationsPage() {
  return (
    <div>
      <PageHeader title="Notifications" subtitle="Stay updated on your account activity" />

      <div className="space-y-2">
        {notifications.map((n) => {
          const style = typeStyles[n.type] ?? typeStyles.info;
          return (
            <div
              key={n.id}
              className={`flex items-start gap-3 p-4 rounded-lg border ${
                n.read ? "bg-white border-gray-200" : `${style.bg} border-gray-200`
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${style.dot}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${n.read ? "text-gray-600" : "text-gray-900 font-medium"}`}>
                  {n.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">{n.timestamp}</p>
              </div>
              {!n.read && (
                <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full shrink-0">
                  New
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
