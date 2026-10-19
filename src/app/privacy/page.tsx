import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/Sections";
export const metadata = pageMeta(
  "Privacy Policy",
  "Privacy Policy for Kalycor Import & Export.",
  "/privacy",
);
export default function Page() {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        intro="Draft placeholder. Replace with text reviewed by the client's legal adviser before launch."
      />
      <section className="py-24">
        <div className="wrap max-w-3xl text-slate-600">
          <p>Add the approved Privacy Policy here.</p>
        </div>
      </section>
    </>
  );
}
