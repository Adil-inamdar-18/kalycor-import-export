"use client";
import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { tradeProcess } from "@/content/site";
import { cn } from "@/lib/cn";

export function TradeRoute() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 78%", "end 60%"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.4,
  });
  const [at, setAt] = useState(0);
  const n = tradeProcess.length;
  useMotionValueEvent(scrollYProgress, "change", (v) =>
    setAt(Math.round(Math.min(1, Math.max(0, v)) * (n - 1))),
  );
  const left = useTransform(p, [0, 1], ["0%", "100%"]);
  return (
    <div ref={ref} className="relative">
      <div className="hidden lg:block">
        <div className="relative mx-4 mt-6 h-16">
          <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-white/15" />
          <motion.div
            className="absolute left-0 top-1/2 h-1 w-full origin-left -translate-y-1/2 bg-box-light"
            style={{ scaleX: p }}
          />
          <motion.div
            className="absolute top-1/2 z-10 -translate-y-1/2"
            style={{ left }}
            aria-hidden
          >
            <div className="corrugated -ml-5 h-7 w-10 bg-box shadow-lg" />
          </motion.div>
          {tradeProcess.map((s, i) => (
            <span
              key={s.id}
              aria-hidden
              className={cn(
                "absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 border-2 transition-colors",
                i <= at ? "border-box-light bg-ink" : "border-white/30 bg-ink",
              )}
              style={{ left: `${(i / (n - 1)) * 100}%` }}
            />
          ))}
        </div>
        <ol className="mt-4 grid grid-cols-7 gap-4">
          {tradeProcess.map((s, i) => (
            <li
              key={s.id}
              className={cn(
                "transition-opacity duration-500",
                i <= at ? "opacity-100" : "opacity-40",
              )}
            >
              <p className="text-sm font-semibold text-box-light">
                Step {i + 1}
              </p>
              <h3 className="mt-1 text-lg font-bold leading-tight">{s.name}</h3>
              <p className="mt-2 text-sm text-white/70">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="relative lg:hidden">
        <div className="absolute bottom-2 left-[9px] top-2 w-0.5 bg-white/15" />
        <motion.div
          className="absolute bottom-2 left-[9px] top-2 w-0.5 origin-top bg-box-light"
          style={{ scaleY: p }}
        />
        <ol className="space-y-8 pl-10">
          {tradeProcess.map((s, i) => (
            <li
              key={s.id}
              className={cn(
                "relative transition-opacity duration-500",
                i <= at ? "opacity-100" : "opacity-45",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute -left-[39px] top-1 h-5 w-5 border-2 bg-ink",
                  i <= at ? "border-box-light" : "border-white/30",
                )}
              />
              <p className="text-sm font-semibold text-box-light">
                Step {i + 1}
              </p>
              <h3 className="text-xl font-bold">{s.name}</h3>
              <p className="mt-1 text-white/70">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
