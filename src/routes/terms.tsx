import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms of Service — HeyBaby AI" }] }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-3xl mx-auto px-5 pt-10 pb-32">
        <span className="pill bg-white/70 px-3 py-1 text-[11px] font-bold tracking-widest text-purple uppercase">Legal</span>
        <h1 className="text-4xl font-extrabold mt-4">Terms of Service</h1>
        <p className="text-ink/55 mt-2 text-sm">Last updated: May 2025</p>

        <div className="mt-8 space-y-8">
          <Section title="Acceptance of terms">
            <p>
              By using HeyBaby AI ("the Service"), you agree to these Terms of Service.
              If you do not agree, please do not use the Service.
            </p>
          </Section>

          <Section title="Free tier">
            <p>
              All users get <strong>20 swipes per day</strong> at no cost. Free tier includes
              basic name search and up to 5 saved names. Partner matching and unlimited swipes
              require a paid plan.
            </p>
          </Section>

          <Section title="Paid plans and refund policy">
            <ul className="space-y-2 list-disc list-inside text-ink/75">
              <li><strong>Solo Pass (₹299)</strong> — 30 days unlimited swipes for one user</li>
              <li><strong>Couple's Pass (₹799)</strong> — 6 months unlimited for two partners</li>
              <li><strong>AI Identity Report (₹199)</strong> — one-time per name, instant access</li>
            </ul>
            <p className="mt-3 font-semibold">All sales are final. No refunds on digital purchases.</p>
            <p className="mt-2">
              Payments are processed by Razorpay. Your plan activates immediately upon successful
              payment. If your payment was charged but your plan did not activate, contact us within
              48 hours and we will resolve it.
            </p>
          </Section>

          <Section title="Age requirement">
            <p>
              You must be <strong>18 years of age or older</strong> to make any purchase on
              HeyBaby AI. By completing a purchase, you confirm that you meet this requirement.
            </p>
          </Section>

          <Section title="Acceptable use">
            <p>You agree not to:</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-ink/75">
              <li>Share your account credentials with others outside of the Couple's Pass</li>
              <li>Attempt to scrape, copy, or redistribute our name database</li>
              <li>Use the Service for any unlawful purpose</li>
            </ul>
          </Section>

          <Section title="Intellectual property">
            <p>
              All content including name data, AI Vibe Scores, and reports are the intellectual
              property of HeyBaby AI. AI Identity Reports purchased by you are licensed for
              personal use only.
            </p>
          </Section>

          <Section title="Disclaimer">
            <p>
              HeyBaby AI is provided "as is." We make no guarantees about the accuracy of
              numerology, astrology, or personality data in AI Reports — these are for
              entertainment and inspiration purposes only.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about these terms? Email us at{" "}
              <a href="mailto:hello@heybabyai.com" className="text-purple underline">hello@heybabyai.com</a>
            </p>
          </Section>
        </div>

        <div className="mt-10 flex gap-4 text-xs text-ink/50">
          <Link to="/privacy" className="underline">Privacy Policy</Link>
          <Link to="/" className="underline">Back to home</Link>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-extrabold mb-3">{title}</h2>
      <div className="text-sm text-ink/75 leading-relaxed space-y-2">{children}</div>
    </section>
  );
}
