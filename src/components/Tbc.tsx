import { SHOW_PLACEHOLDERS } from "@/content/site";
/** Marks content the company has not confirmed yet. Hide with NEXT_PUBLIC_SHOW_PLACEHOLDERS=false. */
export function Tbc({ className = "" }: { className?: string }) {
  if (!SHOW_PLACEHOLDERS) return null;
  return <span className={`inline-block border border-box/60 bg-white px-1.5 py-0.5 text-[11px] font-semibold text-box-dark ${className}`}>To be confirmed</span>;
}
