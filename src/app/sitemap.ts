import type { MetadataRoute } from "next";
import { SITE_URL, categories } from "@/content/site";
const paths = [
  "",
  "/about",
  "/import",
  "/export",
  "/products",
  "/product-categories",
  "/global-markets",
  "/logistics",
  "/quality-compliance",
  "/contact",
  "/privacy",
  "/terms",
];
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...paths,
    ...categories.map((c) => `/product-categories/${c.slug}`),
  ].map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.7,
  }));
}
