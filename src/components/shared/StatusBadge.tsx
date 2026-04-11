const styles = {
  active: "bg-green-100 text-green-700",
  trial: "bg-yellow-100 text-yellow-700",
  suspended: "bg-red-100 text-red-700",
  paused: "bg-gray-100 text-gray-600",
  inactive: "bg-gray-100 text-gray-500",
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  warning: "bg-yellow-100 text-yellow-700",
  error: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  stopped: "bg-red-100 text-red-700",
};

interface StatusBadgeProps {
  status: keyof typeof styles;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {label || status}
    </span>
  );
}
