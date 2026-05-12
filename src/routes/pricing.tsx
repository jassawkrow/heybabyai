import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Check, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { openRazorpay } from "@/lib/razorpay";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Pricing — HeyBaby AI" }] }),
  component: Pricing,
});

function Pricing() {
  const { user, profile, refreshProfile } = useAuth();

  const updateTier = async (tier: "solo" | "couple", days: number, paymentId: string, amount: number) => {
    if (!user) return;
    const expires = new Date();
    expires.setDate(expires.getDate() + days);
    await supabase.from("profiles").update({
      tier,
      tier_expires_at: expires.toISOString(),
    }).eq("id", user.id);
    await supabase.from("payments").insert({
      user_id: user.id,
      amount_paise: amount,
      tier,
      razorpay_payment_id: paymentId,
      status: "paid",
    });
    await refreshProfile();
    toast.success(`Welcome to ${tier === "solo" ? "Solo Pass" : "Couple's Pass"}! 🎉`);
    setTimeout(() => location.reload(), 1500);
  };

  const handleSolo = () => {
    if (!user) { toast.error("Sign in first"); location.assign("/profile"); return; }
    openRazorpay({
      amount: 29900,
      description: "Solo Pass - 30 days unlimited",
      email: user.email ?? "",
      onSuccess: (r: any) => updateTier("solo", 30, r.razorpay_payment_id, 29900),
    });
  };

  const handleCouple = () => {
    if (!user) { toast.error("Sign in first"); location.assign("/profile"); return; }
    openRazorpay({
      amount: 79900,
      description: "Couple's Pass - 6 months",
      email: user.email ?? "",
      onSuccess: (r: any) => updateTier("couple", 180, r.razorpay_payment_id, 79900),
    });
  };

  const currentTier = profile?.tier ?? "free";

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-5xl mx-auto px-5 pt-10 pb-32 text-center">
        <span className="pill bg-white/70 px-3 py-1 text-[11px] font-bold tracking-widest text-purple uppercase">Pricing</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold mt-4">Pick a plan made for two.</h1>
        <p className="text-ink/65 mt-3">Start free. Upgrade when 20 swipes a day just isn't enough.</p>

        <div className="grid md:grid-cols-3 gap-5 mt-10 text-left">
          <Tier
            name="Taste Test" tag="FREE" price="₹0" sub="forever"
            features={[
              ["Get a feel for it.", true],
              ["20 swipes per day", true],
              ["Basic name search", true],
              ["Save up to 5 favorites", true],
              ["Partner match", false],
              ["AI Report (₹499 each)", false],
            ]}
            cta={currentTier === "free" ? "Current plan" : "Free plan"}
            ctaClass="bg-cream border border-black/10 text-ink/70"
            onCta={null}
          />

          <Tier
            name="Solo Pass" tag="₹299 / $5.99" price="₹299" sub="30 days"
            features={[
              ["Swipe to your heart's content — alone.", true],
              ["Unlimited swipes", true],
              ["All filters unlocked", true],
              ["Save unlimited names", true],
              ["Partner match engine", false],
              ["AI Report (₹499 each)", true],
            ]}
            cta={currentTier === "solo" ? "Active plan ✓" : "Choose Solo"}
            ctaClass={currentTier === "solo" ? "bg-teal/10 text-teal border border-teal/30" : "bg-ink text-cream"}
            onCta={currentTier === "solo" ? null : handleSolo}
          />

          <Tier
            name="Couple's Pass" tag="MOST LOVED 💕" price="₹799" sub="6 months · 2 users"
            featured
            features={[
              ["For both of you, together.", true],
              ["Unlimited swipes — BOTH partners", true],
              ["Live Partner Match engine", true],
              ["1 free AI Identity Report", true],
              ["Premium filters & vibe insights", true],
              ["Priority support", true],
            ]}
            cta={currentTier === "couple" ? "Active plan ✓" : "Get the Couple's Pass"}
            ctaClass="bg-white text-purple"
            onCta={currentTier === "couple" ? null : handleCouple}
          />
        </div>

        <div className="mt-6 inline-block rounded-2xl bg-white px-5 py-3 text-xs text-ink/70 shadow-sm">
          Make it a keepsake — <b>Framed certificate ₹1,499 shipped</b>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

function Tier({ name, tag, price, sub, features, cta, ctaClass, featured, onCta }: any) {
  return (
    <div className={`rounded-3xl p-7 shadow-sm flex flex-col ${featured ? "grad-match text-white" : "bg-white"}`}>
      <div className={`pill self-start text-[10px] font-extrabold px-3 py-1 ${featured ? "bg-gold text-ink" : "bg-cream text-ink/70"}`}>
        {tag}
      </div>
      <h3 className="mt-4 text-2xl font-extrabold">{name}</h3>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold">{price}</span>
        <span className={`text-sm ${featured ? "text-white/80" : "text-ink/55"}`}>· {sub}</span>
      </div>
      <ul className="mt-5 space-y-2.5 text-sm flex-1">
        {features.map(([f, on]: [string, boolean], i: number) => (
          <li key={i} className="flex items-start gap-2">
            {on ? <Check className={`w-4 h-4 mt-0.5 shrink-0 ${featured ? "text-white" : "text-teal"}`} /> : <X className="w-4 h-4 mt-0.5 shrink-0 text-ink/30" />}
            <span className={!on ? (featured ? "opacity-70" : "text-ink/40") : ""}>{f}</span>
          </li>
        ))}
      </ul>
      {onCta ? (
        <button onClick={onCta} className={`mt-6 pill font-bold text-center py-3.5 text-sm w-full ${ctaClass}`}>{cta}</button>
      ) : (
        <div className={`mt-6 pill font-bold text-center py-3.5 text-sm ${ctaClass}`}>{cta}</div>
      )}
    </div>
  );
}
