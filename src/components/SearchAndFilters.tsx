import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type FilterState = {
  q: string;
  gender: string;
  origin: string[];
  letter: string;
  religion: string;
  numerology: number | null;
  rasi: string;
  sort: "ai_vibe_score" | "india_rank" | "world_rank" | "name";
};

export const defaultFilters: FilterState = {
  q: "",
  gender: "All",
  origin: [],
  letter: "",
  religion: "",
  numerology: null,
  rasi: "",
  sort: "ai_vibe_score",
};

const GENDERS = ["All", "Girl", "Boy", "Unisex"];

const ORIGINS = [
  "Sanskrit", "Tamil", "Telugu", "Hindi", "Punjabi",
  "Bengali", "Marathi", "Kannada", "Gujarati",
  "Arabic", "Persian", "Modern", "Hebrew", "Greek",
  "English", "French", "Spanish", "Italian", "German",
  "Irish", "Scottish", "Scandinavian", "Latin",
  "Japanese", "Korean", "Chinese", "African",
];

const RELIGIONS = ["All", "Hindu", "Muslim", "Sikh", "Christian", "Jewish", "Buddhist"];

const RASIS = [
  "Mesha", "Vrishabha", "Mithuna", "Karka",
  "Simha", "Kanya", "Tula", "Vrishchika",
  "Dhanu", "Makara", "Kumbha", "Meena",
];

const SORT_OPTIONS: { label: string; value: FilterState["sort"] }[] = [
  { label: "Trending",       value: "ai_vibe_score" },
  { label: "A–Z",            value: "name"          },
  { label: "India Popular",  value: "india_rank"    },
  { label: "World Popular",  value: "world_rank"    },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function activeFilterCount(f: FilterState) {
  return [
    f.gender !== "All",
    f.origin.length > 0,
    f.letter !== "",
    f.religion !== "",
    f.numerology !== null,
    f.rasi !== "",
  ].filter(Boolean).length;
}

export function SearchAndFilters({
  state,
  onChange,
}: {
  state: FilterState;
  onChange: (s: FilterState) => void;
}) {
  const [localQ, setLocalQ]     = useState(state.q);
  const [panelOpen, setPanelOpen] = useState(false);
  const [draft, setDraft]        = useState<FilterState>(state);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Keep input in sync when cleared externally
  useEffect(() => { setLocalQ(state.q); }, [state.q]);

  // Sync draft to current applied state when panel opens
  useEffect(() => {
    if (panelOpen) setDraft(state);
  }, [panelOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lock body scroll while panel is open
  useEffect(() => {
    document.body.style.overflow = panelOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [panelOpen]);

  const count = activeFilterCount(state);

  const handleApply = () => {
    onChange({ ...draft, q: stateRef.current.q });
    setPanelOpen(false);
  };

  const clearTopBar = () => {
    setLocalQ("");
    setDraft(defaultFilters);
    onChange(defaultFilters);
  };

  const clearDraft = () => setDraft({ ...defaultFilters, q: stateRef.current.q });

  const toggleOrigin = (o: string) =>
    setDraft(d => ({
      ...d,
      origin: d.origin.includes(o) ? d.origin.filter(x => x !== o) : [...d.origin, o],
    }));

  return (
    <>
      {/* ── Always-visible top bar ── */}
      <div className="space-y-3">
        {/* Search input */}
        <div className="glass pill flex items-center gap-3 px-5 py-3 shadow-sm">
          <Search className="w-4 h-4 text-ink/50 shrink-0" />
          <input
            value={localQ}
            onChange={(e) => {
              setLocalQ(e.target.value);
              clearTimeout((window as any).__hbq);
              (window as any).__hbq = setTimeout(
                () => onChange({ ...stateRef.current, q: e.target.value }),
                350
              );
            }}
            placeholder='Search 8,000+ names… try "Aria", Tamil, sacred'
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-ink/40"
          />
          {localQ && (
            <button
              onClick={() => { setLocalQ(""); onChange({ ...stateRef.current, q: "" }); }}
              className="text-ink/40 hover:text-ink/70 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Gender pills + Filters button */}
        <div className="flex items-center gap-2 flex-wrap">
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

          <div className="flex-1" />

          {count > 0 && (
            <button
              onClick={clearTopBar}
              className="pill px-3 py-1.5 text-xs font-semibold text-ink/60 bg-white/70 hover:bg-white transition flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}

          <button
            onClick={() => setPanelOpen(true)}
            className={`pill px-4 py-1.5 text-xs font-semibold transition flex items-center gap-1.5 ${
              count > 0 ? "grad-primary text-white shadow" : "bg-white/70 text-ink/70 hover:bg-white"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {count > 0 && (
              <span className="bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-0.5 font-bold">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Filter panel ── */}
      {panelOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setPanelOpen(false)}
          />

          {/* Sheet */}
          <div className="relative z-10 bg-[#FEFBF5] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[88vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-black/8 shrink-0">
              <h2 className="font-extrabold text-base">Filter names</h2>
              <button
                onClick={() => setPanelOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/8 transition"
              >
                <X className="w-5 h-5 text-ink/60" />
              </button>
            </div>

            {/* Scrollable sections */}
            <div className="overflow-y-auto overscroll-contain flex-1 px-5 py-5 space-y-7">

              {/* Sort by */}
              <FilterSection title="Sort by">
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map(({ label, value }) => (
                    <Chip
                      key={value}
                      active={draft.sort === value}
                      onClick={() => setDraft(d => ({ ...d, sort: value }))}
                    >
                      {label}
                    </Chip>
                  ))}
                </div>
              </FilterSection>

              {/* A to Z */}
              <FilterSection title="Starts with letter">
                <div className="grid grid-cols-7 gap-1.5">
                  {ALPHABET.map((letter) => {
                    const active = draft.letter === letter;
                    return (
                      <button
                        key={letter}
                        onClick={() => setDraft(d => ({ ...d, letter: d.letter === letter ? "" : letter }))}
                        className={`rounded-xl py-1.5 text-sm font-bold transition ${
                          active ? "text-white" : "bg-white text-ink/70 hover:bg-white/60"
                        }`}
                        style={active ? { background: "linear-gradient(135deg,#1DAFB6,#7928A3)" } : {}}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>
              </FilterSection>

              {/* Language / Origin — multi-select */}
              <FilterSection title="Language / Origin">
                <div className="flex flex-wrap gap-2">
                  {ORIGINS.map((o) => (
                    <Chip
                      key={o}
                      active={draft.origin.includes(o)}
                      onClick={() => toggleOrigin(o)}
                    >
                      {o}
                    </Chip>
                  ))}
                </div>
              </FilterSection>

              {/* Religion */}
              <FilterSection title="Religion">
                <div className="flex flex-wrap gap-2">
                  {RELIGIONS.map((r) => {
                    const val = r === "All" ? "" : r.toLowerCase();
                    const active = draft.religion === val;
                    return (
                      <Chip
                        key={r}
                        active={active}
                        onClick={() => setDraft(d => ({ ...d, religion: active ? "" : val }))}
                        activeStyle={{ background: "linear-gradient(135deg,#EF5C84,#7928A3)" }}
                      >
                        {r}
                      </Chip>
                    );
                  })}
                </div>
              </FilterSection>

              {/* Rasi */}
              <FilterSection title="Rasi (Vedic astrology)">
                <div className="grid grid-cols-3 gap-2">
                  {RASIS.map((r) => {
                    const active = draft.rasi === r;
                    return (
                      <button
                        key={r}
                        onClick={() => setDraft(d => ({ ...d, rasi: d.rasi === r ? "" : r }))}
                        className={`rounded-xl py-2 px-2 text-xs font-semibold transition truncate ${
                          active ? "text-white" : "bg-white text-ink/70 hover:bg-white/60"
                        }`}
                        style={active ? { background: "linear-gradient(135deg,#F8A51C,#EA4A35)" } : {}}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              </FilterSection>

              {/* Numerology */}
              <FilterSection title="Numerology number">
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
                    const active = draft.numerology === n;
                    return (
                      <button
                        key={n}
                        onClick={() => setDraft(d => ({ ...d, numerology: d.numerology === n ? null : n }))}
                        className={`w-10 h-10 rounded-full text-sm font-bold transition ${
                          active ? "text-white" : "bg-white text-ink/70 hover:bg-white/60"
                        }`}
                        style={active ? { background: "linear-gradient(135deg,#7928A3,#1DAFB6)" } : {}}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
              </FilterSection>

            </div>

            {/* Footer actions */}
            <div className="px-5 py-4 border-t border-black/8 shrink-0 flex gap-3">
              <button
                onClick={clearDraft}
                className="pill px-5 py-3 text-sm font-semibold text-ink/60 bg-white hover:bg-white/80 transition"
              >
                Clear all
              </button>
              <button
                onClick={handleApply}
                className="flex-1 pill py-3 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#1DAFB6,#7928A3)" }}
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Small reusable sub-components ──────────────────────────────────────────

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-extrabold tracking-[0.2em] text-ink/45 uppercase mb-3">
        {title}
      </div>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  activeStyle,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  activeStyle?: React.CSSProperties;
}) {
  const defaultActive: React.CSSProperties = { background: "linear-gradient(135deg,#1DAFB6,#7928A3)" };
  return (
    <button
      onClick={onClick}
      className={`pill px-3 py-1.5 text-xs font-semibold transition ${
        active ? "text-white shadow-sm" : "bg-white text-ink/70 hover:bg-white/60"
      }`}
      style={active ? (activeStyle ?? defaultActive) : {}}
    >
      {children}
    </button>
  );
}
