"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CompanyPicker } from "@/components/procurement/company-picker";
import {
  AGREEMENT_TYPES,
  buildAgreementNumber,
  createAgreement,
  type AgreementDetail,
  type AgreementType,
  type Pasal,
} from "@/lib/agreement";
import type { CompanyId } from "@/config/company-themes";

const SELECT =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

export function AgreementForm({
  value,
  onChange,
}: {
  value: AgreementDetail;
  onChange: (v: AgreementDetail) => void;
}) {
  function set<K extends keyof AgreementDetail>(k: K, v: AgreementDetail[K]) {
    onChange({ ...value, [k]: v });
  }

  function changeType(type: AgreementType) {
    // Ganti template mengikuti tipe, pertahankan perusahaan.
    onChange(createAgreement(type, value.companyId));
  }

  function changeCompany(companyId: CompanyId) {
    onChange({
      ...value,
      companyId,
      number: buildAgreementNumber(value.type, companyId),
    });
  }

  // ---- PASAL helpers ----
  function updatePasal(i: number, p: Pasal) {
    const pasals = value.pasals.slice();
    pasals[i] = p;
    set("pasals", pasals);
  }
  function addPasal() {
    set("pasals", [...value.pasals, { title: "JUDUL PASAL", ayat: [""] }]);
  }
  function removePasal(i: number) {
    set("pasals", value.pasals.filter((_, idx) => idx !== i));
  }
  function addAyat(i: number) {
    updatePasal(i, { ...value.pasals[i], ayat: [...value.pasals[i].ayat, ""] });
  }
  function updateAyat(i: number, ai: number, text: string) {
    const ayat = value.pasals[i].ayat.slice();
    ayat[ai] = text;
    updatePasal(i, { ...value.pasals[i], ayat });
  }
  function removeAyat(i: number, ai: number) {
    updatePasal(i, {
      ...value.pasals[i],
      ayat: value.pasals[i].ayat.filter((_, idx) => idx !== ai),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Detail dasar */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Dokumen</CardTitle>
          <CardDescription>
            Pilih jenis dokumen — pasal & isi terisi otomatis, lalu sesuaikan.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <CompanyPicker value={value.companyId} onChange={changeCompany} />
          </div>
          <div className="grid gap-1.5">
            <Label>Jenis Dokumen</Label>
            <select
              className={SELECT}
              value={value.type}
              onChange={(e) => changeType(e.target.value as AgreementType)}
            >
              {AGREEMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-1.5">
            <Label>Nomor</Label>
            <Input value={value.number} onChange={(e) => set("number", e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>Judul</Label>
            <Input value={value.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>Sub-judul (opsional)</Label>
            <Input
              value={value.subtitle ?? ""}
              onChange={(e) => set("subtitle", e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Tempat</Label>
            <Input value={value.place} onChange={(e) => set("place", e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>Tanggal</Label>
            <Input
              type="date"
              value={value.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </div>
          <div className="grid gap-1.5 sm:col-span-2">
            <Label>Kalimat Pembuka</Label>
            <Textarea
              rows={2}
              value={value.preamble}
              onChange={(e) => set("preamble", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Kode [hari], [tanggal], [tempat] otomatis diisi.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Para pihak */}
      <Card>
        <CardHeader>
          <CardTitle>Para Pihak</CardTitle>
          <CardDescription>Identitas PIHAK PERTAMA & PIHAK KEDUA.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          {value.parties.map((p, i) => (
            <div key={i} className="grid gap-2 rounded-lg border p-3">
              <p className="text-sm font-semibold">{p.label}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <Input
                  placeholder="Nama perusahaan / orang"
                  value={p.name}
                  onChange={(e) => {
                    const parties = value.parties.slice();
                    parties[i] = { ...p, name: e.target.value };
                    set("parties", parties);
                  }}
                />
                <Input
                  placeholder="Jabatan (opsional)"
                  value={p.jabatan ?? ""}
                  onChange={(e) => {
                    const parties = value.parties.slice();
                    parties[i] = { ...p, jabatan: e.target.value };
                    set("parties", parties);
                  }}
                />
              </div>
              <Input
                placeholder="Alamat"
                value={p.address ?? ""}
                onChange={(e) => {
                  const parties = value.parties.slice();
                  parties[i] = { ...p, address: e.target.value };
                  set("parties", parties);
                }}
              />
              <Textarea
                rows={2}
                placeholder="Keterangan pembuka (opsional)"
                value={p.description ?? ""}
                onChange={(e) => {
                  const parties = value.parties.slice();
                  parties[i] = { ...p, description: e.target.value };
                  set("parties", parties);
                }}
              />
            </div>
          ))}
          <div className="grid gap-1.5">
            <Label>Kalimat Komparisi</Label>
            <Textarea
              rows={2}
              value={value.agreementIntro}
              onChange={(e) => set("agreementIntro", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pasal */}
      <Card>
        <CardHeader>
          <CardTitle>Pasal-Pasal</CardTitle>
          <CardDescription>
            Tambah/hapus pasal & ayat. Penomoran (Pasal I, ayat (1)) otomatis.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {value.pasals.map((pasal, i) => (
            <div key={i} className="grid gap-2 rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-muted-foreground">
                  Pasal {i + 1}
                </span>
                <Input
                  className="flex-1"
                  placeholder="Judul pasal"
                  value={pasal.title}
                  onChange={(e) => updatePasal(i, { ...pasal, title: e.target.value })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removePasal(i)}
                  aria-label="Hapus pasal"
                >
                  <Trash2 className="text-destructive" />
                </Button>
              </div>
              {pasal.ayat.map((a, ai) => (
                <div key={ai} className="flex items-start gap-2">
                  <span className="mt-2 text-xs text-muted-foreground">({ai + 1})</span>
                  <Textarea
                    rows={2}
                    className="flex-1"
                    placeholder="Isi ayat"
                    value={a}
                    onChange={(e) => updateAyat(i, ai, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAyat(i, ai)}
                    aria-label="Hapus ayat"
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="justify-self-start"
                onClick={() => addAyat(i)}
              >
                <Plus /> Tambah Ayat
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addPasal}>
            <Plus /> Tambah Pasal
          </Button>
        </CardContent>
      </Card>

      {/* Narasi + penutup + ttd */}
      <Card>
        <CardHeader>
          <CardTitle>Isi Naratif & Penutup</CardTitle>
          <CardDescription>
            Uraian bebas (untuk Berita Acara/LOI), penutup, dan penandatangan.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-1.5">
            <Label>Isi / Uraian (opsional)</Label>
            <Textarea
              rows={4}
              placeholder="Untuk Berita Acara / LOI: tuliskan uraian di sini."
              value={value.narrative}
              onChange={(e) => set("narrative", e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Kalimat Penutup</Label>
            <Textarea
              rows={2}
              value={value.closing}
              onChange={(e) => set("closing", e.target.value)}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {value.signatories.map((s, i) => (
              <div key={i} className="grid gap-2 rounded-lg border p-3">
                <Input
                  placeholder="Label (mis. PIHAK PERTAMA)"
                  value={s.label}
                  onChange={(e) => {
                    const sig = value.signatories.slice();
                    sig[i] = { ...s, label: e.target.value };
                    set("signatories", sig);
                  }}
                />
                <Input
                  placeholder="Nama penandatangan"
                  value={s.name}
                  onChange={(e) => {
                    const sig = value.signatories.slice();
                    sig[i] = { ...s, name: e.target.value };
                    set("signatories", sig);
                  }}
                />
                <Input
                  placeholder="Jabatan (opsional)"
                  value={s.jabatan ?? ""}
                  onChange={(e) => {
                    const sig = value.signatories.slice();
                    sig[i] = { ...s, jabatan: e.target.value };
                    set("signatories", sig);
                  }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
