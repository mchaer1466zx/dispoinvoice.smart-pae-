import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/corporate/site";

const BASE = "https://primaprabu-group-raul-pae.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = [
    "",
    "/about",
    "/business",
    "/products",
    "/partners",
    "/articles",
    "/career",
    "/faq",
    "/contact",
    "/profil-perusahaan",
    "/company-profile",
  ];

  const staticEntries: MetadataRoute.Sitemap = pages.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const articleEntries: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${BASE}/articles/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...articleEntries];
}
