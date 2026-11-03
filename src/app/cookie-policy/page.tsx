import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { contactEmail, stockImages } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Cookie Policy | AgriXpert",
};

const COPYRIGHT_YEAR = 2026;

export default function CookiePolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Cookie Policy"
        description="How AgriXpert uses cookies and similar technologies on this website."
        image={stockImages.documentSigning}
      />
      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
        <div className="space-y-10 text-sm leading-relaxed text-forest-dark/80">
          <p className="text-xs font-medium uppercase tracking-wide text-forest-dark/50">
            Last updated: {COPYRIGHT_YEAR}
          </p>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">1. What Are Cookies</h2>
            <p className="mt-3">
              Cookies are small text files placed on your device when you visit a website. They help the
              website function properly, remember your preferences, and understand how visitors use the
              site. This Cookie Policy explains how AgriXpert, a platform operated by Samakose, uses cookies
              and similar technologies on our website.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">2. Types of Cookies We Use</h2>
            <ul className="mt-3 list-disc space-y-3 pl-5">
              <li>
                <strong>Strictly necessary cookies:</strong> required for the website to function, such as
                enabling page navigation and secure access. These cannot be switched off.
              </li>
              <li>
                <strong>Performance and analytics cookies:</strong> help us understand how visitors interact
                with the website, such as which pages are visited most, so we can improve content and
                usability.
              </li>
              <li>
                <strong>Functionality cookies:</strong> remember choices you make, such as display
                preferences, to provide a more personalised experience.
              </li>
            </ul>
            <p className="mt-3">
              AgriXpert does not currently use third-party advertising or cross-site tracking cookies.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">3. Why We Use Cookies</h2>
            <p className="mt-3">
              We use cookies to keep our website secure and functioning correctly, to understand and improve
              how the site is used by farmers, buyers, suppliers and partners, and to remember basic
              preferences across your visits.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">4. Managing Cookies</h2>
            <p className="mt-3">
              Most web browsers allow you to control cookies through their settings, including blocking or
              deleting cookies. Please note that disabling certain cookies may affect the functionality of
              the AgriXpert website. Guidance on managing cookies is generally available in your browser&apos;s
              help documentation.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">5. Changes to This Policy</h2>
            <p className="mt-3">
              We may update this Cookie Policy from time to time to reflect changes in our practices or
              applicable law. Any changes will be posted on this page with a revised &quot;last updated&quot;
              date.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">6. Contact Us</h2>
            <p className="mt-3">
              If you have questions about this Cookie Policy, please contact us at{" "}
              <a href={`mailto:${contactEmail}`} className="font-semibold text-forest hover:text-forest-dark">
                {contactEmail}
              </a>
              .
            </p>
          </div>

          <div className="rounded-xl border border-harvest-gold/30 bg-harvest-gold/10 p-4 text-xs text-forest-dark/70">
            <strong className="font-semibold text-forest-dark">Note:</strong> This policy is provided as a
            Phase 1 draft to support the AgriXpert website launch and should be reviewed by qualified legal
            counsel, alongside implementation of an appropriate cookie-consent mechanism, before the site
            relies on non-essential cookies at scale.
          </div>
        </div>
      </section>
    </>
  );
}
