import { getCompanies } from "@/lib/data";
import { SmartReactivationClient } from "./ProductClient";

export default async function SmartReactivationPage() {
  const companies = await getCompanies();
  return <SmartReactivationClient companies={companies} />;
}
