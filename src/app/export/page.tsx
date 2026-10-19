import { pageMeta } from "@/lib/seo";
import { CTABand, PageHero, StepColumns } from "@/components/Sections";
import { exportSteps } from "@/content/site";
export const metadata = pageMeta(
  "Export",
  "How Kalycor Import & Export takes products to international buyers, from preparation to hand-over.",
  "/export",
);
export default function Page() {
  return (
    <>
      <PageHero
        title="Export"
        intro="Taking products to international buyers."
      />
      <section className="py-24 sm:py-32">
        <div className="wrap">
          <StepColumns title="How exporting works" steps={exportSteps} />
        </div>
      </section>
      <CTABand title="Need to export a product?" />
    </>
  );
}
