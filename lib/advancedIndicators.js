// INDICADORES TÉCNICOS AVANZADOS

/**
 * Stochastic RSI - Detecta reversiones con más sensibilidad que RSI
 */
export function calculateStochasticRSI(prices, rsiPeriod = 14, stochPeriod = 14) {
  const rsiValues = [];
  
  // Calcular RSI para cada punto
  for (let i = rsiPeriod; i < prices.length; i++) {
    const window = prices.slice(i - rsiPeriod, i);
    let gains = 0, losses = 0;
    
    for (let j = 1; j < window.length; j++) {
      const change = window[j] - window[j-1];
      if (change > 0) gains += change;
      else losses -= change;
    }
    
    const avgGain = gains / rsiPeriod;
    const avgLoss = losses / rsiPeriod;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    rsiValues.push(rsi);
  }
  
  // Calcular Stochastic sobre RSI
  if (rsiValues.length < stochPeriod) return 50;
  
  const recentRSI = rsiValues.slice(-stochPeriod);
  const minRSI = Math.min(...recentRSI);
  const maxRSI = Math.max(...recentRSI);
  const currentRSI = rsiValues[rsiValues.length - 1];
  
  if (maxRSI === minRSI) return 50;
  return ((currentRSI - minRSI) / (maxRSI - minRSI)) * 100;
}

/**
 * ADX (Average Directional Index) - Fuerza de la tendencia
 */
export function calculateADX(highs, lows, closes, period = 14) {
  if (highs.length < period + 1) return { adx: 0, plusDI: 0, minusDI: 0 };
  
  const trueRanges = [];
  const plusDM = [];
  const minusDM = [];
  
  for (let i = 1; i < highs.length; i++) {
    // True Range
    const tr = Math.max(
      highs[i] - lows[i],
      Math.abs(highs[i] - closes[i-1]),
      Math.abs(lows[i] - closes[i-1])
    );
    trueRanges.push(tr);
    
    // Directional Movement
    const highDiff = highs[i] - highs[i-1];
    const lowDiff = lows[i-1] - lows[i];
    
    plusDM.push(highDiff > lowDiff && highDiff > 0 ? highDiff : 0);
    minusDM.push(lowDiff > highDiff && lowDiff > 0 ? lowDiff : 0);
  }
  
  // Promedios
  const avgTR = trueRanges.slice(-period).reduce((a, b) => a + b) / period;
  const avgPlusDM = plusDM.slice(-period).reduce((a, b) => a + b) / period;
  const avgMinusDM = minusDM.slice(-period).reduce((a, b) => a + b) / period;
  
  // DI
  const plusDI = avgTR === 0 ? 0 : (avgPlusDM / avgTR) * 100;
  const minusDI = avgTR === 0 ? 0 : (avgMinusDM / avgTR) * 100;
  
  // DX
  const dx = plusDI + minusDI === 0 ? 0 : 
    (Math.abs(plusDI - minusDI) / (plusDI + minusDI)) * 100;
  
  return { adx: dx, plusDI, minusDI };
}

/**
 * Fibonacci Retracements - Niveles de soporte/resistencia
 */
export function calculateFibonacci(prices) {
  const high = Math.max(...prices);
  const low = Math.min(...prices);
  const diff = high - low;
  
  return {
    level_0: high,
    level_236: high - diff * 0.236,
    level_382: high - diff * 0.382,
    level_500: high - diff * 0.500,
    level_618: high - diff * 0.618,
    level_786: high - diff * 0.786,
    level_100: low,
  };
}

/**
 * Ichimoku Cloud - Sistema completo de tendencias
 */
export function calculateIchimoku(highs, lows, closes) {
  const conversionPeriod = 9;
  const basePeriod = 26;
  const spanPeriod = 52;
  
  // Tenkan-sen (Conversion Line)
  const conversionHigh = Math.max(...highs.slice(-conversionPeriod));
  const conversionLow = Math.min(...lows.slice(-conversionPeriod));
  const tenkanSen = (conversionHigh + conversionLow) / 2;
  
  // Kijun-sen (Base Line)
  const baseHigh = Math.max(...highs.slice(-basePeriod));
  const baseLow = Math.min(...lows.slice(-basePeriod));
  const kijunSen = (baseHigh + baseLow) / 2;
  
  // Senkou Span A
  const senkouSpanA = (tenkanSen + kijunSen) / 2;
  
  // Senkou Span B
  const spanHigh = Math.max(...highs.slice(-spanPeriod));
  const spanLow = Math.min(...lows.slice(-spanPeriod));
  const senkouSpanB = (spanHigh + spanLow) / 2;
  
  // Chikou Span
  const chikouSpan = closes[closes.length - 1];
  
  return {
    tenkanSen,
    kijunSen,
    senkouSpanA,
    senkouSpanB,
    chikouSpan,
    signal: tenkanSen > kijunSen ? 'BULLISH' : 'BEARISH'
  };
}

/**
 * VWAP (Volume Weighted Average Price)
 */
export function calculateVWAP(prices, volumes) {
  let cumVolume = 0;
  let cumPriceVolume = 0;
  
  for (let i = 0; i < prices.length; i++) {
    cumPriceVolume += prices[i] * volumes[i];
    cumVolume += volumes[i];
  }
  
  return cumVolume === 0 ? 0 : cumPriceVolume / cumVolume;
}

/**
 * OBV (On-Balance Volume) - Presión de compra/venta
 */
export function calculateOBV(prices, volumes) {
  let obv = 0;
  const obvValues = [0];
  
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i-1]) {
      obv += volumes[i];
    } else if (prices[i] < prices[i-1]) {
      obv -= volumes[i];
    }
    obvValues.push(obv);
  }
  
  return {
    current: obv,
    values: obvValues,
    trend: obv > 0 ? 'BUYING_PRESSURE' : 'SELLING_PRESSURE'
  };
}

/**
 * ATR (Average True Range) - Volatilidad
 */
export function calculateATR(highs, lows, closes, period = 14) {
  const trueRanges = [];
  
  for (let i = 1; i < highs.length; i++) {
    const tr = Math.max(
      highs[i] - lows[i],
      Math.abs(highs[i] - closes[i-1]),
      Math.abs(lows[i] - closes[i-1])
    );
    trueRanges.push(tr);
  }
  
  if (trueRanges.length < period) return 0;
  
  const atr = trueRanges.slice(-period).reduce((a, b) => a + b) / period;
  return atr;
}

/**
 * Parabolic SAR - Stop and Reverse
 */
export function calculateParabolicSAR(highs, lows, closes) {
  const acceleration = 0.02;
  const maxAcceleration = 0.2;
  
  let isLong = true;
  let sar = lows[0];
  let ep = highs[0]; // Extreme Point
  let af = acceleration;
  
  const sarValues = [sar];
  
  for (let i = 1; i < closes.length; i++) {
    // Actualizar SAR
    sar = sar + af * (ep - sar);
    
    if (isLong) {
      // Posición larga
      if (lows[i] < sar) {
        // Cambio a corto
        isLong = false;
        sar = ep;
        ep = lows[i];
        af = acceleration;
      } else {
        if (highs[i] > ep) {
          ep = highs[i];
          af = Math.min(af + acceleration, maxAcceleration);
        }
      }
    } else {
      // Posición corta
      if (highs[i] > sar) {
        // Cambio a largo
        isLong = true;
        sar = ep;
        ep = highs[i];
        af = acceleration;
      } else {
        if (lows[i] < ep) {
          ep = lows[i];
          af = Math.min(af + acceleration, maxAcceleration);
        }
      }
    }
    
    sarValues.push(sar);
  }
  
  return {
    current: sar,
    values: sarValues,
    position: isLong ? 'LONG' : 'SHORT'
  };
}

/**
 * Análisis completo con todos los indicadores
 */
export function comprehensiveAnalysis(ohlcData) {
  const { opens, highs, lows, closes, volumes } = ohlcData;
  
  return {
    stochasticRSI: calculateStochasticRSI(closes),
    adx: calculateADX(highs, lows, closes),
    fibonacci: calculateFibonacci(closes),
    ichimoku: calculateIchimoku(highs, lows, closes),
    vwap: calculateVWAP(closes, volumes),
    obv: calculateOBV(closes, volumes),
    atr: calculateATR(highs, lows, closes),
    parabolicSAR: calculateParabolicSAR(highs, lows, closes),
  };
}
