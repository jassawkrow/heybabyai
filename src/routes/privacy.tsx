import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — HeyBaby AI" }] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-3xl mx-auto px-5 pt-10 pb-32">
        <span className="pill bg-white/70 px-3 py-1 text-[11px] font-bold tracking-widest text-purple uppercase">Legal</span>
        <h1 className="text-4xl font-extrabold mt-4">Privacy Policy</h1>
        <p className="text-ink/55 mt-2 text-sm">Last updated: May 2025</p>

        <div className="mt-8 space-y-8">
          <Section title="What data we collect">
            <p>When you use HeyBaby AI, we collect the following information:</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-ink/75">
              <li>Your email address (used to sign in via magic link or Google)</li>
              <li>Name preferences — which names you swipe right or left on</li>
              <li>Your partner connection (room code and partner ID)</li>
              <li>Payment information is processed by Razorpay; we only store a payment reference ID and the plan purchased</li>
            </ul>
          </Section>

          <Section title="How we use your data">
            <p>Your data is used solely to provide the HeyBaby AI service:</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-ink/75">
              <li>To remember your saved names and swipe history</li>
              <li>To match your preferences with your partner's in real time</li>
              <li>To manage your subscription tier and swipe limits</li>
              <li>To send you the magic link sign-in email (no marketing emails without consent)</li>
            </ul>
            <p className="mt-3">We do not sell your data to third parties.</p>
          </Section>

          <Section title="Data storage and security">
            <p>
              All user data is stored securely in <strong>Supabase</strong>, which uses PostgreSQL with
              row-level security (RLS) policies so each user can only access their own data.
              Supabase is SOC 2 Type II compliant and encrypts data at rest and in transit.
            </p>
            <p className="mt-3">
              Authentication is handled by Supabase Auth. We never store passwords — sign-in is
              via magic link or Google OAuth only.
            </p>
          </Section>

          <Section title="Cookies and analytics">
            <p>
              We use essential cookies only (for your login session). We do not use advertising
              trackers or third-party analytics that sell your data.
            </p>
          </Section>

          <Section title="Your rights">
            <p>You can request deletion of your account and all associated data at any time by emailing us. We will process deletion within 7 business days.</p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about privacy? Email us at{" "}
              <a href="mailto:hello@heybabyai.com" className="text-purple underline">hello@heybabyai.com</a>
            </p>
          </Section>
        </div>

        <div className="mt-10 flex gap-4 text-xs text-ink/50">
          <Link to="/terms" className="underline">Terms of Service</Link>
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
