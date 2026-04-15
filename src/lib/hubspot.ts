// HubSpot CRM API client — server-only
// Fetches company data and maps to the existing Company interface

import type { Company, CustomerType, ProductInventory } from "./mock-data";

const HUBSPOT_BASE = "https://api.hubapi.com";

// All company properties we need from HubSpot
const COMPANY_PROPERTIES = [
  "name",
  "domain",
  "status",
  "customer_type",
  "customer_status",
  "product_fit",
  "product_onboarding_stage",
  "delivery_method",
  // Pixel
  "total_pixel_units_purchased",
  "pixel_units_purchased_by_company",
  "pixels_used",
  "remaining_pixels",
  "daily_pixel_usage",
  "estimated_days_in_pixels_remaining",
  // Smart Feed
  "smart_feed_used",
  "remaining_smart_feed",
  "daily_usage",
  "estimated_feed_days_remaining",
  // Reactivation
  "estimated_activation_days_remaining",
  // Revenue / deals
  "hs_total_deal_value",
  "estimated_end_date",
  "hubspot_owner_id",
];

interface HubSpotCompanyResult {
  id: string;
  properties: Record<string, string | null>;
}

interface HubSpotSearchResponse {
  results: HubSpotCompanyResult[];
  total: number;
  paging?: { next?: { after: string } };
}

async function hubspotFetch<T>(endpoint: string, body?: object): Promise<T> {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) throw new Error("HUBSPOT_ACCESS_TOKEN is not set");

  const res = await fetch(`${HUBSPOT_BASE}${endpoint}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    next: { revalidate: 300 }, // 5-minute server-side cache
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HubSpot API ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

// Fetch all active companies from HubSpot with pagination
export async function fetchHubSpotCompanies(): Promise<Company[]> {
  const allResults: HubSpotCompanyResult[] = [];
  let after: string | undefined;

  do {
    const body: Record<string, unknown> = {
      filterGroups: [
        {
          filters: [
            { propertyName: "status", operator: "EQ", value: "Active" },
          ],
        },
      ],
      properties: COMPANY_PROPERTIES,
      limit: 100,
    };
    if (after) body.after = after;

    const response = await hubspotFetch<HubSpotSearchResponse>(
      "/crm/v3/objects/companies/search",
      body
    );

    allResults.push(...response.results);
    after = response.paging?.next?.after;
  } while (after);

  return allResults.map(mapHubSpotToCompany);
}

// Fetch a single company by HubSpot ID
export async function fetchHubSpotCompanyById(
  id: string
): Promise<Company | undefined> {
  try {
    const params = new URLSearchParams();
    COMPANY_PROPERTIES.forEach((p) => params.append("properties", p));

    const result = await hubspotFetch<HubSpotCompanyResult>(
      `/crm/v3/objects/companies/${id}?${params.toString()}`
    );
    return mapHubSpotToCompany(result);
  } catch {
    return undefined;
  }
}

// Parse a HubSpot number property, returning 0 for null/undefined/NaN
function num(value: string | null | undefined): number {
  if (value == null || value === "") return 0;
  const n = parseFloat(value);
  return isNaN(n) ? 0 : n;
}

// Parse and round to 1 decimal (for days remaining display)
function numRounded(value: string | null | undefined): number {
  return Math.round(num(value) * 10) / 10;
}

// Map customer_type enum values to our CustomerType
// Note: HubSpot has value "Smart Feed" with label "Smart Lead" (data quirk)
function mapCustomerType(raw: string | null): CustomerType[] {
  if (!raw) return [];
  const mapping: Record<string, CustomerType> = {
    "Smart Pixel": "Smart Pixel",
    "Smart Feed": "Smart Lead", // HubSpot quirk: value="Smart Feed", label="Smart Lead"
    "List Growth": "Smart Feed",
    "Smart Delivery": "Smart Delivery",
    "Smart Reactivation": "Smart Reactivation",
  };
  return raw
    .split(";")
    .map((v) => mapping[v.trim()])
    .filter(Boolean) as CustomerType[];
}

function mapHubSpotToCompany(record: HubSpotCompanyResult): Company {
  const p = record.properties;

  // Determine which products are active based on available data
  const products: Company["products"] = {};

  // Smart Pixel — present if any pixel properties have values
  const pixelPurchased = num(p.total_pixel_units_purchased);
  const pixelUsed = num(p.pixels_used);
  const pixelRemaining = num(p.remaining_pixels);
  if (pixelPurchased > 0 || pixelUsed > 0 || pixelRemaining > 0) {
    products.smartPixel = {
      unitsPurchased: pixelPurchased,
      unitsUsed: pixelUsed,
      remaining: pixelRemaining,
      dailyUsage: num(p.daily_pixel_usage),
      estDaysRemaining: numRounded(p.estimated_days_in_pixels_remaining),
    };
  }

  // Smart Lead — HubSpot properties are named "smart_feed_*" but actually track Smart Lead
  // (same naming quirk as customer_type where value="Smart Feed" means label="Smart Lead")
  const leadUsed = num(p.smart_feed_used);
  const leadRemaining = num(p.remaining_smart_feed);
  const leadDaysRemaining = numRounded(p.estimated_feed_days_remaining);
  if (leadUsed > 0 || leadRemaining > 0 || leadDaysRemaining > 0) {
    products.smartLead = {
      unitsPurchased: leadUsed + leadRemaining, // derived: total = used + remaining
      unitsUsed: leadUsed,
      remaining: leadRemaining,
      dailyUsage: num(p.daily_usage),
      estDaysRemaining: numRounded(p.estimated_feed_days_remaining),
    };
  }

  // Smart Reactivation — present if activation days remaining has a value
  const reactivationDays = numRounded(p.estimated_activation_days_remaining);
  if (reactivationDays > 0) {
    products.smartReactivation = {
      unitsPurchased: 0,
      unitsUsed: 0,
      remaining: 0,
      dailyUsage: 0,
      estDaysRemaining: reactivationDays,
    };
  }

  // Smart Delivery — retainer product, no inventory to track
  const deliveryMethod = p.delivery_method;
  if (
    deliveryMethod &&
    deliveryMethod !== "Paused" &&
    deliveryMethod !== ""
  ) {
    products.smartDelivery = {
      unitsPurchased: 1,
      unitsUsed: 0,
      remaining: 1,
      dailyUsage: 0,
      estDaysRemaining: 999, // retainer — no depletion
    };
  }

  // Map status
  const statusMap: Record<string, "active" | "trial" | "suspended"> = {
    Active: "active",
    Paused: "suspended",
    Dead: "suspended",
  };

  // Map customer types
  const customerTypes = mapCustomerType(p.customer_type);
  // Also check product_fit as a fallback
  if (customerTypes.length === 0 && p.product_fit) {
    customerTypes.push(...mapCustomerType(p.product_fit));
  }

  return {
    id: record.id,
    name: p.name || "Unknown",
    newsletters: [],
    plan: "",
    status: statusMap[p.status || ""] || "active",
    totalSubscribers: 0,
    integration: "",
    contactEmail: "",
    createdAt: "",
    customerType: customerTypes.length > 0 ? customerTypes : ["Smart Lead"],
    owner: "Justin Merrell",
    products,
  };
}
