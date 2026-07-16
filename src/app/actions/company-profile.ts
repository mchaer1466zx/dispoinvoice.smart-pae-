"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { companyProfile } from "@/db/schema";

export type CompanyProfileData = {
  name: string;
  address: string;
  email: string;
  phone: string;
  logoUrl: string | null;
};

const DEFAULT_PROFILE_ID = "default";

/** Server Action untuk mengambil profil perusahaan (termasuk logo) yang tampil di header dokumen. */
export async function getCompanyProfileAction(): Promise<CompanyProfileData> {
  const [profile] = await db
    .select({
      name: companyProfile.name,
      address: companyProfile.address,
      email: companyProfile.email,
      phone: companyProfile.phone,
      logoUrl: companyProfile.logoUrl,
    })
    .from(companyProfile)
    .where(eq(companyProfile.id, DEFAULT_PROFILE_ID))
    .limit(1);

  return (
    profile ?? { name: "", address: "", email: "", phone: "", logoUrl: null }
  );
}
