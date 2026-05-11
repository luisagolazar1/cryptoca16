// Clasificación de liquidez por volumen 24h real de Binance
const BASE = 'https://api.binance.com/api/v3';

export async function getVolumes(symbols) {
  try {
    const res = await fetch(`${BASE}/ticker/24hr`);
    const all = await res.json();
    const map = {};
    all.forEach(t => { map[t.symbol] = parseFloat(t.quoteVolume); });
    return symbols.map(s => ({
      symbol: s,
      volume24h: map[s] || map[s + 'USDT'] || 0,
    }));
  } catch(e) { return []; }
}

export function getLiquidityLabel(volume24h) {
  if (volume24h >= 500_000_000)  return { label: '🔥 Ultra Alta', color: 'text-green-400',  bg: 'bg-green-900/30',  score: 5 };
  if (volume24h >= 100_000_000)  return { label: '✅ Alta',       color: 'text-green-400',  bg: 'bg-green-900/20',  score: 4 };
  if (volume24h >= 20_000_000)   return { label: '🟡 Media',      color: 'text-yellow-400', bg: 'bg-yellow-900/20', score: 3 };
  if (volume24h >= 5_000_000)    return { label: '🟠 Baja',       color: 'text-orange-400', bg: 'bg-orange-900/20', score: 2 };
  return                                { label: '🔴 Muy Baja',   color: 'text-red-400',    bg: 'bg-red-900/20',    score: 1 };
}

export function fmtVol(v) {
  if (v >= 1e9) return `$${(v/1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v/1e6).toFixed(0)}M`;
  if (v >= 1e3) return `$${(v/1e3).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}
