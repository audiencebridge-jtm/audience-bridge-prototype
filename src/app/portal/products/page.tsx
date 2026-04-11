"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { portalProducts, getCompanyById, type ProductInventory } from "@/lib/mock-data";

export default function ProductsHubPage() {
  const company = getCompanyById("1")!;
  const [requestedProducts, setRequestedProducts] = useState<Set<string>>(new Set());

  const handleRequest = (key: string) => {
    setRequestedProducts((prev) => new Set(prev).add(key));
  };

  return (
    <div>
      <PageHeader title="Products" subtitle="Discover, try, and manage your Audience Bridge products" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {portalProducts.map((product) => {
          const inv = company.products[product.key as keyof typeof company.products] as ProductInventory | undefined;
          const requested = requestedProducts.has(product.key);

          return (
            <div key={product.key} className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
              {/* Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  {product.status === "active" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>
                  )}
                  {product.status === "trial" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Trial · {product.trialDaysRemaining}d left</span>
                  )}
                  {product.status === "available" && !requested && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Not Activated</span>
                  )}
                  {product.status === "available" && requested && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Requested</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{product.tagline}</p>
              </div>

              {/* Body */}
              <div className="p-5 flex-1">
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>

                {/* Active: show inventory */}
                {product.status === "active" && inv && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Inventory</span>
                      <span>{inv.remaining.toLocaleString()} remaining</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          inv.estDaysRemaining < 10 ? "bg-red-500" : inv.estDaysRemaining < 30 ? "bg-yellow-500" : "bg-green-500"
                        }`}
                        style={{ width: `${Math.max(100 - (inv.unitsUsed / inv.unitsPurchased) * 100, 2)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400">
                      {inv.estDaysRemaining} days remaining at {inv.dailyUsage}/day
                    </p>
                  </div>
                )}

                {/* Trial: show trial info */}
                {product.status === "trial" && (
                  <div className="bg-blue-50 rounded-md p-3">
                    <p className="text-xs text-blue-700">
                      Free trial active — explore full features for {product.trialDaysRemaining} more days
                    </p>
                  </div>
                )}

                {/* Available: show benefits */}
                {product.status === "available" && (
                  <ul className="space-y-1.5">
                    {product.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                        <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Footer */}
              <div className="p-5 pt-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-900">{product.pricing}</span>
                </div>

                {product.status === "active" && (
                  <div className="flex gap-2">
                    <Link href={product.href} className="flex-1 text-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                      Manage
                    </Link>
                    {inv && inv.estDaysRemaining < 30 && (
                      <Link href={`/portal/purchase/${product.key}`} className="px-4 py-2 bg-white border border-gray-200 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                        Buy More
                      </Link>
                    )}
                  </div>
                )}

                {product.status === "trial" && (
                  <div className="flex gap-2">
                    <Link href={product.href} className="flex-1 text-center px-4 py-2 bg-white border border-gray-200 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                      Explore
                    </Link>
                    <Link href={`/portal/purchase/${product.key}`} className="flex-1 text-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                      Upgrade
                    </Link>
                  </div>
                )}

                {product.status === "available" && (
                  requested ? (
                    <div className="text-center px-4 py-2 bg-green-50 border border-green-200 text-sm font-medium text-green-700 rounded-md">
                      Access Requested
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRequest(product.key)}
                      className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Request Access
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
