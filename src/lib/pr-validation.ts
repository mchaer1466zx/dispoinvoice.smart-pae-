/**
 * Validasi bersama Purchase Request — dipakai di server action (gerbang akhir)
 * dan dicerminkan di form klien agar pesan konsisten. Tidak bergantung pada
 * modul "use server" sehingga aman diimpor dari komponen client.
 */

/** Panjang minimal alasan/justifikasi permintaan. */
export const PR_REASON_MIN_LENGTH = 10;

export type PrValidationItem = {
  description: string;
  quantity: number;
  estPrice: number;
};

export type PrValidationInput = {
  prNumber: string;
  department: string;
  needDate: string;
  notes: string;
  items: PrValidationItem[];
};

/**
 * Aturan: nomor & departemen wajib, tanggal kebutuhan wajib, alasan minimal
 * {@link PR_REASON_MIN_LENGTH} karakter, dan setiap item berdeskripsi harus
 * punya qty > 0 serta harga tidak negatif. Mengembalikan pesan error pertama
 * atau null bila valid.
 */
export function validatePurchaseRequestInput(
  input: PrValidationInput
): string | null {
  if (!input.prNumber.trim()) {
    return "Nomor PR wajib diisi.";
  }
  if (!input.department.trim()) {
    return "Departemen peminta wajib diisi.";
  }
  if (!input.needDate.trim()) {
    return "Tanggal kebutuhan wajib diisi.";
  }
  if (input.notes.trim().length < PR_REASON_MIN_LENGTH) {
    return `Alasan/justifikasi permintaan minimal ${PR_REASON_MIN_LENGTH} karakter.`;
  }
  const filledItems = input.items.filter((item) => item.description.trim());
  if (filledItems.length === 0) {
    return "Minimal satu item dengan deskripsi wajib diisi.";
  }
  for (const item of filledItems) {
    if (!(item.quantity > 0)) {
      return "Jumlah (qty) setiap item harus lebih dari 0.";
    }
    if (item.estPrice < 0) {
      return "Estimasi harga tidak boleh negatif.";
    }
  }
  return null;
}
