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
        slogan: SITE.taglinePlain,
        email: SITE.email,
        telephone: SITE.phone,
        sameAs: SITE.socials.map((s) => s.href),
        parentOrganization: { "@type": "Organization", name: SITE.group },
        address: {
          "@type": "PostalAddress",
          streetAddress: "Jl. Pertanian Raya No. 64, Lebak Bulus, Cilandak",
          addressLocality: "Jakarta Selatan",
          postalCode: "12440",
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
          streetAddress: "Jl. Pertanian Raya No. 64, Lebak Bulus, Cilandak",
          addressLocality: "Jakarta Selatan",
          postalCode: "12440",
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
