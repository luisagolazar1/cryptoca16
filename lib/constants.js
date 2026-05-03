// CONSTANTES DEL SISTEMA DE PREDICCIÓN

export const TIMEFRAMES = {
  DAY_1: { value: 1, label: '1 Day', short: '1D' },
  WEEK_1: { value: 7, label: '7 Days', short: '1W' },
  MONTH_1: { value: 30, label: '30 Days', short: '1M' },
  MONTH_3: { value: 90, label: '90 Days', short: '3M' },
};

export const SIGNALS = {
  STRONG_BUY: 'STRONG BUY',
  BUY: 'BUY',
  HOLD: 'HOLD',
  SELL: 'SELL',
  STRONG_SELL: 'STRONG SELL',
};

export const RISK_LEVELS = {
  VERY_LOW: 'Very Low',
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  VERY_HIGH: 'Very High',
};

export const INDICATORS = {
  RSI: { 
    name: 'RSI', 
    oversold: 30, 
    overbought: 70,
    description: 'Relative Strength Index'
  },
  MACD: {
    name: 'MACD',
    description: 'Moving Average Convergence Divergence'
  },
  BOLLINGER: {
    name: 'Bollinger Bands',
    period: 20,
    stdDev: 2,
    description: 'Bollinger Bands'
  },
  EMA: {
    name: 'EMA',
    periods: [12, 26, 50, 200],
    description: 'Exponential Moving Average'
  }
};

export const SCORE_THRESHOLDS = {
  STRONG_BUY: 70,
  BUY: 60,
  HOLD: 40,
  SELL: 30,
  STRONG_SELL: 0,
};

export const DEFAULT_INVESTMENT = 1000;

export const PREDICTION_CONFIG = {
  historicalDays: 90,
  minDataPoints: 30,
  confidenceThreshold: 70,
  riskFreeRate: 0.02, // 2% anual
};
