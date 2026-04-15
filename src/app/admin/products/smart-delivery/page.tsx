import { getCompanies } from "@/lib/data";
import { SmartDeliveryClient } from "./ProductClient";

export default async function SmartDeliveryPage() {
  const companies = await getCompanies();
  return <SmartDeliveryClient companies={companies} />;
}
