import { Heart } from "lucide-react";

export const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="relative">
      <div className="h-9 w-9 rounded-2xl gradient-hero flex items-center justify-center shadow-soft">
        <Heart className="h-5 w-5 text-primary-foreground fill-primary-foreground" />
      </div>
      <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-secondary border-2 border-background" />
    </div>
    <span className="text-xl font-bold tracking-tight">
      Hey<span className="text-primary">Baby</span>
    </span>
  </div>
);