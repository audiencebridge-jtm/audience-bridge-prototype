"use client";

import { useState } from "react";
import Link from "next/link";
import { getPortalProduct, getCompanyById, type PortalProduct, type ProductInventory } from "@/lib/mock-data";

interface ProductGateProps {
  productKey: string;
  children: React.ReactNode;
}

function AvailableState({ product }: { product: PortalProduct }) {
  const [requested, setRequested] = useState(false);

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="text-center mb-8">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 mb-4">
          Not Activated
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
        <p className="text-lg text-gray-600">{product.description}</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">What you get</h3>
        <ul className="space-y-3">
          {product.benefits.map((b, i) => (
            <li key={i} className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-700">{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 mb-6 text-center">
        <p className="text-sm text-gray-500 mb-1">Pricing</p>
        <p className="text-2xl font-bold text-gray-900">{product.pricing}</p>
      </div>

      {requested ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <svg className="w-10 h-10 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium text-green-800">Access requested! Our team will enable {product.name} for your account shortly.</p>
          <p className="text-xs text-green-600 mt-1">You&apos;ll receive an email when it&apos;s ready.</p>
        </div>
      ) : (
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setRequested(true)}
            className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Request Access
          </button>
          <Link
            href="/portal/products"
            className="px-6 py-3 bg-white border border-gray-200 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View All Products
          </Link>
        </div>
      )}
    </div>
  );
}

function TrialBanner({ product }: { product: PortalProduct }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          Trial
        </span>
        <p className="text-sm text-blue-800">
          You&apos;re on a free trial — <span className="font-semibold">{product.trialDaysRemaining} days remaining</span>
        </p>
      </div>
      <Link
        href={`/portal/purchase/${product.key}`}
        className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
      >
        Upgrade Now
      </Link>
    </div>
  );
}

function InventoryBanner({ inv, productKey }: { inv: ProductInventory; productKey: string }) {
  if (inv.estDaysRemaining >= 30) return null;
  const urgent = inv.estDaysRemaining < 10;
  const pct = inv.unitsPurchased > 0 ? (inv.unitsUsed / inv.unitsPurchased) * 100 : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">Your plan is running low</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {inv.remaining.toLocaleString()} units remaining — est. {inv.estDaysRemaining} days at current usage
          </p>
        </div>
        <Link
          href={`/portal/purchase/${productKey}`}
          className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Upgrade Plan
        </Link>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${urgent ? "bg-red-500" : "bg-yellow-500"}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5 text-[10px] text-gray-400">
        <span>{inv.unitsUsed.toLocaleString()} used</span>
        <span>{inv.unitsPurchased.toLocaleString()} purchased</span>
      </div>
    </div>
  );
}

export function ProductGate({ productKey, children }: ProductGateProps) {
  const product = getPortalProduct(productKey);
  if (!product) return <>{children}</>;

  // Available — show marketing page
  if (product.status === "available") {
    return <AvailableState product={product} />;
  }

  // Get inventory for active/trial products
  const company = getCompanyById("1"); // Portal user = Daily Trends Media
  const inv = company?.products[productKey as keyof typeof company.products];

  // Trial — show banner + product content
  if (product.status === "trial") {
    return (
      <div>
        <TrialBanner product={product} />
        {children}
      </div>
    );
  }

  // Active — show inventory warning if low + product content
  return (
    <div>
      {inv && <InventoryBanner inv={inv} productKey={productKey} />}
      {children}
    </div>
  );
}
