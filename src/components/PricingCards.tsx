import { Check, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";


interface Props { compact?: boolean; }

const tiers = [
  {
    id: "free",
    name: "Taste Test",
    badge: "Free",
    price: { inr: "₹0", usd: "$0" },
    period: "forever",
    blurb: "Get a feel for it.",
    features: ["20 swipes per day", "Basic name details", "Save up to 5 favorites"],
    cta: "Current plan",
    variant: "ghost" as const,
    highlight: false,
  },
  {
    id: "solo",
    name: "Solo Pass",
    badge: "1 user",
    price: { inr: "₹299", usd: "$9.99" },
    period: "30 days",
    blurb: "Swipe to your heart's content — alone.",
    features: ["Unlimited swipes", "Advanced filters", "Unlimited favorites"],
    excluded: ["Partner Match", "AI Identity Report"],
    cta: "Choose Solo",
    variant: "outline" as const,
    highlight: false,
  },
  {
    id: "couple",
    name: "Couple's Pass",
    badge: "Most loved 💕",
    price: { inr: "₹799", usd: "$24.99" },
    period: "6 months · 2 users",
    blurb: "For both of you, together.",
    features: [
      "Unlimited swipes for BOTH partners",
      "Live Partner Match engine",
      "1 free AI Identity Report",
      "Premium filters & vibe insights",
      "Priority support",
    ],
    cta: "Get the Couple's Pass",
    variant: "default" as const,
    highlight: true,
  },
];

export const PricingCards = ({ compact = false }: Props) => (
  <div className="grid md:grid-cols-3 gap-5 items-stretch">
    {tiers.map((t, i) => (
      <motion.div
        key={t.id}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.1 }}
        className={`relative rounded-[1.75rem] p-6 flex flex-col ${
          t.highlight
            ? "gradient-couple text-primary-foreground shadow-pop md:scale-105 md:-my-2 ring-4 ring-pink/30"
            : "bg-card shadow-soft border border-border"
        }`}
      >
        {t.highlight && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-extrabold uppercase tracking-wider shadow-soft flex items-center gap-1">
            <Crown className="h-3.5 w-3.5" /> Recommended
          </div>
        )}
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-extrabold">{t.name}</h3>
          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
            t.highlight ? "bg-background/20 text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}>
            {t.badge}
          </span>
        </div>
        <p className={`text-sm ${t.highlight ? "text-primary-foreground/85" : "text-muted-foreground"}`}>
          {t.blurb}
        </p>
        <div className="mt-5 mb-1">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold">{t.price.inr}</span>
            <span className={`text-sm ${t.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
              / {t.price.usd}
            </span>
          </div>
          <p className={`text-xs mt-1 ${t.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
            {t.period}
          </p>
        </div>
        <ul className="space-y-2.5 my-5 flex-1">
          {t.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm">
              <span className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                t.highlight ? "bg-background/25" : "bg-primary/15 text-primary"
              }`}>
                <Check className="h-3 w-3" />
              </span>
              {f}
            </li>
          ))}
          {t.excluded?.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground line-through">
              <span className="mt-0.5 h-5 w-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">✕</span>
              {f}
            </li>
          ))}
        </ul>
        <Button
          size="lg"
          onClick={undefined}
          disabled={t.id === "free"}
          className={`w-full rounded-full font-bold ${
            t.highlight
              ? "bg-background text-foreground hover:bg-background/90"
              : t.id === "free"
              ? "bg-muted text-muted-foreground cursor-default"
              : ""
          }`}
          variant={t.highlight ? "default" : t.variant}
        >
          {t.id === "couple" && <Sparkles className="h-4 w-4 mr-2" />}
          {t.cta}
        </Button>
      </motion.div>
    ))}
  </div>
);
