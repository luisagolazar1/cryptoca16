// MÁS INDICADORES AVANZADOS

/**
 * Williams %R (overbought/oversold)
 */
export function calculateWilliamsR(highs, lows, closes, period = 14) {
  const williams = [];
  for (let i = period - 1; i < closes.length; i++) {
    const periodHigh = Math.max(...highs.slice(i - period + 1, i + 1));
    const periodLow = Math.min(...lows.slice(i - period + 1, i + 1));
    const wr = -100 * (periodHigh - closes[i]) / (periodHigh - periodLow);
    williams.push(wr || 0);
  }
  return williams;
}

/**
 * Commodity Channel Index (CCI)
 */
export function calculateCCI(highs, lows, closes, period = 20) {
  const cci = [];
  const tp = [];
  
  for (let i = 0; i < closes.length; i++) {
    tp.push((highs[i] + lows[i] + closes[i]) / 3);
  }
  
  for (let i = period - 1; i < tp.length; i++) {
    const sma = tp.slice(i - period + 1, i + 1).reduce((a, b) => a + b) / period;
    const mad = tp.slice(i - period + 1, i + 1)
      .reduce((sum, val) => sum + Math.abs(val - sma), 0) / period;
    const cci_val = (tp[i] - sma) / (0.015 * mad) || 0;
    cci.push(cci_val);
  }
  
  return cci;
}

/**
 * Money Flow Index (MFI)
 */
export function calculateMFI(highs, lows, closes, volumes, period = 14) {
  const mfi = [];
  const tp = [];
  const pmf = [];
  const nmf = [];
  
  for (let i = 0; i < closes.length; i++) {
    tp.push((highs[i] + lows[i] + closes[i]) / 3);
  }
  
  for (let i = 1; i < tp.length; i++) {
    const mf = tp[i] * volumes[i];
    if (tp[i] > tp[i - 1]) pmf.push(mf);
    else pmf.push(0);
    if (tp[i] < tp[i - 1]) nmf.push(mf);
    else nmf.push(0);
  }
  
  for (let i = period; i < pmf.length; i++) {
    const pmf_sum = pmf.slice(i - period, i).reduce((a, b) => a + b, 0);
    const nmf_sum = nmf.slice(i - period, i).reduce((a, b) => a + b, 0);
    const mr = pmf_sum / nmf_sum || 0;
    const mfi_val = 100 - (100 / (1 + mr));
    mfi.push(mfi_val);
  }
  
  return mfi;
}

/**
 * Relative Strength Index mejorado (con divergencias)
 */
export function calculateRSIWithDivergence(closes, period = 14) {
  const rsi = [];
  const gains = [];
  const losses = [];
  
  for (let i = 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? -change : 0);
  }
  
  for (let i = period - 1; i < closes.length; i++) {
    const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b) / period;
    const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b) / period;
    const rs = avgGain / avgLoss;
    const rsi_val = 100 - (100 / (1 + rs));
    rsi.push(rsi_val || 50);
  }
  
  // Detectar divergencias
  let bullishDivergence = false;
  let bearishDivergence = false;
  
  if (rsi.length > 2) {
    const lastRSI = rsi[rsi.length - 1];
    const prevRSI = rsi[rsi.length - 2];
    const lastPrice = closes[closes.length - 1];
    const prevPrice = closes[closes.length - 2];
    
    if (lastRSI > 30 && prevRSI < 30 && lastPrice < prevPrice) {
      bullishDivergence = true;
    }
    if (lastRSI < 70 && prevRSI > 70 && lastPrice > prevPrice) {
      bearishDivergence = true;
    }
  }
  
  return { rsi, bullishDivergence, bearishDivergence };
}

/**
 * Keltner Channels
 */
export function calculateKeltnerChannels(highs, lows, closes, period = 20, multiplier = 2) {
  const ema = [];
  const atr = [];
  const upper = [];
  const lower = [];
  
  // Calcular EMA
  let sum = 0;
  for (let i = 0; i < period; i++) sum += closes[i];
  let emaVal = sum / period;
  ema.push(emaVal);
  
  const k = 2 / (period + 1);
  for (let i = period; i < closes.length; i++) {
    emaVal = closes[i] * k + emaVal * (1 - k);
    ema.push(emaVal);
  }
  
  // Calcular ATR
  for (let i = 1; i < closes.length; i++) {
    const tr = Math.max(
      highs[i] - lows[i],
      Math.abs(highs[i] - closes[i - 1]),
      Math.abs(lows[i] - closes[i - 1])
    );
    const atrVal = i < period ? 
      (atr[i - 1] * (period - 1) + tr) / period :
      (atr[i - 1] * (period - 1) + tr) / period;
    atr.push(atrVal);
  }
  
  // Calcular canales
  for (let i = 0; i < ema.length; i++) {
    const atrVal = atr[i] || atr[atr.length - 1];
    upper.push(ema[i] + (atrVal * multiplier));
    lower.push(ema[i] - (atrVal * multiplier));
  }
  
  return { middle: ema, upper, lower };
}

/**
 * Donchian Channels
 */
export function calculateDonchianChannels(highs, lows, period = 20) {
  const upper = [];
  const lower = [];
  
  for (let i = period - 1; i < highs.length; i++) {
    const periodHigh = Math.max(...highs.slice(i - period + 1, i + 1));
    const periodLow = Math.min(...lows.slice(i - period + 1, i + 1));
    upper.push(periodHigh);
    lower.push(periodLow);
  }
  
  return { upper, lower };
}

/**
 * Market Profile (simpificado)
 */
export function calculateMarketProfile(closes, volumnes, levels = 10) {
  const minPrice = Math.min(...closes);
  const maxPrice = Math.max(...closes);
  const priceRange = maxPrice - minPrice;
  const levelHeight = priceRange / levels;
  
  const profile = Array(levels).fill(0);
  
  for (let i = 0; i < closes.length; i++) {
    const level = Math.floor((closes[i] - minPrice) / levelHeight);
    profile[level] += volumnes[i];
  }
  
  return {
    prices: Array(levels).fill(0).map((_, i) => minPrice + (i * levelHeight)),
    volumes: profile,
    pointOfControl: minPrice + (profile.indexOf(Math.max(...profile)) * levelHeight),
  };
}

/**
 * Accumulation/Distribution Line
 */
export function calculateADLine(highs, lows, closes, volumes) {
  const ad = [];
  let adValue = 0;
  
  for (let i = 0; i < closes.length; i++) {
    const clv = ((closes[i] - lows[i]) - (highs[i] - closes[i])) / (highs[i] - lows[i]);
    const ad_change = clv * volumes[i];
    adValue += ad_change;
    ad.push(adValue);
  }
  
  return ad;
}

/**
 * Calmar Ratio (riesgo/retorno)
 */
export function calculateCalmarRatio(returns, maxDrawdown) {
  const annualizedReturn = returns.length > 252 ? 
    Math.pow(1 + returns.reduce((a, b) => a + b) / returns.length, 252) - 1 :
    returns.reduce((a, b) => a + b);
  
  const calmar = maxDrawdown !== 0 ? annualizedReturn / Math.abs(maxDrawdown) : 0;
  return calmar;
}

/**
 * Sortino Ratio (mejor que Sharpe)
 */
export function calculateSortinoRatio(returns, rfr = 0) {
  const excessReturns = returns.map(r => r - rfr / 252);
  const avgReturn = excessReturns.reduce((a, b) => a + b) / excessReturns.length;
  
  const downside = excessReturns
    .filter(r => r < 0)
    .reduce((sum, r) => sum + Math.pow(r, 2), 0) / excessReturns.length;
  
  const downsideDeviation = Math.sqrt(downside);
  const sortino = (avgReturn * 252) / (downsideDeviation * Math.sqrt(252));
  
  return sortino || 0;
}

/**
 * Ulcer Index (medida de riesgo)
 */
export function calculateUlcerIndex(prices) {
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push(Math.log(prices[i] / prices[i - 1]));
  }
  
  let maxPrice = prices[0];
  let sumSquared = 0;
  
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > maxPrice) maxPrice = prices[i];
    const drawdown = ((prices[i] - maxPrice) / maxPrice) * 100;
    sumSquared += Math.pow(drawdown, 2);
  }
  
  const ulcer = Math.sqrt(sumSquared / prices.length);
  return ulcer;
}
