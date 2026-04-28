import { motion, AnimatePresence } from "framer-motion";
import { BabyName } from "@/data/names";
import { Button } from "@/components/ui/button";
import { Share2, X, Heart } from "lucide-react";
import { useEffect } from "react";
import confetti from "canvas-confetti";

interface Props {
  name: BabyName | null;
  onClose: () => void;
}

export const MatchModal = ({ name, onClose }: Props) => {
  useEffect(() => {
    if (!name) return;
    const end = Date.now() + 1200;
    const colors = ["#1DAFB6", "#F8A51C", "#EF5C84", "#7928A3", "#EA4A35"];
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 70, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 70, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, [name]);

  return (
    <AnimatePresence>
      {name && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-foreground/60 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, y: 60, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative w-full max-w-sm rounded-[2rem] bg-card overflow-hidden shadow-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="gradient-couple p-8 text-center text-primary-foreground">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="inline-flex h-16 w-16 rounded-full bg-background/20 backdrop-blur items-center justify-center mb-3"
              >
                <Heart className="h-8 w-8 fill-primary-foreground" />
              </motion.div>
              <p className="uppercase tracking-[0.2em] text-xs font-bold opacity-90">It's a Match!</p>
              <h2 className="text-5xl font-extrabold mt-2">{name.name}</h2>
              <p className="text-sm opacity-90 mt-1">You & Alex both loved it 💕</p>
            </div>
            <div className="p-6 space-y-3 text-center">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{name.meaning}</span> · {name.origin}
              </p>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 rounded-full" onClick={onClose}>
                  Keep swiping
                </Button>
                <Button className="flex-1 rounded-full gradient-hero text-primary-foreground border-0">
                  <Share2 className="h-4 w-4 mr-2" /> Share
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};