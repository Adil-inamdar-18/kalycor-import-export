import type { Metadata, Viewport } from "next";
import "@fontsource-variable/schibsted-grotesk";
import "@fontsource-variable/hanken-grotesk";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_URL } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Kalycor Import & Export | International Trade in Electronics, Furniture, Machinery and More",
    template: "%s | Kalycor Import & Export",
  },
  description:
    "Kalycor Import & Export trades electronics, furniture, machinery, crockery, clothing, footwear, stationery, plywood, vegetables and kitchenware across international markets.",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Kalycor Import & Export",
    title: "Kalycor Import & Export",
    description: "Connecting products. Connecting markets.",
    images: ["/images/trade-hero.jpg"],
  },
};
export const viewport: Viewport = {
  themeColor: "#08192B",
  width: "device-width",
  initialScale: 1,
};
const ld = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Kalycor Import & Export",
  url: SITE_URL,
  parentOrganization: { "@type": "Organization", name: "Kalycor" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-box focus:px-5 focus:py-3 focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="pt-0">
          {children}
        </main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      </body>
    </html>
  );
}
