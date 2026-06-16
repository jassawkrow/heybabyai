import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Copy, LogOut, Zap } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — HeyBaby AI" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
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

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "https://www.heybabyai.com/profile" },
    });
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") {
      toast.error("Type DELETE to confirm");
      return;
    }
    if (!user) return;
    setDeleting(true);
    try {
      await supabase.from("saved_names").delete().eq("user_id", user.id);
      await supabase.from("partner_rooms").delete().eq("created_by", user.id);
      await supabase.from("profiles").delete().eq("id", user.id);
      await supabase.auth.signOut();
      navigate({ to: "/" });
      toast.success("Your account has been deleted");
    } catch {
      toast.error("Failed to delete account. Please try again.");
      setDeleting(false);
    }
  };

  const tier = profile?.tier ?? "free";

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
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-full py-3 px-6 font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                >
                  <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
                  Continue with Google
                </button>

                <div className="flex items-center gap-3 my-4">
                  <hr className="flex-1 border-gray-200" />
                  <span className="text-gray-400 text-sm">or</span>
                  <hr className="flex-1 border-gray-200" />
                </div>

                <form onSubmit={sendMagic} className="space-y-3">
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pill bg-cream border border-black/10 px-5 py-3.5 text-sm outline-none focus:border-purple"
                  />
                  <button className="w-full pill grad-primary text-white py-3.5 font-semibold text-sm">
                    Send magic link →
                  </button>
                </form>
              </div>
            )}
            <p className="mt-4 text-[11px] text-ink/40">No password needed. Just click the link.</p>
          </div>
        ) : (
          <div className="space-y-4">

            {/* ADD 1 — Home button */}
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-sm text-ink/45 hover:text-ink/70 transition"
            >
              ← Home
            </Link>

            {/* User card */}
            <div className="rounded-3xl bg-white p-6 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-full grad-primary flex items-center justify-center text-white font-extrabold text-xl">
                {(profile?.email ?? user.email ?? "?")[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold truncate">{profile?.full_name ?? user.email}</div>
                <div className="text-xs text-ink/60 truncate">{user.email}</div>
              </div>
              <span className="pill grad-4 text-white text-[10px] font-bold px-3 py-1 uppercase">{tier}</span>
            </div>

            {/* Partner invite card */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="text-xs font-bold text-ink/50 uppercase mb-3">Partner invite</div>
              {profile?.partner_id ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Partner connected
                </div>
              ) : (() => {
                const roomCode = profile?.room_code || "";
                const inviteLink = roomCode
                  ? `https://www.heybabyai.com/join/${roomCode}`
                  : "";
                return (
                  <>
                    <div className="rounded-2xl grad-primary p-5 text-white text-center">
                      <div className="text-xs font-bold opacity-80">YOUR ROOM CODE</div>
                      <div className="text-2xl font-extrabold tracking-widest mt-1">
                        {roomCode ? `HEYBABY-${roomCode}` : "Generating…"}
                      </div>
                    </div>
                    {roomCode ? (
                      <>
                        <div className="mt-3 rounded-2xl bg-cream border border-black/8 px-4 py-2.5">
                          <div className="text-[10px] font-bold text-ink/40 uppercase mb-0.5">Invite link</div>
                          <p className="text-xs text-ink/70" style={{ wordBreak: "break-all" }}>{inviteLink}</p>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(inviteLink);
                            alert("Copied! Send this to your partner.");
                          }}
                          className="mt-2 w-full pill bg-cream border border-black/10 py-3 font-semibold text-sm flex items-center justify-center gap-2">
                          <Copy className="w-4 h-4" /> Copy invite link
                        </button>
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`Let's name our baby together on HeyBaby AI! Join my room here: ${inviteLink}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 w-full pill flex items-center justify-center gap-2 py-3 font-bold text-sm text-white"
                          style={{ background: "#25D366" }}
                        >
                          Share via WhatsApp 💬
                        </a>
                      </>
                    ) : (
                      <p className="text-xs text-ink/50 mt-3 text-center">Generating your room code…</p>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Stats card */}
            <div className="rounded-3xl bg-white p-6 shadow-sm grid grid-cols-3 text-center">
              <Stat label="Swipes today" value={profile?.daily_swipes ?? 0} />
              <Stat label="Plan" value={tier} />
              <Stat label="Code" value={profile?.room_code?.slice(0, 4) ?? "—"} />
            </div>

            {/* ADD 2 — Upgrade button for all tiers */}
            {tier === "couple" ? (
              <div className="w-full pill text-center py-3.5 font-semibold text-sm flex items-center justify-center gap-2 bg-ink/5 text-ink/35 cursor-default select-none">
                You're on the best plan ✦
              </div>
            ) : (
              <Link
                to="/pricing"
                className="block w-full pill grad-primary text-white text-center py-3.5 font-semibold text-sm flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                {tier === "solo"
                  ? "Upgrade to Couple's Pass — ₹799/6mo"
                  : "Upgrade to Solo Pass — ₹299/mo"}
              </Link>
            )}

            {/* Sign out */}
            <button onClick={signOut} className="w-full pill bg-white border border-black/10 py-3.5 font-semibold text-sm flex items-center justify-center gap-2 text-ink/70">
              <LogOut className="w-4 h-4" /> Sign out
            </button>

            {/* ADD 3 — Danger zone */}
            <div style={{ borderTop: "1px solid rgba(255,0,0,0.15)", paddingTop: "16px", marginTop: "8px" }}>
              <button
                onClick={() => { setDeleteConfirm(""); setDeleteOpen(true); }}
                className="w-full text-red-400 text-xs py-2 hover:text-red-600 transition"
              >
                Delete My Account
              </button>
              <p className="text-[10px] text-ink/35 text-center mt-1">
                This will permanently delete your account, saved names, and all data. This cannot be undone.
              </p>
            </div>
          </div>
        )}
      </div>
      <BottomNav />

      {/* Delete confirmation dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="rounded-2xl max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
            <DialogDescription>
              This will permanently delete your account, saved names, and all data. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <p className="text-sm">
              Type <span className="font-mono font-bold text-red-500">DELETE</span> to confirm:
            </p>
            <input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              className="w-full pill bg-cream border border-black/10 px-4 py-3 text-sm outline-none focus:border-red-400 font-mono"
            />
          </div>
          <DialogFooter className="gap-2 flex-row justify-end">
            <DialogClose asChild>
              <button className="pill bg-cream border border-black/10 px-5 py-2.5 text-sm font-semibold">
                Cancel
              </button>
            </DialogClose>
            <button
              onClick={handleDeleteAccount}
              disabled={deleteConfirm !== "DELETE" || deleting}
              className="pill bg-red-500 text-white px-5 py-2.5 text-sm font-semibold disabled:opacity-40 transition"
            >
              {deleting ? "Deleting…" : "Delete permanently"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
