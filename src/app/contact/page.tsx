import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { contactEmail, stockImages } from "@/lib/site-data";
import { getSiteContent, pick } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const instant = false;

export const metadata: Metadata = pageMetadata({
  title: "Contact | AgriXpert",
  description:
    "Get in touch with AgriXpert for enquiries about farming, buying, partnerships or investment in agricultural value chains across Ghana and West Africa.",
  path: "/contact",
  image: stockImages.conferenceTable,
});

export default async function ContactPage() {
  const content = await getSiteContent();
  const email = pick(content, "contact.email", contactEmail);
  const phone = pick(content, "contact.phone", "");
  const address = pick(content, "contact.address", "Tamale, Northern Ghana");

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={pick(content, "contact.hero.title", "Enquiries and business contacts")}
        image={{ src: pick(content, "contact.hero.image", stockImages.conferenceTable.src), alt: stockImages.conferenceTable.alt }}
      />
      <section className="mx-auto grid max-w-5xl gap-12 px-6 py-16 lg:grid-cols-2 lg:px-10">
        <div>
          <h2 className="font-heading text-xl font-bold text-forest">Get in Touch</h2>
          <dl className="mt-6 space-y-4 text-sm text-forest-dark/75">
            <div>
              <dt className="font-semibold text-forest-dark">Email</dt>
              <dd>
                <a href={`mailto:${email}`} className="hover:text-forest">
                  {email}
                </a>
              </dd>
            </div>
            {phone && (
              <div>
                <dt className="font-semibold text-forest-dark">Phone</dt>
                <dd>{phone}</dd>
              </div>
            )}
            <div>
              <dt className="font-semibold text-forest-dark">Location</dt>
              <dd>{address}</dd>
            </div>
          </dl>
          <p className="mt-6 text-xs text-forest-dark/50">
            All enquiries submitted below, or sent directly, are routed to {email}.
          </p>
        </div>

        <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-forest/5" />}>
          <ContactForm />
        </Suspense>
      </section>
    </>
  );
}
