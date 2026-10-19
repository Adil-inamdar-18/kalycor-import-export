import { pageMeta } from "@/lib/seo";
import { CTABand, PageHero } from "@/components/Sections";
import { ProductsExplorer } from "@/components/ProductsExplorer";
export const metadata = pageMeta(
  "Products",
  "Browse Kalycor Import & Export products by category: electronics, furniture, machinery, crockery, clothing, footwear, stationery, plywood, vegetables and kitchenware.",
  "/products",
);
export default function Page() {
  return (
    <>
      <PageHero
        title="Products"
        intro="Browse by category. Individual products are added as the catalogue is confirmed."
      />
      <section className="py-20 sm:py-28">
        <div className="wrap">
          <ProductsExplorer />
        </div>
      </section>
      <CTABand
        title="Can’t find a product?"
        text="Ask us. We will confirm what we can source."
      />
    </>
  );
}
