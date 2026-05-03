// GESTIÓN DE RIESGO COMPLETA

/**
 * Calcular Stop Loss sugerido basado en ATR
 */
export function calculateStopLoss(currentPrice, atr, riskMultiplier = 2) {
  const stopLoss = currentPrice - (atr * riskMultiplier);
  const stopLossPercent = ((currentPrice - stopLoss) / currentPrice) * 100;
  
  return {
    price: stopLoss,
    percent: stopLossPercent,
    distance: atr * riskMultiplier,
  };
}

/**
 * Calcular Take Profit sugerido
 */
export function calculateTakeProfit(currentPrice, atr, rewardMultiplier = 3) {
  const takeProfit = currentPrice + (atr * rewardMultiplier);
  const takeProfitPercent = ((takeProfit - currentPrice) / currentPrice) * 100;
  
  return {
    price: takeProfit,
    percent: takeProfitPercent,
    distance: atr * rewardMultiplier,
  };
}

/**
 * Risk/Reward Ratio
 */
export function calculateRiskReward(entryPrice, stopLoss, takeProfit) {
  const risk = entryPrice - stopLoss;
  const reward = takeProfit - entryPrice;
  
  if (risk <= 0) return 0;
  
  return reward / risk;
}

/**
 * Position Sizing - Cuánto invertir basado en riesgo
 */
export function calculatePositionSize(accountBalance, riskPercent, entryPrice, stopLoss) {
  // Cuánto estamos dispuestos a arriesgar
  const riskAmount = accountBalance * (riskPercent / 100);
  
  // Diferencia entre entrada y stop loss
  const riskPerUnit = entryPrice - stopLoss;
  
  if (riskPerUnit <= 0) return 0;
  
  // Cantidad de unidades a comprar
  const units = riskAmount / riskPerUnit;
  
  // Inversión total
  const totalInvestment = units * entryPrice;
  
  return {
    units: units,
    investment: totalInvestment,
    riskAmount: riskAmount,
    maxLoss: riskAmount,
    percentOfBalance: (totalInvestment / accountBalance) * 100,
  };
}

/**
 * Kelly Criterion - Tamaño óptimo de posición
 */
export function kellyC riterion(winRate, avgWin, avgLoss) {
  // winRate debe estar entre 0 y 1
  const p = winRate / 100;
  const q = 1 - p;
  
  if (avgLoss === 0) return 0;
  
  const b = avgWin / avgLoss; // Ratio win/loss
  
  // Fórmula de Kelly
  const kelly = (p * b - q) / b;
  
  // Limitar a valores razonables (máx 25% por recomendación)
  return Math.max(0, Math.min(kelly * 100, 25));
}

/**
 * Value at Risk (VaR) - Pérdida máxima esperada
 */
export function calculateVaR(returns, confidenceLevel = 95) {
  if (returns.length === 0) return 0;
  
  // Ordenar retornos de menor a mayor
  const sortedReturns = [...returns].sort((a, b) => a - b);
  
  // Índice para el nivel de confianza
  const index = Math.floor(sortedReturns.length * (1 - confidenceLevel / 100));
  
  // VaR es el retorno en ese percentil (negativo = pérdida)
  return Math.abs(sortedReturns[index] || 0) * 100;
}

/**
 * Diversificación de Portfolio - Correlación
 */
export function calculateCorrelation(returns1, returns2) {
  if (returns1.length !== returns2.length || returns1.length === 0) return 0;
  
  const n = returns1.length;
  
  // Medias
  const mean1 = returns1.reduce((a, b) => a + b) / n;
  const mean2 = returns2.reduce((a, b) => a + b) / n;
  
  // Covarianza y desviaciones
  let covariance = 0;
  let variance1 = 0;
  let variance2 = 0;
  
  for (let i = 0; i < n; i++) {
    const diff1 = returns1[i] - mean1;
    const diff2 = returns2[i] - mean2;
    
    covariance += diff1 * diff2;
    variance1 += diff1 * diff1;
    variance2 += diff2 * diff2;
  }
  
  const stdDev1 = Math.sqrt(variance1 / n);
  const stdDev2 = Math.sqrt(variance2 / n);
  
  if (stdDev1 === 0 || stdDev2 === 0) return 0;
  
  return (covariance / n) / (stdDev1 * stdDev2);
}

/**
 * Sugerencia de diversificación
 */
export function portfolioDiversificationSuggestion(cryptos, maxCorrelation = 0.7) {
  const selected = [];
  
  for (const crypto of cryptos) {
    if (selected.length === 0) {
      selected.push(crypto);
      continue;
    }
    
    // Verificar correlación con criptos ya seleccionados
    let tooCorrelated = false;
    
    for (const selectedCrypto of selected) {
      const corr = calculateCorrelation(
        crypto.returns || [],
        selectedCrypto.returns || []
      );
      
      if (Math.abs(corr) > maxCorrelation) {
        tooCorrelated = true;
        break;
      }
    }
    
    if (!tooCorrelated) {
      selected.push(crypto);
    }
    
    // Límite de 10 criptos para diversificación
    if (selected.length >= 10) break;
  }
  
  return selected;
}

/**
 * Análisis completo de riesgo
 */
export function comprehensiveRiskAnalysis(crypto, accountBalance, historicalData) {
  const { closes, highs, lows, volumes } = historicalData;
  
  // Calcular retornos
  const returns = [];
  for (let i = 1; i < closes.length; i++) {
    returns.push((closes[i] - closes[i-1]) / closes[i-1]);
  }
  
  // ATR para stop loss/take profit
  const atr = calculateATR(highs, lows, closes);
  
  const currentPrice = closes[closes.length - 1];
  const stopLoss = calculateStopLoss(currentPrice, atr);
  const takeProfit = calculateTakeProfit(currentPrice, atr);
  const riskReward = calculateRiskReward(currentPrice, stopLoss.price, takeProfit.price);
  
  // Position sizing (arriesgar 2% del balance)
  const positionSize = calculatePositionSize(
    accountBalance,
    2, // 2% risk
    currentPrice,
    stopLoss.price
  );
  
  // VaR
  const var95 = calculateVaR(returns, 95);
  const var99 = calculateVaR(returns, 99);
  
  // Kelly Criterion (asumiendo 60% win rate y avg win/loss de 1.5)
  const kelly = kellyCriterion(60, 1.5, 1);
  
  return {
    stopLoss,
    takeProfit,
    riskReward: riskReward.toFixed(2),
    positionSize,
    var: {
      var95: var95.toFixed(2),
      var99: var99.toFixed(2),
    },
    kelly: kelly.toFixed(2),
    recommendation: getRiskRecommendation(riskReward, var95),
  };
}

function calculateATR(highs, lows, closes, period = 14) {
  const trueRanges = [];
  for (let i = 1; i < highs.length; i++) {
    const tr = Math.max(
      highs[i] - lows[i],
      Math.abs(highs[i] - closes[i-1]),
      Math.abs(lows[i] - closes[i-1])
    );
    trueRanges.push(tr);
  }
  if (trueRanges.length < period) return closes[closes.length - 1] * 0.02;
  return trueRanges.slice(-period).reduce((a, b) => a + b) / period;
}

function getRiskRecommendation(riskReward, var95) {
  if (riskReward >= 3 && var95 < 5) {
    return {
      level: 'EXCELENTE',
      emoji: '🟢',
      description: 'Excelente relación riesgo/recompensa y bajo VaR'
    };
  } else if (riskReward >= 2 && var95 < 10) {
    return {
      level: 'BUENO',
      emoji: '🟡',
      description: 'Buena relación riesgo/recompensa'
    };
  } else if (riskReward < 1.5 || var95 > 15) {
    return {
      level: 'ALTO RIESGO',
      emoji: '🔴',
      description: 'Riesgo elevado, considerar reducir exposición'
    };
  } else {
    return {
      level: 'MODERADO',
      emoji: '🟠',
      description: 'Riesgo moderado, proceder con cautela'
    };
  }
}
