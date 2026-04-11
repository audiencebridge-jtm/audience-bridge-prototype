"use client";

import { use, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { getPortalProduct } from "@/lib/mock-data";

const unitOptions: Record<string, { units: number; label: string; price: number }[]> = {
  smartLead: [
    { units: 5_000, label: "5,000 leads", price: 2_500 },
    { units: 10_000, label: "10,000 leads", price: 5_000 },
    { units: 25_000, label: "25,000 leads", price: 12_500 },
    { units: 50_000, label: "50,000 leads", price: 25_000 },
  ],
  smartPixel: [
    { units: 5_000, label: "5,000 pixels", price: 1_250 },
    { units: 10_000, label: "10,000 pixels", price: 1_500 },
    { units: 25_000, label: "25,000 pixels", price: 3_125 },
    { units: 50_000, label: "50,000 pixels", price: 5_000 },
  ],
  smartReactivation: [
    { units: 50_000, label: "50,000 matches", price: 1_000 },
    { units: 100_000, label: "100,000 matches", price: 2_000 },
    { units: 250_000, label: "250,000 matches", price: 5_000 },
    { units: 500_000, label: "500,000 matches", price: 10_000 },
  ],
  smartFeed: [
    { units: 1, label: "Starter — up to 50/day", price: 250 },
    { units: 2, label: "Growth — up to 200/day", price: 1_500 },
    { units: 3, label: "Scale — up to 500/day", price: 3_500 },
  ],
  smartDelivery: [
    { units: 1, label: "Monthly", price: 2_000 },
    { units: 3, label: "Quarterly (save 5%)", price: 5_700 },
    { units: 12, label: "Annual (save 10%)", price: 21_600 },
  ],
  emailValidation: [
    { units: 10_000, label: "10,000 validations", price: 50 },
    { units: 50_000, label: "50,000 validations", price: 200 },
    { units: 100_000, label: "100,000 validations", price: 350 },
  ],
};

export default function PurchasePage({ params }: { params: Promise<{ product: string }> }) {
  const { product: productKey } = use(params);
  const product = getPortalProduct(productKey);
  const options = unitOptions[productKey] || [];
  const [selectedIdx, setSelectedIdx] = useState(1);
  const [purchased, setPurchased] = useState(false);

  if (!product) {
    return <div className="p-8 text-gray-500">Product not found</div>;
  }

  const selected = options[selectedIdx];
  const isRecurring = productKey === "smartFeed" || productKey === "smartDelivery";

  if (purchased) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Purchase Complete!</h1>
        <p className="text-gray-600 mb-6">
          {product.name} has been activated. {isRecurring ? "Your subscription is now active." : `${selected?.label} have been added to your account.`}
        </p>
        <div className="flex justify-center gap-3">
          <Link href={product.href} className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            Go to {product.name}
          </Link>
          <Link href="/portal/products" className="px-6 py-3 bg-white border border-gray-200 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
            All Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-2">
        <Link href="/portal/products" className="text-sm text-blue-600 hover:underline">← Back to Products</Link>
      </div>
      <PageHeader title={`Purchase ${product.name}`} subtitle={product.tagline} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Plan selection */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              {isRecurring ? "Choose a plan" : "Select quantity"}
            </h3>
            <div className="space-y-3">
              {options.map((option, i) => (
                <label
                  key={i}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedIdx === i
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="plan"
                      checked={selectedIdx === i}
                      onChange={() => setSelectedIdx(i)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-900">{option.label}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    ${option.price.toLocaleString()}
                    {isRecurring && <span className="text-xs text-gray-400 font-normal">{productKey === "smartDelivery" && option.units > 1 ? "" : "/mo"}</span>}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{product.name}</span>
              </div>
              {selected && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{selected.label}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="text-sm font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">${selected.price.toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => setPurchased(true)}
              className="w-full px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Complete Purchase
            </button>
            <p className="text-[10px] text-gray-400 text-center mt-3">
              You&apos;ll be charged via your payment method on file.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
