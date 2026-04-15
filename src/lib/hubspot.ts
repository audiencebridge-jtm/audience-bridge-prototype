import { Client } from "@hubspot/api-client";

// ─── HubSpot Client ────────────────────────────────────────
// Requires HUBSPOT_ACCESS_TOKEN env var (private app token).

let _client: Client | null = null;

function getClient(): Client {
  if (!_client) {
    const token = process.env.HUBSPOT_ACCESS_TOKEN;
    if (!token) throw new Error("HUBSPOT_ACCESS_TOKEN is not set");
    _client = new Client({ accessToken: token });
  }
  return _client;
}

export function isHubSpotConfigured(): boolean {
  return !!process.env.HUBSPOT_ACCESS_TOKEN;
}

// ─── Types for raw HubSpot responses ───────────────────────

export interface HubSpotCompany {
  id: string;
  properties: Record<string, string | null>;
  associatedDealIds: string[];
}

export interface HubSpotDeal {
  id: string;
  properties: Record<string, string | null>;
  associatedLineItemIds: string[];
}

export interface HubSpotLineItem {
  id: string;
  properties: Record<string, string | null>;
}

// ─── Property mappings ─────────────────────────────────────
// These map your HubSpot custom property internal names to our data model.
// Adjust if your HubSpot instance uses different names.

export const COMPANY_PROPS = [
  "name",
  "domain",
  "hs_object_id",
  "hubspot_owner_id",
  // Custom properties — adjust to match your HubSpot setup
  "subscription_plan",      // "Enterprise" | "Growth" | "Starter"
  "account_status",         // "active" | "trial" | "suspended"
  "total_subscribers",
  "esp_integration",        // "Sailthru" | "Beehiiv" | "Iterable" | "Customer.io"
  "contact_email",
  "createdate",
] as const;

export const DEAL_PROPS = [
  "dealname",
  "dealstage",
  "amount",
  "hs_object_id",
  "pipeline",
  // Custom deal properties for product usage tracking
  "product_type",           // "smart_lead" | "smart_pixel" | "smart_feed" | etc.
  "units_purchased",
  "units_used",
  "units_remaining",
  "daily_usage",
  "est_days_remaining",
] as const;

export const LINE_ITEM_PROPS = [
  "name",
  "hs_product_id",
  "quantity",
  "price",
  "amount",
  "hs_object_id",
] as const;

// ─── Fetchers ──────────────────────────────────────────────

export async function fetchCompanies(): Promise<HubSpotCompany[]> {
  const client = getClient();
  const allCompanies: HubSpotCompany[] = [];
  let after: string | undefined;

  do {
    const response = await client.crm.companies.basicApi.getPage(
      100,
      after,
      [...COMPANY_PROPS],
      undefined,       // propertiesWithHistory
      ["deals"],       // associations — fetch associated deal IDs inline
    );

    for (const co of response.results) {
      // Extract associated deal IDs from the associations map
      const dealAssocs = co.associations?.deals?.results ?? [];
      const associatedDealIds = dealAssocs.map((a) => a.id);

      allCompanies.push({
        id: co.id,
        properties: co.properties as Record<string, string | null>,
        associatedDealIds,
      });
    }

    after = response.paging?.next?.after;
  } while (after);

  return allCompanies;
}

export async function fetchDeals(dealIds: string[]): Promise<HubSpotDeal[]> {
  if (dealIds.length === 0) return [];
  const client = getClient();

  // Batch-read deals with our desired properties
  const response = await client.crm.deals.batchApi.read({
    inputs: dealIds.map((id) => ({ id })),
    properties: [...DEAL_PROPS],
    propertiesWithHistory: [],
  });

  // For each deal, also fetch its line item associations
  const deals: HubSpotDeal[] = [];
  for (const d of response.results) {
    // Use the v4 associations API to get line items for this deal
    let lineItemIds: string[] = [];
    try {
      const assocResponse = await client.crm.associations.v4.basicApi.getPage(
        "deals",
        d.id,
        "line_items",
      );
      lineItemIds = assocResponse.results.map((a) => a.toObjectId);
    } catch {
      // No line items or associations not available
    }

    deals.push({
      id: d.id,
      properties: d.properties as Record<string, string | null>,
      associatedLineItemIds: lineItemIds,
    });
  }

  return deals;
}

export async function fetchLineItems(itemIds: string[]): Promise<HubSpotLineItem[]> {
  if (itemIds.length === 0) return [];
  const client = getClient();

  const response = await client.crm.lineItems.batchApi.read({
    inputs: itemIds.map((id) => ({ id })),
    properties: [...LINE_ITEM_PROPS],
    propertiesWithHistory: [],
  });

  return response.results.map((li) => ({
    id: li.id,
    properties: li.properties as Record<string, string | null>,
  }));
}

export async function fetchOwners(): Promise<Map<string, string>> {
  const client = getClient();
  const ownerMap = new Map<string, string>();

  const response = await client.crm.owners.ownersApi.getPage();

  for (const owner of response.results) {
    const name = [owner.firstName, owner.lastName].filter(Boolean).join(" ");
    ownerMap.set(owner.id, name || owner.email || "Unknown");
  }

  return ownerMap;
}

// ─── Aggregate Fetch ───────────────────────────────────────
// Single call that pulls everything needed for the admin dashboard.

export interface HubSpotCompanyBundle {
  company: HubSpotCompany;
  deals: (HubSpotDeal & { lineItems: HubSpotLineItem[] })[];
  ownerName: string;
}

export async function fetchAllCompanyData(): Promise<HubSpotCompanyBundle[]> {
  const [companies, ownerMap] = await Promise.all([
    fetchCompanies(),
    fetchOwners(),
  ]);

  const bundles: HubSpotCompanyBundle[] = [];

  for (const company of companies) {
    // Fetch all deals for this company
    const deals = await fetchDeals(company.associatedDealIds);

    // Collect all line item IDs across deals, then batch-fetch them
    const allLineItemIds = deals.flatMap((d) => d.associatedLineItemIds);
    const allLineItems = await fetchLineItems(allLineItemIds);
    const lineItemMap = new Map(allLineItems.map((li) => [li.id, li]));

    // Attach line items to their deals
    const dealsWithLineItems = deals.map((deal) => ({
      ...deal,
      lineItems: deal.associatedLineItemIds
        .map((id) => lineItemMap.get(id))
        .filter((li): li is HubSpotLineItem => li !== undefined),
    }));

    const ownerId = company.properties.hubspot_owner_id;
    const ownerName = ownerId ? (ownerMap.get(ownerId) ?? "Unassigned") : "Unassigned";

    bundles.push({ company, deals: dealsWithLineItems, ownerName });
  }

  return bundles;
}
