import { NextRequest, NextResponse } from "next/server";
import { isHubSpotConfigured, fetchAllCompanyData } from "@/lib/hubspot";
import { mapHubSpotToCompanies } from "@/lib/hubspot-mapper";
import { companies as mockCompanies } from "@/lib/mock-data";
import type { Company } from "@/lib/mock-data";

// ─── In-memory cache (server-side, per-instance) ──────────
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  companies: Company[];
  lastUpdated: string;
}

let cache: CacheEntry | null = null;
let cacheTimestamp = 0;

function isCacheValid(): boolean {
  return cache !== null && Date.now() - cacheTimestamp < CACHE_TTL_MS;
}

// ─── GET /api/admin/hubspot ────────────────────────────────
// Returns companies data. Uses HubSpot if configured, else mock.
// Query params:
//   ?refresh=true  — bust the cache and re-fetch from HubSpot

export async function GET(request: NextRequest) {
  const refresh = request.nextUrl.searchParams.get("refresh") === "true";

  // If HubSpot is not configured, return mock data
  if (!isHubSpotConfigured()) {
    return NextResponse.json({
      companies: mockCompanies,
      source: "mock" as const,
      lastUpdated: new Date().toISOString(),
    });
  }

  // Return cached data if valid and not a force-refresh
  if (!refresh && isCacheValid() && cache) {
    return NextResponse.json({
      ...cache,
      source: "hubspot" as const,
      cached: true,
    });
  }

  // Fetch from HubSpot
  try {
    const bundles = await fetchAllCompanyData();
    const companies = mapHubSpotToCompanies(bundles);

    cache = {
      companies,
      lastUpdated: new Date().toISOString(),
    };
    cacheTimestamp = Date.now();

    return NextResponse.json({
      ...cache,
      source: "hubspot" as const,
      cached: false,
    });
  } catch (error) {
    console.error("[HubSpot API] Failed to fetch:", error);

    // If we have stale cache, return it with a warning
    if (cache) {
      return NextResponse.json({
        ...cache,
        source: "hubspot" as const,
        cached: true,
        stale: true,
        error: "Failed to refresh — showing cached data",
      });
    }

    // Last resort: fall back to mock data
    return NextResponse.json({
      companies: mockCompanies,
      source: "mock" as const,
      lastUpdated: new Date().toISOString(),
      error: "HubSpot unavailable — showing demo data",
    });
  }
}
