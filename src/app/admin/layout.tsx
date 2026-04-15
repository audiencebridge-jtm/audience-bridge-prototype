import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminDataProvider } from "@/lib/admin-data-context";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminDataProvider>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 lg:ml-60 p-4 pt-16 lg:p-8 lg:pt-8">{children}</main>
      </div>
    </AdminDataProvider>
  );
}
