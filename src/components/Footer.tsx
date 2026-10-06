import Link from "next/link";
import { Logo } from "./Logo";
import { businesses, site } from "@/content/site";
const links = [["Home", "/"], ["About Us", "/about"], ["Import", "/import"], ["Export", "/export"], ["Products", "/products"], ["Product Categories", "/product-categories"], ["Global Markets", "/global-markets"], ["Logistics / Supply", "/logistics"], ["Quality & Compliance", "/quality-compliance"], ["Contact Us", "/contact"]];
export function Footer() {
  return (
    <footer className="overflow-hidden bg-ink text-white">
      <div className="wrap grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div><Logo light /><p className="mt-5 max-w-sm text-white/70">{site.description}</p>
          <ul className="mt-6 flex flex-wrap gap-4 text-sm">{site.social.map((s) => (<li key={s.label}><a href={s.href} className="text-white/70 underline-offset-4 hover:text-box-light hover:underline">{s.label}</a></li>))}</ul></div>
        <nav aria-label="Footer"><h2 className="font-display text-lg font-bold">Navigate</h2><ul className="mt-4 space-y-2 text-white/70">{links.map(([l, h]) => (<li key={h}><Link href={h} className="hover:text-box-light">{l}</Link></li>))}</ul></nav>
        <div><h2 className="font-display text-lg font-bold">Our Businesses</h2><ul className="mt-4 space-y-2 text-white/70">{businesses.map((b) => (<li key={b.name}><a href={b.href} {...(b.current ? {} : { target: "_blank", rel: "noopener noreferrer" })} className="hover:text-box-light">{b.name}</a></li>))}</ul></div>
        <div><h2 className="font-display text-lg font-bold">Contact</h2><address className="mt-4 space-y-2 not-italic text-white/70"><p><a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="hover:text-box-light">{site.contact.phone}</a></p><p><a href={`mailto:${site.contact.email}`} className="hover:text-box-light">{site.contact.email}</a></p><p>{site.contact.location}</p></address></div>
      </div>
      <div aria-hidden className="select-none whitespace-nowrap px-4 font-display text-[16vw] font-bold leading-[0.8] text-white/[0.04]">Import &amp; Export</div>
      <div className="border-t border-white/10"><div className="wrap flex flex-col gap-3 py-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} Kalycor Import &amp; Export. All rights reserved.</p><ul className="flex gap-6"><li><Link href="/privacy" className="hover:text-box-light">Privacy Policy</Link></li><li><Link href="/terms" className="hover:text-box-light">Terms &amp; Conditions</Link></li></ul></div></div>
    </footer>
  );
}
