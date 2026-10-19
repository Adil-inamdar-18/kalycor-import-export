import Image from "next/image";
import Link from "next/link";
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Kalycor Import & Export home"
      className="flex items-center gap-3"
    >
      <span className="flex h-10 w-12 items-center justify-center bg-white">
        <Image
          src="/images/kalycor-logo.png"
          alt=""
          width={40}
          height={31}
          className="h-7 w-auto"
          priority
        />
      </span>
      <span
        className={`font-display text-lg font-bold leading-[1.05] sm:text-xl ${light ? "text-white" : "text-ink"}`}
      >
        Kalycor
        <span className="block text-[0.8em] font-medium text-box">
          Import &amp; Export
        </span>
      </span>
    </Link>
  );
}
