// ANÁLISIS FUNDAMENTAL

/**
 * Fear & Greed Index simulado (0-100)
 * En producción se obtendría de: https://api.alternative.me/fng/
 */
export function calculateFearGreedIndex(marketData) {
  // Factores que afectan el índice
  const { volatility, momentum, volume, sentiment } = marketData;
  
  let index = 50; // Neutral
  
  // Volatilidad (25%)
  if (volatility < 2) index += 12;
  else if (volatility < 5) index += 6;
  else if (volatility > 10) index -= 12;
  else if (volatility > 7) index -= 6;
  
  // Momentum (25%)
  if (momentum > 5) index += 12;
  else if (momentum > 0) index += 6;
  else if (momentum < -5) index -= 12;
  else if (momentum < 0) index -= 6;
  
  // Volumen (25%)
  if (volume > 1.5) index += 12;
  else if (volume > 1.2) index += 6;
  else if (volume < 0.8) index -= 6;
  
  // Sentiment (25%)
  index += sentiment * 12;
  
  index = Math.max(0, Math.min(100, index));
  
  return {
    value: Math.round(index),
    classification: getFearGreedClassification(index),
  };
}

function getFearGreedClassification(index) {
  if (index >= 75) return { label: 'Extreme Greed', emoji: '🤑', color: 'green' };
  if (index >= 55) return { label: 'Greed', emoji: '😊', color: 'lightgreen' };
  if (index >= 45) return { label: 'Neutral', emoji: '😐', color: 'yellow' };
  if (index >= 25) return { label: 'Fear', emoji: '😰', color: 'orange' };
  return { label: 'Extreme Fear', emoji: '😱', color: 'red' };
}

/**
 * Market Cap Analysis
 */
export function analyzeMarketCap(crypto, totalMarketCap = 3000000000000) {
  // Simular market cap basado en precio y volumen
  const estimatedSupply = crypto.volume / crypto.price * 1000;
  const marketCap = crypto.price * estimatedSupply;
  const dominance = (marketCap / totalMarketCap) * 100;
  
  let category;
  if (marketCap > 10e9) category = 'Large Cap';
  else if (marketCap > 1e9) category = 'Mid Cap';
  else if (marketCap > 100e6) category = 'Small Cap';
  else category = 'Micro Cap';
  
  return {
    marketCap,
    marketCapFormatted: formatLargeNumber(marketCap),
    dominance: dominance.toFixed(4),
    category,
    estimatedSupply,
  };
}

/**
 * Social Sentiment Analysis (simulado)
 * En producción usaría APIs como LunarCrush, Santiment, etc.
 */
export function analyzeSocialSentiment(crypto) {
  // Simular basado en cambio de precio y volumen
  const priceImpact = crypto.change24h / 10; // -1 a 1
  const volumeImpact = crypto.volume > 1e9 ? 0.3 : -0.3;
  
  const sentimentScore = Math.max(-1, Math.min(1, priceImpact + volumeImpact));
  
  return {
    score: sentimentScore,
    percentage: ((sentimentScore + 1) / 2 * 100).toFixed(0),
    classification: getSentimentClassification(sentimentScore),
    trending: Math.abs(crypto.change24h) > 10,
  };
}

function getSentimentClassification(score) {
  if (score > 0.6) return { label: 'Very Positive', emoji: '🚀', color: 'green' };
  if (score > 0.2) return { label: 'Positive', emoji: '📈', color: 'lightgreen' };
  if (score > -0.2) return { label: 'Neutral', emoji: '➡️', color: 'gray' };
  if (score > -0.6) return { label: 'Negative', emoji: '📉', color: 'orange' };
  return { label: 'Very Negative', emoji: '⚠️', color: 'red' };
}

/**
 * Developer Activity (simulado)
 * En producción obtendría datos de GitHub API
 */
export function analyzeDeveloperActivity(crypto) {
  // Simular basado en el tipo de crypto
  const isStable = crypto.symbol.includes('USD');
  const isMajor = ['BTC', 'ETH', 'BNB'].some(s => crypto.symbol.includes(s));
  
  let score = 50;
  
  if (isMajor) score = 85 + Math.random() * 10;
  else if (isStable) score = 30 + Math.random() * 20;
  else score = 40 + Math.random() * 40;
  
  return {
    score: Math.round(score),
    commits: Math.round(score * 10),
    contributors: Math.round(score / 5),
    classification: score > 70 ? 'Very Active' : score > 50 ? 'Active' : score > 30 ? 'Moderate' : 'Low',
  };
}

/**
 * On-Chain Metrics (simulado)
 */
export function analyzeOnChainMetrics(crypto, historicalData) {
  const { volumes } = historicalData;
  
  // Active Addresses (estimado del volumen)
  const activeAddresses = Math.round(crypto.volume / crypto.price / 100);
  
  // Transaction Count
  const txCount = Math.round(crypto.volume / crypto.price * 10);
  
  // Hash Rate Growth (solo para PoW)
  const isPoW = crypto.symbol.includes('BTC') || crypto.symbol.includes('LTC');
  const hashRateGrowth = isPoW ? (Math.random() * 10 - 2).toFixed(2) : null;
  
  // Whale Activity (grandes transacciones)
  const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
  const whaleActivity = crypto.volume > avgVolume * 1.5 ? 'High' : 'Normal';
  
  return {
    activeAddresses: formatLargeNumber(activeAddresses),
    txCount: formatLargeNumber(txCount),
    hashRateGrowth,
    whaleActivity,
  };
}

/**
 * Análisis Fundamental Completo
 */
export function comprehensiveFundamentalAnalysis(crypto, historicalData, marketContext) {
  // Calcular métricas necesarias
  const returns = [];
  for (let i = 1; i < historicalData.closes.length; i++) {
    returns.push((historicalData.closes[i] - historicalData.closes[i-1]) / historicalData.closes[i-1]);
  }
  
  const volatility = Math.sqrt(
    returns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / returns.length
  ) * 100;
  
  const momentum = crypto.change24h;
  const volumeRatio = crypto.volume / (historicalData.volumes.reduce((a, b) => a + b) / historicalData.volumes.length);
  
  const fearGreed = calculateFearGreedIndex({
    volatility,
    momentum,
    volume: volumeRatio,
    sentiment: momentum > 0 ? 0.5 : -0.5,
  });
  
  const marketCap = analyzeMarketCap(crypto, marketContext?.totalMarketCap);
  const sentiment = analyzeSocialSentiment(crypto);
  const devActivity = analyzeDeveloperActivity(crypto);
  const onChain = analyzeOnChainMetrics(crypto, historicalData);
  
  // Score fundamental (0-100)
  const fundamentalScore = calculateFundamentalScore({
    fearGreed: fearGreed.value,
    marketCapCategory: marketCap.category,
    sentiment: sentiment.score,
    devActivity: devActivity.score,
  });
  
  return {
    fearGreed,
    marketCap,
    sentiment,
    devActivity,
    onChain,
    fundamentalScore,
    recommendation: getFundamentalRecommendation(fundamentalScore),
  };
}

function calculateFundamentalScore(data) {
  let score = 0;
  
  // Fear & Greed (30%)
  score += (data.fearGreed / 100) * 30;
  
  // Market Cap (20%)
  const capScores = { 'Large Cap': 25, 'Mid Cap': 20, 'Small Cap': 15, 'Micro Cap': 10 };
  score += capScores[data.marketCapCategory] || 10;
  
  // Sentiment (30%)
  score += ((data.sentiment + 1) / 2) * 30;
  
  // Dev Activity (20%)
  score += (data.devActivity / 100) * 20;
  
  return Math.round(score);
}

function getFundamentalRecommendation(score) {
  if (score >= 75) {
    return {
      rating: 'STRONG BUY',
      emoji: '🌟',
      description: 'Fundamentales excelentes'
    };
  } else if (score >= 60) {
    return {
      rating: 'BUY',
      emoji: '✅',
      description: 'Buenos fundamentales'
    };
  } else if (score >= 40) {
    return {
      rating: 'HOLD',
      emoji: '⏸️',
      description: 'Fundamentales neutros'
    };
  } else {
    return {
      rating: 'AVOID',
      emoji: '⚠️',
      description: 'Fundamentales débiles'
    };
  }
}

function formatLargeNumber(num) {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
}
