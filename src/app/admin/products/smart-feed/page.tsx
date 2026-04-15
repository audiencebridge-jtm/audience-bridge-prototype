import { getCompanies } from "@/lib/data";
import { SmartFeedClient } from "./ProductClient";

export default async function SmartFeedPage() {
  const companies = await getCompanies();
  return <SmartFeedClient companies={companies} />;
}
