// PREDICCIÓN MEJORADA CON ML REAL

import { ensemblePredictor, crossValidate } from './mlModels';
import { getHistoricalData } from './binanceAPI';

/**
 * Generar datos históricos - AHORA CON OPCIÓN DE DATOS REALES
 */
export async function generateHistoricalData(crypto, days = 90, useRealData = false) {
  if (useRealData && crypto.symbol) {
    try {
      const klines = await getHistoricalData(crypto.symbol, '1d', days);
      if (klines && klines.length > 0) {
        return {
          prices: klines.map(k => k.close),
          volumes: klines.map(k => k.volume),
          timestamps: klines.map(k => k.timestamp),
        };
      }
    } catch (error) {
      console.log('Falling back to simulated data');
    }
  }
  
  // Fallback: Datos simulados
  const prices = [];
  const volumes = [];
  let currentPrice = crypto.price;
  
  for (let i = days; i >= 0; i--) {
    const randomChange = (Math.random() - 0.5) * crypto.price * 0.05;
    currentPrice = currentPrice + randomChange;
    prices.push(currentPrice);
    volumes.push(crypto.volume * (0.8 + Math.random() * 0.4));
  }
  
  return { prices, volumes, timestamps: [] };
}

/**
 * Predecir precio futuro - AHORA USA ENSEMBLE MODEL
 */
export function predictFuturePrice(prices, daysAhead = 7) {
  const result = ensemblePredictor(prices, daysAhead);
  return result.predictions;
}

/**
 * Simulador de inversión MEJORADO
 */
export function simulateInvestment(crypto, amount, days, historicalData) {
  const currentPrice = crypto.price;
  
  // Usar ensemble predictor
  const prediction = ensemblePredictor(historicalData.prices, days);
  const futurePrices = prediction.predictions;
  
  const finalPrice = futurePrices[futurePrices.length - 1];
  const roi = ((finalPrice - currentPrice) / currentPrice) * 100;
  const profit = amount * (roi / 100);
  const finalAmount = amount + profit;
  
  // Calcular volatilidad real
  const returns = [];
  for (let i = 1; i < historicalData.prices.length; i++) {
    returns.push((historicalData.prices[i] - historicalData.prices[i-1]) / historicalData.prices[i-1]);
  }
  
  const volatility = Math.sqrt(
    returns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / returns.length
  ) * Math.sqrt(252) * 100; // Anualizado
  
  // Nivel de riesgo mejorado
  let riskLevel = 'Muy Bajo';
  if (volatility > 5) riskLevel = 'Bajo';
  if (volatility > 10) riskLevel = 'Medio';
  if (volatility > 20) riskLevel = 'Alto';
  if (volatility > 40) riskLevel = 'Muy Alto';
  
  // Probabilidad de éxito basada en confianza del modelo
  const baseProb = 50;
  const confidenceBoost = (prediction.confidence || 0) * 30;
  const trendBoost = roi > 0 ? 10 : -10;
  const successProbability = Math.max(0, Math.min(100, baseProb + confidenceBoost + trendBoost));
  
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
    confidence: ((prediction.confidence || 0) * 100).toFixed(1),
    models: prediction.models, // Predicciones de cada modelo individual
  };
}

/**
 * Calcular score de inversión MEJORADO
 */
export function calculateInvestmentScore(crypto, historicalData) {
  let score = 50;
  
  // Validación cruzada
  const cvResults = crossValidate(historicalData.prices, 5);
  const accuracy = 100 - cvResults.mape;
  
  // Factor 1: Tendencia reciente (25%)
  const recentChange = crypto.change24h;
  if (recentChange > 10) score += 15;
  else if (recentChange > 5) score += 10;
  else if (recentChange > 0) score += 5;
  else if (recentChange < -10) score -= 15;
  else if (recentChange < -5) score -= 10;
  
  // Factor 2: Volumen (15%)
  const avgVolume = 10e9;
  if (crypto.volume > avgVolume * 2) score += 10;
  else if (crypto.volume > avgVolume) score += 5;
  else if (crypto.volume < avgVolume * 0.5) score -= 10;
  
  // Factor 3: Volatilidad (20%)
  const returns = [];
  for (let i = 1; i < historicalData.prices.length; i++) {
    returns.push((historicalData.prices[i] - historicalData.prices[i-1]) / historicalData.prices[i-1]);
  }
  const volatility = Math.sqrt(
    returns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / returns.length
  ) * 100;
  
  if (volatility < 2) score += 10;
  else if (volatility > 10) score -= 10;
  
  // Factor 4: Predicción ensemble (25%)
  const prediction = ensemblePredictor(historicalData.prices, 7);
  const futureGrowth = ((prediction.predictions[6] - crypto.price) / crypto.price) * 100;
  
  if (futureGrowth > 10) score += 15;
  else if (futureGrowth > 5) score += 10;
  else if (futureGrowth > 0) score += 5;
  else if (futureGrowth < -10) score -= 15;
  
  // Factor 5: Precisión del modelo (15%)
  score += (accuracy / 100) * 15;
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Ranking de inversiones MEJORADO
 */
export async function rankInvestments(cryptos, useRealData = false) {
  const ranked = await Promise.all(
    cryptos.map(async (crypto) => {
      const historicalData = await generateHistoricalData(crypto, 90, useRealData);
      const score = calculateInvestmentScore(crypto, historicalData);
      const simulation1d = simulateInvestment(crypto, 1000, 1, historicalData);
      const simulation7d = simulateInvestment(crypto, 1000, 7, historicalData);
      const simulation30d = simulateInvestment(crypto, 1000, 30, historicalData);
      
      return {
        ...crypto,
        score,
        simulation1d,
        simulation7d,
        simulation30d,
        recommendation: score > 70 ? 'COMPRA FUERTE' : 
                        score > 60 ? 'COMPRAR' :
                        score > 40 ? 'MANTENER' :
                        score > 30 ? 'VENDER' : 'VENTA FUERTE'
      };
    })
  );
  
  return ranked.sort((a, b) => b.score - a.score);
}
