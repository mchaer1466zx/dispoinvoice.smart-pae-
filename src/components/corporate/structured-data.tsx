import { SITE } from "@/lib/corporate/site";

const BASE = "https://primaprabu-group-raul-pae.vercel.app";

/**
 * Structured data (JSON-LD) untuk SEO — Organization + LocalBusiness.
 * Hanya memakai data resmi yang sudah pasti (tanpa mengarang).
 */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${BASE}/#organization`,
        name: SITE.legalName,
        alternateName: SITE.brand,
        url: BASE,
        logo: `${BASE}${SITE.logo}`,
        slogan: SITE.tagline,
        email: SITE.email,
        telephone: SITE.phone,
        parentOrganization: { "@type": "Organization", name: SITE.group },
        address: {
          "@type": "PostalAddress",
          streetAddress: "Graha Mustika Ratu, Jl. Gatot Subroto No. 74-75, Menteng Dalam",
          addressLocality: "Jakarta",
          addressCountry: "ID",
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": `${BASE}/#localbusiness`,
        name: SITE.legalName,
        image: `${BASE}${SITE.logo}`,
        url: BASE,
        email: SITE.email,
        telephone: SITE.phone,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Graha Mustika Ratu, Jl. Gatot Subroto No. 74-75, Menteng Dalam",
          addressLocality: "Jakarta",
          addressCountry: "ID",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${BASE}/#website`,
        url: BASE,
        name: SITE.legalName,
        publisher: { "@id": `${BASE}/#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
