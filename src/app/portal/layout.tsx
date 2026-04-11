import { ClientSidebar } from "@/components/portal/ClientSidebar";
import { NewsletterProvider } from "@/context/NewsletterContext";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <NewsletterProvider>
      <div className="flex min-h-screen bg-gray-50">
        <ClientSidebar />
        <main className="flex-1 ml-60 p-8">{children}</main>
      </div>
    </NewsletterProvider>
  );
}
