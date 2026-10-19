import { pageMeta } from "@/lib/seo";
import { CTABand, PageHero, StepColumns } from "@/components/Sections";
import { importSteps } from "@/content/site";
export const metadata = pageMeta(
  "Import",
  "How Kalycor Import & Export brings products from international suppliers to your market, from sourcing to delivery.",
  "/import",
);
export default function Page() {
  return (
    <>
      <PageHero
        title="Import"
        intro="Bringing products from international suppliers to your market."
      />
      <section className="py-24 sm:py-32">
        <div className="wrap">
          <StepColumns title="How importing works" steps={importSteps} />
        </div>
      </section>
      <CTABand title="Need to import a product?" />
    </>
  );
}
