// ANÁLISIS COMPLETO CON DATOS REALES Y BACKTESTING

import { getHistoricalData } from './binanceAPI';
import { ensemblePredictor, crossValidate } from './mlModels';
import { generateSignal } from './technicalAnalysis';
import { generateBacktestReport } from './backtesting';

/**
 * Análisis completo de una criptomoneda
 */
export async function analyzeCompleteCrypto(symbol) {
  try {
    // 1. Obtener datos históricos reales
    const historicalKlines = await getHistoricalData(symbol, '1d', 90);
    
    if (!historicalKlines || historicalKlines.length < 30) {
      throw new Error('Insufficient historical data');
    }
    
    const prices = historicalKlines.map(k => k.close);
    const volumes = historicalKlines.map(k => k.volume);
    const timestamps = historicalKlines.map(k => k.timestamp);
    
    const currentPrice = prices[prices.length - 1];
    
    // 2. Generar señales técnicas
    const signal = generateSignal(
      { price: currentPrice, change24h: 0, volume: volumes[volumes.length - 1] },
      { prices, volumes }
    );
    
    // 3. Predicción ML con ensemble
    const prediction7d = ensemblePredictor(prices, 7);
    const prediction30d = ensemblePredictor(prices, 30);
    
    // 4. Validación cruzada
    const cvResults = crossValidate(prices, 5);
    
    // 5. Backtesting
    const backtestReport = generateBacktestReport(
      { prices, volumes, timestamps },
      10000
    );
    
    // 6. Calcular score mejorado
    const score = calculateImprovedScore({
      signal,
      prediction7d,
      backtestReport,
      cvResults,
      prices
    });
    
    return {
      symbol,
      currentPrice,
      signal,
      predictions: {
        day7: prediction7d.predictions,
        day30: prediction30d.predictions,
        confidence: prediction7d.confidence,
      },
      backtesting: backtestReport,
      validation: cvResults,
      score,
      recommendation: getRecommendation(score, signal),
    };
    
  } catch (error) {
    console.error(`Error analyzing ${symbol}:`, error);
    return null;
  }
}

/**
 * Calcular score mejorado con múltiples factores
 */
function calculateImprovedScore(data) {
  const { signal, prediction7d, backtestReport, cvResults, prices } = data;
  
  let score = 50; // Base
  
  // Factor 1: Señal técnica (peso 20%)
  if (signal.signal === 'STRONG BUY') score += 20;
  else if (signal.signal === 'BUY') score += 10;
  else if (signal.signal === 'STRONG SELL') score -= 20;
  else if (signal.signal === 'SELL') score -= 10;
  
  // Factor 2: Predicción ML (peso 25%)
  const predictedChange = ((prediction7d.predictions[6] - prices[prices.length - 1]) / prices[prices.length - 1]) * 100;
  if (predictedChange > 10) score += 20;
  else if (predictedChange > 5) score += 12;
  else if (predictedChange > 0) score += 5;
  else if (predictedChange < -10) score -= 20;
  else if (predictedChange < -5) score -= 12;
  
  // Factor 3: Confianza del modelo (peso 15%)
  const confidence = prediction7d.confidence || 0;
  score += confidence * 15;
  
  // Factor 4: Backtesting performance (peso 20%)
  const backReturn = parseFloat(backtestReport.performance.totalReturn);
  if (backReturn > 20) score += 15;
  else if (backReturn > 10) score += 10;
  else if (backReturn > 0) score += 5;
  else if (backReturn < -20) score -= 15;
  else if (backReturn < -10) score -= 10;
  
  // Factor 5: Sharpe Ratio (peso 10%)
  const sharpe = parseFloat(backtestReport.risk.sharpeRatio);
  if (sharpe > 2) score += 10;
  else if (sharpe > 1) score += 5;
  else if (sharpe < 0) score -= 10;
  
  // Factor 6: Precisión de validación cruzada (peso 10%)
  const mape = cvResults.mape;
  if (mape < 5) score += 10;
  else if (mape < 10) score += 5;
  else if (mape > 20) score -= 10;
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Generar recomendación basada en score y señal
 */
function getRecommendation(score, signal) {
  if (score >= 75 && signal.signal.includes('BUY')) {
    return {
      action: 'COMPRA FUERTE',
      emoji: '🚀',
      description: 'Excelente oportunidad de compra con alta confianza'
    };
  } else if (score >= 60 && signal.signal.includes('BUY')) {
    return {
      action: 'COMPRAR',
      emoji: '📈',
      description: 'Buena oportunidad de compra'
    };
  } else if (score <= 25 && signal.signal.includes('SELL')) {
    return {
      action: 'VENTA FUERTE',
      emoji: '⚠️',
      description: 'Se recomienda vender con alta urgencia'
    };
  } else if (score <= 40 && signal.signal.includes('SELL')) {
    return {
      action: 'VENDER',
      emoji: '📉',
      description: 'Se recomienda vender'
    };
  } else {
    return {
      action: 'MANTENER',
      emoji: '⏸️',
      description: 'Mantener posición y observar'
    };
  }
}

/**
 * Análisis batch de múltiples criptos
 */
export async function analyzeBatch(symbols, maxConcurrent = 5) {
  const results = [];
  
  // Procesar en lotes para no sobrecargar la API
  for (let i = 0; i < symbols.length; i += maxConcurrent) {
    const batch = symbols.slice(i, i + maxConcurrent);
    const batchResults = await Promise.all(
      batch.map(symbol => analyzeCompleteCrypto(symbol))
    );
    results.push(...batchResults.filter(r => r !== null));
    
    // Esperar un poco entre lotes para respetar rate limits
    if (i + maxConcurrent < symbols.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}
