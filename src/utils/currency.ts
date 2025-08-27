import AsyncStorage from '@react-native-async-storage/async-storage';

export type Currency = 'USD' | 'TRY' | 'EUR';
type Rates = { 'USDTRY': number, 'EURTRY': number, 'USDEUR': number, 'EURUSD': number };

const KEY = 'fx-cache-v1';
const TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

const FALLBACK: Rates = {
  USDTRY: 33.00,   // changeable fallback
  EURTRY: 35.00,
  USDEUR: 0.92,
  EURUSD: 1.09,
};

type Cache = { ts: number; rates: Rates };

async function fetchRates(): Promise<Rates> {
  try {
    // public endpoint; if it fails we use fallback
    const res = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=TRY,EUR');
    const j = await res.json();
    const USDTRY = j?.rates?.TRY ?? FALLBACK.USDTRY;
    const USDEUR = j?.rates?.EUR ?? FALLBACK.USDEUR;
    return {
      USDTRY,
      EURTRY: USDTRY / USDEUR,
      USDEUR,
      EURUSD: 1 / USDEUR,
    };
  } catch {
    return FALLBACK;
  }
}

export async function getRates(): Promise<Rates> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const cached: Cache | null = raw ? JSON.parse(raw) : null;
    if (cached && (Date.now() - cached.ts) < TTL_MS) return cached.rates;
  } catch {}
  const rates = await fetchRates();
  try { await AsyncStorage.setItem(KEY, JSON.stringify({ ts: Date.now(), rates })); } catch {}
  return rates;
}

export async function convert(amount: number, from: Currency, to: Currency): Promise<number> {
  if (from === to) return amount;
  const r = await getRates();
  const map: Record<string, number> = {
    'USDTRY': r.USDTRY, 'EURTRY': r.EURTRY, 'USDEUR': r.USDEUR, 'EURUSD': r.EURUSD,
    'TRYUSD': 1 / r.USDTRY, 'TRYEUR': 1 / r.EURTRY,
  };
  const key = `${from}${to}`;
  const rate = map[key] ?? 1;
  return Math.round(amount * rate * 100) / 100; // 2 decimals
}

export function format(amount: number, cur: Currency) {
  const symbol = cur === 'TRY' ? '₺' : (cur === 'USD' ? '$' : '€');
  return `${symbol}${amount.toFixed(2)}`;
}
