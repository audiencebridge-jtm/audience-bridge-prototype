import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard } from "@/components/shared/MetricCard";
import { AdminHealthBar } from "@/components/admin/AdminHealthBar";
import { AdminGroupedAlerts } from "@/components/admin/AdminGroupedAlerts";
import {
  dashboardMetrics, generateInventoryAlerts,
  getSystemEventsForRange, getCompanies,
} from "@/lib/data";

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

export default async function AdminDashboard() {
  const companies = await getCompanies();
  const { summary, productPulse } = dashboardMetrics;
  const alerts = generateInventoryAlerts(companies);


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

  // System events — real-time operational pulse
  const events = getSystemEventsForRange("24h");
  const eventsWeek = getSystemEventsForRange("7d");
  const eventsMonth = getSystemEventsForRange("30d");
  const eventsAll = getSystemEventsForRange("all");

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Audience Bridge Admin Overview" />

      <AdminHealthBar companies={companies} />

      {/* Grouped Alerts — right after health bar for immediate triage */}
      <AdminGroupedAlerts alerts={alerts} />

      {/* Revenue Summary */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Revenue</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-4">
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-5">
          <p className="text-xs sm:text-sm font-medium text-gray-500">Today</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">${revDaily.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-5">
          <p className="text-xs sm:text-sm font-medium text-gray-500">This Week</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">${revWeekly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-5">
          <p className="text-xs sm:text-sm font-medium text-gray-500">This Month</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">${revMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-5">
          <p className="text-xs sm:text-sm font-medium text-gray-500">This Quarter</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">${revQuarterly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-5">
          <p className="text-xs sm:text-sm font-medium text-gray-500">This Year</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">${revYearly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
      </div>

      {/* Product Pulse + Revenue */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Product Pulse</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          { name: "Smart Lead", today: smartLeads.today, week: smartLeads.thisWeek, month: smartLeads.thisMonth, rate: LEAD_RATE, href: "/admin/products/smart-lead" },
          { name: "Smart Pixel", today: sp.today, week: sp.thisWeek, month: sp.thisMonth, rate: avgPixelRate, href: "/admin/products/smart-pixel" },
          { name: "Smart Reactivation", today: sr.today, week: sr.thisWeek, month: sr.thisMonth, rate: MATCH_RATE, href: "/admin/products/smart-reactivation" },
          { name: "Smart Feed", today: sf.last24Hours, week: sf.last24Hours * 7, month: sf.last24Hours * 30, rate: 0, mrr: feedMRR, href: "/admin/products/smart-feed" },
        ].map((p) => (
          <Link key={p.name} href={p.href} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 hover:border-blue-300 hover:shadow-sm transition-all">
            <h4 className="text-sm font-semibold text-gray-500 mb-3">{p.name}</h4>
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3">
              <div>
                <p className="text-lg sm:text-xl font-bold text-blue-600">{p.today.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">Today</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold text-blue-500">{p.week.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">This Week</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold text-green-600">{p.month.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">This Month</p>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3 grid grid-cols-3 gap-2 sm:gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">${(p.mrr ? (p.mrr / 30) : p.today * p.rate).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                <p className="text-[10px] text-gray-400">Rev Today</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">${(p.mrr ? (p.mrr / 4.33) : p.week * p.rate).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                <p className="text-[10px] text-gray-400">Rev Week</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">${(p.mrr ? p.mrr : p.month * p.rate).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                <p className="text-[10px] text-gray-400">Rev Month</p>
              </div>
            </div>
          </Link>
        ))}

        {/* Smart Delivery — retainer/consulting */}
        <Link href="/admin/products/smart-delivery" className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 hover:border-blue-300 hover:shadow-sm transition-all">
          <h4 className="text-sm font-semibold text-gray-500 mb-4">Smart Delivery</h4>
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{companies.filter((c) => c.products.smartDelivery).length}</p>
              <p className="text-xs text-gray-400 mt-1">Active Clients</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">${deliveryMRR.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">MRR</p>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-4 pt-3 flex items-center justify-between">
            <p className="text-xs text-gray-400">${DELIVERY_MRR.toLocaleString()}/mo per client</p>
            <span className="text-xs text-blue-600 font-medium">View Details →</span>
          </div>
        </Link>
      </div>

      {/* Signal Loop */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Signal Loop & DTM KPI's</h2>

      {/* Publisher Signals — top row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        {[
          { label: "New Subs Identified", today: events.newSubsIdentified, week: eventsWeek.newSubsIdentified, month: eventsMonth.newSubsIdentified, all: eventsAll.newSubsIdentified, colors: ["text-green-600", "text-green-600", "text-green-600", "text-green-600"] },
          { label: "Real-time Partner Click Signals", today: events.partnerClickSignals, week: eventsWeek.partnerClickSignals, month: eventsMonth.partnerClickSignals, all: eventsAll.partnerClickSignals, colors: ["text-blue-600", "text-blue-600", "text-yellow-600", "text-green-600"] },
        ].map((e) => (
          <div key={e.label} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
            <p className="text-xs font-semibold text-gray-500 mb-3">{e.label}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { value: e.today, label: "Today", color: e.colors[0] },
                { value: e.week, label: "This Week", color: e.colors[1] },
                { value: e.month, label: "This Month", color: e.colors[2] },
                { value: e.all, label: "All Time", color: e.colors[3] },
              ].map((col) => (
                <div key={col.label}>
                  <p className={`text-base sm:text-lg font-bold ${col.color}`}>{col.value.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400">{col.label}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
          <p className="text-xs font-semibold text-gray-500 mb-3">Net New Partner Click Signals</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { value: events.netNewPartnerClickSignals, label: "Today", color: "text-green-600" },
              { value: eventsWeek.netNewPartnerClickSignals, label: "This Week", color: "text-green-600" },
              { value: eventsMonth.netNewPartnerClickSignals, label: "This Month", color: "text-yellow-600" },
              { value: eventsAll.netNewPartnerClickSignals, label: "All Time", color: "text-green-600" },
            ].map((col) => (
              <div key={col.label}>
                <p className={`text-base sm:text-lg font-bold ${col.color}`}>{col.value.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">{col.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
          <p className="text-xs font-semibold text-gray-500 mb-3">CTO Partners</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { value: events.ctoPartners, label: "Today", color: "text-blue-600" },
              { value: eventsWeek.ctoPartners, label: "This Week", color: "text-blue-600" },
              { value: eventsMonth.ctoPartners, label: "This Month", color: "text-green-600" },
              { value: eventsAll.ctoPartners, label: "All Time", color: "text-green-600" },
            ].map((col) => (
              <div key={col.label}>
                <p className={`text-base sm:text-lg font-bold ${col.color}`}>{col.value.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">{col.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Click Events + Events Today — side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
          <p className="text-xs font-semibold text-gray-500 mb-3">Click Events</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { value: events.clickEvents, label: "Today", color: "text-green-600" },
              { value: eventsWeek.clickEvents, label: "This Week", color: "text-green-600" },
              { value: eventsMonth.clickEvents, label: "This Month", color: "text-green-600" },
              { value: eventsAll.clickEvents, label: "All Time", color: "text-green-600" },
            ].map((col) => (
              <div key={col.label}>
                <p className={`text-base sm:text-lg font-bold ${col.color}`}>{col.value.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">{col.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
          <p className="text-xs font-semibold text-gray-500 mb-3">Events Today</p>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[
              { label: "Sent", value: events.sent, color: "text-green-600" },
              { label: "Opens", value: events.opens, color: "text-blue-600" },
              { label: "Clicks", value: events.clicks, color: "text-blue-600" },
              { label: "Unsubs", value: events.unsubs, color: "text-yellow-600" },
              { label: "Bounces", value: events.bounces, color: "text-red-500" },
              { label: "Complaints", value: events.complaints, color: "text-red-600" },
            ].map((e) => (
              <div key={e.label}>
                <p className={`text-base sm:text-lg font-bold ${e.color}`}>{e.value.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">{e.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
