import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BabyName, NAMES, mapSupabaseName } from "@/data/names";

export function useNames(limit = 50) {
  const [names, setNames] = useState<BabyName[]>(NAMES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("names")
      .select("name,slug,gender,origin,pronunciation,meaning_short,ai_vibe_score,india_rank,gradient_index,keywords")
      .limit(limit)
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setNames(data.map((r) => mapSupabaseName(r as Record<string, unknown>)));
        }
        setLoading(false);
      });
  }, [limit]);

  return { names, loading };
}
