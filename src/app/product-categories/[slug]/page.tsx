import { notFound } from "next/navigation";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { Button } from "@/components/Button";
import { CTABand, PageHero } from "@/components/Sections";
import { Tbc } from "@/components/Tbc";
import { categories, products } from "@/content/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = categories.find((x) => x.slug === slug);
  return c
    ? pageMeta(
        c.name,
        `${c.name} import and export from Kalycor Import & Export. ${c.text}`,
        `/product-categories/${c.slug}`,
      )
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = categories.find((x) => x.slug === slug);
  if (!c) notFound();
  const items = products.filter((p) => p.category === c.slug);
  return (
    <>
      <PageHero title={c.name} intro={c.text}>
        <Button href="/contact">Enquire about {c.name}</Button>
      </PageHero>
      <section className="py-24 sm:py-32">
        <div className="wrap">
          <h2 className="h-section">Products in this category</h2>
          {items.length ? (
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <li key={p.name} className="border border-line bg-white p-6">
                  <h3 className="text-xl font-bold">{p.name}</h3>
                  <p className="mt-2 text-slate-600">{p.summary}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 max-w-xl text-slate-600">
              Products will be listed here once the catalogue is confirmed.{" "}
              <Tbc />
            </p>
          )}
          <nav
            aria-label="Other categories"
            className="mt-16 flex flex-wrap gap-2"
          >
            {categories
              .filter((x) => x.slug !== c.slug)
              .map((x) => (
                <Link
                  key={x.slug}
                  href={`/product-categories/${x.slug}`}
                  className="border border-line bg-white px-4 py-2 text-sm font-semibold hover:border-box"
                >
                  {x.name}
                </Link>
              ))}
          </nav>
        </div>
      </section>
      <CTABand />
    </>
  );
}
