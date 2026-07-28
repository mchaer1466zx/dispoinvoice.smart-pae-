"use client";

/* eslint-disable @next/next/no-img-element */

import { useId } from "react";
import { Label } from "@/components/ui/label";
import {
  COMPANY_THEMES,
  COMPANY_IDS,
  getCompanyTheme,
  type CompanyId,
} from "@/config/company-themes";

/**
 * Dropdown "Perusahaan Penerbit". Saat diganti, seluruh elemen visual dokumen
 * & pratinjau (warna, logo, kop, watermark, footer, nomor dokumen) ikut berubah
 * karena companyId mengalir ke CbsDocument & generator nomor.
 */
export function CompanyPicker({
  value,
  onChange,
}: {
  value: CompanyId;
  onChange: (id: CompanyId) => void;
}) {
  const id = useId();
  const theme = getCompanyTheme(value);

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>Perusahaan Penerbit *</Label>
      <div className="flex items-center gap-3">
        <img
          src={theme.logoPath}
          alt=""
          className="h-9 w-9 shrink-0 rounded-md object-contain"
        />
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value as CompanyId)}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          {COMPANY_IDS.map((cid) => (
            <option key={cid} value={cid}>
              {COMPANY_THEMES[cid].fullName} ({cid})
            </option>
          ))}
        </select>
      </div>
      <p className="text-xs text-muted-foreground">
        Nomor dokumen &amp; tampilan PDF mengikuti perusahaan ini.
      </p>
    </div>
  );
}
