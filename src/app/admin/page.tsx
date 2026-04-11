import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard, MetricCard } from "@/components/shared/MetricCard";
import { AlertsPanel } from "@/components/admin/AlertsPanel";
import {
  dashboardMetrics, companies, generateInventoryAlerts, getCompanyHealthStatus,
  reportingAnalytics, getNewsletterById,
} from "@/lib/mock-data";

const LEAD_RATE = 0.50;
const MATCH_RATE = 0.02;
const DELIVERY_MRR = 2_000;

function getPixelRate(units: number): number {
  if (units >= 50_000) return 0.10;
  if (units >= 10_000) return 0.15;
  return 0.25;
}
function getFeedMRR(dailyUsage: number): number {
  if (dailyUsage >= 500) return 3_500;
  if (dailyUsage >= 200) return 1_500;
  if (dailyUsage >= 50) return 500;
  return 250;
}

export default function AdminDashboard() {
  const { summary, productPulse } = dashboardMetrics;
  const alerts = generateInventoryAlerts(companies);
  const attentionCompanies = companies.filter((c) => getCompanyHealthStatus(c) !== "healthy");

  // Revenue calculations — per-unit products use activity * rate
  const { smartLeads, smartPixel: sp, smartReactivation: sr, smartFeed: sf } = productPulse;

  // Smart Lead revenue by period ($0.50/lead)
  const leadRevDaily = smartLeads.today * LEAD_RATE;
  const leadRevWeekly = smartLeads.thisWeek * LEAD_RATE;
  const leadRevMonthly = smartLeads.thisMonth * LEAD_RATE;
  const leadRevAllTime = smartLeads.allTime * LEAD_RATE;

  // Smart Pixel — use avg rate across companies for period estimates
  const avgPixelRate = 0.15;
  const pixelRevDaily = sp.today * avgPixelRate;
  const pixelRevWeekly = sp.thisWeek * avgPixelRate;
  const pixelRevMonthly = sp.thisMonth * avgPixelRate;
  const pixelRevAllTime = sp.allTime * avgPixelRate;

  // Smart Reactivation ($0.02/match)
  const reactRevDaily = sr.today * MATCH_RATE;
  const reactRevWeekly = sr.thisWeek * MATCH_RATE;
  const reactRevMonthly = sr.thisMonth * MATCH_RATE;
  const reactRevAllTime = sr.allTime * MATCH_RATE;

  // Recurring revenue (Feed MRR + Delivery MRR)
  const feedMRR = companies.reduce((s, c) => c.products.smartFeed ? s + getFeedMRR(c.products.smartFeed.dailyUsage) : s, 0);
  const deliveryMRR = companies.filter((c) => c.products.smartDelivery).length * DELIVERY_MRR;
  const recurringMRR = feedMRR + deliveryMRR;
  const recurringDaily = recurringMRR / 30;
  const recurringWeekly = recurringMRR / 4.33;

  // Totals by period
  const revDaily = leadRevDaily + pixelRevDaily + reactRevDaily + recurringDaily;
  const revWeekly = leadRevWeekly + pixelRevWeekly + reactRevWeekly + recurringWeekly;
  const revMonthly = leadRevMonthly + pixelRevMonthly + reactRevMonthly + recurringMRR;
  const revQuarterly = revMonthly * 3;
  const revYearly = revMonthly * 12;
  const revAllTime = leadRevAllTime + pixelRevAllTime + reactRevAllTime;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Audience Bridge Admin Overview" />

      {/* Revenue Summary */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Revenue</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500">Today</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">${revDaily.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500">This Week</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">${revWeekly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500">This Month</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">${revMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500">This Quarter</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">${revQuarterly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500">This Year</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">${revYearly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
      </div>

      {/* Revenue by Product */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Smart Lead</p>
          <p className="text-lg font-bold text-gray-900">${leadRevMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}<span className="text-xs text-gray-400">/mo</span></p>
          <p className="text-[10px] text-gray-400">${leadRevAllTime.toLocaleString(undefined, { maximumFractionDigits: 0 })} all time</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Smart Pixel</p>
          <p className="text-lg font-bold text-gray-900">${pixelRevMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}<span className="text-xs text-gray-400">/mo</span></p>
          <p className="text-[10px] text-gray-400">${pixelRevAllTime.toLocaleString(undefined, { maximumFractionDigits: 0 })} all time</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Smart Reactivation</p>
          <p className="text-lg font-bold text-gray-900">${reactRevMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}<span className="text-xs text-gray-400">/mo</span></p>
          <p className="text-[10px] text-gray-400">${reactRevAllTime.toLocaleString(undefined, { maximumFractionDigits: 0 })} all time</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Smart Feed</p>
          <p className="text-lg font-bold text-gray-900">${feedMRR.toLocaleString()}<span className="text-xs text-gray-400">/mo</span></p>
          <p className="text-[10px] text-gray-400">recurring</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Smart Delivery</p>
          <p className="text-lg font-bold text-gray-900">${deliveryMRR.toLocaleString()}<span className="text-xs text-gray-400">/mo</span></p>
          <p className="text-[10px] text-gray-400">recurring</p>
        </div>
      </div>

      {/* Platform KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Total Newsletters" value={summary.totalNewsletters} trend={{ value: "+2 this month", positive: true }} />
        <SummaryCard title="Total Subscribers" value="2.9M" trend={{ value: "+3.2%", positive: true }} subtitle="vs last month" />
        <SummaryCard title="New Subs Today" value={summary.newSubsToday} trend={{ value: "+12%", positive: true }} subtitle="vs yesterday" />
        <SummaryCard title="Delivery Rate" value={`${summary.overallDeliveryRate}%`} trend={{ value: "+0.3%", positive: true }} subtitle="vs last week" />
      </div>

      {/* Alerts */}
      <div className="mb-6">
        <AlertsPanel alerts={alerts} />
      </div>

      {/* Companies Needing Attention */}
      {attentionCompanies.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Companies Needing Attention</h2>
          <div className="flex flex-wrap gap-2">
            {attentionCompanies.map((c) => {
              const health = getCompanyHealthStatus(c);
              return (
                <Link key={c.id} href={`/admin/companies/${c.id}`}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors hover:shadow-sm ${
                    health === "critical" ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100" : "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                  }`}>
                  <span className={`w-2 h-2 rounded-full ${health === "critical" ? "bg-red-500" : "bg-yellow-500"}`} />
                  {c.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Newsletter Analytics (moved from Reporting) */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Newsletter Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {reportingAnalytics.map((entry) => {
          const nl = getNewsletterById(entry.newsletterId);
          if (!nl) return null;
          return (
            <div key={entry.newsletterId} className="bg-white rounded-lg border border-gray-200 p-5">
              <h4 className="font-semibold text-gray-900 mb-3">{nl.name}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Total Leads</p>
                  <p className="text-xl font-bold text-gray-900">{entry.totalLeads}</p>
                  <span className={`text-xs font-medium ${entry.positive ? "text-green-600" : "text-red-500"}`}>{entry.leadsTrend}</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">CPES</p>
                  <p className="text-xl font-bold text-gray-900">${entry.cpes.toFixed(2)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Pulse */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Product Pulse</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard title={productPulse.smartPixel.label} metrics={[
          { label: "Today", value: productPulse.smartPixel.today, color: "text-blue-600" },
          { label: "This Week", value: productPulse.smartPixel.thisWeek, color: "text-blue-500" },
          { label: "This Month", value: productPulse.smartPixel.thisMonth, color: "text-green-600" },
        ]} />
        <MetricCard title={productPulse.smartFeed.label} metrics={[
          { label: "Last 5 min", value: productPulse.smartFeed.last5Min, color: "text-blue-600" },
          { label: "Last Hour", value: productPulse.smartFeed.lastHour, color: "text-blue-500" },
          { label: "Last 24h", value: productPulse.smartFeed.last24Hours, color: "text-green-600" },
        ]} />
        <MetricCard title={productPulse.smartLeads.label} metrics={[
          { label: "Today", value: productPulse.smartLeads.today, color: "text-blue-600" },
          { label: "This Week", value: productPulse.smartLeads.thisWeek, color: "text-blue-500" },
          { label: "This Month", value: productPulse.smartLeads.thisMonth, color: "text-yellow-600" },
        ]} />
        <MetricCard title={productPulse.smartReactivation.label} metrics={[
          { label: "Today", value: productPulse.smartReactivation.today, color: "text-blue-600" },
          { label: "This Week", value: productPulse.smartReactivation.thisWeek, color: "text-blue-500" },
          { label: "All Time", value: productPulse.smartReactivation.allTime, color: "text-red-500" },
        ]} />
        <MetricCard title={productPulse.emailValidation.label} metrics={[
          { label: "Last 5 min", value: productPulse.emailValidation.last5Min, color: "text-blue-600" },
          { label: "Last Hour", value: productPulse.emailValidation.lastHour, color: "text-blue-500" },
          { label: "Last 24h", value: productPulse.emailValidation.last24Hours, color: "text-green-600" },
        ]} />
      </div>
    </div>
  );
}
