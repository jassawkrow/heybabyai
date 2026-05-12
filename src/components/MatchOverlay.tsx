import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import type { Tables } from "@/integrations/supabase/types";
import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

const COLORS = ["#1DAFB6", "#F8A51C", "#7928A3", "#EF5C84", "#EA4A35", "#ffffff"];

export function MatchOverlay({
  name, partnerName, onClose,
}: { name: Tables<"names"> | null; partnerName?: string; onClose: () => void }) {
  useEffect(() => {
    if (!name) return;
    const fire = () => confetti({
      particleCount: 80, spread: 90, origin: { y: 0.4 }, colors: COLORS,
    });
    fire();
    const t1 = setTimeout(fire, 400);
    const t2 = setTimeout(onClose, 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [name, onClose]);

  return (
    <AnimatePresence>
      {name && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] grad-match flex flex-col items-center justify-center text-white px-6 text-center"
        >
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14 }}
            className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur"
          >
            <Heart className="w-10 h-10 fill-white" />
          </motion.div>
          <div className="text-[11px] font-bold tracking-[0.3em] mt-6">IT'S A MATCH</div>
          <h2 className="text-6xl font-extrabold mt-3">{name.name}</h2>
          {name.pronunciation && <div className="italic mt-2 text-white/90">/{name.pronunciation}/</div>}
          <p className="mt-4 text-white/95">You{partnerName ? ` & ${partnerName}` : ""} both loved it 💕</p>
          <div className="flex flex-wrap gap-2 justify-center mt-5">
            <span className="glass-chip pill px-3 py-1 text-xs">{name.origin}</span>
            <span className="glass-chip pill px-3 py-1 text-xs">✨ {name.ai_vibe_score}</span>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 w-full max-w-sm">
            <Link to="/report" search={{ name: name.name }}
              className="pill bg-white text-purple font-bold py-3.5 px-6 flex-1">
              View AI Report
            </Link>
            <button onClick={onClose} className="pill glass-chip font-semibold py-3.5 px-6 flex-1">
              Keep swiping →
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
