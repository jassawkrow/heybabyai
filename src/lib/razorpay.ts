export type Currency = 'INR' | 'USD' | 'GBP' | 'EUR' | 'CAD';

export interface Pricing {
  currency: Currency;
  symbol: string;
  report: number;    // AI Identity Report — major units
  solo: number;      // Solo Pass 30 days — major units
  couple6m: number;  // Couple's Pass 6 months — major units
}

// Canadian IANA timezone IDs that don't overlap with US equivalents
const CANADA_TZ = new Set([
  'America/Toronto', 'America/Vancouver', 'America/Winnipeg', 'America/Edmonton',
  'America/Halifax', 'America/St_Johns', 'America/Regina', 'America/Whitehorse',
  'America/Dawson', 'America/Inuvik', 'America/Rankin_Inlet', 'America/Resolute',
  'America/Iqaluit', 'America/Moncton', 'America/Glace_Bay', 'America/Goose_Bay',
  'America/Nipigon', 'America/Thunder_Bay', 'America/Rainy_River', 'America/Creston',
  'America/Dawson_Creek', 'America/Fort_Nelson',
]);

export function getCurrency(): Currency {
  try {
    const tz     = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
    const locale = navigator.language ?? '';
    if (tz === 'Asia/Calcutta' || tz === 'Asia/Kolkata' || locale === 'en-IN') return 'INR';
    if (tz === 'Europe/London' || locale === 'en-GB')                           return 'GBP';
    if (locale === 'en-CA' || locale === 'fr-CA' || CANADA_TZ.has(tz))         return 'CAD';
    if (tz.startsWith('Europe/'))                                                return 'EUR';
  } catch (_) { /* fallthrough */ }
  return 'USD';
}

const PRICES: Record<Currency, Pricing> = {
  INR: { currency: 'INR', symbol: '₹',   report: 199,  solo: 299,  couple6m: 999  },
  USD: { currency: 'USD', symbol: '$',   report: 4.99, solo: 5.99, couple6m: 19.99 },
  GBP: { currency: 'GBP', symbol: '£',   report: 3.99, solo: 4.99, couple6m: 15.99 },
  EUR: { currency: 'EUR', symbol: '€',   report: 4.49, solo: 5.49, couple6m: 17.99 },
  CAD: { currency: 'CAD', symbol: 'CA$', report: 6.99, solo: 7.99, couple6m: 24.99 },
};

export function getPricing(currency?: Currency): Pricing {
  return PRICES[currency ?? getCurrency()];
}

/** Format a price for display: ₹199 or $4.99 */
export function fmtPrice(amount: number, p: Pricing): string {
  return p.currency === 'INR'
    ? `${p.symbol}${amount}`
    : `${p.symbol}${amount.toFixed(2)}`;
}

/** Major-unit amount → smallest unit (paise / cents / pence) */
function toSmallestUnit(amount: number): number {
  return Math.round(amount * 100);
}

export function openRazorpay({
  amount,
  currency,
  description,
  email,
  onSuccess,
}: {
  amount: number;     // major units (e.g. 199 or 4.99)
  currency: Currency;
  description: string;
  email?: string;
  onSuccess: (response: any, amountSmallest: number) => void;
}) {
  const amountSmallest = toSmallestUnit(amount);
  new (window as any).Razorpay({
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: amountSmallest,
    currency,
    name: 'HeyBaby AI',
    description,
    prefill: { email: email ?? '' },
    theme: { color: '#1DAFB6' },
    handler: (response: any) => onSuccess(response, amountSmallest),
  }).open();
}
