import { pageMeta } from "@/lib/seo";
import { CTABand, MarketsBlock, PageHero } from "@/components/Sections";
export const metadata = pageMeta(
  "Global Markets",
  "The international markets served by Kalycor Import & Export.",
  "/global-markets",
);
export default function Page() {
  return (
    <>
      <PageHero
        title="Global Markets"
        intro="Confirmed markets appear on the map. None are shown until the company supplies them."
      />
      <section className="py-24 sm:py-32">
        <div className="wrap">
          <MarketsBlock />
        </div>
      </section>
      <CTABand />
    </>
  );
}
