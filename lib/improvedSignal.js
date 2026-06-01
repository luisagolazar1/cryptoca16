/**
 * lib/improvedSignal.js
 * Señal mejorada con múltiples criterios + score numérico
 */

export function calculateSignal(crypto) {
  const {
    change24h = 0,
    volume24h = 0,
    price = 0,
    highPrice = 0,
    lowPrice = 0,
  } = crypto;

  // Validación 1: Liquidez mínima
  if (volume24h < 1_000_000) {
    return { signal: 'LOW_LIQUIDITY', score: 0, confidence: 0, reasons: ['Volume < $1M'] };
  }

  // Validación 2: Volatilidad extrema
  if (price > 0) {
    const volatility = ((highPrice - lowPrice) / price) * 100;
    if (volatility > 40) {
      return { signal: 'HIGH_VOLATILITY', score: 0, confidence: 0, reasons: [`Volatility ${volatility.toFixed(1)}%`] };
    }
  }

  // Score compuesto
  const changeScore = normalizeScore(change24h, -20, 20);
  const volumeScore = normalizeScore(volume24h, 1_000_000, 100_00
