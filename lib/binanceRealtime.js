const BASE = 'https://api.binance.com/api/v3';
const FAPI = 'https://fapi.binance.com/fapi/v1';

// Order Book - presión compradora/vendedora
export async function getOrderBook(symbol, limit = 20) {
  try {
    const s = symbol.includes('USDT') ? symbol : symbol + 'USDT';
    const res = await fetch(`${BASE}/depth?symbol=${s}&limit=${limit}`);
    const data = await res.json();
    const bids = data.bids.reduce((a, b) => a + parseFloat(b[1]), 0);
    const asks = data.asks.reduce((a, b) => a + parseFloat(b[1]), 0);
    const total = bids + asks;
    return {
      bids: data.bids.slice(0, 5).map(b => ({ price: parseFloat(b[0]), qty: parseFloat(b[1]) })),
      asks: data.asks.slice(0, 5).map(a => ({ price: parseFloat(a[0]), qty: parseFloat(a[1]) })),
      buyPressure: ((bids / total) * 100).toFixed(1),
      sellPressure: ((asks / total) * 100).toFixed(1),
      ratio: (bids / asks).toFixed(2),
    };
  } catch(e) {
    return { bids: [], asks: [], buyPressure: 50, sellPressure: 50, ratio: 1 };
  }
}

// Funding Rate + Open Interest
export async function getFundingRate(symbol) {
  try {
    const s = symbol.includes('USDT') ? symbol : symbol + 'USDT';
    const [frRes, oiRes] = await Promise.all([
      fetch(`${FAPI}/fundingRate?symbol=${s}&limit=3`),
      fetch(`${FAPI}/openInterest?symbol=${s}`),
    ]);
    const fr = await frRes.json();
    const oi = await oiRes.json();
    return {
      fundingRate: fr[0] ? (parseFloat(fr[0].fundingRate) * 100).toFixed(4) : '0',
      fundingRateNum: fr[0] ? parseFloat(fr[0].fundingRate) * 100 : 0,
      openInterest: oi.openInterest ? parseFloat(oi.openInterest).toLocaleString() : '0',
      openInterestUSD: oi.openInterest ? (parseFloat(oi.openInterest) * parseFloat(oi.price || 1)).toFixed(0) : '0',
    };
  } catch(e) {
    return { fundingRate: '0.0100', fundingRateNum: 0.01, openInterest: '0', openInterestUSD: '0' };
  }
}

// Klines histórico para ML
export async function getKlines(symbol, interval = '1d', limit = 500) {
  try {
    const s = symbol.includes('USDT') ? symbol : symbol + 'USDT';
    const res = await fetch(`${BASE}/klines?symbol=${s}&interval=${interval}&limit=${limit}`);
    const data = await res.json();
    return data.map(k => ({
      time: k[0],
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5]),
    }));
  } catch(e) { return []; }
}
