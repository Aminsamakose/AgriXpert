import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Contact | AgriXpert",
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Enquiries and business contacts" />
      <section className="mx-auto grid max-w-5xl gap-12 px-6 py-16 lg:grid-cols-2 lg:px-10">
        <div>
          <h2 className="font-heading text-xl font-bold text-forest">Get in Touch</h2>
          <dl className="mt-6 space-y-4 text-sm text-forest-dark/75">
            <div>
              <dt className="font-semibold text-forest-dark">Email</dt>
              <dd>info@agrixpert.com</dd>
            </div>
            <div>
              <dt className="font-semibold text-forest-dark">Location</dt>
              <dd>Tamale, Northern Ghana</dd>
            </div>
          </dl>
          <p className="mt-6 text-xs text-forest-dark/50">
            Contact details above are placeholders. Replace with AgriXpert&apos;s confirmed office address,
            phone number and email before launch.
          </p>
        </div>

        {/*
          Static form for Phase 1. Submission handling (persisting enquiries,
          routing buyer/farmer/partnership enquiries) is a Phase 2 item once
          Supabase is wired up for this project.
        */}
        <form className="space-y-4 rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
          <div>
            <label className="text-sm font-medium text-forest-dark" htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
              disabled
            />
          </div>
          <div>
            <label className="text-sm font-medium text-forest-dark" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
              disabled
            />
          </div>
          <div>
            <label className="text-sm font-medium text-forest-dark" htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
              disabled
            />
          </div>
          <button
            type="button"
            disabled
            className="w-full rounded-full bg-forest/40 px-6 py-3 text-sm font-semibold text-natural-white"
          >
            Submit (coming in Phase 2)
          </button>
        </form>
      </section>
    </>
  );
}
