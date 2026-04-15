import { getCompanies } from "@/lib/data";
import { SmartLeadClient } from "./ProductClient";

export default async function SmartLeadPage() {
  const companies = await getCompanies();
  return <SmartLeadClient companies={companies} />;
}
