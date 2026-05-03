export function analyzeTopCryptos(cryptoData) {
  if (!cryptoData || !cryptoData.cryptos) return null;

  const cryptos = Object.values(cryptoData.cryptos);
  
  return {
    timestamp: cryptoData.timestamp,
    top50: cryptos.slice(0, 50).map(c => ({
      ...c,
      type: 'top'
    })),
    volatility: cryptos.slice(50, 70).map(c => ({
      ...c,
      type: 'volatility'
    })),
    stables: cryptos.slice(70, 90).map(c => ({
      ...c,
      type: 'stable'
    }))
  };
}

export function getTopGainers(cryptos, limit = 10) {
  return [...cryptos]
    .sort((a, b) => b.change24h - a.change24h)
    .slice(0, limit);
}

export function getTopLosers(cryptos, limit = 10) {
  return [...cryptos]
    .sort((a, b) => a.change24h - b.change24h)
    .slice(0, limit);
}

export function getMarketStats(cryptos) {
  const prices = cryptos.map(c => c.price);
  const changes = cryptos.map(c => c.change24h);
  
  return {
    avgPrice: (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2),
    avgChange: (changes.reduce((a, b) => a + b, 0) / changes.length).toFixed(2),
    totalVolume: cryptos.reduce((a, b) => a + b.volume, 0).toFixed(0),
    gainers: getTopGainers(cryptos, 5),
    losers: getTopLosers(cryptos, 5)
  };
}
