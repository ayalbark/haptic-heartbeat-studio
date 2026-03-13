/**
 * Finnhub stock quote API for live display.
 * See: https://finnhub.io/docs/api/quote
 */

const TOKEN = import.meta.env.VITE_FINNHUB_TOKEN;

export interface StockQuote {
  c: number;   // current price
  d: number;   // change
  dp: number;  // percent change
  h: number;   // high
  l: number;   // low
  o: number;   // open
  pc: number;  // previous close
}

export async function fetchQuote(symbol: string): Promise<StockQuote | null> {
  if (!TOKEN || !symbol?.trim()) return null;
  const ticker = symbol.trim().toUpperCase();
  const res = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${TOKEN}`
  );
  if (!res.ok) return null;
  const data = await res.json();
  if (data.d === null || data.d === undefined) return null; // invalid ticker
  return data;
}
