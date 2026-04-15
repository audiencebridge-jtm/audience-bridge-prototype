// Unified data layer — serves HubSpot data when token is configured, mock data otherwise
// All admin pages should import from here instead of mock-data directly

import {
  companies as mockCompanies,
  dashboardMetrics,
  getCompanyHealthStatus,
  getLowestInventory,
  generateInventoryAlerts,
  getSystemEventsForRange,
  formatNumber,
  type Company,
  type ProductInventory,
} from "./mock-data";
import { fetchHubSpotCompanies, fetchHubSpotCompanyById } from "./hubspot";

// Re-export types and pure helpers that work regardless of data source
export {
  getCompanyHealthStatus,
  getLowestInventory,
  generateInventoryAlerts,
  getSystemEventsForRange,
  formatNumber,
  dashboardMetrics,
};
export type { Company, ProductInventory };

const useHubSpot = () => !!process.env.HUBSPOT_ACCESS_TOKEN;

export async function getCompanies(): Promise<Company[]> {
  if (!useHubSpot()) return mockCompanies;

  try {
    return await fetchHubSpotCompanies();
  } catch (error) {
    console.warn("[data] HubSpot fetch failed, falling back to mock data:", error);
    return mockCompanies;
  }
}

export async function getCompanyById(id: string): Promise<Company | undefined> {
  if (!useHubSpot()) {
    return mockCompanies.find((c) => c.id === id);
  }

  try {
    return await fetchHubSpotCompanyById(id);
  } catch (error) {
    console.warn("[data] HubSpot company fetch failed, falling back to mock:", error);
    return mockCompanies.find((c) => c.id === id);
  }
}
