"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type CustomerFormValues = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export function CustomerFormFields({
  value,
  onChange,
  nameError,
}: {
  value: CustomerFormValues;
  onChange: (value: CustomerFormValues) => void;
  nameError?: string | null;
}) {
  const idPrefix = useId();

  return (
    <div className="grid gap-3 py-2">
      <div className="grid gap-1.5">
        <Label htmlFor={`${idPrefix}-name`}>Nama *</Label>
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
        <Label htmlFor={`${idPrefix}-email`}>Email</Label>
        <Input
          id={`${idPrefix}-email`}
          type="email"
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor={`${idPrefix}-phone`}>Telepon</Label>
        <Input
          id={`${idPrefix}-phone`}
          value={value.phone}
          onChange={(e) => onChange({ ...value, phone: e.target.value })}
        />
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
