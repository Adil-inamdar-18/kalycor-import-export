import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/Sections";
import { Tbc } from "@/components/Tbc";
import { ContactForm } from "./ContactForm";
import { site } from "@/content/site";
export const metadata = pageMeta(
  "Contact Us",
  "Contact Kalycor Import & Export about importing, exporting and product sourcing.",
  "/contact",
);
export default function Page() {
  return (
    <>
      <PageHero
        title="Contact Us"
        intro="Tell us what you want to import or export."
      />
      <section className="py-24 sm:py-32">
        <div className="wrap grid gap-16 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="h-section">Let’s Build Global Connections.</h2>
            <address className="mt-8 space-y-3 text-lg not-italic text-slate-600">
              <p>
                <a
                  className="hover:text-box"
                  href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                >
                  {site.contact.phone}
                </a>
              </p>
              <p>
                <a
                  className="hover:text-box"
                  href={`mailto:${site.contact.email}`}
                >
                  {site.contact.email}
                </a>
              </p>
              <p>{site.contact.location}</p>
              <Tbc />
            </address>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
