"use client";
import { motion, useReducedMotion } from "framer-motion";
import { WorldMap } from "./WorldMap";
import { Button } from "./Button";
import { categories } from "@/content/site";

const lines = [["Connecting", "Products."], ["Connecting", "Markets."]];

export function HomeHero() {
  const reduce = useReducedMotion();
  const strip = [...categories, ...categories];
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-white">
      <div className="absolute inset-x-[-10%] top-[12%] -z-10 opacity-90 sm:inset-x-0 lg:top-[8%]"><WorldMap sweep dotClass="text-white/[0.24]" className="h-auto w-full" /></div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#08192B_0%,rgba(8,25,43,0.88)_38%,rgba(8,25,43,0)_75%)]" />
      <div className="wrap flex flex-1 flex-col justify-center pb-28 pt-32">
        <h1 className="h-display" aria-label="Connecting Products. Connecting Markets.">
          {lines.map((l, i) => (
            <span key={i} className="block overflow-hidden pb-[0.06em]" aria-hidden>
              {l.map((w, j) => (<motion.span key={j} className={`mr-[0.2em] inline-block ${i === 1 && j === 1 ? "text-box-light" : ""}`} initial={reduce ? false : { y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.1 + (i * 2 + j) * 0.1, ease: [0.22, 1, 0.36, 1] }}>{w}</motion.span>))}
            </span>
          ))}
        </h1>
        <motion.p initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }} className="lead mt-8 max-w-xl text-white/75">Kalycor Import &amp; Export trades products across borders, from sourcing and supply to delivery in international markets.</motion.p>
        <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }} className="mt-9 flex flex-wrap gap-3"><Button href="/products">Explore Products</Button><Button href="/contact" variant="outline">Contact Us</Button></motion.div>
      </div>
      <div className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-white/15 bg-ink/80 backdrop-blur-sm" aria-label="Product categories">
        <ul className="flex w-max gap-3 py-4 [animation:marquee_50s_linear_infinite] hover:[animation-play-state:paused]">
          {strip.map((c, i) => (<li key={i} aria-hidden={i >= categories.length}><span className="flex items-center gap-2 border border-white/20 px-4 py-2 text-sm font-semibold"><span className="h-2.5 w-2.5" style={{ background: c.color === "#0F2D4D" ? "#E8764A" : c.color }} />{c.name}</span></li>))}
        </ul>
      </div>
    </section>
  );
}
