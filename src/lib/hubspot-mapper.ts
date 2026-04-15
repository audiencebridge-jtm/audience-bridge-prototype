import type { HubSpotCompanyBundle } from "./hubspot";
import type { Company, ProductInventory, CustomerType, CompanyOwner } from "./mock-data";

// ─── Product type mapping ──────────────────────────────────
// Maps HubSpot deal/line-item names to our internal product keys.
// The mapping is case-insensitive and matches partial strings.

const PRODUCT_KEY_PATTERNS: Record<string, keyof Company["products"]> = {
  "smart lead": "smartLead",
  "smart_lead": "smartLead",
  "smartlead": "smartLead",
  "smart pixel": "smartPixel",
  "smart_pixel": "smartPixel",
  "smartpixel": "smartPixel",
  "smart feed": "smartFeed",
  "smart_feed": "smartFeed",
  "smartfeed": "smartFeed",
  "smart delivery": "smartDelivery",
  "smart_delivery": "smartDelivery",
  "smartdelivery": "smartDelivery",
  "smart reactivation": "smartReactivation",
  "smart_reactivation": "smartReactivation",
  "smartreactivation": "smartReactivation",
};

const PRODUCT_KEY_TO_LABEL: Record<string, CustomerType> = {
  smartLead: "Smart Lead",
  smartPixel: "Smart Pixel",
  smartFeed: "Smart Feed",
  smartDelivery: "Smart Delivery",
  smartReactivation: "Smart Reactivation",
};

function resolveProductKey(name: string): keyof Company["products"] | null {
  const lower = name.toLowerCase().trim();
  for (const [pattern, key] of Object.entries(PRODUCT_KEY_PATTERNS)) {
    if (lower.includes(pattern)) return key;
  }
  return null;
}

// ─── Helpers ───────────────────────────────────────────────

function num(val: string | null | undefined, fallback = 0): number {
  if (!val) return fallback;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? fallback : parsed;
}

function str(val: string | null | undefined, fallback = ""): string {
  return val ?? fallback;
}

// ─── Map a single HubSpot bundle → Company ────────────────

function mapBundle(bundle: HubSpotCompanyBundle, index: number): Company {
  const { company, deals, ownerName } = bundle;
  const props = company.properties;

  // Build products from deals + line items
  const products: Company["products"] = {};
  const customerTypes = new Set<CustomerType>();

  for (const deal of deals) {
    const dp = deal.properties;

    // Try to determine product type from deal's product_type property first
    let productKey = dp.product_type ? resolveProductKey(dp.product_type) : null;

    // Fall back to deal name
    if (!productKey && dp.dealname) {
      productKey = resolveProductKey(dp.dealname);
    }

    // Fall back to line item names
    if (!productKey) {
      for (const li of deal.lineItems) {
        const liName = li.properties.name;
        if (liName) {
          productKey = resolveProductKey(liName);
          if (productKey) break;
        }
      }
    }

    if (!productKey) continue;

    // Build inventory from deal properties
    const unitsPurchased = num(dp.units_purchased) || num(dp.amount);
    const unitsUsed = num(dp.units_used);
    const remaining = num(dp.units_remaining) || Math.max(0, unitsPurchased - unitsUsed);
    const dailyUsage = num(dp.daily_usage);
    const estDaysRemaining = num(dp.est_days_remaining) ||
      (dailyUsage > 0 ? Math.round((remaining / dailyUsage) * 10) / 10 : 0);

    // If deal properties are sparse, try to pull quantity from line items
    const lineQty = deal.lineItems.reduce((sum, li) => sum + num(li.properties.quantity), 0);

    const inventory: ProductInventory = {
      unitsPurchased: unitsPurchased || lineQty,
      unitsUsed,
      remaining: remaining || Math.max(0, (unitsPurchased || lineQty) - unitsUsed),
      dailyUsage,
      estDaysRemaining,
    };

    // If we already have this product, merge (sum up quantities)
    const existing = products[productKey];
    if (existing) {
      existing.unitsPurchased += inventory.unitsPurchased;
      existing.unitsUsed += inventory.unitsUsed;
      existing.remaining += inventory.remaining;
      existing.dailyUsage = Math.max(existing.dailyUsage, inventory.dailyUsage);
      existing.estDaysRemaining = existing.dailyUsage > 0
        ? Math.round((existing.remaining / existing.dailyUsage) * 10) / 10
        : 0;
    } else {
      products[productKey] = inventory;
    }

    const label = PRODUCT_KEY_TO_LABEL[productKey];
    if (label) customerTypes.add(label);
  }

  // Map status
  let status: Company["status"] = "active";
  const rawStatus = str(props.account_status).toLowerCase();
  if (rawStatus.includes("trial")) status = "trial";
  else if (rawStatus.includes("suspend")) status = "suspended";

  // Owner — try to match known owners, otherwise use as-is
  const knownOwners: CompanyOwner[] = ["Justin Merrell", "Chris Miquel"];
  const owner: CompanyOwner = knownOwners.find(
    (o) => ownerName.toLowerCase().includes(o.split(" ")[0].toLowerCase()),
  ) ?? ownerName as CompanyOwner;

  return {
    id: company.id,
    name: str(props.name, `Company ${index + 1}`),
    newsletters: [],  // Newsletters are not in HubSpot — keep from local data
    plan: str(props.subscription_plan, "Growth"),
    status,
    totalSubscribers: num(props.total_subscribers),
    integration: str(props.esp_integration, "Unknown"),
    contactEmail: str(props.contact_email, str(props.domain, "")),
    createdAt: str(props.createdate, new Date().toISOString()).slice(0, 10),
    customerType: [...customerTypes],
    owner,
    products,
  };
}

// ─── Map all bundles → Company[] ───────────────────────────

export function mapHubSpotToCompanies(bundles: HubSpotCompanyBundle[]): Company[] {
  return bundles.map((b, i) => mapBundle(b, i));
}
