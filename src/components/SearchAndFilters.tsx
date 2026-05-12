import { Search } from "lucide-react";
import { useState } from "react";

const ORIGINS = ["Sanskrit", "Tamil", "Telugu", "Hindi", "Arabic", "Persian", "Modern"];
const GENDERS = ["All", "Girl", "Boy", "Unisex"];

export type FilterState = {
  q: string;
  gender: string;
  origin: string;
};

export function SearchAndFilters({
  state,
  onChange,
}: {
  state: FilterState;
  onChange: (s: FilterState) => void;
}) {
  const [local, setLocal] = useState(state.q);
  return (
    <div className="space-y-3">
      <div className="glass pill flex items-center gap-3 px-5 py-3 shadow-sm">
        <Search className="w-4 h-4 text-ink/50" />
        <input
          value={local}
          onChange={(e) => {
            setLocal(e.target.value);
            // debounce
            clearTimeout((window as any).__hbq);
            (window as any).__hbq = setTimeout(() => onChange({ ...state, q: e.target.value }), 350);
          }}
          placeholder="Search 2,278 names… try Aria, Tamil, sacred"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-ink/40"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {GENDERS.map((g) => {
          const active = (state.gender || "All") === g;
          return (
            <button
              key={g}
              onClick={() => onChange({ ...state, gender: g })}
              className={`pill px-4 py-1.5 text-xs font-semibold transition ${
                active ? "grad-primary text-white shadow" : "bg-white/70 text-ink/70 hover:bg-white"
              }`}
            >
              {g}
            </button>
          );
        })}
        <span className="w-px h-6 bg-black/10 self-center mx-1" />
        {ORIGINS.map((o) => {
          const active = state.origin === o;
          return (
            <button
              key={o}
              onClick={() => onChange({ ...state, origin: active ? "" : o })}
              className={`pill px-4 py-1.5 text-xs font-semibold transition ${
                active ? "grad-primary text-white shadow" : "bg-white/70 text-ink/70 hover:bg-white"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
