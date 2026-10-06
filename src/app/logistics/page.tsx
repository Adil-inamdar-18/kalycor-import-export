import { pageMeta } from "@/lib/seo";
import { CTABand, PageHero, StepColumns } from "@/components/Sections";
import { TradeRoute } from "@/components/TradeRoute";
import { logistics } from "@/content/site";
export const metadata = pageMeta("Logistics & Supply", "How Kalycor Import & Export plans transport, documentation and supply for international trade.", "/logistics");
export default function Page() { return (<>
  <PageHero title="Logistics / Supply" intro="How goods move from supplier to customer." />
  <section className="py-24 sm:py-32"><div className="wrap"><StepColumns title="Supply chain" steps={logistics} /></div></section>
  <section className="bg-ink py-24 text-white sm:py-32"><div className="wrap"><h2 className="h-section">The trade process</h2><div className="mt-14"><TradeRoute /></div></div></section>
  <CTABand /></>); }
