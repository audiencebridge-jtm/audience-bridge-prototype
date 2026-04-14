import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SimpleLineChart } from "@/components/portal/SimpleLineChart";
import { GreetingLine } from "@/components/shared/GreetingLine";
import { AccountHealthBar } from "@/components/portal/AccountHealthBar";
import { getNewslettersByCompany, getCompanyById, clickerGrowthData, portalProducts, type ProductInventory } from "@/lib/mock-data";

// Product brand colors from Figma style guide
const productColors: Record<string, string> = {
  smartLead: "#0097FF",
  smartPixel: "#FD9F4C",
  smartFeed: "#0097FF",
  smartDelivery: "#0E9488",
  smartReactivation: "#036383",
  emailValidation: "#036383",
};

export default function PortalDashboard() {
  const myNewsletters = getNewslettersByCompany("1");
  const totalSubs = myNewsletters.reduce((s, n) => s + n.subscribers, 0);

  const chartData = clickerGrowthData.map((d) => ({ label: d.day, value: d.clickers }));

  return (
    <div>
      <GreetingLine name="Daily Trends Media" />
      <PageHeader title="Account Overview" subtitle="Your newsletters, products, and performance at a glance" />

      <AccountHealthBar />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Total Subscribers" value={totalSubs.toLocaleString()} trend={{ value: "+4.8%", positive: true }} subtitle="vs last month" />
        <SummaryCard title="New Subs This Month" value="25,056" trend={{ value: "+12%", positive: true }} />
        <SummaryCard title="Budget Remaining" value="$18,500" subtitle="of $25,000" />
        <SummaryCard title="Avg Engagement Rate" value="30.4%" trend={{ value: "+2.1%", positive: true }} />
      </div>

      {/* 30-Day Clickers Chart */}
      <div className="bg-white rounded-lg border border-gray-200/80 p-6 mb-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] hover:shadow-sm transition-all duration-200">
        <h3 className="font-semibold text-gray-900 mb-4 font-heading">30 Day Clickers Growth Over Time</h3>
        <SimpleLineChart data={chartData} height={220} />
      </div>

      {/* Newsletter Table */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">My Newsletters</h2>
      <div className="bg-white rounded-lg border border-gray-200/80 overflow-hidden mb-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Newsletter</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Subscribers</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">30-Day Clickers</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Growth</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Feed</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Domain Rep</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Gmail Complaints</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Delivery</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[...myNewsletters].sort((a, b) => {
              const attentionScore = (n: typeof a) => {
                let score = 0;
                if (n.domainRep === "LOW") score += 2;
                else if (n.domainRep === "MEDIUM") score += 1;
                if (n.gmailComplaints >= 0.3) score += 2;
                else if (n.gmailComplaints > 0) score += 1;
                return score;
              };
              const diff = attentionScore(b) - attentionScore(a);
              if (diff !== 0) return diff;
              return b.subscribers - a.subscribers;
            }).map((nl) => {
              const hasFeed = nl.activeProducts.includes("Smart Feed");
              const hasDelivery = nl.activeProducts.includes("Smart Reactivation") || nl.activeProducts.includes("Smart Lead");
              return (
                <tr key={nl.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{nl.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{nl.subscribers.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{nl.thirtyDayClickers.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className="text-green-600 font-medium">+5.2%</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${hasFeed ? "bg-green-500" : "bg-gray-300"}`} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                      nl.domainRep === "HIGH" ? "bg-green-100 text-green-700" :
                      nl.domainRep === "MEDIUM" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {nl.domainRep}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm ${nl.gmailComplaints >= 0.3 ? "text-red-600 font-semibold" : nl.gmailComplaints > 0 ? "text-yellow-600" : "text-gray-500"}`}>
                      {nl.gmailComplaints.toFixed(3)}%
                      {nl.gmailComplaints >= 0.3 && <span className="ml-1">⚠</span>}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                      !hasDelivery ? "bg-gray-300" :
                      nl.domainRep === "LOW" ? "bg-red-500" :
                      nl.domainRep === "MEDIUM" ? "bg-yellow-500" :
                      "bg-green-500"
                    }`} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={nl.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">My Products</h2>
        <Link href="/portal/products" className="text-xs text-[#0097FF] hover:underline">View All →</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...portalProducts].sort((a, b) => {
          const company = getCompanyById("1")!;
          const getOrder = (p: typeof a) => {
            if (p.status === "trial") return 0;
            if (p.status === "active") {
              const inv = company.products[p.key as keyof typeof company.products] as ProductInventory | undefined;
              return inv && inv.estDaysRemaining < 30 ? 1 : 2;
            }
            return 3; // available
          };
          return getOrder(a) - getOrder(b);
        }).map((product) => {
          const company = getCompanyById("1")!;
          const inv = company.products[product.key as keyof typeof company.products] as ProductInventory | undefined;
          const borderColor = productColors[product.key] || "#0097FF";

          return (
            <div
              key={product.key}
              className="bg-white rounded-lg border border-gray-200/80 p-4 border-l-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] hover:shadow-sm transition-all duration-200"
              style={{ borderLeftColor: borderColor }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{product.name}</span>
                {product.status === "active" && <StatusBadge status="active" />}
                {product.status === "trial" && <StatusBadge status="trial" label={`Trial · ${product.trialDaysRemaining}d`} />}
                {product.status === "available" && <StatusBadge status="inactive" label="Not Active" />}
              </div>

              {product.status === "trial" && (
                <p className="text-xs text-amber-600 mb-2">{product.trialDaysRemaining} days left in trial</p>
              )}

              {product.status === "active" && inv && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{inv.remaining.toLocaleString()} remaining</span>
                    <span>{inv.estDaysRemaining}d</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${inv.estDaysRemaining < 10 ? "bg-red-500" : inv.estDaysRemaining < 30 ? "bg-yellow-500" : "bg-green-500"}`}
                      style={{ width: `${Math.max(100 - (inv.unitsUsed / inv.unitsPurchased) * 100, 2)}%` }}
                    />
                  </div>
                </div>
              )}

              {product.status === "active" && (
                <Link href={product.href} className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-[#0097FF] bg-[#E5F5FF] border border-[#0097FF]/20 rounded-md hover:bg-[#0097FF]/10 transition-colors">
                  Manage →
                </Link>
              )}
              {product.status === "trial" && (
                <div className="flex items-center gap-2">
                  <Link href={product.href} className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">
                    Explore
                  </Link>
                  <Link href={`/portal/purchase/${product.key}`} className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-[#0097FF] rounded-md hover:bg-[#0097FF]/90 transition-colors">
                    Upgrade
                  </Link>
                </div>
              )}
              {product.status === "available" && (
                <Link href="/portal/products" className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-[#0097FF] bg-[#E5F5FF] border border-[#0097FF]/20 rounded-md hover:bg-[#0097FF]/10 transition-colors">
                  Start Free Trial →
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
