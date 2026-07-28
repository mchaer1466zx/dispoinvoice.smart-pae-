export type InvoiceLine = { quantity: number; price: number };

export type InvoiceTotals = {
  subtotal: number;
  discount: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
};

/**
 * Menghitung rincian total invoice secara konsisten untuk form, pratinjau, PDF,
 * dan halaman detail. Urutan: subtotal item → kurangi diskon (nominal, tidak
 * boleh negatif) → tambah PPN (persen dari nilai setelah diskon).
 */
export function calculateInvoiceTotals(
  items: InvoiceLine[],
  taxPercent = 0,
  discount = 0
): InvoiceTotals {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const safeDiscount = Math.min(Math.max(discount, 0), subtotal);
  const afterDiscount = subtotal - safeDiscount;
  const taxAmount = afterDiscount * (Math.max(taxPercent, 0) / 100);

  return {
    subtotal,
    discount: safeDiscount,
    taxPercent,
    taxAmount,
    total: afterDiscount + taxAmount,
  };
}
