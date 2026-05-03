// ANÁLISIS MULTI-TIMEFRAME

import { getHistoricalData } from './binanceAPI';
import { generateSignal } from './technicalAnalysis';
import { ensemblePredictor } from './mlModels';

/**
 * Timeframes disponibles en Binance
 */
export const Timeframes = {
  '1m': '1 Minuto',
  '5m': '5 Minutos',
  '15m': '15 Minutos',
  '30m': '30 Minutos',
  '1h': '1 Hora',
  '4h': '4 Horas',
  '1d': '1 Día',
  '1w': '1 Semana',
};

/**
 * Obtener datos de múltiples timeframes
 */
export async function getMultiTimeframeData(symbol, timeframes = ['1h', '4h', '1d']) {
  const data = {};
  
  for (const tf of timeframes) {
    try {
      const klines = await getHistoricalData(symbol, tf, 100);
      
      if (klines && klines.length > 0) {
        data[tf] = {
          opens: klines.map(k => k.open),
          highs: klines.map(k => k.high),
          lows: klines.map(k => k.low),
          closes: klines.map(k => k.close),
          volumes: klines.map(k => k.volume),
          timestamps: klines.map(k => k.timestamp),
        };
      }
    } catch (error) {
      console.error(`Error fetching ${tf} data for ${symbol}:`, error);
    }
  }
  
  return data;
}

/**
 * Analizar un timeframe específico
 */
export function analyzeTimeframe(ohlcData, timeframe) {
  const { closes, volumes } = ohlcData;
  
  // Generar señal técnica
  const signal = generateSignal(
    { 
      price: closes[closes.length - 1],
      change24h: 0,
      volume: volumes[volumes.length - 1]
    },
    { prices: closes, volumes }
  );
  
  // Predicción
  const prediction = ensemblePredictor(closes, 7);
  const predictedChange = ((prediction.predictions[6] - closes[closes.length - 1]) / closes[closes.length - 1]) * 100;
  
  // Tendencia
  const sma20 = closes.slice(-20).reduce((a, b) => a + b) / 20;
  const sma50 = closes.slice(-50).reduce((a, b) => a + b) / 50;
  
  let trend = 'NEUTRAL';
  if (closes[closes.length - 1] > sma20 && sma20 > sma50) trend = 'UPTREND';
  else if (closes[closes.length - 1] < sma20 && sma20 < sma50) trend = 'DOWNTREND';
  
  return {
    timeframe,
    signal: signal.signal,
    signalScore: signal.score,
    trend,
    predictedChange: predictedChange.toFixed(2),
    currentPrice: closes[closes.length - 1],
    sma20,
    sma50,
  };
}

/**
 * Análisis multi-timeframe completo
 */
export function comprehensiveMultiTimeframeAnalysis(multiTFData) {
  const analyses = {};
  
  for (const [tf, data] of Object.entries(multiTFData)) {
    analyses[tf] = analyzeTimeframe(data, tf);
  }
  
  return analyses;
}

/**
 * Detectar confluencias entre timeframes
 */
export function detectConfluences(analyses) {
  const timeframes = Object.keys(analyses);
  const confluences = [];
  
  // Confluencia de señales
  const buySignals = timeframes.filter(tf => 
    analyses[tf].signal && analyses[tf].signal.includes('BUY')
  );
  
  const sellSignals = timeframes.filter(tf => 
    analyses[tf].signal && analyses[tf].signal.includes('SELL')
  );
  
  if (buySignals.length >= 2) {
    confluences.push({
      type: 'BUY_CONFLUENCE',
      strength: buySignals.length,
      timeframes: buySignals,
      description: `Señal de COMPRA en ${buySignals.length} timeframes: ${buySignals.join(', ')}`,
      emoji: '🟢'
    });
  }
  
  if (sellSignals.length >= 2) {
    confluences.push({
      type: 'SELL_CONFLUENCE',
      strength: sellSignals.length,
      timeframes: sellSignals,
      description: `Señal de VENTA en ${sellSignals.length} timeframes: ${sellSignals.join(', ')}`,
      emoji: '🔴'
    });
  }
  
  // Confluencia de tendencias
  const uptrends = timeframes.filter(tf => analyses[tf].trend === 'UPTREND');
  const downtrends = timeframes.filter(tf => analyses[tf].trend === 'DOWNTREND');
  
  if (uptrends.length >= 2) {
    confluences.push({
      type: 'UPTREND_CONFLUENCE',
      strength: uptrends.length,
      timeframes: uptrends,
      description: `Tendencia ALCISTA en ${uptrends.length} timeframes`,
      emoji: '📈'
    });
  }
  
  if (downtrends.length >= 2) {
    confluences.push({
      type: 'DOWNTREND_CONFLUENCE',
      strength: downtrends.length,
      timeframes: downtrends,
      description: `Tendencia BAJISTA en ${downtrends.length} timeframes`,
      emoji: '📉'
    });
  }
  
  return confluences;
}

/**
 * Recomendación basada en multi-timeframe
 */
export function getMultiTimeframeRecommendation(analyses, confluences) {
  let score = 50; // Base neutral
  
  // Puntuar confluencias
  for (const conf of confluences) {
    if (conf.type.includes('BUY') || conf.type === 'UPTREND_CONFLUENCE') {
      score += conf.strength * 10;
    } else if (conf.type.includes('SELL') || conf.type === 'DOWNTREND_CONFLUENCE') {
      score -= conf.strength * 10;
    }
  }
  
  // Puntuar timeframes individuales
  const timeframeWeights = {
    '1m': 5,
    '5m': 7,
    '15m': 10,
    '30m': 12,
    '1h': 15,
    '4h': 20,
    '1d': 25,
    '1w': 30,
  };
  
  for (const [tf, analysis] of Object.entries(analyses)) {
    const weight = timeframeWeights[tf] || 10;
    
    if (analysis.signal && analysis.signal.includes('BUY')) {
      score += weight * 0.5;
    } else if (analysis.signal && analysis.signal.includes('SELL')) {
      score -= weight * 0.5;
    }
  }
  
  score = Math.max(0, Math.min(100, score));
  
  // Generar recomendación
  let action, emoji, description;
  
  if (score >= 75) {
    action = 'COMPRA FUERTE';
    emoji = '🚀';
    description = 'Múltiples timeframes confirman señal de compra';
  } else if (score >= 60) {
    action = 'COMPRAR';
    emoji = '📈';
    description = 'Señal de compra con confirmación multi-timeframe';
  } else if (score <= 25) {
    action = 'VENTA FUERTE';
    emoji = '⚠️';
    description = 'Múltiples timeframes confirman señal de venta';
  } else if (score <= 40) {
    action = 'VENDER';
    emoji = '📉';
    description = 'Señal de venta con confirmación multi-timeframe';
  } else {
    action = 'MANTENER';
    emoji = '⏸️';
    description = 'Señales mixtas en diferentes timeframes';
  }
  
  return {
    action,
    emoji,
    description,
    score: score.toFixed(0),
    confluenceCount: confluences.length,
  };
}

/**
 * Resumen completo multi-timeframe
 */
export function generateMultiTimeframeSummary(symbol, multiTFData) {
  const analyses = comprehensiveMultiTimeframeAnalysis(multiTFData);
  const confluences = detectConfluences(analyses);
  const recommendation = getMultiTimeframeRecommendation(analyses, confluences);
  
  return {
    symbol,
    analyses,
    confluences,
    recommendation,
    timestamp: new Date().toISOString(),
  };
}
