export function calculateSignal(crypto) {
  const {
    change24h = 0,
    volume24h = 0,
    price = 0,
    highPrice = 0,
    lowPrice = 0,
  } = crypto;

  // Validación 1: Liquidez Muy Baja (<$5M) → HOLD siempre
  if (volume24h < 5_000_000) {
    return { signal: 'HOLD', score: 0.5, confidence: 0, reasons: ['Liquidez muy baja < $5M'] };
  }

  // Validación 2: Liquidez Baja (<$20M) → solo BUY si cambio > 10%
  if (volume24h < 20_000_000 && change24h < 10) {
    return { signal: 'HOLD', score: 0.5, confidence: 0.2, reasons: ['Liquidez baja < $20M'] };
  }

  // Validación 3: Volatilidad extrema
  if (price > 0 && highPrice > 0 && lowPrice > 0) {
    const volatility = ((highPrice - lowPrice) / price) * 100;
    if (volatility > 40) {
      return { signal: 'HOLD', score: 0.5, confidence: 0, reasons: [`Volatilidad extrema ${volatility.toFixed(1)}%`] };
    }
  }

  // Score compuesto
  const changeScore = normalizeScore(change24h, -20, 20);
  const volumeScore = normalizeScore(volume24h, 5_000_000, 500_000_000);

  let trendScore = 0.5;
  if (price > 0 && lowPrice > 0 && highPrice > lowPrice) {
    const range = highPrice - lowPrice;
    trendScore = (price - lowPrice) / range;
  }

  const totalScore = (changeScore * 0.60) + (volumeScore * 0.30) + (trendScore * 0.10);

  let signal = 'HOLD';
  let confidence = 0.5;
  const reasons = [];

  if (totalScore > 0.70) {
    signal = 'BUY';
    confidence = Math.min(0.95, totalScore);
    reasons.push(`Score ${(totalScore * 100).toFixed(0)}% | Cambio: +${change24h.toFixed(2)}% | Vol: $${(volume24h/1_000_000).toFixed(0)}M`);
  } else if (totalScore < 0.30) {
    signal = 'SELL';
    confidence = Math.min(0.95, 1 - totalScore);
    reasons.push(`Score ${(totalScore * 100).toFixed(0)}% | Cambio: ${change24h.toFixed(2)}% | Vol: $${(volume24h/1_000_000).toFixed(0)}M`);
  } else {
    reasons.push(`Score neutro ${(totalScore * 100).toFixed(0)}%`);
  }

  return {
    signal,
    score: parseFloat(totalScore.toFixed(3)),
    confidence: parseFloat(confidence.toFixed(2)),
    reasons,
    components: {
      change: parseFloat(changeScore.toFixed(2)),
      volume: parseFloat(volumeScore.toFixed(2)),
      trend: parseFloat(trendScore.toFixed(2)),
    },
  };
}

function normalizeScore(value, min, max) {
  if (value <= min) return 0;
  if (value >= max) return 1;
  return (value - min) / (max - min);
}

export function calculateSignalsBatch(cryptos) {
  return cryptos.map(crypto => ({
    ...crypto,
    analysis: calculateSignal(crypto),
  }));
}

export function filterByConfidence(cryptos, minConfidence = 0.65, signal = null) {
  return cryptos.filter(c => {
    const analysis = c.analysis || calculateSignal(c);
    if (analysis.confidence < minConfidence) return false;
    if (signal && analysis.signal !== signal) return false;
    return true;
  });
}

export function generateAlerts(cryptos) {
  const alerts = [];
  cryptos.forEach(crypto => {
    const analysis = crypto.analysis || calculateSignal(crypto);
    if (analysis.signal === 'BUY' && analysis.confidence > 0.80) {
      alerts.push({ type: 'strong_buy', symbol: crypto.symbol, price: crypto.price, confidence: analysis.confidence });
    }
    if (analysis.signal === 'SELL' && analysis.confidence > 0.80) {
      alerts.push({ type: 'strong_sell', symbol: crypto.symbol, price: crypto.price, confidence: analysis.confidence });
    }
    if (crypto.highPrice && crypto.lowPrice && crypto.price) {
      const vol = ((crypto.highPrice - crypto.lowPrice) / crypto.price) * 100;
      if (vol > 35) {
        alerts.push({ type: 'high_volatility', symbol: crypto.symbol, volatility: vol.toFixed(1) });
      }
    }
  });
  return alerts;
}