import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Copy, LogOut, Zap } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — HeyBaby AI" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const pending = localStorage.getItem("pendingRoomCode");
      if (pending) {
        localStorage.removeItem("pendingRoomCode");
        navigate({ to: "/join/$code", params: { code: pending } });
      }
    }
  }, [user]);

  // Generate room_code client-side if missing (fallback for existing users)
  useEffect(() => {
    if (!user || !profile) return;
    if (!profile.room_code) {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      supabase.from("profiles").update({ room_code: code }).eq("id", user.id)
        .then(() => refreshProfile());
    }
  }, [user?.id, profile?.room_code]);

  const sendMagic = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: "https://www.heybabyai.com/profile" },
    });
    if (error) toast.error(error.message); else setSent(true);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-md mx-auto px-5 pt-8 pb-32">
        {!user ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <div className="w-14 h-14 rounded-full grad-primary mx-auto flex items-center justify-center text-2xl mb-4">
              👋
            </div>
            <h1 className="text-2xl font-extrabold">Welcome to HeyBaby AI</h1>
            <p className="text-sm text-ink/60 mt-2">Sign in to save names and match with your partner.</p>
            {sent ? (
              <div className="mt-6 rounded-2xl grad-primary text-white p-6">
                <div className="text-2xl mb-2">✉️</div>
                <div className="font-extrabold text-base">Check your inbox!</div>
                <div className="text-sm text-white/85 mt-1">We sent a magic link to <b>{email}</b></div>
              </div>
            ) : (
              <form onSubmit={sendMagic} className="mt-6 space-y-3">
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pill bg-cream border border-black/10 px-5 py-3.5 text-sm outline-none focus:border-purple"
                />
                <button className="w-full pill grad-primary text-white py-3.5 font-semibold text-sm">
                  Send magic link →
                </button>
              </form>
            )}
            <p className="mt-4 text-[11px] text-ink/40">No password needed. Just click the link.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-3xl bg-white p-6 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-full grad-primary flex items-center justify-center text-white font-extrabold text-xl">
                {(profile?.email ?? user.email ?? "?")[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold truncate">{profile?.full_name ?? user.email}</div>
                <div className="text-xs text-ink/60 truncate">{user.email}</div>
              </div>
              <span className="pill grad-4 text-white text-[10px] font-bold px-3 py-1 uppercase">{profile?.tier ?? "free"}</span>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="text-xs font-bold text-ink/50 uppercase mb-3">Partner invite</div>
              {profile?.partner_id ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Partner connected
                </div>
              ) : (
                <>
                  <div className="rounded-2xl grad-primary p-5 text-white text-center">
                    <div className="text-xs font-bold opacity-80">YOUR ROOM CODE</div>
                    <div className="text-2xl font-extrabold tracking-widest mt-1">HEYBABY-{profile?.room_code}</div>
                  </div>
                  <p className="text-xs text-ink/60 mt-3 text-center">Share this link with your partner</p>
                  <button
                    disabled={!profile?.room_code}
                    onClick={() => {
                      const roomCode = profile?.room_code;
                      if (!roomCode) return;
                      navigator.clipboard.writeText(`https://www.heybabyai.com/join/${roomCode}`);
                      toast.success("Invite link copied!");
                    }}
                    className="mt-2 w-full pill bg-cream border border-black/10 py-3 font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40">
                    <Copy className="w-4 h-4" /> Copy invite link
                  </button>
                </>
              )}
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm grid grid-cols-3 text-center">
              <Stat label="Swipes today" value={profile?.daily_swipes ?? 0} />
              <Stat label="Plan" value={profile?.tier ?? "free"} />
              <Stat label="Code" value={profile?.room_code?.slice(0, 4) ?? "—"} />
            </div>

            {(profile?.tier ?? "free") === "free" && (
              <Link to="/pricing" className="block w-full pill grad-primary text-white text-center py-3.5 font-semibold text-sm flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" /> Upgrade plan
              </Link>
            )}

            <button onClick={signOut} className="w-full pill bg-white border border-black/10 py-3.5 font-semibold text-sm flex items-center justify-center gap-2 text-ink/70">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-lg font-extrabold">{value}</div>
      <div className="text-[10px] text-ink/50 uppercase font-bold">{label}</div>
    </div>
  );
}
