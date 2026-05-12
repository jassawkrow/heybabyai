import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ArrowRight } from "lucide-react";
import { gradientFor } from "@/lib/gradients";
import type { Tables } from "@/integrations/supabase/types";
import { Link } from "@tanstack/react-router";

type N = Tables<"names">;

function ScoreBar({ label, value, color }: { label: string; value: number | null; color: string }) {
  const v = value ?? 0;
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold mb-1">
        <span className="text-ink/60">{label}</span>
        <span className="text-ink">{v}</span>
      </div>
      <div className="h-2 bg-black/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${v}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

export function NameSheet({
  name,
  onClose,
  onSave,
  onPass,
  saved,
}: {
  name: N | null;
  onClose: () => void;
  onSave?: (n: N) => void;
  onPass?: (n: N) => void;
  saved?: boolean;
}) {
  return (
    <AnimatePresence>
      {name && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-cream rounded-t-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 flex justify-center pt-2 pb-1 bg-cream z-10">
              <div className="w-10 h-1 rounded-full bg-black/15" />
            </div>
            <div className={`${gradientFor(name.gradient_index)} text-white rounded-t-2xl px-6 pt-6 pb-8 mx-3 mt-2`}>
              <div className="flex items-center justify-between text-[10px] font-semibold">
                <span className="glass-chip pill px-2 py-0.5">{name.origin}</span>
                <span className="glass-chip pill px-2 py-0.5">✨ {name.ai_vibe_score ?? "–"}</span>
              </div>
              <div className="mt-6">
                <h2 className="text-5xl font-extrabold tracking-tight">{name.name}</h2>
                {name.pronunciation && <div className="italic text-sm mt-2 text-white/90">/{name.pronunciation}/</div>}
                {name.meaning_short && <div className="text-base mt-3 text-white/95">{name.meaning_short}</div>}
              </div>
            </div>

            <div className="px-6 py-6 space-y-6">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {name.rasi && <Info label="Rasi" value={name.rasi} />}
                {name.star && <Info label="Star" value={name.star} />}
                {name.numerology != null && <Info label="Numerology" value={String(name.numerology)} />}
                {name.gender && <Info label="Gender" value={name.gender} />}
              </div>

              <div className="space-y-3">
                <ScoreBar label="AI Vibe Score" value={name.ai_vibe_score} color="var(--grad-primary)" />
                <ScoreBar label="Instagram Score" value={name.instagram_score} color="var(--grad-2)" />
                <ScoreBar label="Historical Score" value={name.historical_score} color="var(--grad-4)" />
              </div>

              {name.keywords && (
                <div>
                  <div className="text-xs font-semibold text-ink/60 mb-2">KEYWORDS</div>
                  <div className="flex flex-wrap gap-2">
                    {name.keywords.split(",").map((k, i) => (
                      <span key={i} className={`pill px-3 py-1 text-xs font-semibold text-white ${gradientFor(i)}`}>
                        {k.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {name.personality && (
                <div>
                  <div className="text-xs font-semibold text-ink/60 mb-2">PERSONALITY ARCHETYPE</div>
                  <div className="rounded-2xl bg-white p-4 text-sm">{name.personality}</div>
                </div>
              )}

              {name.meaning_long && (
                <div className="rounded-2xl border-2 border-gold/40 bg-gold/10 p-4 text-sm leading-relaxed">
                  <div className="text-xs font-extrabold text-gold mb-2">✦ FUN FACT</div>
                  {name.meaning_long}
                </div>
              )}
            </div>

            <div className="sticky bottom-0 px-6 py-4 bg-cream/95 backdrop-blur border-t border-black/5 flex items-center gap-3">
              <button
                onClick={() => { onPass?.(name); onClose(); }}
                className="flex-1 pill bg-white border border-black/10 py-3 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" /> Pass
              </button>
              <button
                onClick={() => { onSave?.(name); onClose(); }}
                className={`flex-1 pill py-3 text-sm font-semibold flex items-center justify-center gap-2 ${saved ? "bg-pink-100 text-pink-500 border border-pink-200" : "grad-2 text-white"}`}
              >
                <Heart className={`w-4 h-4 ${saved ? "fill-pink-500" : ""}`} /> {saved ? "Saved ✦" : "Save"}
              </button>
              <Link
                to="/report"
                search={{ name: name.name }}
                className="flex-1 pill grad-primary text-white py-3 text-sm font-semibold flex items-center justify-center gap-2"
              >
                Report <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="h-24" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-3">
      <div className="text-[10px] font-bold text-ink/50 uppercase tracking-wider">{label}</div>
      <div className="font-semibold mt-0.5">{value}</div>
    </div>
  );
}
