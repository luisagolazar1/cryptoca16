// SISTEMA DE BACKTESTING

import { ensemblePredictor, calculateMetrics } from './mlModels';
import { generateSignal } from './technicalAnalysis';

/**
 * Backtesting de estrategia de trading
 */
export function backtestStrategy(historicalData, initialCapital = 10000) {
  const { prices, timestamps } = historicalData;
  
  let capital = initialCapital;
  let position = 0; // Cantidad de crypto que tenemos
  let trades = [];
  let equity = [initialCapital];
  
  // Recorrer histórico
  for (let i = 30; i < prices.length - 1; i++) {
    const windowPrices = prices.slice(Math.max(0, i - 30), i);
    const currentPrice = prices[i];
    
    // Generar señal
    const signal = generateSignal(
      { price: currentPrice, change24h: 0, volume: 0 },
      { prices: windowPrices, volumes: [] }
    );
    
    // Ejecutar trade basado en señal
    if (signal.signal.includes('BUY') && capital >= currentPrice) {
      // COMPRAR
      const buyAmount = capital * 0.95; // Usar 95% del capital
      const quantity = buyAmount / currentPrice;
      
      position += quantity;
      capital -= buyAmount;
      
      trades.push({
        type: 'BUY',
        price: currentPrice,
        quantity,
        timestamp: timestamps ? timestamps[i] : i,
        capital: capital + position * currentPrice
      });
      
    } else if (signal.signal.includes('SELL') && position > 0) {
      // VENDER
      const sellAmount = position * currentPrice;
      
      capital += sellAmount;
      position = 0;
      
      trades.push({
        type: 'SELL',
        price: currentPrice,
        quantity: position,
        timestamp: timestamps ? timestamps[i] : i,
        capital
      });
    }
    
    // Registrar equity
    equity.push(capital + position * currentPrice);
  }
  
  // Cerrar posición final si hay
  if (position > 0) {
    const finalPrice = prices[prices.length - 1];
    capital += position * finalPrice;
    position = 0;
  }
  
  const finalCapital = capital;
  const totalReturn = ((finalCapital - initialCapital) / initialCapital) * 100;
  
  return {
    initialCapital,
    finalCapital,
    totalReturn,
    trades: trades.length,
    equity,
    tradeHistory: trades
  };
}

/**
 * Backtesting de predicciones ML
 */
export function backtestPredictions(historicalPrices, predictionDays = 7) {
  const results = [];
  
  // Usar ventana deslizante
  for (let i = 90; i < historicalPrices.length - predictionDays; i++) {
    const trainData = historicalPrices.slice(i - 90, i);
    const actualFuture = historicalPrices.slice(i, i + predictionDays);
    
    // Hacer predicción
    const prediction = ensemblePredictor(trainData, predictionDays);
    
    // Comparar con realidad
    const metrics = calculateMetrics(actualFuture, prediction.predictions);
    
    results.push({
      trainEndIndex: i,
      metrics,
      accuracy: 100 - metrics.mape, // Precisión como porcentaje
    });
  }
  
  // Calcular estadísticas generales
  const avgAccuracy = results.reduce((sum, r) => sum + r.accuracy, 0) / results.length;
  const avgMAE = results.reduce((sum, r) => sum + r.metrics.mae, 0) / results.length;
  const avgRMSE = results.reduce((sum, r) => sum + r.metrics.rmse, 0) / results.length;
  
  return {
    avgAccuracy: avgAccuracy.toFixed(2),
    avgMAE: avgMAE.toFixed(2),
    avgRMSE: avgRMSE.toFixed(2),
    tests: results.length,
    results
  };
}

/**
 * Comparar con estrategia Buy & Hold
 */
export function compareToBuyAndHold(historicalData, strategyResult, initialCapital) {
  const { prices } = historicalData;
  
  // Buy & Hold: comprar al inicio y mantener
  const initialPrice = prices[0];
  const finalPrice = prices[prices.length - 1];
  const quantity = initialCapital / initialPrice;
  const finalValue = quantity * finalPrice;
  const buyHoldReturn = ((finalValue - initialCapital) / initialCapital) * 100;
  
  return {
    strategy: {
      return: strategyResult.totalReturn,
      finalCapital: strategyResult.finalCapital
    },
    buyAndHold: {
      return: buyHoldReturn,
      finalCapital: finalValue
    },
    outperformance: strategyResult.totalReturn - buyHoldReturn
  };
}

/**
 * Calcular métricas de riesgo
 */
export function calculateRiskMetrics(equity) {
  // Retornos diarios
  const returns = [];
  for (let i = 1; i < equity.length; i++) {
    returns.push((equity[i] - equity[i-1]) / equity[i-1]);
  }
  
  // Volatilidad (desviación estándar anualizada)
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const volatility = Math.sqrt(variance * 252) * 100; // Anualizado
  
  // Sharpe Ratio
  const riskFreeRate = 0.02; // 2% anual
  const excessReturn = avgReturn * 252 - riskFreeRate;
  const sharpeRatio = volatility > 0 ? excessReturn / (volatility / 100) : 0;
  
  // Maximum Drawdown
  let maxDrawdown = 0;
  let peak = equity[0];
  
  for (const value of equity) {
    if (value > peak) peak = value;
    const drawdown = ((peak - value) / peak) * 100;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }
  
  // Win Rate
  const positiveReturns = returns.filter(r => r > 0).length;
  const winRate = (positiveReturns / returns.length) * 100;
  
  return {
    volatility: volatility.toFixed(2),
    sharpeRatio: sharpeRatio.toFixed(2),
    maxDrawdown: maxDrawdown.toFixed(2),
    winRate: winRate.toFixed(2)
  };
}

/**
 * Generar reporte completo de backtesting
 */
export function generateBacktestReport(historicalData, initialCapital = 10000) {
  // Ejecutar backtesting de estrategia
  const strategyResult = backtestStrategy(historicalData, initialCapital);
  
  // Comparar con buy & hold
  const comparison = compareToBuyAndHold(historicalData, strategyResult, initialCapital);
  
  // Métricas de riesgo
  const riskMetrics = calculateRiskMetrics(strategyResult.equity);
  
  // Backtesting de predicciones ML
  const mlBacktest = backtestPredictions(historicalData.prices, 7);
  
  return {
    performance: {
      initialCapital,
      finalCapital: strategyResult.finalCapital,
      totalReturn: strategyResult.totalReturn.toFixed(2),
      trades: strategyResult.trades,
    },
    risk: riskMetrics,
    comparison: {
      strategyReturn: strategyResult.totalReturn.toFixed(2),
      buyHoldReturn: comparison.buyAndHold.return.toFixed(2),
      outperformance: comparison.outperformance.toFixed(2),
    },
    mlAccuracy: {
      avgAccuracy: mlBacktest.avgAccuracy,
      avgMAE: mlBacktest.avgMAE,
      avgRMSE: mlBacktest.avgRMSE,
      tests: mlBacktest.tests,
    },
    equity: strategyResult.equity,
    tradeHistory: strategyResult.tradeHistory,
  };
}
