import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const { user, profile } = useAuth();

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-cream/80 border-b border-black/5 no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Logo />
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-ink/80">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-ink" }}>Home</Link>
          <Link to="/pricing" activeProps={{ className: "text-ink" }}>Pricing</Link>
          <Link to="/report" activeProps={{ className: "text-ink" }}>AI Report</Link>
          <Link to="/pets/explore" activeProps={{ className: "text-ink" }}>Pet Names 🐾</Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/profile" className="w-9 h-9 rounded-full grad-primary flex items-center justify-center text-white font-bold text-sm shadow-md">
              {(profile?.email ?? user.email ?? "?")[0].toUpperCase()}
            </Link>
          ) : (
            <Link to="/profile" className="hidden md:block text-sm font-semibold text-ink/70 hover:text-ink transition">
              Sign in
            </Link>
          )}
          <Link to="/swipe" className="grad-primary pill text-white text-sm font-semibold px-5 py-2.5 shadow-lg shadow-purple/20 hover:scale-[1.02] active:scale-[0.97] transition">
            Start swiping
          </Link>
        </div>
      </div>
    </header>
  );
}
