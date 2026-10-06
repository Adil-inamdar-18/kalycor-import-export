import { HomeHero } from "@/components/HomeHero";
import { TradeRoute } from "@/components/TradeRoute";
import { ServicesPanels } from "@/components/ServicesPanels";
import { AboutBlock, CategoryTiles, CTABand, Intro, MarketsBlock, StepColumns, WhyTable } from "@/components/Sections";
import { Button } from "@/components/Button";
import { Tbc } from "@/components/Tbc";
import { exportSteps, importSteps, logistics, quality } from "@/content/site";

export default function Home() {
  return (<>
    <HomeHero />
    <AboutBlock />
    <section className="pb-24 sm:pb-32"><div className="wrap"><Intro title="What we do"><p>Import and export are the core of the business. Other services are marked until confirmed.</p></Intro><div className="mt-12"><ServicesPanels /></div></div></section>
    <section className="bg-fog py-24 sm:py-32"><div className="wrap"><Intro title="Ten product categories"><p>Every category links to its own page, ready to hold products as the catalogue grows.</p></Intro><div className="mt-12"><CategoryTiles /></div><Button href="/products" variant="dark" className="mt-12">View all products</Button></div></section>
    <section className="py-24 sm:py-32"><div className="wrap grid gap-16 lg:grid-cols-2"><StepColumns title="Import" steps={importSteps} /><StepColumns title="Export" steps={exportSteps} /></div></section>
    <section className="bg-harbor-950 py-24 text-white sm:py-32"><div className="wrap"><Intro title="Global markets"><p className="text-white/70">Markets will appear on the map once the company confirms them.</p></Intro><div className="mt-12"><MarketsBlock dark /></div><Button href="/global-markets" className="mt-10">Global markets</Button></div></section>
    <section className="py-24 sm:py-32"><div className="wrap grid gap-12 lg:grid-cols-[1fr_1.4fr]"><div><h2 className="h-section">Logistics and supply</h2><p className="lead mt-5 text-slate-600">How goods move from supplier to customer.</p><Button href="/logistics" variant="dark" className="mt-8">Logistics / Supply</Button></div>
      <ul className="grid gap-px bg-line sm:grid-cols-2">{logistics.map((l) => (<li key={l.title} className="bg-white p-6"><h3 className="text-xl font-bold">{l.title}</h3><p className="mt-2 text-slate-600">{l.text}</p></li>))}</ul></div></section>
    <section className="bg-ink py-24 text-white sm:py-32"><div className="wrap"><h2 className="h-section max-w-3xl">From sourcing to delivery, one route.</h2><div className="mt-14"><TradeRoute /></div></div></section>
    <section className="py-24 sm:py-32"><div className="wrap grid gap-12 lg:grid-cols-[1fr_1.4fr]"><div><h2 className="h-section">Quality and compliance</h2><p className="lead mt-5 text-slate-600">No certifications are listed until the company confirms them. <Tbc /></p><Button href="/quality-compliance" variant="dark" className="mt-8">Quality &amp; Compliance</Button></div>
      <ul className="divide-y divide-line border-y border-line">{quality.map((q) => (<li key={q.title} className="py-5"><h3 className="text-xl font-bold">{q.title}</h3><p className="mt-1 text-slate-600">{q.text}</p></li>))}</ul></div></section>
    <WhyTable /><CTABand />
  </>);
}
