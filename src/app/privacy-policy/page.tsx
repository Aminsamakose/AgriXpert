import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { contactEmail, stockImages } from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy | AgriXpert",
  description: "How AgriXpert collects, uses and protects personal information submitted through this website.",
  path: "/privacy-policy",
});

const COPYRIGHT_YEAR = 2026;

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="How AgriXpert collects, uses and protects your personal data."
        image={stockImages.documentSigning}
      />
      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
        <div className="space-y-10 text-sm leading-relaxed text-forest-dark/80">
          <p className="text-xs font-medium uppercase tracking-wide text-forest-dark/50">
            Last updated: {COPYRIGHT_YEAR}
          </p>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">1. Introduction</h2>
            <p className="mt-3">
              AgriXpert (&quot;AgriXpert&quot;, &quot;we&quot;, &quot;us&quot; or &quot;our&quot;), a platform operated by
              Samakose, is committed to protecting the privacy of farmers, buyers, suppliers, partners and
              other visitors (&quot;you&quot;) who use our website and platform. This Privacy Policy explains what
              personal data we collect, why we collect it, how we use and protect it, and the rights you
              have over it. It is intended to be consistent with Ghana&apos;s Data Protection Act, 2012 (Act
              843) and with generally accepted international data protection principles.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">2. Information We Collect</h2>
            <p className="mt-3">We may collect the following categories of information:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong>Identity and contact information:</strong> name, phone number, email address, physical
                or farm location, and business or organisation name.
              </li>
              <li>
                <strong>Registration information:</strong> farmer, buyer or supplier registration details,
                including commodity types, farm size, production volumes, and certification or compliance
                documentation you choose to submit.
              </li>
              <li>
                <strong>Transactional information:</strong> records of enquiries, sourcing requests, offtake
                agreements and any communications made through our contact forms or portal.
              </li>
              <li>
                <strong>Technical information:</strong> IP address, browser type, device information and usage
                data collected automatically when you visit our website, for security and analytics purposes.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">3. How We Use Your Information</h2>
            <p className="mt-3">We use the information we collect to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Facilitate registration, verification and onboarding of farmers, buyers and suppliers.</li>
              <li>Connect farmers with buyers and support agricultural commodity sourcing and transactions.</li>
              <li>Respond to enquiries submitted through our contact and registration forms.</li>
              <li>Provide mechanisation, aggregation, training and other agribusiness support services.</li>
              <li>Improve our website, platform and services, and communicate relevant updates.</li>
              <li>Comply with applicable legal, regulatory and reporting obligations.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">4. Legal Basis for Processing</h2>
            <p className="mt-3">
              We process personal data on the basis of your consent, the performance of a contract or service
              you have requested, our legitimate business interests in operating an agricultural value-chain
              platform, and compliance with applicable law.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">5. Sharing of Information</h2>
            <p className="mt-3">
              We do not sell personal data. We may share information with: buyers or farmers for the purpose
              of facilitating a transaction you have initiated; service providers who support our operations
              (such as hosting, payment or logistics providers) under confidentiality obligations; development
              partners and funders where required for programme reporting, in aggregated or anonymised form
              where practicable; and regulatory or government authorities where required by law.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">6. Data Security</h2>
            <p className="mt-3">
              We implement reasonable administrative, technical and physical safeguards designed to protect
              personal data against unauthorised access, loss, misuse or alteration. No system is completely
              secure, and we encourage you to use strong passwords and protect your account credentials.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">7. Data Retention</h2>
            <p className="mt-3">
              We retain personal data for as long as necessary to fulfil the purposes described in this policy,
              to comply with legal obligations, and to resolve disputes, after which it is securely deleted or
              anonymised.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">8. Your Rights</h2>
            <p className="mt-3">
              Subject to applicable law, you have the right to access, correct or request deletion of your
              personal data, to object to or restrict certain processing, and to withdraw consent at any time.
              To exercise any of these rights, contact us using the details below.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">9. Children&apos;s Privacy</h2>
            <p className="mt-3">
              Our platform is intended for business use by farmers, buyers, suppliers and partners who are 18
              years of age or older. We do not knowingly collect personal data from children.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">10. Changes to This Policy</h2>
            <p className="mt-3">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal
              requirements. We will post the updated version on this page with a revised &quot;last updated&quot;
              date.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">11. Contact Us</h2>
            <p className="mt-3">
              If you have questions about this Privacy Policy or how your personal data is handled, please
              contact us at{" "}
              <a href={`mailto:${contactEmail}`} className="font-semibold text-forest hover:text-forest-dark">
                {contactEmail}
              </a>
              .
            </p>
          </div>

          <div className="rounded-xl border border-harvest-gold/30 bg-harvest-gold/10 p-4 text-xs text-forest-dark/70">
            <strong className="font-semibold text-forest-dark">Note:</strong> This policy is provided as a
            Phase 1 draft to support the AgriXpert website launch. It should be reviewed and finalised by
            qualified legal counsel familiar with Ghana&apos;s Data Protection Act, 2012 (Act 843) and any
            other jurisdictions in which AgriXpert operates before the platform processes personal data at
            scale.
          </div>
        </div>
      </section>
    </>
  );
}
