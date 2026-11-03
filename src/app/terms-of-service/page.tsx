import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { contactEmail, stockImages } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Terms of Service | AgriXpert",
};

const COPYRIGHT_YEAR = 2026;

export default function TermsOfServicePage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        description="The terms that govern your use of the AgriXpert website and platform."
        image={stockImages.documentSigning}
      />
      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
        <div className="space-y-10 text-sm leading-relaxed text-forest-dark/80">
          <p className="text-xs font-medium uppercase tracking-wide text-forest-dark/50">
            Last updated: {COPYRIGHT_YEAR}
          </p>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">1. Acceptance of Terms</h2>
            <p className="mt-3">
              These Terms of Service (&quot;Terms&quot;) govern your access to and use of the AgriXpert website
              and platform, operated by Samakose (&quot;AgriXpert&quot;, &quot;we&quot;, &quot;us&quot; or
              &quot;our&quot;). By accessing or using our website, registering as a farmer, buyer or supplier,
              or otherwise engaging with our services, you agree to be bound by these Terms. If you do not
              agree, please do not use our website or services.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">2. Description of Services</h2>
            <p className="mt-3">
              AgriXpert provides an agricultural value-chain platform connecting farmers, buyers, suppliers
              and development partners, offering services that may include farmer registration and
              aggregation, mechanisation and farm services, commodity sourcing and procurement support,
              market and value-chain information, training and capacity building, and partnership facilitation.
              Not all services described on this website may be available in every location or at every
              stage of our rollout.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">3. Eligibility and Registration</h2>
            <p className="mt-3">
              To register as a farmer, buyer or supplier, you must be at least 18 years old and able to enter
              into legally binding agreements. You agree to provide accurate, current and complete
              information during registration and to update it as necessary. You are responsible for
              maintaining the confidentiality of any account credentials and for all activity under your
              account.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">4. Role of AgriXpert</h2>
            <p className="mt-3">
              AgriXpert facilitates connections, information flow and support services between farmers,
              buyers and other participants in the agricultural value chain. Unless expressly stated,
              AgriXpert is not a party to, and does not guarantee the performance of, any commercial
              agreement entered into between farmers and buyers through our platform. Each party remains
              responsible for conducting its own due diligence and for fulfilling its contractual
              obligations.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">5. User Conduct</h2>
            <p className="mt-3">You agree not to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Provide false, misleading or fraudulent information.</li>
              <li>Use the platform for any unlawful purpose or in violation of these Terms.</li>
              <li>Interfere with or disrupt the security or proper functioning of the website or platform.</li>
              <li>
                Attempt to gain unauthorised access to other users&apos; accounts or to any AgriXpert systems.
              </li>
              <li>Misrepresent your affiliation with AgriXpert, a farmer group, cooperative or business.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">6. Fees</h2>
            <p className="mt-3">
              Access to the AgriXpert website is currently free. Fees, if any, for specific services such as
              mechanisation, aggregation or facilitated transactions will be communicated and agreed with
              you separately before those services are provided.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">7. Intellectual Property</h2>
            <p className="mt-3">
              The AgriXpert name, logo, website content, design and underlying software are the property of
              Samakose and its licensors and are protected by applicable intellectual property laws. You may
              not reproduce, distribute or create derivative works from our content without prior written
              permission, except as necessary to use the platform for its intended purpose.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">8. Disclaimers</h2>
            <p className="mt-3">
              The AgriXpert website and platform are provided on an &quot;as is&quot; and &quot;as
              available&quot; basis. While we strive for accuracy, we do not warrant that market information,
              pricing or content on this website is complete, current or error-free. AgriXpert does not
              guarantee specific agricultural yields, prices, sales volumes or business outcomes for any
              farmer, buyer or supplier using the platform.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">9. Limitation of Liability</h2>
            <p className="mt-3">
              To the fullest extent permitted by applicable law, AgriXpert shall not be liable for any
              indirect, incidental, special or consequential damages arising from your use of, or inability
              to use, the website or platform, or from any transaction or agreement entered into between
              users of the platform.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">10. Termination</h2>
            <p className="mt-3">
              We may suspend or terminate your access to the platform at our discretion if we reasonably
              believe you have violated these Terms or engaged in conduct harmful to AgriXpert, other users,
              or the integrity of the platform.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">11. Governing Law</h2>
            <p className="mt-3">
              These Terms are governed by the laws of the Republic of Ghana, without regard to conflict-of-law
              principles. Any disputes arising under these Terms shall be subject to the exclusive
              jurisdiction of the courts of Ghana, unless otherwise agreed in writing.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">12. Changes to These Terms</h2>
            <p className="mt-3">
              We may revise these Terms from time to time. Continued use of the website or platform after
              changes are posted constitutes acceptance of the revised Terms.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-forest">13. Contact Us</h2>
            <p className="mt-3">
              Questions about these Terms should be directed to{" "}
              <a href={`mailto:${contactEmail}`} className="font-semibold text-forest hover:text-forest-dark">
                {contactEmail}
              </a>
              .
            </p>
          </div>

          <div className="rounded-xl border border-harvest-gold/30 bg-harvest-gold/10 p-4 text-xs text-forest-dark/70">
            <strong className="font-semibold text-forest-dark">Note:</strong> These Terms are provided as a
            Phase 1 draft to support the AgriXpert website launch and should be reviewed and finalised by
            qualified legal counsel before the platform processes transactions or binding agreements between
            users.
          </div>
        </div>
      </section>
    </>
  );
}
