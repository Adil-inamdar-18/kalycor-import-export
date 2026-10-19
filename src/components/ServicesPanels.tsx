"use client";
import { useState } from "react";
import { services } from "@/content/site";
import { Tbc } from "./Tbc";
import { cn } from "@/lib/cn";

export function ServicesPanels() {
  const [open, setOpen] = useState(0);
  return (
    <ul className="flex flex-col border border-line lg:h-[380px] lg:flex-row">
      {services.map((s, i) => (
        <li
          key={s.title}
          className={cn(
            "border-b border-line transition-[flex] duration-500 last:border-0 lg:flex lg:border-b-0 lg:border-r",
            open === i ? "lg:flex-[3]" : "lg:flex-1",
          )}
          onMouseEnter={() => setOpen(i)}
        >
          <button
            type="button"
            aria-expanded={open === i}
            onClick={() => setOpen(i)}
            onFocus={() => setOpen(i)}
            className={cn(
              "flex h-full w-full flex-col justify-between p-6 text-left transition-colors",
              open === i ? "bg-ink text-white" : "bg-white hover:bg-fog",
            )}
          >
            <span className="font-display text-2xl font-bold">{s.title}</span>
            <span
              className={cn(
                "mt-6 block max-w-sm transition-opacity duration-300 lg:mt-0",
                open === i ? "opacity-100" : "hidden opacity-0 lg:block",
              )}
            >
              <span
                className={cn(
                  "block",
                  open === i ? "text-white/80" : "lg:invisible",
                )}
              >
                {s.text}
              </span>
              {!s.confirmed && <Tbc className="mt-3" />}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
