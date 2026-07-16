"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CompanyInput } from "@/app/actions/companies";

export type CompanyFormValues = CompanyInput;

export function CompanyFormFields({
  value,
  onChange,
  nameError,
}: {
  value: CompanyFormValues;
  onChange: (value: CompanyFormValues) => void;
  nameError?: string | null;
}) {
  const idPrefix = useId();

  return (
    <div className="grid gap-3 py-2">
      <div className="grid gap-1.5">
        <Label htmlFor={`${idPrefix}-name`}>Nama Perusahaan *</Label>
        <Input
          id={`${idPrefix}-name`}
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          aria-invalid={nameError ? true : undefined}
        />
        {nameError ? (
          <p className="text-sm text-destructive">{nameError}</p>
        ) : null}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor={`${idPrefix}-address`}>Alamat</Label>
        <Input
          id={`${idPrefix}-address`}
          value={value.address}
          onChange={(e) => onChange({ ...value, address: e.target.value })}
        />
      </div>
    </div>
  );
}
