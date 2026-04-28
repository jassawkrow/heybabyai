import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Check, Crown, Sparkles } from "lucide-react";
import { PricingCards } from "./PricingCards";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const PaywallModal = ({ open, onClose }: Props) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-foreground/70 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
          className="relative w-full max-w-3xl rounded-t-[2rem] sm:rounded-[2rem] bg-background overflow-hidden shadow-pop max-h-[92vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full bg-muted flex items-center justify-center hover:scale-110 transition-transform"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="p-8 pt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/15 text-secondary text-xs font-bold uppercase tracking-wider mb-4">
              <Crown className="h-3.5 w-3.5" /> You hit your daily limit
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold">
              Unlock <span className="text-gradient-hero">unlimited swipes</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              Find the one. Match with your partner. Get an AI Identity Report.
            </p>
          </div>
          <div className="px-6 pb-8">
            <PricingCards compact />
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);