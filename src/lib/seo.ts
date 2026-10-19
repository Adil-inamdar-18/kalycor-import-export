import type { Metadata } from "next";
import { SITE_URL } from "@/content/site";
export function pageMeta(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | Kalycor Import & Export`,
      description,
      url: `${SITE_URL}${path}`,
      siteName: "Kalycor Import & Export",
      type: "website",
      locale: "en",
      images: [
        {
          url: "/images/trade-hero.jpg",
          alt: "International trade and cargo logistics",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Kalycor Import & Export`,
      description,
    },
  };
}
