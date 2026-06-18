import { Link, useLocation } from "@tanstack/react-router";
import { LayoutGrid, Heart, PawPrint, Bookmark, User } from "lucide-react";

const tabs = [
  { to: "/explore",      label: "Explore", icon: LayoutGrid },
  { to: "/swipe",        label: "Swipe",   icon: Heart      },
  { to: "/pets/explore", label: "Pets",    icon: PawPrint   },
  { to: "/saved",        label: "Saved",   icon: Bookmark   },
  { to: "/profile",      label: "Profile", icon: User       },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 no-print">
      <div className="glass-dark pill flex items-center gap-1 px-2 py-2 shadow-2xl">
        {tabs.map((t) => {
          const active = pathname === t.to || pathname.startsWith(t.to + "/");
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className="flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-full transition"
            >
              <span
                className={`flex items-center justify-center w-9 h-9 rounded-full transition ${
                  active ? "grad-primary" : ""
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-white" : "text-white/70"}`} />
              </span>
              <span className={`text-[10px] font-semibold ${active ? "text-white" : "text-white/60"}`}>
                {t.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
