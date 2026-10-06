import { pageMeta } from "@/lib/seo";
import { CTABand, PageHero, StepColumns } from "@/components/Sections";
import { Tbc } from "@/components/Tbc";
import { quality } from "@/content/site";
export const metadata = pageMeta("Quality & Compliance", "Quality checks and compliance practices at Kalycor Import & Export.", "/quality-compliance");
export default function Page() { return (<>
  <PageHero title="Quality & Compliance" intro="How quality and compliance are handled. No certification is claimed until confirmed." />
  <section className="py-24 sm:py-32"><div className="wrap"><StepColumns title="Our approach" steps={quality} /><p className="mt-8 text-slate-600">Certifications and standards: none listed yet. <Tbc /></p></div></section>
  <CTABand /></>); }
