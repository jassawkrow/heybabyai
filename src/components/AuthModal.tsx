import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Sparkles, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

interface Props { open: boolean; onClose: () => void; }

export const AuthModal = ({ open, onClose }: Props) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const send = async () => {
    if (!email.includes("@")) { setError("Enter a valid email"); return; }
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/explore` },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSent(true);
  };

  const reset = () => { setSent(false); setEmail(""); setError(""); };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-foreground/50 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="relative w-full max-w-sm rounded-[2rem] bg-card p-8 shadow-pop overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative glow */}
            <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full gradient-hero opacity-20 blur-3xl pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:scale-110 transition-transform"
            >
              <X className="h-4 w-4" />
            </button>

            {!sent ? (
              <>
                <div className="mb-6">
                  <div className="h-12 w-12 rounded-2xl gradient-hero flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-extrabold">Sign in to HeyBaby</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    We'll send a magic link to your email — no password needed.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && send()}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  {error && <p className="text-xs text-destructive font-medium">{error}</p>}

                  <Button
                    onClick={send}
                    disabled={loading}
                    className="w-full rounded-full gradient-hero text-white border-0 font-bold h-12"
                  >
                    {loading ? "Sending…" : "Send me a magic link"}
                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>

                <p className="text-[11px] text-muted-foreground text-center mt-4">
                  By signing in you agree to our terms. No spam, ever.
                </p>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="text-4xl mb-4">📬</div>
                <h2 className="text-2xl font-extrabold">Check your email!</h2>
                <p className="text-sm text-muted-foreground mt-2 mb-6">
                  We sent a magic link to <span className="font-semibold text-foreground">{email}</span>.
                  Click it to sign in — you'll land on your explore page.
                </p>
                <Button variant="outline" onClick={reset} className="rounded-full">
                  Use a different email
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
