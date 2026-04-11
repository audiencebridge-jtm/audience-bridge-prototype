"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { newsletters } from "@/lib/mock-data";

export default function NewslettersPage() {
  const router = useRouter();

  const columns = [
    { key: "name", label: "Newsletter" },
    { key: "companyName", label: "Company" },
    { key: "owner", label: "Owner" },
    { key: "integration", label: "Integration" },
    {
      key: "thirtyDayClickers",
      label: "30 Day Clickers",
      align: "right" as const,
      render: (row: Record<string, unknown>) => (row.thirtyDayClickers as number).toLocaleString(),
    },
    {
      key: "engagementRate",
      label: "Eng. Rate",
      align: "right" as const,
      render: (row: Record<string, unknown>) => `${row.engagementRate}%`,
    },
    {
      key: "status",
      label: "Status",
      render: (row: Record<string, unknown>) => <StatusBadge status={row.status as "active"} />,
    },
  ];

  return (
    <div>
      <PageHeader title="Newsletters" subtitle="Manage and view all newsletters" />
      <DataTable
        columns={columns}
        data={newsletters as unknown as Record<string, unknown>[]}
        onRowClick={(row) => router.push(`/admin/newsletters/${row.id}`)}
        searchable
        searchPlaceholder="Search newsletters..."
      />
    </div>
  );
}
