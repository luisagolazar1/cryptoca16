// ANÁLISIS TÉCNICO AVANZADO - CRYPTOCA16

// RSI (Relative Strength Index)
export function calculateRSI(prices, period = 14) {
  if (prices.length < period) return 50;
  
  let gains = 0;
  let losses = 0;
  
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  
  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

// MACD (Moving Average Convergence Divergence)
export function calculateMACD(prices) {
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  const macd = ema12 - ema26;
  const signal = macd * 0.9; // Aproximación simple
  const histogram = macd - signal;
  
  return { macd, signal, histogram };
}

// EMA (Exponential Moving Average)
export function calculateEMA(prices, period) {
  if (prices.length === 0) return 0;
  
  const k = 2 / (period + 1);
  let ema = prices[0];
  
  for (let i = 1; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }
  
  return ema;
}

// Bandas de Bollinger
export function calculateBollingerBands(prices, period = 20, stdDev = 2) {
  if (prices.length < period) return { upper: 0, middle: 0, lower: 0 };
  
  const recentPrices = prices.slice(-period);
  const middle = recentPrices.reduce((a, b) => a + b) / period;
  
  const variance = recentPrices.reduce((sum, price) => 
    sum + Math.pow(price - middle, 2), 0
  ) / period;
  
  const std = Math.sqrt(variance);
  
  return {
    upper: middle + (stdDev * std),
    middle: middle,
    lower: middle - (stdDev * std)
  };
}

// Señal de Compra/Venta basada en múltiples indicadores
export function generateSignal(crypto, historicalData) {
  const rsi = calculateRSI(historicalData.prices);
  const macd = calculateMACD(historicalData.prices);
  const bollinger = calculateBollingerBands(historicalData.prices);
  
  let score = 0;
  let signals = [];
  
  // RSI
  if (rsi < 30) {
    score += 3;
    signals.push('RSI oversold');
  } else if (rsi > 70) {
    score -= 3;
    signals.push('RSI overbought');
  }
  
  // MACD
  if (macd.histogram > 0 && macd.macd > macd.signal) {
    score += 2;
    signals.push('MACD bullish');
  } else if (macd.histogram < 0) {
    score -= 2;
    signals.push('MACD bearish');
  }
  
  // Bollinger
  const currentPrice = crypto.price;
  if (currentPrice < bollinger.lower) {
    score += 2;
    signals.push('Below Bollinger lower');
  } else if (currentPrice > bollinger.upper) {
    score -= 2;
    signals.push('Above Bollinger upper');
  }
  
  // Tendencia de precio
  if (crypto.change24h > 5) {
    score += 1;
    signals.push('Strong uptrend');
  } else if (crypto.change24h < -5) {
    score -= 1;
    signals.push('Strong downtrend');
  }
  
  // Generar señal final
  let signal = 'HOLD';
  let strength = 'Medium';
  
  if (score >= 5) {
    signal = 'STRONG BUY';
    strength = 'Very High';
  } else if (score >= 3) {
    signal = 'BUY';
    strength = 'High';
  } else if (score <= -5) {
    signal = 'STRONG SELL';
    strength = 'Very High';
  } else if (score <= -3) {
    signal = 'SELL';
    strength = 'High';
  }
  
  return {
    signal,
    strength,
    score,
    indicators: { rsi, macd, bollinger },
    reasons: signals
  };
}

// Calcular volatilidad histórica
export function calculateVolatility(prices, period = 30) {
  if (prices.length < period) return 0;
  
  const recentPrices = prices.slice(-period);
  const returns = [];
  
  for (let i = 1; i < recentPrices.length; i++) {
    returns.push((recentPrices[i] - recentPrices[i-1]) / recentPrices[i-1]);
  }
  
  const mean = returns.reduce((a, b) => a + b) / returns.length;
  const variance = returns.reduce((sum, ret) => 
    sum + Math.pow(ret - mean, 2), 0
  ) / returns.length;
  
  return Math.sqrt(variance * 365) * 100; // Anualizado
}

// Calcular Sharpe Ratio (risk-adjusted return)
export function calculateSharpeRatio(returns, riskFreeRate = 0.02) {
  if (returns.length === 0) return 0;
  
  const avgReturn = returns.reduce((a, b) => a + b) / returns.length;
  const std = Math.sqrt(
    returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length
  );
  
  if (std === 0) return 0;
  
  return (avgReturn - riskFreeRate) / std;
}
