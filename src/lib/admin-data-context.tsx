"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Company } from "./mock-data";
import { companies as mockCompanies } from "./mock-data";

// ─── Types ─────────────────────────────────────────────────

interface AdminData {
  companies: Company[];
  source: "hubspot" | "mock";
  lastUpdated: string | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const AdminDataContext = createContext<AdminData | null>(null);

// ─── Provider ──────────────────────────────────────────────

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [source, setSource] = useState<"hubspot" | "mock">("mock");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const url = forceRefresh
        ? "/api/admin/hubspot?refresh=true"
        : "/api/admin/hubspot";
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setCompanies(data.companies);
      setSource(data.source);
      setLastUpdated(data.lastUpdated);
      if (data.error) setError(data.error);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      // Keep existing data (mock or previous fetch) on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => fetchData(true), [fetchData]);

  return (
    <AdminDataContext.Provider
      value={{ companies, source, lastUpdated, loading, error, refresh }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────

export function useAdminData(): AdminData {
  const ctx = useContext(AdminDataContext);
  if (!ctx) {
    throw new Error("useAdminData must be used inside <AdminDataProvider>");
  }
  return ctx;
}
