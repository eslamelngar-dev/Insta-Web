// src/app/terms/page.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service | InstaWeb",
  description: "InstaWeb Terms of Service and usage guidelines.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-12"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <h1 className="text-4xl font-black uppercase tracking-tight mb-4">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-12">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-black uppercase tracking-tight mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              By accessing or using InstaWeb ("Service"), you agree to be bound
              by these Terms of Service. If you do not agree to these terms, you
              may not use the Service. We reserve the right to update these
              terms at any time, and continued use of the Service constitutes
              acceptance of any modifications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight mb-3">
              2. Account Registration
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              You must provide accurate, complete, and current information when
              creating an account. You are responsible for safeguarding your
              account credentials and for all activities that occur under your
              account. You must notify us immediately of any unauthorized use of
              your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight mb-3">
              3. Acceptable Use
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 mb-3">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>Violate any applicable law or regulation</li>
              <li>Infringe upon the intellectual property rights of others</li>
              <li>Distribute malware, spam, or harmful content</li>
              <li>Impersonate any person or entity</li>
              <li>
                Attempt to gain unauthorized access to any part of the Service
              </li>
              <li>
                Use the Service for phishing, scamming, or fraudulent purposes
              </li>
              <li>Host content that is illegal, defamatory, or obscene</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight mb-3">
              4. Content Ownership
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              You retain ownership of all content you create and publish through
              the Service. By using the Service, you grant InstaWeb a
              non-exclusive, worldwide license to host, display, and distribute
              your content solely for the purpose of operating and providing the
              Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight mb-3">
              5. Subscription & Billing
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Paid plans are billed on a recurring monthly basis. You may cancel
              your subscription at any time through the billing portal.
              Cancellations take effect at the end of the current billing
              period. Refunds are not provided for partial billing periods. We
              reserve the right to change pricing with 30 days advance notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight mb-3">
              6. Service Availability
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              We strive to maintain 99.9% uptime but do not guarantee
              uninterrupted access to the Service. We may perform scheduled
              maintenance with reasonable advance notice. We are not liable for
              any downtime or service interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight mb-3">
              7. Termination
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              We reserve the right to suspend or terminate your account at any
              time for violation of these terms. Upon termination, your right to
              use the Service ceases immediately. You may request export of your
              data within 30 days of termination.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight mb-3">
              8. Limitation of Liability
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              To the maximum extent permitted by law, InstaWeb shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages, including loss of profits, data, or business
              opportunities, arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight mb-3">
              9. Contact
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              For questions about these Terms, please contact us at{" "}
              <a
                href="mailto:legal@instaweb.me"
                className="text-indigo-600 font-bold hover:underline"
              >
                legal@instaweb.me
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
