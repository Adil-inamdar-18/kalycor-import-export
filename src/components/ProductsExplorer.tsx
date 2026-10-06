"use client";
import { useState } from "react";
import Link from "next/link";
import { categories, products } from "@/content/site";
import { Tbc } from "./Tbc";
import { cn } from "@/lib/cn";

export function ProductsExplorer() {
  const [cat, setCat] = useState<string>("all");
  const shown = categories.filter((c) => cat === "all" || c.slug === cat);
  return (
    <div>
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
        {[{ slug: "all", name: "All" }, ...categories].map((c) => (
          <button key={c.slug} type="button" aria-pressed={cat === c.slug} onClick={() => setCat(c.slug)} className={cn("min-h-10 border px-4 text-sm font-semibold transition-colors", cat === c.slug ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-box")}>{c.name}</button>
        ))}
      </div>
      <div className="mt-10 divide-y divide-line border-y border-line">
        {shown.map((c) => {
          const items = products.filter((p) => p.category === c.slug);
          return (
            <section key={c.slug} aria-labelledby={`h-${c.slug}`} className="grid gap-6 py-8 md:grid-cols-[260px_1fr]">
              <div><span aria-hidden className="mb-3 block h-1.5 w-10" style={{ background: c.color }} /><h2 id={`h-${c.slug}`} className="text-2xl font-bold"><Link href={`/product-categories/${c.slug}`} className="hover:text-box">{c.name}</Link></h2></div>
              {items.length ? (
                <ul className="grid gap-4 sm:grid-cols-2">{items.map((p) => (<li key={p.name} className="border border-line bg-white p-5"><h3 className="text-lg font-bold">{p.name}</h3><p className="mt-1 text-slate-600">{p.summary}</p></li>))}</ul>
              ) : (
                <p className="text-slate-600">Products in this category will be listed here. <Tbc className="ml-1" /></p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
