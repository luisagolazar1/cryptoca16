// Formatear números a moneda
export function formatCurrency(value, decimals = 2) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: decimals,
  }).format(value);
}

// Formatear números grandes (K, M, B)
export function formatNumber(value) {
  if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B';
  if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M';
  if (value >= 1e3) return (value / 1e3).toFixed(2) + 'K';
  return value.toFixed(2);
}

// Calcular porcentaje de cambio
export function calculatePercentChange(original, current) {
  return ((current - original) / original) * 100;
}

// Obtener color basado en el cambio
export function getColorByChange(change) {
  if (change > 0) return 'text-green-400';
  if (change < 0) return 'text-red-400';
  return 'text-gray-400';
}

// Obtener emoji basado en el cambio
export function getEmojiByChange(change) {
  if (change > 5) return '🚀';
  if (change > 0) return '📈';
  if (change < -5) return '📉';
  if (change < 0) return '📉';
  return '➡️';
}

// Calcular volatilidad
export function calculateVolatility(prices) {
  if (prices.length < 2) return 0;
  const mean = prices.reduce((a, b) => a + b) / prices.length;
  const variance = prices.reduce((a, b) => a + Math.pow(b - mean, 2)) / prices.length;
  return Math.sqrt(variance);
}

// Detectar tendencia
export function detectTrend(prices) {
  if (prices.length < 3) return 'neutral';
  const recentAvg = (prices[prices.length - 1] + prices[prices.length - 2]) / 2;
  const olderAvg = (prices[0] + prices[1]) / 2;
  if (recentAvg > olderAvg * 1.02) return 'uptrend';
  if (recentAvg < olderAvg * 0.98) return 'downtrend';
  return 'sideways';
}

// Generar timestamp legible
export function formatTime(date) {
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
}
