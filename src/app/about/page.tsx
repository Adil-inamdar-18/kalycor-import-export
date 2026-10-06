import { pageMeta } from "@/lib/seo";
import { AboutBlock, CTABand, PageHero, WhyTable } from "@/components/Sections";
export const metadata = pageMeta("About Us", "About Kalycor Import & Export, the international trading business of the Kalycor group.", "/about");
export default function About() { return (<><PageHero title="About Kalycor Import & Export" intro="The international trading business of the Kalycor group." /><AboutBlock cta={false} /><WhyTable /><CTABand /></>); }
