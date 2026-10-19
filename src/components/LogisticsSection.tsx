import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { logistics } from "@/content/site";

const icons = [
  <path
    key="t"
    d="M3 6h11v10H3V6Zm11 4h4l3 3v3h-7m-7 0a2 2 0 1 0 0 .01M17 16a2 2 0 1 0 0 .01"
  />,
  <path key="w" d="M3 10 12 4l9 6v10H3V10Zm5 10v-6h8v6M8 17h8" />,
  <path key="d" d="M7 3h7l4 4v14H7V3Zm7 0v4h4M10 12h5M10 16h5" />,
  <path
    key="p"
    d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
  />,
];

const accents = [
  {
    tile: "bg-blue-100 text-blue-600",
    bar: "bg-blue-600",
    pill: "bg-blue-100 text-blue-600",
  },
  {
    tile: "bg-emerald-100 text-emerald-600",
    bar: "bg-emerald-500",
    pill: "bg-emerald-100 text-emerald-600",
  },
  {
    tile: "bg-violet-100 text-violet-600",
    bar: "bg-violet-600",
    pill: "bg-violet-100 text-violet-600",
  },
  {
    tile: "bg-cyan-100 text-cyan-600",
    bar: "bg-cyan-500",
    pill: "bg-cyan-100 text-cyan-600",
  },
];

function Icon({
  index,
  className = "h-7 w-7",
}: {
  index: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} fill-none stroke-current stroke-[1.7] [stroke-linecap:round] [stroke-linejoin:round]`}
      aria-hidden
    >
      {icons[index % icons.length]}
    </svg>
  );
}

export function LogisticsSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-white to-blue-50 py-16 sm:py-20">
      <div
        aria-hidden
        className="absolute bottom-0 left-0 hidden h-[58%] w-[54%] overflow-hidden rounded-tr-[100%_60%] lg:block"
      >
        <Image
          src="/images/importexporting.jpg"
          alt=""
          fill
          sizes="54vw"
          className="object-cover object-[50%_72%] [mask-image:linear-gradient(to_top,black_45%,transparent),linear-gradient(to_right,black_60%,transparent)] [mask-composite:intersect]"
        />
      </div>
      <div className="wrap relative grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
            <Icon index={0} className="h-4 w-4" />
            Our Services
          </span>
          <h2 className="h-section mt-5">
            Logistics
            <span className="block text-blue-600">and supply</span>
          </h2>
          <p className="lead mt-5 text-slate-600">
            How goods move from supplier to customer.
          </p>
          <Link
            href="/logistics"
            className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-xl bg-blue-700 px-7 text-[15px] font-semibold text-white shadow-lg shadow-blue-700/25 transition-colors duration-200 hover:bg-blue-800"
          >
            Logistics / Supply <span aria-hidden>→</span>
          </Link>
        </Reveal>
        <ul className="grid gap-5 sm:grid-cols-2 lg:self-start">
          {logistics.map((l, i) => {
            const a = accents[i % accents.length];
            return (
              <li key={l.title}>
                <Reveal delay={i * 0.06} className="h-full">
                  <Link
                    href="/logistics"
                    className="group relative flex h-full min-h-[13rem] flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-[0_10px_30px_-12px_rgba(8,25,43,0.25)] ring-1 ring-ink/5 transition duration-300 hover:-translate-y-1"
                  >
                    <div className="relative flex gap-5">
                      <span
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${a.tile}`}
                      >
                        <Icon index={i} />
                      </span>
                      <div>
                        <h3 className="text-xl font-bold text-ink">
                          {l.title}
                        </h3>
                        <span
                          className={`mt-2 block h-0.5 w-6 rounded-full ${a.bar}`}
                        />
                        <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                          {l.text}
                        </p>
                      </div>
                    </div>
                    <span
                      aria-hidden
                      className={`relative mt-auto flex h-10 w-12 items-center justify-center rounded-full pt-0 text-base font-semibold ${a.pill}`}
                    >
                      →
                    </span>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
