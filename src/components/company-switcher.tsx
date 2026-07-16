"use client";

import Link from "next/link";
import { Building2, Check, ChevronsUpDown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCompany } from "@/lib/company-store";
import { getCompanyInitials } from "@/lib/company-initials";

export function CompanySwitcher() {
  const { companies, activeCompany, isSwitching, setActiveCompanyId } = useCompany();

  if (companies.length === 0) {
    return (
      <Button variant="outline" size="sm" asChild>
        <Link href="/profil-perusahaan">
          <Building2 /> Tambah Perusahaan
        </Link>
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="max-w-56 justify-between gap-2"
          disabled={isSwitching}
        >
          <span className="flex items-center gap-2 truncate">
            <Building2 className="shrink-0" size={16} />
            <span className="truncate">
              {activeCompany?.name || "Pilih Perusahaan"}
            </span>
          </span>
          <ChevronsUpDown className="shrink-0 opacity-50" size={14} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-1.5">
        <div className="flex flex-col">
          {companies.map((company) => (
            <button
              key={company.id}
              type="button"
              onClick={() => setActiveCompanyId(company.id)}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded bg-gray-100 text-[10px] font-semibold text-gray-500">
                {getCompanyInitials(company.name)}
              </span>
              <span className="flex-1 truncate">{company.name}</span>
              {company.id === activeCompany?.id ? (
                <Check size={14} className="shrink-0 text-primary" />
              ) : null}
            </button>
          ))}
        </div>
        <div className="mt-1.5 border-t pt-1.5">
          <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
            <Link href="/profil-perusahaan">
              <Settings /> Kelola Perusahaan
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
