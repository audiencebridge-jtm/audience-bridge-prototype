import { getCompanyById } from "@/lib/data";
import { getNewslettersByCompany, invoices } from "@/lib/mock-data";
import { CompanyDetailClient } from "./CompanyDetailClient";

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await getCompanyById(id);

  if (!company) {
    return <div className="p-8 text-gray-500">Company not found</div>;
  }

  // Newsletters and invoices remain mock data for now
  const companyNewsletters = getNewslettersByCompany(id);
  const companyInvoices = invoices.filter((inv) => inv.company === company.name);

  return (
    <CompanyDetailClient
      company={company}
      companyNewsletters={companyNewsletters}
      companyInvoices={companyInvoices}
    />
  );
}
