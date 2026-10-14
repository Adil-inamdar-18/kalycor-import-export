import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";
const styles = {
  solid: "bg-box text-white hover:bg-box-dark",
  dark: "bg-ink text-white hover:bg-harbor-800",
  outline: "border border-current hover:bg-white/10",
};
export function Button({
  href,
  children,
  variant = "solid",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof styles;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-12 items-center justify-center px-7 text-[15px] font-semibold transition-colors duration-200",
        styles[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
