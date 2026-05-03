// SISTEMA DE PREDICCIÓN Y SIMULACIÓN - CRYPTOCA16

// Generar datos históricos simulados para predicción
export function generateHistoricalData(crypto, days = 30) {
  const prices = [];
  const volumes = [];
  let currentPrice = crypto.price;
  
  // Simular precios históricos con volatilidad realista
  for (let i = days; i >= 0; i--) {
    const randomChange = (Math.random() - 0.5) * crypto.price * 0.05; // ±5% máximo
    currentPrice = currentPrice + randomChange;
    prices.push(currentPrice);
    volumes.push(crypto.volume * (0.8 + Math.random() * 0.4));
  }
  
  return { prices, volumes };
}

// Predecir precio futuro usando regresión lineal simple
export function predictFuturePrice(prices, daysAhead = 7) {
  const n = prices.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const y = prices;
  
  // Calcular pendiente e intersección
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Predecir precios futuros
  const predictions = [];
  for (let i = 1; i <= daysAhead; i++) {
    const futureX = n + i;
    predictions.push(slope * futureX + intercept);
  }
  
  return predictions;
}

// Simulador de inversión con diferentes timeframes
export function simulateInvestment(crypto, amount, days) {
  const historicalData = generateHistoricalData(crypto, 90);
  const currentPrice = crypto.price;
  const futurePrices = predictFuturePrice(historicalData.prices, days);
  
  const finalPrice = futurePrices[futurePrices.length - 1];
  const roi = ((finalPrice - currentPrice) / currentPrice) * 100;
  const profit = amount * (roi / 100);
  const finalAmount = amount + profit;
  
  // Calcular probabilidades
  const upDays = futurePrices.filter((p, i) => i === 0 ? p > currentPrice : p > futurePrices[i-1]).length;
  const successProbability = (upDays / futurePrices.length) * 100;
  
  // Nivel de riesgo basado en volatilidad
  const volatility = Math.sqrt(
    historicalData.prices.reduce((sum, p, i) => {
      if (i === 0) return 0;
      return sum + Math.pow((p - historicalData.prices[i-1]) / historicalData.prices[i-1], 2);
    }, 0) / historicalData.prices.length
  ) * 100;
  
  let riskLevel = 'Low';
  if (volatility > 5) riskLevel = 'Medium';
  if (volatility > 10) riskLevel = 'High';
  if (volatility > 20) riskLevel = 'Very High';
  
  return {
    initialAmount: amount,
    finalAmount,
    profit,
    roi,
    predictedPrice: finalPrice,
    currentPrice,
    successProbability,
    riskLevel,
    volatility: volatility.toFixed(2),
    timeline: futurePrices,
  };
}

// Calcular score de inversión (0-100)
export function calculateInvestmentScore(crypto, historicalData) {
  let score = 50; // Base
  
  // Factor 1: Tendencia reciente (peso: 25%)
  const recentChange = crypto.change24h;
  if (recentChange > 10) score += 15;
  else if (recentChange > 5) score += 10;
  else if (recentChange > 0) score += 5;
  else if (recentChange < -10) score -= 15;
  else if (recentChange < -5) score -= 10;
  else if (recentChange < 0) score -= 5;
  
  // Factor 2: Volumen (peso: 15%)
  const avgVolume = 10e9; // 10B promedio
  if (crypto.volume > avgVolume * 2) score += 10;
  else if (crypto.volume > avgVolume) score += 5;
  else if (crypto.volume < avgVolume * 0.5) score -= 10;
  
  // Factor 3: Volatilidad (peso: 20%)
  const volatility = calculateVolatility(historicalData.prices);
  if (volatility < 5) score += 10; // Baja volatilidad = estable
  else if (volatility > 20) score -= 10; // Alta volatilidad = riesgoso
  
  // Factor 4: Predicción de tendencia (peso: 25%)
  const predictions = predictFuturePrice(historicalData.prices, 7);
  const futureGrowth = ((predictions[6] - crypto.price) / crypto.price) * 100;
  if (futureGrowth > 10) score += 15;
  else if (futureGrowth > 5) score += 10;
  else if (futureGrowth > 0) score += 5;
  else if (futureGrowth < -10) score -= 15;
  
  // Factor 5: RSI (peso: 15%)
  const rsi = calculateRSI(historicalData.prices);
  if (rsi < 30) score += 10; // Oversold = oportunidad
  else if (rsi > 70) score -= 10; // Overbought = riesgoso
  
  return Math.max(0, Math.min(100, score));
}

function calculateRSI(prices, period = 14) {
  if (prices.length < period) return 50;
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  return 100 - (100 / (1 + avgGain / avgLoss));
}

function calculateVolatility(prices) {
  if (prices.length < 2) return 0;
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i-1]) / prices[i-1]);
  }
  const mean = returns.reduce((a, b) => a + b) / returns.length;
  const variance = returns.reduce((sum, ret) => 
    sum + Math.pow(ret - mean, 2), 0
  ) / returns.length;
  return Math.sqrt(variance * 365) * 100;
}

// Ranking de mejores opciones
export function rankInvestments(cryptos) {
  const ranked = cryptos.map(crypto => {
    const historicalData = generateHistoricalData(crypto, 90);
    const score = calculateInvestmentScore(crypto, historicalData);
    const simulation1d = simulateInvestment(crypto, 1000, 1);
    const simulation7d = simulateInvestment(crypto, 1000, 7);
    const simulation30d = simulateInvestment(crypto, 1000, 30);
    
    return {
      ...crypto,
      score,
      simulation1d,
      simulation7d,
      simulation30d,
      recommendation: score > 70 ? 'STRONG BUY' : 
                      score > 60 ? 'BUY' :
                      score > 40 ? 'HOLD' :
                      score > 30 ? 'SELL' : 'STRONG SELL'
    };
  });
  
  return ranked.sort((a, b) => b.score - a.score);
}
