import { useEffect, useState } from 'react';
import { fetchQuote, type StockQuote } from '@/lib/stock';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';

interface Props {
  ticker: string;
  intensity: number;
}

/** Slider 1–10 → 40–100% */
function intensityToPercent(intensity: number): number {
  return Math.round(40 + ((intensity - 1) / 9) * 60);
}

export function StockInfoCard({ ticker, intensity }: Props) {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!ticker.trim()) {
      setQuote(null);
      setError(false);
      return;
    }
    setLoading(true);
    setError(false);
    const sym = ticker.trim().toUpperCase();
    fetchQuote(sym)
      .then((q) => {
        setQuote(q);
        if (!q) setError(true);
      })
      .catch(() => {
        setQuote(null);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [ticker]);

  const intensityPct = intensityToPercent(intensity);

  if (!ticker.trim()) {
    return (
      <div className="rounded-xl border border-[#00D9FF]/20 bg-[#0A1929]/80 px-4 py-3 text-sm text-[#00D9FF]/60">
        Enter a stock ticker to see live data
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-[#00D9FF]/20 bg-[#0A1929]/80 px-4 py-3 text-sm text-[#00D9FF]/80">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Fetching {ticker.trim().toUpperCase()}…</span>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-[#0A1929]/80 px-4 py-3 text-sm text-red-400/90">
        {ticker.trim().toUpperCase()} — Could not fetch quote
      </div>
    );
  }

  const up = quote.dp >= 0;
  const arrow = up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-[#00D9FF]/20 bg-[#0A1929]/80 px-4 py-3 text-sm">
      <span className="font-mono font-semibold text-[#00D9FF]">
        {ticker.trim().toUpperCase()}
      </span>
      <span className="text-white/90">
        ${quote.c.toFixed(2)}
      </span>
      <span className={up ? 'text-emerald-400' : 'text-red-400'}>
        {arrow}
        {up ? '+' : ''}{quote.dp.toFixed(2)}%
      </span>
      <span className="text-white/60">|</span>
      <span className="text-[#00D9FF]/90">
        Intensity: {intensityPct}%
      </span>
    </div>
  );
}
