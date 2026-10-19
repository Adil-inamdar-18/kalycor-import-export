import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/Sections";
export const metadata = pageMeta(
  "Terms & Conditions",
  "Terms & Conditions for Kalycor Import & Export.",
  "/terms",
);
export default function Page() {
  return (
    <>
      <PageHero
        title="Terms & Conditions"
        intro="Draft placeholder. Replace with text reviewed by the client's legal adviser before launch."
      />
      <section className="py-24">
        <div className="wrap max-w-3xl text-slate-600">
          <p>Add the approved Terms & Conditions here.</p>
        </div>
      </section>
    </>
  );
}
