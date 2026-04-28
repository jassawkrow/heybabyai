import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Users, Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const PartnerLobby = () => {
  const [code] = useState("HEYBABY-MAYA8K");
  const [copied, setCopied] = useState(false);
  const [partnerJoined, setPartnerJoined] = useState(false);

  // Mock realtime: partner "joins" after 4s
  useEffect(() => {
    const t = setTimeout(() => setPartnerJoined(true), 4000);
    return () => clearTimeout(t);
  }, []);

  const copy = () => {
    navigator.clipboard.writeText(`https://heybaby.app/join/${code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="rounded-[1.75rem] bg-card shadow-soft border border-border p-6 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-10 w-10 rounded-2xl gradient-couple flex items-center justify-center">
          <Users className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-bold leading-tight">Partner Match Lobby</h3>
          <p className="text-xs text-muted-foreground">Swipe together, in real time</p>
        </div>
      </div>

      <div className="flex items-center gap-3 my-5">
        <PartnerAvatar label="You" emoji="👤" online />
        <div className="flex-1 h-0.5 bg-gradient-to-r from-primary via-pink to-purple rounded-full relative overflow-hidden">
          <motion.div
            animate={{ x: ["-30%", "130%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
            className="absolute inset-y-0 w-1/3 bg-background/50 blur-sm"
          />
        </div>
        <PartnerAvatar
          label={partnerJoined ? "Alex" : "Waiting…"}
          emoji={partnerJoined ? "💕" : "⏳"}
          online={partnerJoined}
        />
      </div>

      <div className="rounded-2xl bg-muted p-3 flex items-center gap-2">
        <code className="flex-1 text-sm font-mono font-semibold truncate">heybaby.app/join/{code}</code>
        <Button size="sm" onClick={copy} className="rounded-full h-8" variant={copied ? "default" : "outline"}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span className="ml-1.5 text-xs">{copied ? "Copied" : "Invite"}</span>
        </Button>
      </div>

      {partnerJoined && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-2 text-xs font-semibold text-primary"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Alex joined! Matches will fire when you both swipe right.
        </motion.div>
      )}
    </div>
  );
};

const PartnerAvatar = ({ label, emoji, online }: { label: string; emoji: string; online: boolean }) => (
  <div className="flex flex-col items-center gap-1">
    <div className={`relative h-12 w-12 rounded-2xl flex items-center justify-center text-xl ${online ? "gradient-cool" : "bg-muted"}`}>
      <span>{emoji}</span>
      <span
        className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-background ${
          online ? "bg-primary animate-pulse-glow" : "bg-muted-foreground/40"
        }`}
      />
    </div>
    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
  </div>
);