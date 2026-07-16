/** Inisial dari nama perusahaan, dipakai sebagai placeholder logo (mis. "PT Prima Andalas" -> "PP"). */
export function getCompanyInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}
