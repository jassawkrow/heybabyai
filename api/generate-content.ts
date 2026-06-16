import type { VercelRequest, VercelResponse } from '@vercel/node';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60 * 60 * 1000 });
    return false;
  }

  if (limit.count >= 10) {
    return true;
  }

  limit.count++;
  return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('API called');
  console.log('API key exists:', !!process.env.ANTHROPIC_API_KEY);
  console.log('API key prefix:', process.env.ANTHROPIC_API_KEY?.substring(0, 10));

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown';

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Try again later.' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', user.id)
      .single();

    if (!profile || profile.tier === 'free') {
      return res.status(403).json({ error: 'Payment required' });
    }

    const body = typeof req.body === 'string'
      ? JSON.parse(req.body)
      : req.body;

    const { name, origin, meaning_short, numerology, rasi, star } = body;

    console.log('Generating for name:', name);

    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Generate rich content for a baby name report.
Name: ${name}
Origin: ${origin}
Meaning: ${meaning_short}
Numerology life path: ${numerology}
Vedic Rasi: ${rasi}
Nakshatra: ${star}

Return ONLY valid JSON:
{
  "historical_story": "4-5 sentence rich history of the name",
  "personality_deep": "3-4 sentences about personality traits",
  "cultural_significance": "2-3 sentences about cultural importance",
  "lucky_elements": "Color: Gold · Day: Thursday · Stone: Topaz",
  "famous_bearers": "2-3 famous people with this name"
}`,
      }],
    });

    const text = message.content[0].type === 'text'
      ? message.content[0].text
      : '{}';

    console.log('AI response received, length:', text.length);

    // Strip markdown code fences Claude sometimes wraps the JSON in
    const jsonText = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    const parsed = JSON.parse(jsonText);
    return res.status(200).json(parsed);

  } catch (err: any) {
    console.error('Error in generate-content:', err.message);
    console.error('Full error:', err);
    return res.status(500).json({
      error: err.message,
      stack: err.stack?.substring(0, 500),
    });
  }
}
