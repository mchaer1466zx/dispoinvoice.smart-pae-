import type { PoDetail } from "@/components/po/po-detail-form";
import type { PoItem } from "@/components/po/po-item-list-form";
import type { Supplier } from "@/lib/mock-data";

export type PublicPoData = {
  poDetail: PoDetail;
  supplier: Supplier | null;
  items: PoItem[];
};

/** Membangun tautan publik pratinjau PO; data dokumen disematkan langsung di query string. */
export function buildPoPublicShareUrl(origin: string, data: PublicPoData): string {
  const query = new URLSearchParams({ data: JSON.stringify(data) });
  return `${origin}/po/publik?${query.toString()}`;
}

export function parsePoShareData(raw: string | undefined): PublicPoData | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PublicPoData;
  } catch {
    return null;
  }
}
