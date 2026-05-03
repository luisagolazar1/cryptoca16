// MODELOS DE MACHINE LEARNING MEJORADOS

/**
 * Regresión Lineal Mejorada con validación
 */
export function linearRegressionModel(prices) {
  const n = prices.length;
  if (n < 10) return null; // Mínimo 10 puntos
  
  const x = Array.from({ length: n }, (_, i) => i);
  const y = prices;
  
  // Calcular pendiente e intersección
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Calcular R² (coeficiente de determinación)
  const yMean = sumY / n;
  const ssTotal = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
  const ssResidual = y.reduce((sum, yi, i) => {
    const predicted = slope * x[i] + intercept;
    return sum + Math.pow(yi - predicted, 2);
  }, 0);
  const r2 = 1 - (ssResidual / ssTotal);
  
  return { slope, intercept, r2 };
}

/**
 * Predicción con Regresión Lineal
 */
export function predictLinear(prices, daysAhead) {
  const model = linearRegressionModel(prices);
  if (!model) return [];
  
  const predictions = [];
  const n = prices.length;
  
  for (let i = 1; i <= daysAhead; i++) {
    const futureX = n + i;
    const predicted = model.slope * futureX + model.intercept;
    predictions.push(Math.max(0, predicted)); // No negativos
  }
  
  return { predictions, confidence: model.r2 };
}

/**
 * Promedio Móvil Ponderado Exponencial (EMA) Mejorado
 */
export function emaPredictor(prices, period = 12, daysAhead = 7) {
  if (prices.length < period) return [];
  
  const ema = calculateEMASequence(prices, period);
  const recentTrend = ema.slice(-5);
  
  // Calcular tendencia promedio
  const trendSlope = recentTrend.reduce((sum, val, i) => {
    if (i === 0) return 0;
    return sum + (val - recentTrend[i - 1]);
  }, 0) / (recentTrend.length - 1);
  
  // Proyectar basándose en la tendencia
  const predictions = [];
  let lastEMA = ema[ema.length - 1];
  
  for (let i = 0; i < daysAhead; i++) {
    lastEMA += trendSlope;
    predictions.push(Math.max(0, lastEMA));
  }
  
  return predictions;
}

function calculateEMASequence(prices, period) {
  const k = 2 / (period + 1);
  const emaSeq = [prices[0]];
  
  for (let i = 1; i < prices.length; i++) {
    const ema = prices[i] * k + emaSeq[i - 1] * (1 - k);
    emaSeq.push(ema);
  }
  
  return emaSeq;
}

/**
 * Modelo de Momentum con Media Móvil
 */
export function momentumModel(prices, daysAhead = 7) {
  if (prices.length < 20) return [];
  
  // Calcular momentum (tasa de cambio)
  const momentum = [];
  for (let i = 10; i < prices.length; i++) {
    momentum.push((prices[i] - prices[i - 10]) / prices[i - 10]);
  }
  
  // Promedio de momentum reciente
  const avgMomentum = momentum.slice(-5).reduce((a, b) => a + b) / 5;
  
  // Proyectar con momentum
  const predictions = [];
  let currentPrice = prices[prices.length - 1];
  
  for (let i = 0; i < daysAhead; i++) {
    currentPrice *= (1 + avgMomentum);
    predictions.push(Math.max(0, currentPrice));
  }
  
  return predictions;
}

/**
 * Ensemble Model - Combina múltiples predicciones
 */
export function ensemblePredictor(prices, daysAhead = 7) {
  const linear = predictLinear(prices, daysAhead);
  const ema = emaPredictor(prices, 12, daysAhead);
  const momentum = momentumModel(prices, daysAhead);
  
  // Combinar predicciones con pesos
  const weights = {
    linear: 0.4,
    ema: 0.35,
    momentum: 0.25
  };
  
  const ensemble = [];
  for (let i = 0; i < daysAhead; i++) {
    const combined = 
      (linear.predictions[i] || 0) * weights.linear +
      (ema[i] || 0) * weights.ema +
      (momentum[i] || 0) * weights.momentum;
    
    ensemble.push(combined);
  }
  
  return {
    predictions: ensemble,
    confidence: linear.confidence || 0,
    models: {
      linear: linear.predictions,
      ema,
      momentum
    }
  };
}

/**
 * Calcular métricas de error
 */
export function calculateMetrics(actual, predicted) {
  const n = Math.min(actual.length, predicted.length);
  
  // MAE (Mean Absolute Error)
  const mae = actual.slice(0, n).reduce((sum, val, i) => 
    sum + Math.abs(val - predicted[i]), 0
  ) / n;
  
  // RMSE (Root Mean Square Error)
  const mse = actual.slice(0, n).reduce((sum, val, i) => 
    sum + Math.pow(val - predicted[i], 2), 0
  ) / n;
  const rmse = Math.sqrt(mse);
  
  // MAPE (Mean Absolute Percentage Error)
  const mape = actual.slice(0, n).reduce((sum, val, i) => {
    if (val === 0) return sum;
    return sum + Math.abs((val - predicted[i]) / val);
  }, 0) / n * 100;
  
  return { mae, rmse, mape };
}

/**
 * Validación Cruzada (Cross-Validation)
 */
export function crossValidate(prices, folds = 5) {
  const foldSize = Math.floor(prices.length / folds);
  const errors = [];
  
  for (let i = 0; i < folds; i++) {
    const testStart = i * foldSize;
    const testEnd = testStart + foldSize;
    
    // Train data
    const trainData = [
      ...prices.slice(0, testStart),
      ...prices.slice(testEnd)
    ];
    
    // Test data
    const testData = prices.slice(testStart, testEnd);
    
    // Predecir
    const model = linearRegressionModel(trainData);
    if (!model) continue;
    
    const predictions = testData.map((_, idx) => 
      model.slope * (trainData.length + idx) + model.intercept
    );
    
    const metrics = calculateMetrics(testData, predictions);
    errors.push(metrics);
  }
  
  // Promediar errores
  const avgMAE = errors.reduce((sum, e) => sum + e.mae, 0) / errors.length;
  const avgRMSE = errors.reduce((sum, e) => sum + e.rmse, 0) / errors.length;
  const avgMAPE = errors.reduce((sum, e) => sum + e.mape, 0) / errors.length;
  
  return { mae: avgMAE, rmse: avgRMSE, mape: avgMAPE };
}
