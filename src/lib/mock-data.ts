// ============================================================
// Audience Bridge – Mock Data
// Realistic data based on actual screenshots
// ============================================================

export interface ProductInventory {
  unitsPurchased: number;
  unitsUsed: number;
  remaining: number;
  dailyUsage: number;
  estDaysRemaining: number;
}

export type CustomerType = "Smart Lead" | "Smart Pixel" | "Smart Delivery" | "Smart Reactivation" | "Smart Feed";
export type CompanyOwner = "Justin Merrell" | "Chris Miquel";

export interface Company {
  id: string;
  name: string;
  newsletters: string[];
  plan: string;
  status: "active" | "trial" | "suspended";
  totalSubscribers: number;
  integration: string;
  contactEmail: string;
  createdAt: string;
  customerType: CustomerType[];
  owner: CompanyOwner;
  products: {
    smartLead?: ProductInventory;
    smartFeed?: ProductInventory;
    smartPixel?: ProductInventory;
    smartDelivery?: ProductInventory;
    smartReactivation?: ProductInventory;
  };
}

export interface Newsletter {
  id: string;
  name: string;
  companyId: string;
  companyName: string;
  owner: string;
  integration: string;
  subscribers: number;
  thirtyDayClickers: number;
  engagementRate: number;
  status: "active" | "paused" | "inactive";
  activeProducts: string[];
  createdAt: string;
  domainRep: "HIGH" | "MEDIUM" | "LOW";
  gmailComplaints: number;
  deliverabilityScore: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  unsubRate: number;
  spamRate: number;
  sent: number;
  growth: number;
}

export interface SmartLeadSource {
  id: number;
  newsletter: string;
  totalPurchased: number;
  delivered: number;
  remaining: number;
  available: number;
  dailyUsage: number;
  daysRemaining: number;
  costPerLead: number;
  listKey: string;
  createdAt: string;
  status: "active" | "paused" | "stopped";
}

export interface FeedDomain {
  name: string;
  availability: number;
  engagementRate: number;
  volume: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  product: string;
  listId: string;
  email: string;
  costPerLead: number;
  esp: string;
  endpoint: string;
  responseCode: number;
  newsletter: string;
}

export interface ReactivationRecord {
  newsletter: string;
  company: string;
  dormantRecords: number;
  matchedRecords: number;
}

export interface AdminUser {
  email: string;
  role: "Admin" | "Account Manager" | "Viewer";
  lastLogin: string;
}

export interface Invoice {
  id: string;
  company: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  date: string;
  plan: string;
}

// ─── Companies ───────────────────────────────────────────────
export const companies: Company[] = [
  {
    id: "1",
    name: "Daily Trends Media",
    newsletters: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    plan: "Enterprise",
    status: "active",
    totalSubscribers: 1_850_000,
    integration: "Sailthru",
    contactEmail: "chris@sovidigital.com",
    createdAt: "2025-08-15",
    customerType: ["Smart Lead", "Smart Feed", "Smart Pixel", "Smart Reactivation", "Smart Delivery"],
    owner: "Justin Merrell",
    products: {
      smartLead: { unitsPurchased: 90_000, unitsUsed: 85_282, remaining: 4_718, dailyUsage: 200, estDaysRemaining: 23.6 },
      smartFeed: { unitsPurchased: 90_000, unitsUsed: 82_500, remaining: 7_500, dailyUsage: 1_000, estDaysRemaining: 7.5 },
      smartPixel: { unitsPurchased: 50_000, unitsUsed: 25_056, remaining: 24_944, dailyUsage: 350, estDaysRemaining: 71.3 },
      smartReactivation: { unitsPurchased: 500_000, unitsUsed: 407_450, remaining: 92_550, dailyUsage: 2_261, estDaysRemaining: 40.9 },
      smartDelivery: { unitsPurchased: 12, unitsUsed: 8, remaining: 4, dailyUsage: 0, estDaysRemaining: 120 },
    },
  },
  {
    id: "2",
    name: "Sovdigital",
    newsletters: ["11", "12", "13", "14", "15"],
    plan: "Growth",
    status: "active",
    totalSubscribers: 620_000,
    integration: "Beehiiv",
    contactEmail: "chris@sovidigital.com",
    createdAt: "2025-09-01",
    customerType: ["Smart Lead", "Smart Feed"],
    owner: "Chris Miquel",
    products: {
      smartLead: { unitsPurchased: 20_000, unitsUsed: 11_548, remaining: 8_452, dailyUsage: 150, estDaysRemaining: 56.3 },
      smartFeed: { unitsPurchased: 20_000, unitsUsed: 15_848, remaining: 4_152, dailyUsage: 200, estDaysRemaining: 20.8 },
    },
  },
  {
    id: "3",
    name: "Viral Media Group",
    newsletters: ["16", "17"],
    plan: "Growth",
    status: "active",
    totalSubscribers: 340_000,
    integration: "Iterable",
    contactEmail: "team@viralmedia.io",
    createdAt: "2025-11-10",
    customerType: ["Smart Lead", "Smart Feed", "Smart Pixel", "Smart Delivery"],
    owner: "Justin Merrell",
    products: {
      smartLead: { unitsPurchased: 10_000, unitsUsed: 9_329, remaining: 671, dailyUsage: 130, estDaysRemaining: 5.2 },
      smartFeed: { unitsPurchased: 10_000, unitsUsed: 760, remaining: 9_240, dailyUsage: 50, estDaysRemaining: 184.8 },
      smartPixel: { unitsPurchased: 5_000, unitsUsed: 5_000, remaining: 0, dailyUsage: 0, estDaysRemaining: 0 },
      smartDelivery: { unitsPurchased: 12, unitsUsed: 3, remaining: 9, dailyUsage: 0, estDaysRemaining: 270 },
    },
  },
  {
    id: "4",
    name: "Liberty Publishing",
    newsletters: ["18", "19"],
    plan: "Starter",
    status: "trial",
    totalSubscribers: 95_000,
    integration: "Customer.io",
    contactEmail: "ops@libertypub.com",
    createdAt: "2026-02-20",
    customerType: ["Smart Lead"],
    owner: "Justin Merrell",
    products: {
      smartLead: { unitsPurchased: 2_000, unitsUsed: 1_558, remaining: 442, dailyUsage: 2, estDaysRemaining: 221 },
    },
  },
];

// ─── Newsletters ─────────────────────────────────────────────
export const newsletters: Newsletter[] = [
  { id: "1", name: "Daily Skrape", companyId: "1", companyName: "Daily Trends Media", owner: "Sovdigital (chris@sovidigital.com)", integration: "Sailthru", subscribers: 245_000, thirtyDayClickers: 10_881, engagementRate: 34.2, status: "active", activeProducts: ["Smart Lead", "Smart Pixel", "Smart Feed", "Smart Reactivation"], createdAt: "2025-08-15", domainRep: "MEDIUM", gmailComplaints: 0.100, deliverabilityScore: 98, deliveryRate: 97.8, openRate: 42.1, clickRate: 8.3, unsubRate: 0.04, spamRate: 0.01, sent: 48_200, growth: 1.2 },
  { id: "2", name: "Investing Pioneer", companyId: "1", companyName: "Daily Trends Media", owner: "Sovdigital (chris@sovidigital.com)", integration: "Sailthru", subscribers: 180_000, thirtyDayClickers: 7_200, engagementRate: 28.5, status: "active", activeProducts: ["Smart Lead", "Smart Pixel"], createdAt: "2025-08-15", domainRep: "MEDIUM", gmailComplaints: 0.000, deliverabilityScore: 98, deliveryRate: 98.1, openRate: 36.4, clickRate: 6.7, unsubRate: 0.03, spamRate: 0.01, sent: 35_600, growth: 0.8 },
  { id: "3", name: "Daily Brain Buster", companyId: "1", companyName: "Daily Trends Media", owner: "Sovdigital (chris@sovidigital.com)", integration: "Sailthru", subscribers: 155_000, thirtyDayClickers: 5_890, engagementRate: 31.1, status: "active", activeProducts: ["Smart Lead", "Smart Feed", "Smart Reactivation"], createdAt: "2025-09-01", domainRep: "MEDIUM", gmailComplaints: 0.000, deliverabilityScore: 98, deliveryRate: 97.5, openRate: 38.9, clickRate: 7.1, unsubRate: 0.05, spamRate: 0.02, sent: 31_000, growth: 1.5 },
  { id: "4", name: "Fit With Age", companyId: "1", companyName: "Daily Trends Media", owner: "Sovdigital (chris@sovidigital.com)", integration: "Sailthru", subscribers: 198_000, thirtyDayClickers: 8_430, engagementRate: 26.7, status: "active", activeProducts: ["Smart Lead", "Smart Reactivation"], createdAt: "2025-09-15", domainRep: "MEDIUM", gmailComplaints: 0.500, deliverabilityScore: 98, deliveryRate: 96.9, openRate: 33.2, clickRate: 5.8, unsubRate: 0.06, spamRate: 0.03, sent: 41_500, growth: 0.4 },
  { id: "5", name: "Liberty Surveys", companyId: "1", companyName: "Daily Trends Media", owner: "Sovdigital (chris@sovidigital.com)", integration: "Customer.io", subscribers: 120_000, thirtyDayClickers: 4_100, engagementRate: 22.3, status: "active", activeProducts: ["Smart Lead"], createdAt: "2025-10-01", domainRep: "MEDIUM", gmailComplaints: 0.000, deliverabilityScore: 99, deliveryRate: 98.7, openRate: 29.1, clickRate: 4.2, unsubRate: 0.02, spamRate: 0.01, sent: 24_800, growth: 0.9 },
  { id: "6", name: "Crystal Clear News", companyId: "1", companyName: "Daily Trends Media", owner: "Sovdigital (chris@sovidigital.com)", integration: "Sailthru", subscribers: 165_000, thirtyDayClickers: 6_200, engagementRate: 29.8, status: "active", activeProducts: ["Smart Lead", "Smart Pixel", "Smart Reactivation"], createdAt: "2025-10-15", domainRep: "MEDIUM", gmailComplaints: 0.000, deliverabilityScore: 98, deliveryRate: 97.6, openRate: 37.5, clickRate: 6.9, unsubRate: 0.03, spamRate: 0.01, sent: 33_200, growth: 1.1 },
  { id: "7", name: "Middle America News", companyId: "1", companyName: "Daily Trends Media", owner: "Sovdigital (chris@sovidigital.com)", integration: "Sailthru", subscribers: 142_000, thirtyDayClickers: 5_100, engagementRate: 25.4, status: "active", activeProducts: ["Smart Lead", "Smart Reactivation"], createdAt: "2025-11-01", domainRep: "HIGH", gmailComplaints: 0.000, deliverabilityScore: 99, deliveryRate: 98.9, openRate: 31.8, clickRate: 5.4, unsubRate: 0.02, spamRate: 0.01, sent: 28_400, growth: 0.7 },
  { id: "8", name: "Healthy Happy News", companyId: "1", companyName: "Daily Trends Media", owner: "Sovdigital (chris@sovidigital.com)", integration: "Sailthru", subscribers: 210_000, thirtyDayClickers: 9_100, engagementRate: 33.5, status: "active", activeProducts: ["Smart Lead", "Smart Feed", "Smart Reactivation"], createdAt: "2025-11-15", domainRep: "HIGH", gmailComplaints: 0.100, deliverabilityScore: 99, deliveryRate: 98.4, openRate: 41.3, clickRate: 8.1, unsubRate: 0.04, spamRate: 0.01, sent: 42_100, growth: 1.8 },
  { id: "9", name: "Trivia Nut", companyId: "1", companyName: "Daily Trends Media", owner: "Sovdigital (chris@sovidigital.com)", integration: "Sailthru", subscribers: 178_000, thirtyDayClickers: 7_800, engagementRate: 35.2, status: "active", activeProducts: ["Smart Lead", "Smart Pixel"], createdAt: "2025-12-01", domainRep: "HIGH", gmailComplaints: 0.000, deliverabilityScore: 99, deliveryRate: 99.1, openRate: 43.7, clickRate: 9.2, unsubRate: 0.02, spamRate: 0.01, sent: 35_800, growth: 2.1 },
  { id: "10", name: "Todays Flashback", companyId: "1", companyName: "Daily Trends Media", owner: "Sovdigital (chris@sovidigital.com)", integration: "Sailthru", subscribers: 157_000, thirtyDayClickers: 5_600, engagementRate: 27.9, status: "active", activeProducts: ["Smart Lead"], createdAt: "2026-01-01", domainRep: "MEDIUM", gmailComplaints: 0.000, deliverabilityScore: 98, deliveryRate: 97.3, openRate: 34.6, clickRate: 5.9, unsubRate: 0.03, spamRate: 0.01, sent: 31_400, growth: 0.6 },
  { id: "11", name: "65 Nation", companyId: "2", companyName: "Sovdigital", owner: "Sovdigital (chris@sovidigital.com)", integration: "Beehiiv", subscribers: 185_000, thirtyDayClickers: 10_881, engagementRate: 38.1, status: "active", activeProducts: ["Smart Lead", "Smart Pixel", "Smart Feed"], createdAt: "2025-09-01", domainRep: "MEDIUM", gmailComplaints: 0.000, deliverabilityScore: 99, deliveryRate: 98.6, openRate: 45.2, clickRate: 10.1, unsubRate: 0.02, spamRate: 0.01, sent: 37_000, growth: 2.4 },
  { id: "12", name: "6AM - ATX", companyId: "2", companyName: "Sovdigital", owner: "Sovdigital (chris@sovidigital.com)", integration: "Sailthru", subscribers: 92_000, thirtyDayClickers: 599, engagementRate: 31.4, status: "active", activeProducts: ["Smart Lead", "Smart Feed"], createdAt: "2025-10-01", domainRep: "HIGH", gmailComplaints: 0.000, deliverabilityScore: 99, deliveryRate: 99.2, openRate: 39.8, clickRate: 7.5, unsubRate: 0.01, spamRate: 0.00, sent: 18_400, growth: 1.6 },
  { id: "13", name: "6AM - CLT", companyId: "2", companyName: "Sovdigital", owner: "Sovdigital (chris@sovidigital.com)", integration: "Sailthru", subscribers: 88_000, thirtyDayClickers: 612, engagementRate: 29.7, status: "active", activeProducts: ["Smart Lead", "Smart Feed"], createdAt: "2025-10-15", domainRep: "HIGH", gmailComplaints: 0.000, deliverabilityScore: 99, deliveryRate: 99.0, openRate: 37.2, clickRate: 6.8, unsubRate: 0.02, spamRate: 0.00, sent: 17_600, growth: 1.3 },
  { id: "14", name: "6AM - NASH", companyId: "2", companyName: "Sovdigital", owner: "Sovdigital (chris@sovidigital.com)", integration: "Sailthru", subscribers: 135_000, thirtyDayClickers: 1_482, engagementRate: 33.8, status: "active", activeProducts: ["Smart Lead", "Smart Feed"], createdAt: "2025-11-01", domainRep: "HIGH", gmailComplaints: 0.000, deliverabilityScore: 99, deliveryRate: 98.8, openRate: 41.5, clickRate: 8.4, unsubRate: 0.02, spamRate: 0.01, sent: 27_000, growth: 1.9 },
  { id: "15", name: "6AM - NOVA", companyId: "2", companyName: "Sovdigital", owner: "Sovdigital (chris@sovidigital.com)", integration: "Sailthru", subscribers: 120_000, thirtyDayClickers: 5_092, engagementRate: 30.4, status: "active", activeProducts: ["Smart Lead", "Smart Feed"], createdAt: "2025-11-15", domainRep: "MEDIUM", gmailComplaints: 0.000, deliverabilityScore: 98, deliveryRate: 97.9, openRate: 38.1, clickRate: 7.0, unsubRate: 0.03, spamRate: 0.01, sent: 24_000, growth: 1.0 },
  { id: "16", name: "Viral Daily", companyId: "3", companyName: "Viral Media Group", owner: "Viral Media (team@viralmedia.io)", integration: "Iterable", subscribers: 210_000, thirtyDayClickers: 8_707, engagementRate: 30.1, status: "active", activeProducts: ["Smart Lead", "Smart Feed", "Smart Pixel"], createdAt: "2025-11-10", domainRep: "MEDIUM", gmailComplaints: 0.200, deliverabilityScore: 97, deliveryRate: 96.5, openRate: 35.8, clickRate: 6.2, unsubRate: 0.05, spamRate: 0.02, sent: 42_000, growth: 0.3 },
  { id: "17", name: "Trending Now", companyId: "3", companyName: "Viral Media Group", owner: "Viral Media (team@viralmedia.io)", integration: "Iterable", subscribers: 130_000, thirtyDayClickers: 4_200, engagementRate: 27.5, status: "active", activeProducts: ["Smart Lead"], createdAt: "2026-01-15", domainRep: "LOW", gmailComplaints: 0.400, deliverabilityScore: 94, deliveryRate: 93.8, openRate: 28.4, clickRate: 3.9, unsubRate: 0.08, spamRate: 0.04, sent: 26_000, growth: -0.5 },
  { id: "18", name: "Liberty Daily", companyId: "4", companyName: "Liberty Publishing", owner: "Liberty (ops@libertypub.com)", integration: "Customer.io", subscribers: 55_000, thirtyDayClickers: 2_100, engagementRate: 24.8, status: "active", activeProducts: ["Smart Lead"], createdAt: "2026-02-20", domainRep: "LOW", gmailComplaints: 0.300, deliverabilityScore: 95, deliveryRate: 94.7, openRate: 30.2, clickRate: 4.5, unsubRate: 0.06, spamRate: 0.03, sent: 11_000, growth: -0.2 },
  { id: "19", name: "Freedom Wire", companyId: "4", companyName: "Liberty Publishing", owner: "Liberty (ops@libertypub.com)", integration: "Customer.io", subscribers: 40_000, thirtyDayClickers: 1_500, engagementRate: 22.1, status: "active", activeProducts: ["Smart Lead", "Smart Pixel"], createdAt: "2026-03-01", domainRep: "MEDIUM", gmailComplaints: 0.100, deliverabilityScore: 96, deliveryRate: 95.9, openRate: 27.6, clickRate: 3.8, unsubRate: 0.04, spamRate: 0.02, sent: 8_000, growth: 0.5 },
];

// ─── Smart Lead Sources ──────────────────────────────────────
export const smartLeadSources: SmartLeadSource[] = [
  { id: 1, newsletter: "Guardian", totalPurchased: 10_000, delivered: 945, remaining: 9_055, available: 27_653, dailyUsage: 253, daysRemaining: 35.8, costPerLead: 0.50, listKey: "7f7c7b27e883a8c6deea85e84ba5d84c", createdAt: "2026-04-06", status: "active" },
  { id: 2, newsletter: "Dupple", totalPurchased: 10_000, delivered: 960, remaining: 9_040, available: 86_024, dailyUsage: 206, daysRemaining: 43.9, costPerLead: 0.50, listKey: "5b3ba401db55c625a9739bde12bdd2b8", createdAt: "2026-04-02", status: "active" },
  { id: 3, newsletter: "6AM - WS", totalPurchased: 5_000, delivered: 392, remaining: 4_608, available: 1_929, dailyUsage: 43, daysRemaining: 107.2, costPerLead: 0.25, listKey: "3a6daa1ca47581cacae53134a0ea2d5e", createdAt: "2026-03-24", status: "active" },
  { id: 4, newsletter: "6AM - TBAY", totalPurchased: 5_000, delivered: 687, remaining: 4_313, available: 7_022, dailyUsage: 103, daysRemaining: 41.9, costPerLead: 0.25, listKey: "8d29743c1efeced43b84ad053710115f", createdAt: "2026-03-24", status: "active" },
  { id: 5, newsletter: "6AM - RIC", totalPurchased: 5_000, delivered: 481, remaining: 4_519, available: 2_456, dailyUsage: 54, daysRemaining: 83.7, costPerLead: 0.25, listKey: "b6a13ea8740ac964dd986fd7a1ec1746", createdAt: "2026-03-24", status: "active" },
  { id: 6, newsletter: "6AM - RAL", totalPurchased: 5_000, delivered: 601, remaining: 4_399, available: 3_207, dailyUsage: 72, daysRemaining: 61.1, costPerLead: 0.25, listKey: "66d3db75f97d22f9138e6e7dbc9a12fd", createdAt: "2026-03-24", status: "active" },
  { id: 7, newsletter: "6AM - NOVA", totalPurchased: 5_000, delivered: 894, remaining: 4_106, available: 11_508, dailyUsage: 135, daysRemaining: 30.4, costPerLead: 0.25, listKey: "25a00ce3a7b273d342037aac00f67f1c", createdAt: "2026-03-24", status: "active" },
  { id: 8, newsletter: "6AM - NOOGA", totalPurchased: 5_000, delivered: 282, remaining: 4_718, available: 963, dailyUsage: 34, daysRemaining: 138.8, costPerLead: 0.25, listKey: "a98ff3fae6ff7cbe9a31307dc813263d", createdAt: "2026-03-24", status: "active" },
  { id: 9, newsletter: "6AM - NASH", totalPurchased: 5_000, delivered: 472, remaining: 4_528, available: 3_458, dailyUsage: 55, daysRemaining: 82.3, costPerLead: 0.25, listKey: "5f24ee6d6d303ef84f4fc10a900c66f7", createdAt: "2026-03-24", status: "active" },
  { id: 10, newsletter: "6AM - LOU", totalPurchased: 5_000, delivered: 359, remaining: 4_641, available: 2_405, dailyUsage: 44, daysRemaining: 105.5, costPerLead: 0.25, listKey: "d4166359434ff7216e6a", createdAt: "2026-03-24", status: "active" },
];

// ─── Feed Management Domains ─────────────────────────────────
export const feedDomains: FeedDomain[] = [
  { name: "Gmail", availability: 3_341, engagementRate: 34.9, volume: 130 },
  { name: "Yahoo", availability: 1_265, engagementRate: 29.9, volume: 29 },
  { name: "Aol", availability: 1_285, engagementRate: 36.3, volume: 8 },
  { name: "Verizon", availability: 211, engagementRate: 39.6, volume: 3 },
  { name: "AT&T", availability: 690, engagementRate: 26.7, volume: 9 },
  { name: "Comcast", availability: 195, engagementRate: 27.9, volume: 4 },
  { name: "Microsoft", availability: 945, engagementRate: 6.2, volume: 9 },
  { name: "Spectrum", availability: 27, engagementRate: 35.9, volume: 1 },
  { name: "Other", availability: 748, engagementRate: 32.2, volume: 7 },
];

// ─── Logs ────────────────────────────────────────────────────
export const logEntries: LogEntry[] = [
  { id: "1", timestamp: "03/17/2026 06:10:44", product: "Smart Lead", listId: "240", email: "lloranger5203@gmail.com", costPerLead: 0, esp: "Customer.io", endpoint: "track.customer.io", responseCode: 200, newsletter: "Liberty Surveys" },
  { id: "2", timestamp: "03/17/2026 02:40:32", product: "Smart Lead", listId: "-955814850", email: "richardgravescbo@gmail.com", costPerLead: 0, esp: "Iterable", endpoint: "api.iterable.com", responseCode: 200, newsletter: "Liberty Surveys" },
  { id: "3", timestamp: "03/17/2026 00:11:47", product: "Smart Lead", listId: "-955814850", email: "patshorey@windstream.net", costPerLead: 0, esp: "Iterable", endpoint: "api.iterable.com", responseCode: 200, newsletter: "Liberty Surveys" },
  { id: "4", timestamp: "03/16/2026 23:45:12", product: "Smart Feed", listId: "312", email: "jmiller@yahoo.com", costPerLead: 0, esp: "Sailthru", endpoint: "api.sailthru.com", responseCode: 200, newsletter: "Daily Skrape" },
  { id: "5", timestamp: "03/16/2026 22:30:05", product: "Smart Lead", listId: "445", email: "sarah.jones@aol.com", costPerLead: 0.25, esp: "Beehiiv", endpoint: "api.beehiiv.com", responseCode: 200, newsletter: "65 Nation" },
  { id: "6", timestamp: "03/16/2026 21:15:33", product: "Smart Pixel", listId: "118", email: "dkennedy@gmail.com", costPerLead: 0, esp: "Sailthru", endpoint: "api.sailthru.com", responseCode: 200, newsletter: "Crystal Clear News" },
  { id: "7", timestamp: "03/16/2026 20:05:19", product: "Smart Reactivation", listId: "667", email: "mwilson@hotmail.com", costPerLead: 0, esp: "Sailthru", endpoint: "api.sailthru.com", responseCode: 200, newsletter: "Healthy Happy News" },
  { id: "8", timestamp: "03/16/2026 19:42:08", product: "Smart Lead", listId: "240", email: "rjohnston@comcast.net", costPerLead: 0.50, esp: "Customer.io", endpoint: "track.customer.io", responseCode: 429, newsletter: "Liberty Surveys" },
  { id: "9", timestamp: "03/16/2026 18:30:55", product: "Smart Feed", listId: "890", email: "tkimball@gmail.com", costPerLead: 0, esp: "Iterable", endpoint: "api.iterable.com", responseCode: 200, newsletter: "Viral Daily" },
  { id: "10", timestamp: "03/16/2026 17:22:41", product: "Smart Lead", listId: "556", email: "bthomas@yahoo.com", costPerLead: 0.25, esp: "Sailthru", endpoint: "api.sailthru.com", responseCode: 500, newsletter: "6AM - NOVA" },
];

// ─── Reactivation Records ────────────────────────────────────
export const reactivationRecords: ReactivationRecord[] = [
  { newsletter: "Daily Skrape", company: "Daily Trends Media", dormantRecords: 88_552, matchedRecords: 12_450 },
  { newsletter: "Investing Pioneer", company: "Daily Trends Media", dormantRecords: 0, matchedRecords: 0 },
  { newsletter: "Daily Brain Buster", company: "Daily Trends Media", dormantRecords: 33_068, matchedRecords: 4_230 },
  { newsletter: "Fit With Age", company: "Daily Trends Media", dormantRecords: 107_914, matchedRecords: 15_800 },
  { newsletter: "Liberty Surveys", company: "Daily Trends Media", dormantRecords: 0, matchedRecords: 0 },
  { newsletter: "Crystal Clear News", company: "Daily Trends Media", dormantRecords: 75_645, matchedRecords: 12 },
  { newsletter: "Middle America News", company: "Daily Trends Media", dormantRecords: 66_667, matchedRecords: 8_900 },
  { newsletter: "Healthy Happy News", company: "Daily Trends Media", dormantRecords: 188_763, matchedRecords: 22_100 },
  { newsletter: "Trivia Nut", company: "Daily Trends Media", dormantRecords: 90_798, matchedRecords: 11_200 },
  { newsletter: "Todays Flashback", company: "Daily Trends Media", dormantRecords: 109_043, matchedRecords: 14_500 },
];

// ─── Admin Users ─────────────────────────────────────────────
export const adminUsers: AdminUser[] = [
  { email: "chris@audiencebridge.io", role: "Admin", lastLogin: "2026-04-10 09:15" },
  { email: "chris@sovidigital.com", role: "Admin", lastLogin: "2026-04-10 08:30" },
  { email: "joecarey81@gmail.com", role: "Account Manager", lastLogin: "2026-04-09 14:22" },
  { email: "justin@sovidigital.com", role: "Admin", lastLogin: "2026-04-10 10:05" },
  { email: "snaedisvalsdottir@gmail.com", role: "Viewer", lastLogin: "2026-04-07 16:45" },
];

// ─── Dashboard Metrics ───────────────────────────────────────
export const dashboardMetrics = {
  summary: {
    totalNewsletters: 19,
    totalSubscribers: 2_905_000,
    newSubsToday: 350,
    overallDeliveryRate: 97.2,
  },
  productPulse: {
    smartPixel: { label: "Smart Pixel", today: 350, thisWeek: 4_299, thisMonth: 25_056, allTime: 1_240_090 },
    smartFeed: { label: "Smart Feed", last5Min: 42, lastHour: 545, last24Hours: 23_386, yesterday: 22_975 },
    smartLeads: { label: "Smart Leads", today: 2_593, thisWeek: 11_548, thisMonth: 21_399, allTime: 85_282 },
    smartReactivation: { label: "Smart Reactivation", today: 2_261, thisWeek: 19_483, thisMonth: 80_381, allTime: 407_450 },
    emailValidation: { label: "Email Validation", last5Min: 42, lastHour: 583, last24Hours: 26_554, yesterday: 26_329 },
  },
  systemMetrics: {
    newSubsIdentified: { today: 346, thisWeek: 3_759, thisMonth: 25_325, allTime: 1_242_468 },
    partnerClickSignals: { today: 521_903, thisWeek: 4_695_795, thisMonth: 20_679_919, allTime: 163_721_742 },
    netNewPartnerClickSignals: { today: 9_652, thisWeek: 79_401, thisMonth: 286_956, allTime: 3_793_187 },
    ctoPartners: { today: 91, thisWeek: 4_340, thisMonth: 16_155, allTime: 110_910 },
    clickEvents: { today: 152_320, thisWeek: 1_911_960, thisMonth: 7_085_742, allTime: 43_594_030 },
    eventsToday: { sent: 1_676_101, opens: 219_271, clicks: 17_451, unsubs: 2_822, bounces: 816, complaints: 3 },
  },
  alerts: [
    { type: "warning" as const, message: "6AM - NOOGA Smart Lead feed running low (34/day, 963 available)", link: "/admin/products/smart-lead" },
    { type: "warning" as const, message: "6AM - WS Smart Lead feed running low (43/day, 1,929 available)", link: "/admin/products/smart-lead" },
    { type: "error" as const, message: "2 failed API responses in last 24 hours (429, 500)", link: "/admin/system/logs" },
    { type: "info" as const, message: "Liberty Publishing trial expires in 14 days", link: "/admin/companies/4" },
    { type: "warning" as const, message: "Microsoft domain engagement rate critically low (6.2%)", link: "/admin/products/smart-lead/feed-management" },
  ],
};

// ─── Invoices ────────────────────────────────────────────────
export const invoices: Invoice[] = [
  { id: "INV-001", company: "Daily Trends Media", amount: 4_500, status: "paid", date: "2026-04-01", plan: "Enterprise" },
  { id: "INV-002", company: "Sovdigital", amount: 1_200, status: "paid", date: "2026-04-01", plan: "Growth" },
  { id: "INV-003", company: "Viral Media Group", amount: 1_200, status: "paid", date: "2026-04-01", plan: "Growth" },
  { id: "INV-004", company: "Liberty Publishing", amount: 0, status: "pending", date: "2026-04-24", plan: "Starter (Trial)" },
  { id: "INV-005", company: "Daily Trends Media", amount: 4_500, status: "paid", date: "2026-03-01", plan: "Enterprise" },
  { id: "INV-006", company: "Sovdigital", amount: 1_200, status: "paid", date: "2026-03-01", plan: "Growth" },
  { id: "INV-007", company: "Viral Media Group", amount: 1_200, status: "failed", date: "2026-03-01", plan: "Growth" },
];

// ─── Feed Sources (growth channels) ─────────────────────────
export interface FeedSource {
  id: string;
  name: string;
  type: "smart-product" | "paid" | "organic";
  newsletter: string;
  engRate: number;
  cpl: number;
  cpes: number;
  available: number;
  recordsSent: number;
  recordsFailed: number;
  volume: number;
  feedStatus: "on" | "off" | "paused";
}

export const feedSources: FeedSource[] = [
  // Smart products
  { id: "fs1", name: "Smart Lead — Net New", type: "smart-product", newsletter: "Daily Skrape", engRate: 9.8, cpl: 0.02, cpes: 0.20, available: 14_254, recordsSent: 26_978, recordsFailed: 0, volume: 100, feedStatus: "on" },
  { id: "fs2", name: "Smart Lead — 6AM DMA", type: "smart-product", newsletter: "65 Nation", engRate: 6.8, cpl: 0.02, cpes: 0.29, available: 2_157, recordsSent: 16_510, recordsFailed: 0, volume: 100, feedStatus: "on" },
  { id: "fs3", name: "Smart Pixel — Retargeting", type: "smart-product", newsletter: "Daily Skrape", engRate: 12.4, cpl: 0.10, cpes: 0.15, available: 8_920, recordsSent: 14_200, recordsFailed: 12, volume: 100, feedStatus: "on" },
  { id: "fs4", name: "Smart Reactivation", type: "smart-product", newsletter: "Fit With Age", engRate: 5.2, cpl: 0.02, cpes: 0.39, available: 11_699, recordsSent: 22_839, recordsFailed: 0, volume: 100, feedStatus: "on" },
  { id: "fs5", name: "Smart Lead — Flyover States", type: "smart-product", newsletter: "Middle America News", engRate: 7.1, cpl: 0.02, cpes: 0.28, available: 5_430, recordsSent: 9_100, recordsFailed: 0, volume: 100, feedStatus: "on" },
  // Paid / external sources
  { id: "fs6", name: "Meta — Lookalike 1%", type: "paid", newsletter: "Daily Skrape", engRate: 4.2, cpl: 1.85, cpes: 1.12, available: 0, recordsSent: 42_300, recordsFailed: 1_240, volume: 41, feedStatus: "on" },
  { id: "fs7", name: "Meta — Interest Targeting", type: "paid", newsletter: "Investing Pioneer", engRate: 3.1, cpl: 2.10, cpes: 1.45, available: 0, recordsSent: 18_750, recordsFailed: 890, volume: 35, feedStatus: "on" },
  { id: "fs8", name: "X (Twitter) — Promoted", type: "paid", newsletter: "Crystal Clear News", engRate: 2.8, cpl: 3.20, cpes: 2.85, available: 0, recordsSent: 8_400, recordsFailed: 320, volume: 22, feedStatus: "paused" },
  { id: "fs9", name: "Taboola — Native Ads", type: "paid", newsletter: "Healthy Happy News", engRate: 3.5, cpl: 1.50, cpes: 0.95, available: 0, recordsSent: 31_200, recordsFailed: 610, volume: 55, feedStatus: "on" },
  // Organic
  { id: "fs10", name: "Organic — Website Signup", type: "organic", newsletter: "Daily Skrape", engRate: 18.2, cpl: 0, cpes: 0, available: 0, recordsSent: 12_400, recordsFailed: 45, volume: 100, feedStatus: "on" },
  { id: "fs11", name: "Organic — Referral Program", type: "organic", newsletter: "Trivia Nut", engRate: 22.5, cpl: 0, cpes: 0, available: 0, recordsSent: 6_800, recordsFailed: 10, volume: 100, feedStatus: "on" },
];

export function getFeedSourcesByNewsletter(newsletterName: string): FeedSource[] {
  return feedSources.filter((s) => s.newsletter === newsletterName);
}

// Feed Management — domain group view with sources per domain
export interface DomainFeedSource {
  name: string;
  availability: number;
  engagementRate: number;
  volume: number;
}

export interface DomainGroup {
  domain: string;
  engagementRate: number;
  dataFed: number;
  optimalVolume: number;
  sources: DomainFeedSource[];
}

export const domainGroups: DomainGroup[] = [
  {
    domain: "Gmail", engagementRate: 9.6, dataFed: 0.8, optimalVolume: 6_817,
    sources: [
      { name: "AE — Satire", availability: 91_172, engagementRate: 11.7, volume: 3_000 },
      { name: "ATTR — Flyover States", availability: 0, engagementRate: 6.2, volume: 3_760 },
      { name: "ATTR — 6AM DMA", availability: 0, engagementRate: 8.2, volume: 0 },
      { name: "Flyover States — Net New", availability: 0, engagementRate: 11.8, volume: 0 },
    ],
  },
  {
    domain: "Yahoo", engagementRate: 8.1, dataFed: 1.2, optimalVolume: 2_450,
    sources: [
      { name: "AE — Satire", availability: 34_200, engagementRate: 10.2, volume: 1_200 },
      { name: "ATTR — Flyover States", availability: 0, engagementRate: 5.8, volume: 1_250 },
    ],
  },
  {
    domain: "Microsoft", engagementRate: 3.4, dataFed: 0.4, optimalVolume: 1_890,
    sources: [
      { name: "AE — Satire", availability: 18_400, engagementRate: 4.1, volume: 900 },
      { name: "ATTR — 6AM DMA", availability: 0, engagementRate: 2.8, volume: 500 },
      { name: "Flyover States — Net New", availability: 0, engagementRate: 3.9, volume: 490 },
    ],
  },
  {
    domain: "AOL", engagementRate: 10.8, dataFed: 0.6, optimalVolume: 820,
    sources: [
      { name: "AE — Satire", availability: 12_100, engagementRate: 12.4, volume: 500 },
      { name: "ATTR — Flyover States", availability: 0, engagementRate: 9.1, volume: 320 },
    ],
  },
  {
    domain: "Comcast", engagementRate: 7.2, dataFed: 0.3, optimalVolume: 410,
    sources: [
      { name: "AE — Satire", availability: 5_600, engagementRate: 8.5, volume: 250 },
      { name: "ATTR — 6AM DMA", availability: 0, engagementRate: 5.9, volume: 160 },
    ],
  },
];

// ─── Delivery Health & Postmaster ────────────────────────────
export interface DeliveryHealthCheck {
  label: string;
  status: "pass" | "fail" | "warning";
}

export const deliveryHealthChecks: DeliveryHealthCheck[] = [
  { label: "CANSPAM Compliance", status: "pass" },
  { label: "SPF Record", status: "pass" },
  { label: "DKIM Signing", status: "pass" },
  { label: "DMARC Policy", status: "pass" },
  { label: "Blacklist Check", status: "pass" },
  { label: "Reverse DNS", status: "pass" },
  { label: "MX Records", status: "pass" },
  { label: "TLS Encryption", status: "warning" },
];

export const postmasterMetrics = {
  spamRate: "0.02%",
  ipReputation: "High",
  domainReputation: "High",
  authentication: "99.8%",
};

export const deliverabilityScore = { score: 92, grade: "A-" };

// ─── Reactivation Tabs ──────────────────────────────────────
export interface ReactivatedSubscriber {
  email: string;
  newsletter: string;
  reactivatedDate: string;
  source: string;
}

export const reactivatedSubscribers: ReactivatedSubscriber[] = [
  { email: "j***@gmail.com", newsletter: "Daily Skrape", reactivatedDate: "2026-04-09", source: "Smart Reactivation" },
  { email: "m***@yahoo.com", newsletter: "Fit With Age", reactivatedDate: "2026-04-09", source: "Smart Reactivation" },
  { email: "s***@aol.com", newsletter: "Healthy Happy News", reactivatedDate: "2026-04-08", source: "Smart Reactivation" },
  { email: "r***@comcast.net", newsletter: "Crystal Clear News", reactivatedDate: "2026-04-08", source: "Smart Reactivation" },
  { email: "d***@gmail.com", newsletter: "Daily Brain Buster", reactivatedDate: "2026-04-07", source: "Smart Reactivation" },
  { email: "k***@hotmail.com", newsletter: "Trivia Nut", reactivatedDate: "2026-04-07", source: "Smart Reactivation" },
  { email: "p***@gmail.com", newsletter: "Todays Flashback", reactivatedDate: "2026-04-06", source: "Smart Reactivation" },
  { email: "a***@yahoo.com", newsletter: "Middle America News", reactivatedDate: "2026-04-06", source: "Smart Reactivation" },
];

export const reactivationSettings = {
  matchCriteria: "Email + First Name",
  reEngagementWindow: "90 days",
  notifyOnMatch: true,
  autoReactivate: false,
  minDormantDays: 60,
};

// ─── Dashboard Chart Data ───────────────────────────────────
export const clickerGrowthData = [
  { day: "Mar 11", clickers: 62_100 }, { day: "Mar 12", clickers: 63_200 }, { day: "Mar 13", clickers: 61_800 },
  { day: "Mar 14", clickers: 64_500 }, { day: "Mar 15", clickers: 65_100 }, { day: "Mar 16", clickers: 63_900 },
  { day: "Mar 17", clickers: 66_200 }, { day: "Mar 18", clickers: 67_800 }, { day: "Mar 19", clickers: 68_100 },
  { day: "Mar 20", clickers: 67_200 }, { day: "Mar 21", clickers: 69_400 }, { day: "Mar 22", clickers: 70_100 },
  { day: "Mar 23", clickers: 68_900 }, { day: "Mar 24", clickers: 71_200 }, { day: "Mar 25", clickers: 72_500 },
  { day: "Mar 26", clickers: 71_800 }, { day: "Mar 27", clickers: 73_400 }, { day: "Mar 28", clickers: 74_100 },
  { day: "Mar 29", clickers: 72_900 }, { day: "Mar 30", clickers: 75_200 }, { day: "Mar 31", clickers: 76_800 },
  { day: "Apr 1", clickers: 75_500 }, { day: "Apr 2", clickers: 77_100 }, { day: "Apr 3", clickers: 78_400 },
  { day: "Apr 4", clickers: 76_900 }, { day: "Apr 5", clickers: 79_200 }, { day: "Apr 6", clickers: 80_100 },
  { day: "Apr 7", clickers: 78_800 }, { day: "Apr 8", clickers: 81_300 }, { day: "Apr 9", clickers: 82_500 },
];

// ─── API Credentials ────────────────────────────────────────
export const apiCredentials = {
  apiKey: "ab-live-****-****-****-7f3c",
  apiSecret: "••••••••••••••••••••••••",
  webhookUrls: [] as string[],
  usage: { requestsToday: 1_245, requestsThisMonth: 38_420, limit: 100_000 },
};

// ─── Notifications ──────────────────────────────────────────
export type NotificationSeverity = "action_needed" | "heads_up" | "good_news" | "info";
export type NotificationCategory = "source_low" | "delivery_issue" | "source_performance" | "feed_volume" | "lead_delivery" | "reactivation" | "billing" | "system";

export interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "error";
  severity: NotificationSeverity;
  category: NotificationCategory;
  message: string;
  newsletter?: string;
  product?: string;
  detail?: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionHref?: string;
}

export const notifications: Notification[] = [
  // Source Data Running Low — the big offender (simulates 8+ near-identical alerts)
  { id: "n1", type: "warning", severity: "heads_up", category: "source_low", message: "Source ATTR - 6AM DNA will be out of leads for AT&T in the next few days.", newsletter: "Daily Skrape", product: "Smart Lead", detail: "AT&T — 2 days remaining", timestamp: "2026-04-13 08:30", read: false, actionLabel: "Review", actionHref: "/portal/smart-lead" },
  { id: "n2", type: "warning", severity: "heads_up", category: "source_low", message: "Source ATTR - 6AM DNA will be out of leads for DiMar in the next few days.", newsletter: "Daily Skrape", product: "Smart Lead", detail: "DiMar — 3 days remaining", timestamp: "2026-04-13 08:30", read: false, actionLabel: "Review", actionHref: "/portal/smart-lead" },
  { id: "n3", type: "warning", severity: "heads_up", category: "source_low", message: "Source ATTR - 6AM DNA will be out of leads for Gmail in the next few days.", newsletter: "Daily Skrape", product: "Smart Lead", detail: "Gmail — 4 days remaining", timestamp: "2026-04-13 08:25", read: false, actionLabel: "Review", actionHref: "/portal/smart-lead" },
  { id: "n4", type: "warning", severity: "heads_up", category: "source_low", message: "Source ATTR - 6AM DNA will be out of leads for Verizon in the next few days.", newsletter: "Daily Skrape", product: "Smart Lead", detail: "Verizon — 3 days remaining", timestamp: "2026-04-13 08:25", read: false, actionLabel: "Review", actionHref: "/portal/smart-lead" },
  { id: "n5", type: "warning", severity: "heads_up", category: "source_low", message: "Source ATTR - 6AM DNA will be out of leads for Microsoft in the next few days.", newsletter: "Daily Skrape", product: "Smart Lead", detail: "Microsoft — 5 days remaining", timestamp: "2026-04-13 08:20", read: false, actionLabel: "Review", actionHref: "/portal/smart-lead" },
  { id: "n6", type: "warning", severity: "heads_up", category: "source_low", message: "Source Flyover States - Net New will be out of leads for Gmail in the next few days.", newsletter: "Fit With Age", product: "Smart Lead", detail: "Gmail — 2 days remaining", timestamp: "2026-04-13 07:45", read: false, actionLabel: "Review", actionHref: "/portal/smart-lead" },
  { id: "n7", type: "warning", severity: "heads_up", category: "source_low", message: "Source Flyover States - Net New will be out of leads for Yahoo in the next few days.", newsletter: "Fit With Age", product: "Smart Lead", detail: "Yahoo — 4 days remaining", timestamp: "2026-04-13 07:45", read: false, actionLabel: "Review", actionHref: "/portal/smart-lead" },
  { id: "n8", type: "warning", severity: "heads_up", category: "source_low", message: "Source Flyover States - Net New will be out of leads for Outlook in the next few days.", newsletter: "Fit With Age", product: "Smart Lead", detail: "Outlook — 6 days remaining", timestamp: "2026-04-13 07:40", read: false, actionLabel: "Review", actionHref: "/portal/smart-lead" },
  { id: "n9", type: "warning", severity: "heads_up", category: "source_low", message: "Source ATTR - SANI DNA will be out of leads for Gmail in the next few days.", newsletter: "Daily Brain Buster", product: "Smart Lead", detail: "Gmail — 3 days remaining", timestamp: "2026-04-12 14:00", read: true, actionLabel: "Review", actionHref: "/portal/smart-lead" },
  { id: "n10", type: "warning", severity: "heads_up", category: "source_low", message: "Source ATTR - SANI DNA will be out of leads for AT&T in the next few days.", newsletter: "Daily Brain Buster", product: "Smart Lead", detail: "AT&T — 5 days remaining", timestamp: "2026-04-12 14:00", read: true, actionLabel: "Review", actionHref: "/portal/smart-lead" },

  // Delivery Issues — action required
  { id: "n11", type: "error", severity: "action_needed", category: "delivery_issue", message: "Delivery Rate 30.89% fell below 95% for Comcast.", newsletter: "Daily Skrape", product: "Smart Delivery", detail: "Recommend lowering Comcast heads and tightening up on your Comcast sending segments.", timestamp: "2026-04-13 06:00", read: false, actionLabel: "Fix Now", actionHref: "/portal/smart-delivery" },
  { id: "n12", type: "error", severity: "action_needed", category: "delivery_issue", message: "Delivery Rate 17.65% fell below 95% for Spectrum.", newsletter: "Daily Skrape", product: "Smart Delivery", detail: "Recommend lowering Spectrum heads and tightening up on your Spectrum sending segments.", timestamp: "2026-04-13 06:00", read: false, actionLabel: "Fix Now", actionHref: "/portal/smart-delivery" },

  // Outstanding Source Performance — good news
  { id: "n13", type: "success", severity: "good_news", category: "source_performance", message: "Source Flyover States - Net New has an engagement rate of 92.9%.", newsletter: "Fit With Age", product: "Smart Lead", detail: "Look to increase volume from this source.", timestamp: "2026-04-12 10:00", read: true, actionLabel: "Details", actionHref: "/portal/smart-lead" },
  { id: "n14", type: "success", severity: "good_news", category: "source_performance", message: "Source ME - Sable has an engagement rate of 91.6%.", newsletter: "Fit With Age", product: "Smart Lead", detail: "Look to increase volume from this source.", timestamp: "2026-04-12 10:00", read: true, actionLabel: "Details", actionHref: "/portal/smart-lead" },

  // Smart Feed volume change
  { id: "n15", type: "warning", severity: "heads_up", category: "feed_volume", message: "Smart Feed volume decreased by 14,869.", newsletter: "Daily Skrape", product: "Smart Feed", detail: "Review if any sources have run out of leads.", timestamp: "2026-04-12 07:00", read: true, actionLabel: "Review", actionHref: "/portal/smart-feed" },

  // Lead deliveries — good news
  { id: "n16", type: "success", severity: "good_news", category: "lead_delivery", message: "Smart Lead delivery completed for Daily Skrape — 253 leads delivered.", newsletter: "Daily Skrape", product: "Smart Lead", timestamp: "2026-04-10 09:15", read: true },
  { id: "n17", type: "success", severity: "good_news", category: "reactivation", message: "Smart Reactivation matched 1,240 subscribers for Healthy Happy News.", newsletter: "Healthy Happy News", product: "Smart Reactivation", timestamp: "2026-04-09 10:22", read: true },

  // Info / system
  { id: "n18", type: "info", severity: "info", category: "billing", message: "Your April billing statement is ready — $4,500.00.", timestamp: "2026-04-09 14:00", read: true, actionLabel: "View", actionHref: "/portal/billing" },
  { id: "n19", type: "info", severity: "info", category: "system", message: "Monthly performance report generated for all newsletters.", timestamp: "2026-04-08 06:00", read: true },
];

// ─── Notification Grouping Helpers ──────────────────────────
export interface NotificationGroup {
  category: NotificationCategory;
  severity: NotificationSeverity;
  title: string;
  summary: string;
  items: Notification[];
  unreadCount: number;
  actionLabel?: string;
  actionHref?: string;
}

export function groupNotifications(notifs: Notification[]): NotificationGroup[] {
  const buckets = new Map<string, Notification[]>();

  for (const n of notifs) {
    const key = `${n.severity}:${n.category}`;
    const arr = buckets.get(key) || [];
    arr.push(n);
    buckets.set(key, arr);
  }

  const groups: NotificationGroup[] = [];

  for (const [, items] of buckets) {
    const first = items[0];
    const unreadCount = items.filter((n) => !n.read).length;

    // Build human-readable summary
    const newsletters = [...new Set(items.map((n) => n.newsletter).filter(Boolean))];
    const details = items.map((n) => n.detail).filter(Boolean);

    let title = "";
    let summary = "";

    switch (first.category) {
      case "source_low":
        title = `${items.length} sources running low`;
        summary = newsletters.length > 0
          ? `Across ${newsletters.join(", ")}. Most urgent: ${details.slice(0, 2).join("; ")}`
          : `${details.slice(0, 2).join("; ")}`;
        break;
      case "delivery_issue":
        title = `Delivery issues on ${items.length} domain${items.length > 1 ? "s" : ""}`;
        summary = items.map((n) => n.detail || n.message).slice(0, 2).join(". ");
        break;
      case "source_performance":
        title = `${items.length} sources performing well`;
        summary = newsletters.length > 0
          ? `Strong engagement on ${newsletters.join(", ")}`
          : "High engagement rates detected";
        break;
      case "feed_volume":
        title = "Smart Feed volume change";
        summary = first.message;
        break;
      case "lead_delivery":
        title = `${items.length} lead deliver${items.length > 1 ? "ies" : "y"} completed`;
        summary = newsletters.length > 0 ? `For ${newsletters.join(", ")}` : first.message;
        break;
      case "reactivation":
        title = "Reactivation matches completed";
        summary = first.message;
        break;
      case "billing":
        title = "Billing update";
        summary = first.message;
        break;
      case "system":
        title = "System update";
        summary = first.message;
        break;
      default:
        title = first.message;
        summary = "";
    }

    groups.push({
      category: first.category,
      severity: first.severity,
      title,
      summary,
      items,
      unreadCount,
      actionLabel: first.actionLabel,
      actionHref: first.actionHref,
    });
  }

  // Sort: action_needed first, then heads_up, then good_news, then info
  const severityOrder: Record<NotificationSeverity, number> = { action_needed: 0, heads_up: 1, good_news: 2, info: 3 };
  groups.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return groups;
}

// ─── Portal Product Status & Config ─────────────────────────
export type PortalProductStatus = "active" | "trial" | "available";

export interface PortalProduct {
  key: string;
  name: string;
  status: PortalProductStatus;
  tagline: string;
  description: string;
  benefits: string[];
  pricing: string;
  href: string;
  trialDaysRemaining?: number;
}

export const portalProducts: PortalProduct[] = [
  {
    key: "smartLead", name: "Smart Lead", status: "active",
    tagline: "Targeted subscriber acquisition",
    description: "Grow your newsletter with targeted, high-intent subscribers delivered daily.",
    benefits: ["Audience-matched leads delivered to your ESP", "Real-time tracking of delivery and engagement", "Flexible daily volume controls"],
    pricing: "$0.50/lead", href: "/portal/smart-lead",
  },
  {
    key: "smartPixel", name: "Smart Pixel", status: "trial",
    tagline: "Intent-rich visitor capture",
    description: "Track pre-subscribe behavior on your site and convert intent-rich visitors into subscribers.",
    benefits: ["Drop-in pixel for any website", "Captures visitor intent before they subscribe", "Integrates with your existing ESP"],
    pricing: "From $0.10/pixel", href: "/portal/smart-pixel", trialDaysRemaining: 18,
  },
  {
    key: "smartFeed", name: "Smart Feed", status: "active",
    tagline: "Automated daily growth",
    description: "Automated list feeder that optimizes your daily subscriber growth with smart distribution.",
    benefits: ["Set-and-forget daily list growth", "Domain-level engagement optimization", "Volume controls by domain group"],
    pricing: "From $250/mo", href: "/portal/smart-feed",
  },
  {
    key: "smartDelivery", name: "Smart Delivery", status: "available",
    tagline: "Inbox placement & monitoring",
    description: "Get your emails to inbox and drive engagement with deliverability monitoring and optimization.",
    benefits: ["Sender health checks (SPF, DKIM, DMARC)", "Google Postmaster Tools integration", "Domain-level deliverability reporting"],
    pricing: "$2,000/mo", href: "/portal/smart-delivery",
  },
  {
    key: "smartReactivation", name: "Smart Reactivation", status: "active",
    tagline: "Win back dormant subscribers",
    description: "Turn dormant subscribers back into engaged readers with smart matching and re-engagement.",
    benefits: ["Upload dormant lists for matching", "Automated re-engagement workflows", "Track recovery rates by newsletter"],
    pricing: "$0.02/match", href: "/portal/smart-reactivation",
  },
  {
    key: "emailValidation", name: "Email Validation", status: "available",
    tagline: "List hygiene & deliverability",
    description: "Clean your list with real-time email validation for better deliverability and lower bounce rates.",
    benefits: ["Real-time validation at point of capture", "Bulk list cleaning via CSV upload", "Catches invalid, risky, and disposable emails"],
    pricing: "Bundled with Smart Lead or standalone", href: "/portal/email-validation",
  },
];

export function getPortalProduct(key: string): PortalProduct | undefined {
  return portalProducts.find((p) => p.key === key);
}

// ─── Reporting Analytics (deterministic) ────────────────────
export const reportingAnalytics = [
  { newsletterId: "1", totalLeads: 423, cpes: 0.87, leadsTrend: "+15%", positive: true },
  { newsletterId: "2", totalLeads: 312, cpes: 1.12, leadsTrend: "+8%", positive: true },
  { newsletterId: "3", totalLeads: 287, cpes: 0.95, leadsTrend: "+12%", positive: true },
  { newsletterId: "4", totalLeads: 198, cpes: 1.34, leadsTrend: "-3%", positive: false },
  { newsletterId: "5", totalLeads: 156, cpes: 1.48, leadsTrend: "+5%", positive: true },
  { newsletterId: "6", totalLeads: 341, cpes: 0.92, leadsTrend: "+18%", positive: true },
];

// ─── Time-Range Scaling ─────────────────────────────────────
// Simulates data for different time ranges by scaling the base daily values
// with realistic variance. In production this would be a ClickHouse query.
export type TimeRange = "24h" | "7d" | "30d" | "90d" | "ytd" | "all";

const rangeMultipliers: Record<TimeRange, number> = {
  "24h": 1,
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "ytd": 103, // ~Apr 13 = day 103 of year
  "all": 240, // ~8 months since first newsletter
};

// Adds slight variance so numbers don't look perfectly multiplied
function vary(base: number, mult: number, variance = 0.08): number {
  const jitter = 1 + (Math.sin(base * 7 + mult * 13) * variance);
  return Math.round(base * mult * jitter);
}

export function scaleForRange(dailyValue: number, range: TimeRange): number {
  return vary(dailyValue, rangeMultipliers[range]);
}

// Get product pulse metrics scaled to a time range
export function getProductPulseForRange(range: TimeRange) {
  const m = rangeMultipliers[range];
  const { smartLeads, smartPixel, smartReactivation, smartFeed, emailValidation } = dashboardMetrics.productPulse;
  return {
    smartLeads: { units: vary(smartLeads.today, m), revenue: vary(smartLeads.today, m) * 0.50 },
    smartPixel: { units: vary(smartPixel.today, m), revenue: vary(smartPixel.today, m) * 0.15 },
    smartReactivation: { units: vary(smartReactivation.today, m), revenue: vary(smartReactivation.today, m) * 0.02 },
    smartFeed: { units: vary(smartFeed.last24Hours, m), revenue: 0 }, // MRR-based
    emailValidation: { units: vary(emailValidation.last24Hours, m), revenue: 0 },
  };
}

// Get system event totals scaled to a time range
export function getSystemEventsForRange(range: TimeRange) {
  const m = rangeMultipliers[range];
  const sm = dashboardMetrics.systemMetrics;
  return {
    newSubsIdentified: vary(sm.newSubsIdentified.today, m),
    partnerClickSignals: vary(sm.partnerClickSignals.today, m),
    netNewPartnerClickSignals: vary(sm.netNewPartnerClickSignals.today, m),
    ctoPartners: vary(sm.ctoPartners.today, m),
    clickEvents: vary(sm.clickEvents.today, m),
    sent: vary(sm.eventsToday.sent, m),
    opens: vary(sm.eventsToday.opens, m),
    clicks: vary(sm.eventsToday.clicks, m),
    unsubs: vary(sm.eventsToday.unsubs, m),
    bounces: vary(sm.eventsToday.bounces, m),
    complaints: vary(sm.eventsToday.complaints, m),
  };
}

// Get newsletter delivery metrics scaled to a time range
export function getNewsletterMetricsForRange(newsletter: Newsletter, range: TimeRange) {
  const m = rangeMultipliers[range];
  return {
    ...newsletter,
    sent: vary(newsletter.sent, m),
    // Rates stay roughly the same regardless of range (they're percentages)
    deliveryRate: +(newsletter.deliveryRate + Math.sin(m) * 0.3).toFixed(1),
    openRate: +(newsletter.openRate + Math.sin(m * 2) * 0.5).toFixed(1),
    clickRate: +(newsletter.clickRate + Math.sin(m * 3) * 0.2).toFixed(1),
  };
}

// ─── Helper Functions ────────────────────────────────────────
export function formatNumber(n: number): string {
  return n.toLocaleString();
}

export function getCompanyById(id: string): Company | undefined {
  return companies.find((c) => c.id === id);
}

export function getNewsletterById(id: string): Newsletter | undefined {
  return newsletters.find((n) => n.id === id);
}

export function getNewslettersByCompany(companyId: string): Newsletter[] {
  return newsletters.filter((n) => n.companyId === companyId);
}

export function getCompanyHealthStatus(company: Company): "critical" | "warning" | "healthy" {
  const inventories = Object.values(company.products) as ProductInventory[];
  if (inventories.length === 0) return "healthy";
  if (inventories.some((inv) => inv.remaining === 0)) return "critical";
  if (inventories.some((inv) => inv.estDaysRemaining < 10)) return "warning";
  return "healthy";
}

export function getLowestInventory(company: Company): { product: string; days: number } | null {
  const entries = Object.entries(company.products) as [string, ProductInventory][];
  if (entries.length === 0) return null;
  const productLabels: Record<string, string> = {
    smartLead: "Lead", smartFeed: "Feed", smartPixel: "Pixel",
    smartDelivery: "Delivery", smartReactivation: "Reactivation",
  };
  let lowest: { product: string; days: number } | null = null;
  for (const [key, inv] of entries) {
    if (!lowest || inv.estDaysRemaining < lowest.days) {
      lowest = { product: productLabels[key] || key, days: inv.estDaysRemaining };
    }
  }
  return lowest;
}

interface Alert {
  type: "warning" | "error" | "info";
  message: string;
  link: string;
}

export function generateInventoryAlerts(companyList: Company[]): Alert[] {
  const alerts: Alert[] = [];
  for (const company of companyList) {
    const productLabels: Record<string, string> = {
      smartLead: "Smart Lead", smartFeed: "Smart Feed", smartPixel: "Smart Pixel",
      smartDelivery: "Smart Delivery", smartReactivation: "Smart Reactivation",
    };
    for (const [key, inv] of Object.entries(company.products) as [string, ProductInventory][]) {
      const label = productLabels[key] || key;
      if (inv.remaining === 0) {
        alerts.push({ type: "error", message: `${company.name} — ${label} inventory depleted (0 remaining)`, link: `/admin/companies/${company.id}` });
      } else if (inv.estDaysRemaining < 10) {
        alerts.push({ type: "warning", message: `${company.name} — ${label} running low (${inv.estDaysRemaining} days remaining)`, link: `/admin/companies/${company.id}` });
      }
      if (inv.dailyUsage > 0 && inv.dailyUsage < 5 && inv.remaining > 0) {
        alerts.push({ type: "warning", message: `${company.name} — ${label} usage stalled (${inv.dailyUsage}/day)`, link: `/admin/companies/${company.id}` });
      }
    }
  }
  // Static alerts
  alerts.push({ type: "error", message: "2 failed API responses in last 24 hours (429, 500)", link: "/admin/system/logs" });
  if (companyList.find((c) => c.status === "trial")) {
    alerts.push({ type: "info", message: "Liberty Publishing trial expires in 14 days", link: "/admin/companies/4" });
  }
  return alerts;
}
