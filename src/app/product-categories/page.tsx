import { pageMeta } from "@/lib/seo";
import { CategoryTiles, CTABand, PageHero } from "@/components/Sections";
export const metadata = pageMeta("Product Categories", "The ten product categories traded by Kalycor Import & Export.", "/product-categories");
export default function Page() { return (<><PageHero title="Product Categories" intro="Ten categories, each with its own page." /><section className="py-24 sm:py-32"><div className="wrap"><CategoryTiles /></div></section><CTABand /></>); }
