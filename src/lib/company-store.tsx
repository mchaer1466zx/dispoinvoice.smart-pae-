"use client";

import { createContext, useContext, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setActiveCompanyAction, type CompanyRecord } from "@/app/actions/companies";

type CompanyContextValue = {
  companies: CompanyRecord[];
  activeCompany: CompanyRecord | null;
  isSwitching: boolean;
  setActiveCompanyId: (id: string) => void;
};

const CompanyContext = createContext<CompanyContextValue | null>(null);

/**
 * Menyediakan daftar perusahaan & perusahaan aktif ke seluruh app. Data awal diambil di
 * server (root layout) lewat listCompaniesAction/getActiveCompanyAction; berganti aktif
 * memanggil server action lalu me-refresh route agar semua halaman ikut ter-update.
 */
export function CompanyProvider({
  companies,
  activeCompany,
  children,
}: {
  companies: CompanyRecord[];
  activeCompany: CompanyRecord | null;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isSwitching, startTransition] = useTransition();
  const [optimisticActiveId, setOptimisticActiveId] = useState(activeCompany?.id ?? null);

  function setActiveCompanyId(id: string) {
    setOptimisticActiveId(id);
    startTransition(async () => {
      await setActiveCompanyAction(id);
      router.refresh();
    });
  }

  const resolvedActiveCompany =
    companies.find((company) => company.id === optimisticActiveId) ?? activeCompany;

  return (
    <CompanyContext.Provider
      value={{
        companies,
        activeCompany: resolvedActiveCompany,
        isSwitching,
        setActiveCompanyId,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany harus dipakai di dalam CompanyProvider");
  }
  return context;
}
