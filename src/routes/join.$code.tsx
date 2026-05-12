import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/join/$code")({
  head: () => ({ meta: [{ title: "Join your partner — HeyBaby AI" }] }),
  component: Join,
});

function Join() {
  const { code } = Route.useParams();
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (!user) return;
      // Find partner by room_code
      const { data: partner } = await supabase.from("profiles").select("id").eq("room_code", code).maybeSingle();
      if (!partner) { toast.error("Invalid room code"); return; }
      if (partner.id === user.id) { toast("That's your own room code"); return; }
      // Link both ways: copy partner's room_code & set partner_id mutually
      await supabase.from("profiles").update({ partner_id: partner.id, room_code: code }).eq("id", user.id);
      await supabase.from("profiles").update({ partner_id: user.id }).eq("id", partner.id);
      await refreshProfile();
      toast.success("Connected with your partner 💕");
      navigate({ to: "/swipe" });
    })();
  }, [user, code, navigate, refreshProfile]);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-md mx-auto px-5 pt-16 text-center">
        <h1 className="text-3xl font-extrabold">Joining room HEYBABY-{code}…</h1>
        <p className="text-ink/65 mt-3">{user ? "Linking you with your partner…" : "Sign in first to accept the invite."}</p>
        {!user && <a href="/profile" className="mt-6 inline-block pill grad-primary text-white px-6 py-3 font-semibold text-sm">Sign in</a>}
      </div>
    </div>
  );
}
