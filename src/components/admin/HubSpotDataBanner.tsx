"use client";

interface HubSpotDataBannerProps {
  source: "hubspot" | "mock";
  lastUpdated: string | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function HubSpotDataBanner({ source, lastUpdated, loading, error, onRefresh }: HubSpotDataBannerProps) {
  const isHubSpot = source === "hubspot";
  const updatedLabel = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className={`mb-4 rounded-lg border px-4 py-2.5 flex items-center justify-between text-sm ${
      error
        ? "bg-yellow-50 border-yellow-200 text-yellow-800"
        : isHubSpot
          ? "bg-green-50 border-green-200 text-green-800"
          : "bg-gray-50 border-gray-200 text-gray-600"
    }`}>
      <div className="flex items-center gap-2">
        <span className={`inline-block w-2 h-2 rounded-full ${
          error ? "bg-yellow-500" : isHubSpot ? "bg-green-500" : "bg-gray-400"
        }`} />
        <span className="font-medium">
          {isHubSpot ? "HubSpot" : "Demo Data"}
        </span>
        {updatedLabel && (
          <span className="text-xs opacity-70">Updated {updatedLabel}</span>
        )}
        {error && (
          <span className="text-xs">{error}</span>
        )}
      </div>
      <button
        onClick={onRefresh}
        disabled={loading}
        className={`px-3 py-1 text-xs font-medium rounded-md border transition-colors ${
          loading
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
        }`}
      >
        {loading ? (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
            </svg>
            Syncing...
          </span>
        ) : (
          "Refresh"
        )}
      </button>
    </div>
  );
}
