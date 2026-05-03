// DETECCIÓN DE PATRONES DE TRADING

/**
 * Detectar patrón Doji - Indecisión
 */
export function detectDoji(open, high, low, close) {
  const bodySize = Math.abs(close - open);
  const totalRange = high - low;
  
  if (totalRange === 0) return false;
  
  // Doji: cuerpo muy pequeño comparado con el rango total
  const bodyRatio = bodySize / totalRange;
  
  return bodyRatio < 0.1;
}

/**
 * Detectar patrón Hammer - Reversión alcista
 */
export function detectHammer(open, high, low, close) {
  const bodySize = Math.abs(close - open);
  const upperShadow = high - Math.max(open, close);
  const lowerShadow = Math.min(open, close) - low;
  const totalRange = high - low;
  
  if (totalRange === 0) return false;
  
  // Hammer: sombra inferior larga, sombra superior corta, cuerpo pequeño
  return (
    lowerShadow > bodySize * 2 &&
    upperShadow < bodySize * 0.5 &&
    lowerShadow > totalRange * 0.6
  );
}

/**
 * Detectar patrón Shooting Star - Reversión bajista
 */
export function detectShootingStar(open, high, low, close) {
  const bodySize = Math.abs(close - open);
  const upperShadow = high - Math.max(open, close);
  const lowerShadow = Math.min(open, close) - low;
  const totalRange = high - low;
  
  if (totalRange === 0) return false;
  
  // Shooting Star: sombra superior larga, sombra inferior corta
  return (
    upperShadow > bodySize * 2 &&
    lowerShadow < bodySize * 0.5 &&
    upperShadow > totalRange * 0.6
  );
}

/**
 * Detectar patrón Engulfing - Reversión fuerte
 */
export function detectEngulfing(candles) {
  if (candles.length < 2) return { bullish: false, bearish: false };
  
  const prev = candles[candles.length - 2];
  const curr = candles[candles.length - 1];
  
  // Bullish Engulfing
  const bullishEngulfing = 
    prev.close < prev.open && // Vela anterior bajista
    curr.close > curr.open && // Vela actual alcista
    curr.open < prev.close && // Abre por debajo del cierre anterior
    curr.close > prev.open;   // Cierra por encima de la apertura anterior
  
  // Bearish Engulfing
  const bearishEngulfing =
    prev.close > prev.open && // Vela anterior alcista
    curr.close < curr.open && // Vela actual bajista
    curr.open > prev.close && // Abre por encima del cierre anterior
    curr.close < prev.open;   // Cierra por debajo de la apertura anterior
  
  return { bullish: bullishEngulfing, bearish: bearishEngulfing };
}

/**
 * Detectar Head and Shoulders - Reversión bajista
 */
export function detectHeadAndShoulders(prices, window = 20) {
  if (prices.length < window) return false;
  
  const recentPrices = prices.slice(-window);
  
  // Buscar tres picos
  const peaks = [];
  for (let i = 1; i < recentPrices.length - 1; i++) {
    if (recentPrices[i] > recentPrices[i-1] && recentPrices[i] > recentPrices[i+1]) {
      peaks.push({ index: i, value: recentPrices[i] });
    }
  }
  
  if (peaks.length < 3) return false;
  
  // Verificar si el pico del medio es más alto
  const [left, head, right] = peaks.slice(-3);
  
  return (
    head.value > left.value * 1.05 &&
    head.value > right.value * 1.05 &&
    Math.abs(left.value - right.value) < left.value * 0.05
  );
}

/**
 * Detectar Triángulo - Consolidación
 */
export function detectTriangle(prices, window = 20) {
  if (prices.length < window) return { type: null, breakout: null };
  
  const recentPrices = prices.slice(-window);
  
  // Encontrar máximos y mínimos locales
  const highs = [];
  const lows = [];
  
  for (let i = 2; i < recentPrices.length - 2; i++) {
    // Máximo local
    if (recentPrices[i] > recentPrices[i-1] && recentPrices[i] > recentPrices[i-2] &&
        recentPrices[i] > recentPrices[i+1] && recentPrices[i] > recentPrices[i+2]) {
      highs.push(recentPrices[i]);
    }
    
    // Mínimo local
    if (recentPrices[i] < recentPrices[i-1] && recentPrices[i] < recentPrices[i-2] &&
        recentPrices[i] < recentPrices[i+1] && recentPrices[i] < recentPrices[i+2]) {
      lows.push(recentPrices[i]);
    }
  }
  
  if (highs.length < 2 || lows.length < 2) return { type: null, breakout: null };
  
  // Analizar tendencia de máximos y mínimos
  const highsTrend = highs[highs.length - 1] - highs[0];
  const lowsTrend = lows[lows.length - 1] - lows[0];
  
  let type = null;
  
  if (Math.abs(highsTrend) < highs[0] * 0.02 && Math.abs(lowsTrend) < lows[0] * 0.02) {
    type = 'SYMMETRICAL'; // Triángulo simétrico
  } else if (highsTrend > 0 && lowsTrend > 0) {
    type = 'ASCENDING'; // Triángulo ascendente (alcista)
  } else if (highsTrend < 0 && lowsTrend < 0) {
    type = 'DESCENDING'; // Triángulo descendente (bajista)
  }
  
  // Detectar breakout
  const currentPrice = prices[prices.length - 1];
  const upperBound = Math.max(...highs.slice(-2));
  const lowerBound = Math.min(...lows.slice(-2));
  
  let breakout = null;
  if (currentPrice > upperBound * 1.01) breakout = 'UPWARD';
  else if (currentPrice < lowerBound * 0.99) breakout = 'DOWNWARD';
  
  return { type, breakout };
}

/**
 * Detectar Support/Resistance Levels
 */
export function detectSupportResistance(prices, tolerance = 0.02) {
  const levels = [];
  
  // Buscar niveles donde el precio ha rebotado varias veces
  for (let i = 5; i < prices.length - 5; i++) {
    const price = prices[i];
    let touches = 1;
    
    // Contar cuántas veces el precio ha tocado este nivel
    for (let j = 0; j < prices.length; j++) {
      if (Math.abs(prices[j] - price) / price < tolerance) {
        touches++;
      }
    }
    
    // Si ha tocado al menos 3 veces, es un nivel significativo
    if (touches >= 3) {
      // Evitar duplicados
      const exists = levels.some(level => 
        Math.abs(level.price - price) / price < tolerance
      );
      
      if (!exists) {
        levels.push({
          price,
          touches,
          type: price > prices[prices.length - 1] ? 'RESISTANCE' : 'SUPPORT'
        });
      }
    }
  }
  
  return levels.sort((a, b) => b.touches - a.touches).slice(0, 5);
}

/**
 * Detectar Trendlines
 */
export function detectTrendlines(prices, window = 20) {
  if (prices.length < window) return { uptrend: null, downtrend: null };
  
  const recentPrices = prices.slice(-window);
  
  // Encontrar mínimos para uptrend
  const lows = [];
  for (let i = 2; i < recentPrices.length - 2; i++) {
    if (recentPrices[i] < recentPrices[i-1] && recentPrices[i] < recentPrices[i+1]) {
      lows.push({ index: i, price: recentPrices[i] });
    }
  }
  
  // Encontrar máximos para downtrend
  const highs = [];
  for (let i = 2; i < recentPrices.length - 2; i++) {
    if (recentPrices[i] > recentPrices[i-1] && recentPrices[i] > recentPrices[i+1]) {
      highs.push({ index: i, price: recentPrices[i] });
    }
  }
  
  // Calcular pendiente de uptrend
  let uptrend = null;
  if (lows.length >= 2) {
    const firstLow = lows[0];
    const lastLow = lows[lows.length - 1];
    const slope = (lastLow.price - firstLow.price) / (lastLow.index - firstLow.index);
    uptrend = { slope, valid: slope > 0 };
  }
  
  // Calcular pendiente de downtrend
  let downtrend = null;
  if (highs.length >= 2) {
    const firstHigh = highs[0];
    const lastHigh = highs[highs.length - 1];
    const slope = (lastHigh.price - firstHigh.price) / (lastHigh.index - firstHigh.index);
    downtrend = { slope, valid: slope < 0 };
  }
  
  return { uptrend, downtrend };
}

/**
 * Análisis completo de patrones
 */
export function comprehensivePatternAnalysis(ohlcData) {
  const { opens, highs, lows, closes } = ohlcData;
  const candles = opens.map((o, i) => ({
    open: o,
    high: highs[i],
    low: lows[i],
    close: closes[i]
  }));
  
  const lastCandle = candles[candles.length - 1];
  
  return {
    candlestickPatterns: {
      doji: detectDoji(lastCandle.open, lastCandle.high, lastCandle.low, lastCandle.close),
      hammer: detectHammer(lastCandle.open, lastCandle.high, lastCandle.low, lastCandle.close),
      shootingStar: detectShootingStar(lastCandle.open, lastCandle.high, lastCandle.low, lastCandle.close),
      engulfing: detectEngulfing(candles),
    },
    chartPatterns: {
      headAndShoulders: detectHeadAndShoulders(closes),
      triangle: detectTriangle(closes),
    },
    levels: {
      supportResistance: detectSupportResistance(closes),
      trendlines: detectTrendlines(closes),
    },
  };
}
