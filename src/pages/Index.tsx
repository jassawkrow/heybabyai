import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { SwipeDeck } from "@/components/SwipeDeck";
import { PartnerLobby } from "@/components/PartnerLobby";
import { PricingCards } from "@/components/PricingCards";
import { motion } from "framer-motion";
import {
  Sparkles, Heart, Users, BrainCircuit, ArrowRight,
  Globe2, Zap, Star, ShieldCheck, BookHeart, ChartNoAxesCombined,
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* NAV */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <a href="#how" className="hover:text-primary transition">How it works</a>
            <a href="#pricing" className="hover:text-primary transition">Pricing</a>
            <a href="#report" className="hover:text-primary transition">AI Report</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="rounded-full hidden sm:inline-flex">Sign in</Button>
            <Button size="sm" className="rounded-full gradient-hero text-primary-foreground border-0 font-semibold shadow-soft">
              Start swiping
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="container pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border shadow-soft text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-secondary" />
              AI-powered baby name discovery
            </span>
            <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
              A smarter way to <span className="text-gradient-hero">name your baby.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Swipe through thousands of names — together with your partner. Match in real time,
              read their AI Vibe Score, and find the one that just <em>feels</em> right.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="rounded-full gradient-hero text-primary-foreground border-0 font-bold shadow-pop h-14 px-7 text-base">
                Start free — 20 swipes a day
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full h-14 px-7 text-base font-semibold">
                <Users className="mr-2 h-5 w-5" /> Invite your partner
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm">
              <div className="flex -space-x-2">
                {["💕", "👶", "✨", "🎀"].map((e, i) => (
                  <div key={i} className="h-9 w-9 rounded-full bg-card border-2 border-background flex items-center justify-center text-base shadow-soft">
                    {e}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5 text-secondary">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                </div>
                <p className="text-xs text-muted-foreground font-medium">Loved by 12,000+ parents-to-be</p>
              </div>
            </div>
          </motion.div>

          {/* Live swipe demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-8 gradient-warm opacity-20 blur-3xl rounded-full" />
            <div className="relative">
              <SwipeDeck />
            </div>
          </motion.div>
        </div>
      </section>

      {/* PARTNER LOBBY */}
      <section id="how" className="container py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink/15 text-pink text-xs font-bold uppercase tracking-wider">
            <Heart className="h-3 w-3 fill-current" /> Partner Match
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold mt-4">
            When you both swipe right, <span className="text-gradient-warm">it's a match.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Send your partner an invite link, swipe at your own pace, and let the algorithm celebrate
            the moment you both fall for the same name.
          </p>
        </div>
        <PartnerLobby />
      </section>

      {/* HOW IT WORKS */}
      <section className="container py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Heart, color: "pink", title: "Swipe what you love", desc: "Right for love, left for pass. Your taste shapes the deck." },
            { icon: Users, color: "purple", title: "Match with your partner", desc: "Both partners swipe — matches fire instantly with confetti." },
            { icon: BrainCircuit, color: "primary", title: "Decode the AI Report", desc: "Etymology, numerology, personality — for your final shortlist." },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-[1.75rem] bg-card border border-border shadow-soft p-7"
            >
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-4 bg-${f.color}/15 text-${f.color}`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">{f.title}</h3>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI REPORT PREVIEW */}
      <section id="report" className="container py-20">
        <div className="rounded-[2rem] gradient-hero text-primary-foreground p-8 lg:p-14 shadow-pop overflow-hidden relative">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-pink/30 blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/15 backdrop-blur text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3 w-3" /> Premium · AI Identity Report
              </span>
              <h2 className="text-4xl sm:text-5xl font-extrabold mt-4">
                More than just a name.
              </h2>
              <p className="mt-4 opacity-90 max-w-md">
                Generate a full identity profile for your favorite name — etymology, numerology,
                and a personality archetype analysis based on cultural psychology.
              </p>
              <Button size="lg" className="mt-6 rounded-full bg-background text-foreground hover:bg-background/90 font-bold h-14 px-7">
                Preview a sample report
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="grid gap-3">
              {[
                { icon: BookHeart, title: "Name Etymology", text: "Trace the roots, language family, and historical bearers." },
                { icon: ChartNoAxesCombined, title: "Numerology Profile", text: "Life-path number, soul urge, expression — explained." },
                { icon: Star, title: "Personality Archetype", text: "What this name evokes in others, statistically." },
              ].map((c, i) => (
                <div key={i} className="rounded-2xl bg-background/15 backdrop-blur p-4 flex gap-3">
                  <div className="h-10 w-10 rounded-xl bg-background/25 flex items-center justify-center flex-shrink-0">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">{c.title}</h4>
                    <p className="text-sm opacity-85">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="container py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-bold uppercase tracking-wider">
            <Zap className="h-3 w-3" /> Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold mt-4">
            Pick a plan made for two.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Start free. Upgrade when 20 swipes a day just isn't enough.
          </p>
        </div>
        <PricingCards />
        <p className="text-center text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" /> Cancel anytime · Secure payments · 7-day refund
        </p>
      </section>

      {/* FOOTER */}
      <footer className="container py-10 border-t border-border/50 mt-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo />
          <p className="text-xs text-muted-foreground">
            © 2026 Hey Baby · Made with <Heart className="h-3 w-3 inline fill-pink text-pink" /> for new parents
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Globe2 className="h-3.5 w-3.5" /> India · Global
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
