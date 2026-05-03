import { useState, useEffect, useCallback } from 'react';

const mockCryptos = [
  { symbol: 'BTCUSDT', price: 67500, change24h: 2.5, volume: 45000000000 },
  { symbol: 'ETHUSDT', price: 3500, change24h: 1.8, volume: 30000000000 },
  { symbol: 'BNBUSDT', price: 650, change24h: 3.2, volume: 2500000000 },
  { symbol: 'XRPUSDT', price: 2.8, change24h: -1.5, volume: 1800000000 },
  { symbol: 'ADAUSDT', price: 1.2, change24h: 0.8, volume: 900000000 },
  { symbol: 'SOLUSDT', price: 185, change24h: 4.2, volume: 1200000000 },
  { symbol: 'DOGEUSDT', price: 0.45, change24h: 5.5, volume: 800000000 },
  { symbol: 'DOTUSDT', price: 8.5, change24h: 2.1, volume: 600000000 },
  { symbol: 'DYDXUSDT', price: 6.2, change24h: -2.3, volume: 400000000 },
  { symbol: 'AVAXUSDT', price: 35, change24h: 1.5, volume: 500000000 },
];

export function useCryptoData() {
  const [cryptos, setCryptos] = useState(mockCryptos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      setCryptos(mockCryptos);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const getTopGainers = useCallback((limit = 5) => {
    return [...cryptos].sort((a, b) => b.change24h - a.change24h).slice(0, limit);
  }, [cryptos]);

  const getTopLosers = useCallback((limit = 5) => {
    return [...cryptos].sort((a, b) => a.change24h - b.change24h).slice(0, limit);
  }, [cryptos]);

  const searchCrypto = useCallback((query) => {
    return cryptos.filter(c => 
      c.symbol.toUpperCase().includes(query.toUpperCase())
    );
  }, [cryptos]);

  const getStats = useCallback(() => {
    return {
      avgPrice: (cryptos.reduce((a, b) => a + b.price, 0) / cryptos.length).toFixed(2),
      avgChange: (cryptos.reduce((a, b) => a + b.change24h, 0) / cryptos.length).toFixed(2),
      totalVolume: cryptos.reduce((a, b) => a + b.volume, 0),
      bullish: cryptos.filter(c => c.change24h > 0).length,
      bearish: cryptos.filter(c => c.change24h < 0).length,
    };
  }, [cryptos]);

  return {
    cryptos,
    loading,
    error,
    refetch: fetchData,
    getTopGainers,
    getTopLosers,
    searchCrypto,
    getStats,
  };
}
