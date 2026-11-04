import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { contactEmail, stockImages } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Contact | AgriXpert",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Enquiries and business contacts"
        image={stockImages.conferenceTable}
      />
      <section className="mx-auto grid max-w-5xl gap-12 px-6 py-16 lg:grid-cols-2 lg:px-10">
        <div>
          <h2 className="font-heading text-xl font-bold text-forest">Get in Touch</h2>
          <dl className="mt-6 space-y-4 text-sm text-forest-dark/75">
            <div>
              <dt className="font-semibold text-forest-dark">Email</dt>
              <dd>
                <a href={`mailto:${contactEmail}`} className="hover:text-forest">
                  {contactEmail}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-forest-dark">Location</dt>
              <dd>Tamale, Northern Ghana</dd>
            </div>
          </dl>
          <p className="mt-6 text-xs text-forest-dark/50">
            Office address and phone number are pending confirmation. All enquiries submitted below, or
            sent directly, are routed to {contactEmail}.
          </p>
        </div>

        <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-forest/5" />}>
          <ContactForm />
        </Suspense>
      </section>
    </>
  );
}
