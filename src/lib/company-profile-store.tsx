"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import { MOCK_COMPANY } from "@/lib/mock-data";

const STORAGE_KEY = "dispoinvoice:company-logo-url";
const CHANGE_EVENT = "dispoinvoice:company-logo-changed";

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY);
}

function getServerSnapshot() {
  return MOCK_COMPANY.logoUrl;
}

type CompanyProfileContextValue = {
  logoUrl: string | null;
  setLogoUrl: (logoUrl: string | null) => void;
};

const CompanyProfileContext = createContext<CompanyProfileContextValue | null>(
  null
);

export function CompanyProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const logoUrl = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function setLogoUrl(next: string | null) {
    if (next) {
      window.localStorage.setItem(STORAGE_KEY, next);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  return (
    <CompanyProfileContext.Provider value={{ logoUrl, setLogoUrl }}>
      {children}
    </CompanyProfileContext.Provider>
  );
}

export function useCompanyProfile() {
  const context = useContext(CompanyProfileContext);
  if (!context) {
    throw new Error(
      "useCompanyProfile harus dipakai di dalam CompanyProfileProvider"
    );
  }
  return context;
}
