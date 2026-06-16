import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Check, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Pricing — HeyBaby AI" }] }),
  component: Pricing,
});

function Pricing() {
  const { user, profile } = useAuth();

  const handleSolo = () => {
    if (!user) { toast.error("Sign in first"); location.assign("/profile"); return; }
    new (window as any).Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: 29900,
      currency: 'INR',
      name: 'HeyBaby AI',
      description: 'Solo Pass - 30 days',
      payment_capture: 1,
      theme: { color: '#1DAFB6' },
      handler: async (response: any) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not logged in');
          const tierValue = 'solo';
          const { error } = await supabase
            .from('profiles')
            .update({
              tier: tierValue,
              tier_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            })
            .eq('id', user.id);
          if (error) throw error;
          await supabase.from('payments').insert({
            user_id: user.id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id || null,
            amount_paise: 29900,
            tier: tierValue,
            status: 'paid',
          });
          toast.success('You are now on Solo Pass!');
          window.location.reload();
        } catch (err) {
          toast.error('Payment recorded but upgrade failed. Contact support.');
          console.error(err);
        }
      },
    }).open();
  };

  const handleCouple = () => {
    if (!user) { toast.error("Sign in first"); location.assign("/profile"); return; }
    new (window as any).Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: 79900,
      currency: 'INR',
      name: 'HeyBaby AI',
      description: "Couple's Pass - 6 months",
      payment_capture: 1,
      theme: { color: '#1DAFB6' },
      handler: async (response: any) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not logged in');
          const tierValue = 'couple';
          const { error } = await supabase
            .from('profiles')
            .update({
              tier: tierValue,
              tier_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            })
            .eq('id', user.id);
          if (error) throw error;
          await supabase.from('payments').insert({
            user_id: user.id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id || null,
            amount_paise: 79900,
            tier: tierValue,
            status: 'paid',
          });
          toast.success("You are now on Couple Pass!");
          window.location.reload();
        } catch (err) {
          toast.error('Payment recorded but upgrade failed. Contact support.');
          console.error(err);
        }
      },
    }).open();
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
              ["AI Report (₹199 each)", false],
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
              ["AI Report (₹199 each)", true],
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
