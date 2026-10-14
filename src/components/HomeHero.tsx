"use client";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GLOBE_SCENES, TradeGlobe, type GlobeHandle } from "./TradeGlobe";
import { Button } from "./Button";
import { categories } from "@/content/site";
import { cn } from "@/lib/cn";

const sceneIcons = [
  <path key="s" d="M3 17h18l-2 3.5H5L3 17Zm3-1V9h12v7M9 9V6h6v3M12 3v3" />,
  <path key="a" d="M2.5 12.5 21 4l-5 16-3.5-6.5L2.5 12.5Zm10 1L21 4" />,
  <path key="t" d="M2 7h11v9H2V7Zm11 3h4l3 3v3h-7M6 19.5a1.6 1.6 0 1 0 0-.01M17 19.5a1.6 1.6 0 1 0 0-.01" />,
];

const words = ["Connecting", "Products.", "Connecting", "Markets."];

export function HomeHero() {
  const reduce = useReducedMotion();
  const strip = [...categories, ...categories];
  const globe = useRef<GlobeHandle>(null);
  const [scene, setScene] = useState(0);
  const [hint, setHint] = useState(true);

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_75%_70%,#10345c_0%,#08192B_62%)]" />
      <TradeGlobe ref={globe} onScene={setScene} onInteract={() => setHint(false)} className="pointer-events-none absolute inset-0 -z-10 h-full w-full" />
      <div className="absolute inset-0 -z-[5] bg-[linear-gradient(180deg,rgba(8,25,43,0.85)_0%,rgba(8,25,43,0.45)_45%,transparent_70%)] lg:bg-[linear-gradient(90deg,rgba(8,25,43,0.92)_0%,rgba(8,25,43,0.55)_36%,transparent_60%)]" />
      <div className="wrap flex flex-1 flex-col justify-start pb-28 pt-28 lg:justify-center lg:pt-32">
        <h1 className="h-display max-w-[8em] text-[length:clamp(2.5rem,min(6.4vw,10.5vh),6.75rem)]" aria-label="Connecting Products. Connecting Markets.">
          {words.map((w, i) => (
            <span key={i} className="-mb-[0.1em] mr-[0.2em] inline-block overflow-hidden pb-[0.1em] align-bottom" aria-hidden>
              <motion.span
                className={`inline-block ${i === 3 ? "text-box-light" : ""}`}
                initial={reduce ? false : { y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }} className="lead mt-8 max-w-xl text-white/75">
          Kalycor Import &amp; Export trades products across borders, from sourcing and supply to delivery in international markets.
        </motion.p>
        <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }} className="mt-9 flex flex-wrap gap-3">
          <Button href="/products">Explore Products</Button>
          <Button href="/contact" variant="outline">Contact Us</Button>
        </motion.div>
      </div>
      {/* <div className="absolute bottom-[88px] left-1/2 z-10 flex w-max max-w-[calc(100%-1.5rem)] -translate-x-1/2 flex-col items-center gap-2.5 lg:left-[73.5%]">
        <p className={cn("flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/55 transition-opacity duration-700", hint ? "opacity-100" : "opacity-0")} aria-hidden={!hint}>
          <span aria-hidden>&#8596;</span> Drag the globe to turn it
        </p>
        <div role="group" aria-label="Globe view" className="flex flex-wrap justify-center gap-2">
          {GLOBE_SCENES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={scene === i}
              onClick={() => { setHint(false); globe.current?.goTo(i); }}
              className={cn("inline-flex min-h-10 items-center gap-1.5 border px-3 text-[13px] font-semibold backdrop-blur-sm sm:gap-2 sm:px-3.5 sm:text-sm transition-colors duration-300", scene === i ? "border-box-light bg-box text-white" : "border-white/25 bg-ink/60 text-white/80 hover:border-white/55 hover:text-white")}
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current stroke-[1.7] [stroke-linecap:round] [stroke-linejoin:round]" aria-hidden>{sceneIcons[i]}</svg>
              {s.label}
            </button>
          ))}
        </div>
      </div> */}
      <div className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-white/15 bg-ink/70 backdrop-blur-sm" aria-label="Product categories">
        <ul className="flex w-max gap-3 py-4 [animation:marquee_50s_linear_infinite] hover:[animation-play-state:paused]">
          {strip.map((c, i) => (
            <li key={i} aria-hidden={i >= categories.length}>
              <span className="flex items-center gap-2 border border-white/20 px-4 py-2 text-sm font-semibold">
                <span className="h-2.5 w-2.5" style={{ background: c.color === "#0F2D4D" ? "#E8764A" : c.color }} />
                {c.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}