import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function GuestAuthModal({
  open,
  onClose,
  heading,
  body,
}: {
  open: boolean;
  onClose: () => void;
  heading: string;
  body: string;
}) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) setSent(false);
  }, [open]);

  if (!open) return null;

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "https://www.heybabyai.com/profile" },
    });
  };

  const sendMagic = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: "https://www.heybabyai.com/profile" },
    });
    if (error) toast.error(error.message);
    else setSent(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-cream hover:bg-black/10 transition"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4 text-ink/60" />
        </button>

        <div className="text-center">
          <div className="w-12 h-12 rounded-full grad-primary mx-auto flex items-center justify-center text-2xl mb-4">
            ✨
          </div>
          <h2 className="text-xl font-extrabold">{heading}</h2>
          <p className="text-sm text-ink/60 mt-2">{body}</p>
        </div>

        {sent ? (
          <div className="mt-6 rounded-2xl grad-primary text-white p-6 text-center">
            <div className="text-2xl mb-2">✉️</div>
            <div className="font-extrabold text-base">Check your inbox!</div>
            <div className="text-sm text-white/85 mt-1">
              We sent a magic link to <b>{email}</b>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-full py-3 px-6 font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="" />
              Sign in with Google
            </button>

            <div className="flex items-center gap-3 my-2">
              <hr className="flex-1 border-gray-200" />
              <span className="text-gray-400 text-sm">or</span>
              <hr className="flex-1 border-gray-200" />
            </div>

            <form onSubmit={sendMagic} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pill bg-cream border border-black/10 px-5 py-3.5 text-sm outline-none focus:border-purple"
              />
              <button className="w-full pill grad-primary text-white py-3.5 font-semibold text-sm">
                Continue with email →
              </button>
            </form>
          </div>
        )}

        <p className="mt-4 text-center text-[11px] text-ink/40">No password needed. Just click the link.</p>
      </div>
    </div>
  );
}
