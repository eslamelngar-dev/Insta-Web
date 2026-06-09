// src/app/privacy/page.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | InstaWeb",
  description: "InstaWeb Privacy Policy - How we collect, use, and protect your data.",
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-12">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-black uppercase tracking-tight mb-3">1. Information We Collect</h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 mb-3">
              We collect information you provide directly to us:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><strong>Account Information:</strong> Name, email address, and password when you create an account</li>
              <li><strong>Profile Data:</strong> Username, avatar, and any content you publish on your sites</li>
              <li><strong>Payment Information:</strong> Billing details processed securely through Stripe</li>
              <li><strong>Communications:</strong> Messages you send to us for support or feedback</li>
            </ul>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 mt-3">
              We automatically collect certain information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><strong>Analytics Data:</strong> Page views, device type, and referrer information for your published sites</li>
              <li><strong>Usage Data:</strong> How you interact with the dashboard and editor</li>
              <li><strong>Technical Data:</strong> Browser type, IP address, and device identifiers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>To provide, maintain, and improve the Service</li>
              <li>To process transactions and manage your subscription</li>
              <li>To send you important updates about the Service</li>
              <li>To provide analytics and insights about your published sites</li>
              <li>To detect, prevent, and address fraud or security issues</li>
              <li>To respond to your support requests</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight mb-3">3. Data Storage & Security</h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Your data is stored securely using Supabase infrastructure with encryption at rest
              and in transit. We implement industry-standard security measures including SSL/TLS
              encryption, secure authentication, and regular security audits. Payment information
              is processed by Stripe and is never stored on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight mb-3">4. Data Sharing</h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 mb-3">
              We do not sell your personal information. We may share your data with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><strong>Service Providers:</strong> Supabase (database), Stripe (payments), Vercel (hosting)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger or acquisition</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight mb-3">5. Cookies</h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              We use essential cookies to maintain your authentication session and remember your
              preferences (such as dark mode). We do not use third-party tracking cookies or
              advertising cookies. Analytics for your published sites use anonymous visitor IDs
              stored in localStorage, not cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight mb-3">6. Your Rights</h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 mb-3">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>Access, update, or delete your personal information</li>
              <li>Export your data at any time</li>
              <li>Close your account and request data deletion</li>
              <li>Opt out of non-essential communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight mb-3">7. Data Retention</h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              We retain your account data for as long as your account is active. Upon account
              deletion, we will delete your personal data within 30 days, except where retention
              is required by law. Anonymized analytics data may be retained indefinitely.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight mb-3">8. Children's Privacy</h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              The Service is not directed to children under 13. We do not knowingly collect
              personal information from children under 13. If you believe a child has provided
              us with personal information, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight mb-3">9. Changes to This Policy</h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              We may update this Privacy Policy from time to time. We will notify you of any
              material changes by posting the updated policy on this page and updating the
              "Last updated" date. Your continued use of the Service after changes constitutes
              acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight mb-3">10. Contact Us</h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              For privacy-related questions or requests, contact us at{" "}
              <a href="mailto:privacy@instaweb.me" className="text-indigo-600 font-bold hover:underline">
                privacy@instaweb.me
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}