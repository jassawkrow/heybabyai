import { supabase } from '../integrations/supabase/client';

export interface AIContent {
  historical_story: string;
  personality_deep: string;
  cultural_significance: string;
  lucky_elements: string;
  famous_bearers: string;
}

export async function generateAIContent(
  name: string,
  origin: string | null,
  meaning_short: string | null,
  numerology: number | null,
  rasi: string | null,
  star: string | null,
): Promise<AIContent> {
  const { data: { session } } = await supabase.auth.getSession();

  const response = await fetch('/api/generate-content', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify({ name, origin, meaning_short, numerology, rasi, star }),
  });

  if (!response.ok) {
    throw new Error(`AI content generation failed: ${response.status}`);
  }

  const data = await response.json();
  return data as AIContent;
}
