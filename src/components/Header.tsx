"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";
import { businesses, nav } from "@/content/site";
import { cn } from "@/lib/cn";

const mobileLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Import", href: "/import" },
  { label: "Export", href: "/export" },
  { label: "Products", href: "/products" },
  { label: "Product Categories", href: "/product-categories" },
  { label: "Global Markets", href: "/global-markets" },
  { label: "Logistics / Supply", href: "/logistics" },
  { label: "Quality & Compliance", href: "/quality-compliance" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const f = () => setScrolled(scrollY > 8);
    f();
    addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const active = (h: string) =>
    h === "/" ? pathname === "/" : pathname.startsWith(h);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 bg-white transition-shadow",
        scrolled && "shadow-[0_2px_0_0_#C8481C]",
      )}
    >
      <div className="wrap flex h-[68px] items-center justify-between">
        <Logo />
        <nav
          aria-label="Primary"
          className="hidden items-stretch self-stretch xl:flex"
        >
          {nav.map((item) => (
            <div key={item.label} className="group relative flex">
              <Link
                href={item.href}
                aria-current={active(item.href) ? "page" : undefined}
                className={cn(
                  "flex items-center border-b-[3px] border-transparent px-4 text-[15px] font-semibold text-ink hover:text-box",
                  active(item.href) && "border-box",
                )}
              >
                {item.label}
              </Link>
              {item.children && (
                <div className="invisible absolute left-0 top-full w-64 opacity-0 transition duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <ul className="border border-line bg-white shadow-xl">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          className="block border-b border-line px-5 py-3 text-[15px] last:border-0 hover:bg-fog"
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
          <div className="group relative flex">
            <button
              type="button"
              aria-haspopup="true"
              className="flex items-center self-stretch px-4 text-[15px] font-semibold text-ink hover:text-box"
            >
              Our Businesses
            </button>
            <div className="invisible absolute right-0 top-full w-[340px] opacity-0 transition duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <ul className="border border-line bg-white shadow-xl">
                {businesses.map((b) => (
                  <li key={b.name}>
                    <a
                      href={b.href}
                      {...(b.current
                        ? { "aria-current": "true" as const }
                        : { target: "_blank", rel: "noopener noreferrer" })}
                      className={cn(
                        "block border-b border-line px-5 py-3 last:border-0 hover:bg-fog",
                        b.current && "bg-fog",
                      )}
                    >
                      <span className="block font-display font-bold">
                        {b.name}
                      </span>
                      <span className="block text-sm text-slate-600">
                        {b.blurb}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Link
            href="/contact"
            className="my-3 ml-3 flex items-center bg-box px-6 text-[15px] font-semibold text-white hover:bg-box-dark"
          >
            Contact Us
          </Link>
        </nav>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="drawer"
          aria-label="Open menu"
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 xl:hidden"
        >
          <span className="h-0.5 w-6 bg-ink" />
          <span className="h-0.5 w-6 bg-ink" />
          <span className="h-0.5 w-4 self-end bg-box" />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="s"
              className="fixed inset-0 z-40 bg-ink/60 xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              key="d"
              id="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed inset-y-0 right-0 z-50 flex w-[88%] max-w-[400px] flex-col overflow-y-auto bg-ink p-6 text-white xl:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="mb-6 flex h-11 w-11 items-center justify-center self-end text-2xl"
              >
                ✕
              </button>
              <ul>
                {mobileLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="block border-b border-white/15 py-3 font-display text-xl font-semibold"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm text-white/60">Our Businesses</p>
              <ul className="mt-2 space-y-2">
                {businesses.map((b) => (
                  <li key={b.name}>
                    <a
                      href={b.href}
                      {...(b.current
                        ? {}
                        : { target: "_blank", rel: "noopener noreferrer" })}
                      className="text-box-light"
                    >
                      {b.name}
                    </a>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="mt-8 flex min-h-12 items-center justify-center bg-box font-semibold"
              >
                Contact Us
              </Link>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
