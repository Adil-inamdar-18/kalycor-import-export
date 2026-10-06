import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "./Button";
import { Tbc } from "./Tbc";
import { DoorReveal, Reveal } from "./Reveal";
import { WorldMap } from "./WorldMap";
import { categories, homeBase, markets, why } from "@/content/site";

export function PageHero({ title, intro, children }: { title: string; intro: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-ink pb-16 pt-36 text-white sm:pb-24 sm:pt-44">
      <div aria-hidden className="corrugated absolute inset-y-0 right-0 w-24 bg-box sm:w-40" />
      <div className="wrap relative"><h1 className="max-w-4xl font-display text-5xl font-bold leading-[0.98] sm:text-7xl">{title}</h1><p className="lead mt-6 max-w-2xl text-white/75">{intro}</p>{children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}</div>
    </section>
  );
}
export function Intro({ title, children }: { title: string; children?: ReactNode }) {
  return (<div className="max-w-3xl"><h2 className="h-section">{title}</h2>{children && <div className="lead mt-5 text-slate-600">{children}</div>}</div>);
}

export function CategoryTiles({ limit }: { limit?: number }) {
  const list = limit ? categories.slice(0, limit) : categories;
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {list.map((c) => (
        <li key={c.slug}>
          <Link href={`/product-categories/${c.slug}`} className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden p-5 text-white" style={{ background: c.color }}>
            <span aria-hidden className="corrugated absolute inset-0 transition-transform duration-500 group-hover:translate-x-3" />
            <span aria-hidden className="absolute inset-y-0 left-1/2 w-px bg-black/25" />
            <span className="relative font-display text-3xl font-bold leading-none">{c.name}</span>
            <span className="relative translate-y-3 opacity-90 transition duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0">
              <span className="block bg-black/30 p-3 text-sm backdrop-blur-[2px]">{c.text}</span>
              <span className="mt-3 inline-block bg-white px-4 py-2 text-sm font-semibold text-ink">Explore {c.name}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function StepColumns({ title, steps, tone = "light" }: { title: string; steps: { title: string; text: string }[]; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div>
      <h2 className="h-section">{title}</h2>
      <ol className={`mt-10 divide-y border-y ${dark ? "divide-white/15 border-white/15" : "divide-line border-line"}`}>
        {steps.map((s, i) => (
          <li key={s.title} className="grid gap-1 py-5 sm:grid-cols-[3.5rem_1fr_1.4fr] sm:gap-6">
            <span className="font-display text-xl font-bold text-box">{i + 1}</span><h3 className="text-xl font-bold">{s.title}</h3><p className={dark ? "text-white/70" : "text-slate-600"}>{s.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function MarketsBlock({ dark = false }: { dark?: boolean }) {
  const placed = markets.some((m) => m.lon !== undefined);
  return (
    <div>
      <WorldMap markets={markets} base={homeBase} dotClass={dark ? "text-white/20" : "text-harbor-800/30"} className="h-auto w-full" />
      <ul className="mt-8 grid gap-3 sm:grid-cols-3">
        {markets.map((m) => (<li key={m.name} className={`border p-4 ${dark ? "border-white/20" : "border-line bg-white"}`}><p className="font-display text-lg font-bold">{m.name}</p>{m.note && <p className="mt-1 text-sm opacity-70">{m.note}</p>}{m.lon === undefined && <Tbc className="mt-2" />}</li>))}
      </ul>
      {!placed && <p className={`mt-4 text-sm ${dark ? "text-white/60" : "text-slate-600"}`}>No markets are shown on the map until the company confirms them. Add them in <code>src/content/site.ts</code>.</p>}
    </div>
  );
}

export function AboutBlock({ cta = true }: { cta?: boolean }) {
  return (
    <section className="py-24 sm:py-32">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <DoorReveal className="relative aspect-[3/2] overflow-hidden"><Image src="/images/trade-hero.jpg" alt="Cargo and trade logistics" fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" /></DoorReveal>
        <Reveal>
          <h2 className="h-section">A trading company working across borders.</h2>
          <p className="lead mt-6 text-slate-600">Kalycor Import &amp; Export is part of the Kalycor group. It imports and exports products across ten categories, from electronics and machinery to vegetables and kitchenware.</p>
          <p className="mt-4 text-slate-600">Company history, scale and team details will be added once confirmed. <Tbc /></p>
          {cta && <Button href="/about" variant="dark" className="mt-8">About Kalycor Import &amp; Export</Button>}
        </Reveal>
      </div>
    </section>
  );
}

export function WhyTable() {
  return (
    <section className="py-24 sm:py-32">
      <div className="wrap"><Intro title="Why choose Kalycor Import & Export" />
        <dl className="mt-12 border-t-2 border-ink">
          {why.map((w) => (<div key={w.title} className="grid gap-2 border-b border-line py-6 transition-colors hover:bg-white sm:grid-cols-[1fr_2fr] sm:px-4"><dt className="font-display text-2xl font-bold">{w.title}</dt><dd className="text-slate-600">{w.text}</dd></div>))}
        </dl>
      </div>
    </section>
  );
}

export function CTABand({ title = "Let’s Build Global Connections.", text = "Tell us what you want to import or export and we will respond." }: { title?: string; text?: string }) {
  return (
    <section className="relative overflow-hidden bg-box py-24 text-white sm:py-32">
      <div aria-hidden className="corrugated absolute inset-0 opacity-60" />
      <div className="wrap relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
        <div><h2 className="h-display" style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}>{title}</h2><p className="lead mt-4 max-w-xl">{text}</p></div>
        <Button href="/contact" variant="dark">Contact Us</Button>
      </div>
    </section>
  );
}
