export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type CompanyProfile = {
  name: string;
  address: string;
  email: string;
  phone: string;
  logoInitials: string;
  /** URL logo yang diunggah di Profil Perusahaan; null jika belum ada. */
  logoUrl: string | null;
};

/** Logo resmi perusahaan, disimpan di public/logo-pae.jpg. */
export const COMPANY_LOGO_URL = "/logo-pae.jpg";

export const MOCK_COMPANY: CompanyProfile = {
  name: "PT Prima Andalas Energi",
  address: "Jl. Sudirman Kav. 25, Jakarta Pusat, Indonesia",
  email: "info@primaandalasenergi.co.id",
  phone: "021-2233-4567",
  logoInitials: "PAE",
  logoUrl: COMPANY_LOGO_URL,
};

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "cust-1",
    name: "PT Sinar Abadi Sejahtera",
    email: "keuangan@sinarabadi.co.id",
    phone: "021-5551234",
    address: "Jl. Gatot Subroto No. 12, Jakarta Selatan",
  },
  {
    id: "cust-2",
    name: "CV Mitra Teknik Utama",
    email: "admin@mitrateknik.com",
    phone: "022-7778899",
    address: "Jl. Asia Afrika No. 45, Bandung",
  },
  {
    id: "cust-3",
    name: "PT Nusantara Digital Kreasi",
    email: "billing@nusantaradigital.id",
    phone: "031-4443322",
    address: "Jl. Basuki Rahmat No. 8, Surabaya",
  },
  {
    id: "cust-4",
    name: "Toko Berkah Jaya",
    email: "berkahjaya.toko@gmail.com",
    phone: "0811-2233-4455",
    address: "Jl. Ahmad Yani No. 100, Semarang",
  },
];
