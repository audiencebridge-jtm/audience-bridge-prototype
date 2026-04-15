import { getCompanies } from "@/lib/data";
import { SmartPixelClient } from "./ProductClient";

export default async function SmartPixelPage() {
  const companies = await getCompanies();
  return <SmartPixelClient companies={companies} />;
}
