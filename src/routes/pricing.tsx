import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Check, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getCurrency, getPricing, fmtPrice, openRazorpay } from "@/lib/razorpay";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Pricing — HeyBaby AI" }] }),
  component: Pricing,
});

function Pricing() {
  const { user, profile } = useAuth();
  const currency = getCurrency();
  const p = getPricing(currency);
  const fmt = (n: number) => fmtPrice(n, p);

  const handleSolo = () => {
    if (!user) { toast.error("Sign in first"); location.assign("/profile"); return; }
    openRazorpay({
      amount: p.solo,
      currency,
      description: 'Solo Pass – 30 days',
      email: user.email ?? '',
      onSuccess: async (response, amountSmallest) => {
        try {
          const { data: { user: u } } = await supabase.auth.getUser();
          if (!u) throw new Error('Not logged in');
          const { error } = await supabase
            .from('profiles')
            .update({
              tier: 'solo',
              tier_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            })
            .eq('id', u.id);
          if (error) throw error;
          await supabase.from('payments').insert({
            user_id: u.id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id ?? null,
            amount_paise: amountSmallest,
            currency,
            tier: 'solo',
            status: 'paid',
          });
          toast.success('You are now on Solo Pass!');
          window.location.reload();
        } catch (err) {
          toast.error('Payment recorded but upgrade failed. Contact support.');
          console.error(err);
        }
      },
    });
  };

  const handleCouple = () => {
    if (!user) { toast.error("Sign in first"); location.assign("/profile"); return; }
    openRazorpay({
      amount: p.couple6m,
      currency,
      description: "Couple's Pass – 6 months",
      email: user.email ?? '',
      onSuccess: async (response, amountSmallest) => {
        try {
          const { data: { user: u } } = await supabase.auth.getUser();
          if (!u) throw new Error('Not logged in');
          const { error } = await supabase
            .from('profiles')
            .update({
              tier: 'couple',
              tier_expires_at: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
            })
            .eq('id', u.id);
          if (error) throw error;
          await supabase.from('payments').insert({
            user_id: u.id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id ?? null,
            amount_paise: amountSmallest,
            currency,
            tier: 'couple',
            status: 'paid',
          });
          toast.success("You are now on Couple's Pass!");
          window.location.reload();
        } catch (err) {
          toast.error('Payment recorded but upgrade failed. Contact support.');
          console.error(err);
        }
      },
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
            name="Taste Test" tag="FREE" price={`${p.symbol}0`} sub="forever"
            features={[
              ["Get a feel for it.", true],
              ["20 swipes per day", true],
              ["Basic name search", true],
              ["Save up to 5 favorites", true],
              ["Partner match", false],
              [`AI Report (${fmt(p.report)} each)`, false],
            ]}
            cta={currentTier === "free" ? "Current plan" : "Free plan"}
            ctaClass="bg-cream border border-black/10 text-ink/70"
            onCta={null}
          />

          <Tier
            name="Solo Pass" tag={fmt(p.solo)} price={fmt(p.solo)} sub="30 days"
            features={[
              ["Swipe to your heart's content — alone.", true],
              ["Unlimited swipes", true],
              ["All filters unlocked", true],
              ["Save unlimited names", true],
              ["Partner match engine", false],
              [`AI Report (${fmt(p.report)} each)`, true],
            ]}
            cta={currentTier === "solo" ? "Active plan ✓" : "Choose Solo"}
            ctaClass={currentTier === "solo" ? "bg-teal/10 text-teal border border-teal/30" : "bg-ink text-cream"}
            onCta={currentTier === "solo" ? null : handleSolo}
          />

          <Tier
            name="Couple's Pass" tag="MOST LOVED 💕" price={fmt(p.couple6m)} sub="6 months · 2 users"
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

        <p className="mt-5 text-xs text-ink/50">
          Prices shown in {currency} · Secured by Razorpay
        </p>
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
