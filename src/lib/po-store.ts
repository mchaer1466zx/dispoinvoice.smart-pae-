import type { PoDetail } from "@/components/po/po-detail-form";
import type { PoItem } from "@/components/po/po-item-list-form";
import type { Supplier } from "@/lib/mock-data";
import type { CompanyRecord } from "@/app/actions/companies";

const STORAGE_KEY = "dispoinvoice:purchase-orders";

export type SavedPurchaseOrder = {
  id: string;
  poDetail: PoDetail;
  supplier: Supplier | null;
  company: CompanyRecord | null;
  items: PoItem[];
  savedAt: string;
};

function readAll(): SavedPurchaseOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedPurchaseOrder[]) : [];
  } catch {
    return [];
  }
}

function writeAll(purchaseOrders: SavedPurchaseOrder[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(purchaseOrders));
}

export type SavePoInput = {
  poDetail: PoDetail;
  supplier: Supplier | null;
  company: CompanyRecord | null;
  items: PoItem[];
};

export type SavePoResult =
  | { success: true; id: string }
  | { success: false; error: string };

/** Menyimpan purchase order ke localStorage (belum ada backend database untuk PO). */
export function savePurchaseOrder(input: SavePoInput): SavePoResult {
  if (!input.poDetail.poNumber.trim()) {
    return { success: false, error: "Nomor PO wajib diisi." };
  }

  const hasValidItem = input.items.some((item) => item.description.trim());
  if (!hasValidItem) {
    return {
      success: false,
      error: "Minimal satu item dengan deskripsi wajib diisi.",
    };
  }

  const id = `po-${Date.now()}`;
  const saved: SavedPurchaseOrder = {
    id,
    poDetail: input.poDetail,
    supplier: input.supplier,
    company: input.company,
    items: input.items,
    savedAt: new Date().toISOString(),
  };

  writeAll([...readAll(), saved]);
  return { success: true, id };
}

export function getPurchaseOrder(id: string): SavedPurchaseOrder | null {
  return readAll().find((po) => po.id === id) ?? null;
}

export function listPurchaseOrders(): SavedPurchaseOrder[] {
  return readAll();
}
