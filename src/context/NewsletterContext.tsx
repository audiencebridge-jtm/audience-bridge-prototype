"use client";

import { createContext, useContext, useState } from "react";
import { getNewslettersByCompany, type Newsletter } from "@/lib/mock-data";

interface NewsletterContextValue {
  selectedNewsletterId: string | null;
  setSelectedNewsletterId: (id: string | null) => void;
  selectedNewsletter: Newsletter | null;
  newsletters: Newsletter[];
}

const NewsletterContext = createContext<NewsletterContextValue | null>(null);

export function NewsletterProvider({ children }: { children: React.ReactNode }) {
  const [selectedNewsletterId, setSelectedNewsletterId] = useState<string | null>(null);
  const newsletters = getNewslettersByCompany("1");
  const selectedNewsletter = selectedNewsletterId
    ? newsletters.find((n) => n.id === selectedNewsletterId) ?? null
    : null;

  return (
    <NewsletterContext.Provider value={{ selectedNewsletterId, setSelectedNewsletterId, selectedNewsletter, newsletters }}>
      {children}
    </NewsletterContext.Provider>
  );
}

export function useNewsletter() {
  const ctx = useContext(NewsletterContext);
  if (!ctx) throw new Error("useNewsletter must be used within NewsletterProvider");
  return ctx;
}
