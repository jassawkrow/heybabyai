import { useEffect, useState } from 'react';
import type { AIContent } from '@/lib/generateAIContent';

export interface ReportProps {
  name: string;
  pronunciation?: string | null;
  meaning_short?: string | null;
  origin?: string | null;
  ai_vibe_score?: number | null;
  numerology?: number | null;
  rasi?: string | null;
  star?: string | null;
  personality?: string | null;
  keywords?: string | null;
  meaning_long?: string | null;
  photoDataUrl?: string;
  aiContent?: AIContent;
}

export function ReportTemplate(props: ReportProps) {
  const {
    name, pronunciation, meaning_short, origin,
    ai_vibe_score, numerology, rasi, star,
    personality, keywords, meaning_long, photoDataUrl, aiContent,
  } = props;

  const [, setFontsLoaded] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@300;400;500;600&display=swap';
    document.head.appendChild(link);
    link.onload = () => {
      document.fonts.ready.then(() => setFontsLoaded(true));
    };
    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
    };
  }, []);

  const kwList = (keywords ?? '').split(',').map(k => k.trim()).filter(Boolean);

  const pill = (text: string, bg: string, color: string) => (
    <span style={{
      background: bg, color, borderRadius: 100,
      padding: '3px 12px', fontSize: 10, fontWeight: 600,
      display: 'inline-block',
    }}>{text}</span>
  );

  const luckyElements = aiContent?.lucky_elements || `Color: Teal · Day: Wednesday · Stone: Emerald`;
  const historicalStory = aiContent?.historical_story
    || meaning_long
    || `The name ${name} traces its roots to ${origin ?? 'ancient'} tradition, where it was bestowed as a blessing of strength and grace. Over centuries it found its way into poetry, sacred texts, and the hearts of families across the world. Today, ${name} carries the weight of history and the lightness of new beginnings — a timeless gift from the past to the future.`;
  const personalityDeep = aiContent?.personality_deep || '';
  const culturalSignificance = aiContent?.cultural_significance
    || `The name ${name} has resonated across generations, carried by poets, scholars, and visionaries of ${origin ?? 'ancient'} heritage.`;
  const famousBearers = aiContent?.famous_bearers || '';

  return (
    <div>
      {/* ── SLIDE 1 ────────────────────────────────────────────── */}
      <div
        id="report-slide-1"
        style={{
          width: 794, height: 1123,
          background: '#0D0A14',
          fontFamily: 'Arial, Helvetica, sans-serif',
          wordSpacing: 'normal',
          letterSpacing: 'normal',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden', position: 'relative',
        }}
      >
        {/* Header bar */}
        <div style={{
          height: 52, flexShrink: 0,
          background: 'linear-gradient(135deg,#1DAFB6,#7928A3)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 28px',
        }}>
          <span style={{ color: 'white', fontSize: 13, fontWeight: 700 }}>heybaby.ai ✦</span>
          <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 9, letterSpacing: '2.5px' }}>NAME IDENTITY REPORT</span>
        </div>

        {/* Hero section */}
        <div style={{ height: 420, display: 'flex', flexShrink: 0 }}>
          {/* Left 52% */}
          <div style={{
            width: '52%',
            background: 'linear-gradient(160deg,#1DAFB6 0%,#0D0A14 100%)',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', padding: '32px 36px',
          }}>
            {ai_vibe_score != null && (
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, letterSpacing: '2px', marginBottom: 10 }}>
                ✨ AI VIBE SCORE: {ai_vibe_score}
              </div>
            )}
            <div style={{
              fontSize: 72, fontWeight: 800, color: 'white',
              lineHeight: 1, fontFamily: 'Arial, Helvetica, sans-serif',
              wordBreak: 'break-word',
            }}>
              {name}
            </div>
            {pronunciation && (
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, fontStyle: 'italic', marginTop: 10 }}>
                /{pronunciation}/
              </div>
            )}
            {origin && (
              <div style={{
                marginTop: 18, width: 'fit-content',
                background: 'rgba(255,255,255,0.15)', borderRadius: 100,
                padding: '5px 16px', color: 'white',
                fontSize: 11, fontWeight: 600, letterSpacing: '1px',
              }}>
                {origin}
              </div>
            )}
          </div>

          {/* Right 48% */}
          <div style={{ width: '48%', position: 'relative', overflow: 'hidden' }}>
            {photoDataUrl ? (
              <>
                <img
                  src={photoDataUrl}
                  alt="Family photo"
                  crossOrigin="anonymous"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    display: 'block',
                  }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(135deg,rgba(239,92,132,0.3),rgba(121,40,163,0.4))',
                }} />
              </>
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(160deg, #EF5C84, #7928A3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24"
                    fill="none" stroke="rgba(255,255,255,0.8)"
                    strokeWidth="1.5" strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
                <p style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '13px',
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  textAlign: 'center',
                  margin: 0,
                  padding: '0 16px',
                  lineHeight: '1.4',
                }}>
                  Your child's photo<br/>appears here
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mid section */}
        <div style={{ height: 100, display: 'flex', flexShrink: 0 }}>
          {/* Left: meaning */}
          <div style={{
            width: '52%', background: '#F8F5FF',
            padding: '14px 24px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            <div style={{ color: '#1DAFB6', fontSize: 9, fontWeight: 700, letterSpacing: '2.5px', marginBottom: 6 }}>
              CORE MEANING
            </div>
            <div style={{
              fontSize: 15, fontStyle: 'italic',
              fontFamily: 'Arial, Helvetica, sans-serif', color: '#1A0A2E', lineHeight: 1.35,
            }}>
              {meaning_short}
            </div>
          </div>
          {/* Right: origin & vibe */}
          <div style={{
            width: '48%', background: '#FEFCFF',
            borderLeft: '1px solid rgba(0,0,0,0.07)',
            padding: '12px 20px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            <div style={{ color: '#F8A51C', fontSize: 9, fontWeight: 700, letterSpacing: '2.5px', marginBottom: 8 }}>
              ORIGIN & VIBE
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
              {kwList.slice(0, 3).map((k, i) => (
                <span key={i} style={{
                  background: 'rgba(29,175,182,0.12)', color: '#1DAFB6',
                  borderRadius: 100, padding: '2px 10px',
                  fontSize: 10, fontWeight: 600,
                }}>{k}</span>
              ))}
            </div>
            {ai_vibe_score != null && (
              <div style={{ fontSize: 26, fontWeight: 800, color: '#F8A51C', lineHeight: 1 }}>
                {ai_vibe_score}
              </div>
            )}
          </div>
        </div>

        {/* Etymology section — fills remaining space */}
        <div style={{
          flex: 1, background: '#0D0A14',
          padding: '28px 32px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{ color: '#1DAFB6', fontSize: 9, fontWeight: 700, letterSpacing: '3px', marginBottom: 14 }}>
            ETYMOLOGY & ROOTS
          </div>
          <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, lineHeight: 1.75, marginBottom: 20 }}>
            {historicalStory}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {origin && pill(origin, 'rgba(29,175,182,0.2)', '#1DAFB6')}
            {kwList.slice(0, 4).map((k, i) =>
              pill(k, 'rgba(121,40,163,0.2)', '#C084FC')
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          height: 24, flexShrink: 0, background: '#080610',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 28px',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 8 }}>
            heybabyai.com · Premium Name Report
          </span>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 8 }}>01 / 02</span>
        </div>
      </div>

      {/* ── SLIDE 2 ────────────────────────────────────────────── */}
      <div
        id="report-slide-2"
        style={{
          width: 794, height: 1123,
          background: '#1A1424',
          fontFamily: 'Arial, Helvetica, sans-serif',
          wordSpacing: 'normal',
          letterSpacing: 'normal',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header bar */}
        <div style={{
          height: 52, flexShrink: 0,
          background: 'linear-gradient(135deg,#7928A3,#EF5C84)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 28px',
        }}>
          <span style={{ color: 'white', fontSize: 13, fontWeight: 700 }}>heybaby.ai ✦</span>
          <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 9, letterSpacing: '2.5px' }}>NAME IDENTITY REPORT</span>
        </div>

        {/* Name row */}
        <div style={{
          height: 70, flexShrink: 0,
          background: 'rgba(255,255,255,0.03)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 28px',
        }}>
          <div>
            <div style={{
              fontSize: 36, fontWeight: 700, color: 'white',
              fontFamily: 'Arial, Helvetica, sans-serif', lineHeight: 1,
            }}>{name}</div>
            <div style={{
              fontSize: 10, color: '#EF5C84',
              fontWeight: 700, letterSpacing: '2px', marginTop: 5,
            }}>
              {(personality ?? 'THE VISIONARY').toUpperCase()}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', letterSpacing: '1.5px' }}>
              BORN IN AN ERA OF
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 3 }}>
              {origin} · Ancient tradition
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', flexShrink: 0 }} />

        {/* 2×2 Grid */}
        <div style={{
          flex: 1, display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12, padding: 12, minHeight: 0,
        }}>
          {/* Cell 1 — Numerology */}
          <div style={{
            background: '#1E1530', borderRadius: 16,
            padding: 20, display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ color: '#F8A51C', fontSize: 9, fontWeight: 700, letterSpacing: '2px', marginBottom: 14 }}>
              NUMEROLOGY
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'linear-gradient(135deg,#F8A51C,#EA4A35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, fontWeight: 800, color: 'white', flexShrink: 0,
              }}>
                {numerology ?? '?'}
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: 14, marginBottom: 5 }}>
                  {personality ?? 'The Visionary'}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, lineHeight: 1.5 }}>
                  Life Path {numerology ?? '?'}
                </div>
              </div>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10, lineHeight: 1.6 }}>
              {luckyElements}
            </div>
          </div>

          {/* Cell 2 — Vedic Astrology */}
          <div style={{
            background: '#0A1E2A', borderRadius: 16,
            padding: 20, display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ color: '#1DAFB6', fontSize: 9, fontWeight: 700, letterSpacing: '2px', marginBottom: 14 }}>
              VEDIC ASTROLOGY
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
              {rasi && pill(`${rasi} Rasi`, 'rgba(29,175,182,0.2)', '#1DAFB6')}
              {star && pill(`${star} Nakshatra`, 'rgba(121,40,163,0.2)', '#C084FC')}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, lineHeight: 1.6, flex: 1 }}>
              Governed by celestial rhythms, this name carries the energy of {rasi ?? 'the cosmos'} and the grace of {star ?? 'ancient stars'}.
            </div>
          </div>

          {/* Cell 3 — Personality */}
          <div style={{
            background: '#220F18', borderRadius: 16,
            padding: 20, display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ color: '#EF5C84', fontSize: 9, fontWeight: 700, letterSpacing: '2px', marginBottom: 14 }}>
              PERSONALITY ARCHETYPE
            </div>
            <div style={{
              fontSize: 18, fontWeight: 700, color: 'white',
              marginBottom: personalityDeep ? 10 : 16, fontFamily: 'Arial, Helvetica, sans-serif',
            }}>
              {personality ?? 'The Visionary'}
            </div>
            {personalityDeep ? (
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, lineHeight: 1.6, flex: 1 }}>
                {personalityDeep}
              </div>
            ) : (
              [
                { label: 'Empathy',    value: 92, gradient: 'linear-gradient(90deg,#EF5C84,#7928A3)' },
                { label: 'Creativity', value: 96, gradient: 'linear-gradient(90deg,#1DAFB6,#7928A3)' },
                { label: 'Wisdom',     value: 88, gradient: 'linear-gradient(90deg,#F8A51C,#EA4A35)' },
              ].map(({ label, value, gradient }) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10 }}>{label}</span>
                    <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10 }}>{value}%</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                    <div style={{ height: '100%', width: `${value}%`, background: gradient, borderRadius: 2 }} />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cell 4 — Cultural Legacy */}
          <div style={{
            background: '#1A100A', borderRadius: 16,
            padding: 20, display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ color: '#F8A51C', fontSize: 9, fontWeight: 700, letterSpacing: '2px', marginBottom: 14 }}>
              CULTURAL LEGACY
            </div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, lineHeight: 1.6, flex: 1 }}>
              {culturalSignificance}
            </div>
            {famousBearers && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ color: '#F8A51C', fontSize: 8, fontWeight: 700, letterSpacing: '2px', marginBottom: 6 }}>
                  NOTABLE BEARERS
                </div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10, lineHeight: 1.5 }}>
                  {famousBearers}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Historical Story panel */}
        <div style={{
          height: 160, flexShrink: 0,
          background: '#0A0712', borderRadius: 16,
          margin: '0 12px 12px', padding: '20px 24px',
        }}>
          <div style={{ color: '#1DAFB6', fontSize: 9, fontWeight: 700, letterSpacing: '3px', marginBottom: 10 }}>
            HISTORICAL STORY
          </div>
          <div style={{ height: 1, background: 'rgba(29,175,182,0.3)', marginBottom: 14 }} />
          <div style={{ color: 'rgba(255,255,255,0.68)', fontSize: 12, lineHeight: 1.75 }}>
            {historicalStory}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          height: 28, flexShrink: 0, background: '#080610',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 28px',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 8 }}>
            heybabyai.com · Premium Name Report · All rights reserved · Printable · A4 · Frame-ready
          </span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 8 }}>02 / 02</span>
        </div>
      </div>
    </div>
  );
}
