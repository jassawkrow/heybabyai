import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/join/$code")({
  head: () => ({ meta: [{ title: "Join your partner — HeyBaby AI" }] }),
  component: Join,
});

function Join() {
  const { code } = Route.useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "own" | "invalid" | "done">("loading");

  useEffect(() => {
    (async () => {
      console.log("Looking for code:", code);

      // Look up who owns this room code
      const { data: ownerProfile, error } = await supabase
        .from("profiles")
        .select("id, room_code")
        .eq("room_code", code)
        .single();

      console.log("Found profile:", ownerProfile);
      console.log("Error:", error);

      if (!ownerProfile) {
        setStatus("invalid");
        return;
      }

      // Get current user (fresh)
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        localStorage.setItem("pendingRoomCode", code);
        navigate({ to: "/profile" });
        return;
      }

      if (ownerProfile.id === user.id) {
        setStatus("own");
        return;
      }

      // Connect both partners
      await supabase.from("profiles")
        .update({ partner_id: ownerProfile.id })
        .eq("id", user.id);

      await supabase.from("profiles")
        .update({ partner_id: user.id })
        .eq("id", ownerProfile.id);

      localStorage.removeItem("pendingRoomCode");
      setStatus("done");
      alert("Partner connected! Start swiping together 💕");
      navigate({ to: "/swipe" });
    })();
  }, [code]);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-md mx-auto px-5 pt-16 text-center">
        <h1 className="text-3xl font-extrabold mb-4">HEYBABY-{code}</h1>
        {status === "loading" && <p className="text-ink/65">Looking up room code…</p>}
        {status === "invalid" && (
          <>
            <p className="text-red-500 font-semibold">Invalid room code: {code}</p>
            <p className="text-ink/50 text-sm mt-2">Ask your partner to re-send the invite link.</p>
          </>
        )}
        {status === "own" && (
          <p className="text-ink/65">This is your own invite link! Share it with your partner.</p>
        )}
        {status === "done" && <p className="text-teal font-semibold">Connected! Redirecting…</p>}
      </div>
    </div>
  );
}
