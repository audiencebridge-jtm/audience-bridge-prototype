"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getNewslettersByCompany } from "@/lib/mock-data";

export default function PortalNewslettersPage() {
  const router = useRouter();
  const myNewsletters = getNewslettersByCompany("1");

  const columns = [
    { key: "name", label: "Newsletter" },
    { key: "subscribers", label: "Subscribers", align: "right" as const, render: (r: Record<string, unknown>) => (r.subscribers as number).toLocaleString() },
    { key: "engagementRate", label: "Eng. Rate", align: "right" as const, render: (r: Record<string, unknown>) => `${r.engagementRate}%` },
    { key: "thirtyDayClickers", label: "30-Day Clickers", align: "right" as const, render: (r: Record<string, unknown>) => (r.thirtyDayClickers as number).toLocaleString() },
    { key: "activeProducts", label: "Active Products", render: (r: Record<string, unknown>) => (
      <div className="flex flex-wrap gap-1">
        {(r.activeProducts as string[]).map((p) => (
          <span key={p} className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">{p}</span>
        ))}
      </div>
    )},
    { key: "status", label: "Status", render: (r: Record<string, unknown>) => <StatusBadge status={r.status as "active"} /> },
  ];

  return (
    <div>
      <PageHeader title="My Newsletters" subtitle="Your publications and their performance" />
      <DataTable
        columns={columns}
        data={myNewsletters as unknown as Record<string, unknown>[]}
        onRowClick={(row) => router.push(`/portal/newsletters/${row.id}`)}
      />
    </div>
  );
}
