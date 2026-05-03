export default function handler(req, res) {
  try {
    // Datos de prueba mientras se genera data_crypto.js
    const mockData = {
      timestamp: new Date().toISOString(),
      cryptos: {
        'BTCUSDT': { symbol: 'BTCUSDT', price: 67500, change24h: 2.5, volume: 45000000000 },
        'ETHUSDT': { symbol: 'ETHUSDT', price: 3500, change24h: 1.8, volume: 30000000000 },
        'BNBUSDT': { symbol: 'BNBUSDT', price: 650, change24h: 3.2, volume: 2500000000 },
        'XRPUSDT': { symbol: 'XRPUSDT', price: 2.8, change24h: -1.5, volume: 1800000000 },
        'ADAUSDT': { symbol: 'ADAUSDT', price: 1.2, change24h: 0.8, volume: 900000000 },
        'SOLUSDT': { symbol: 'SOLUSDT', price: 185, change24h: 4.2, volume: 1200000000 },
        'DOGEUSDT': { symbol: 'DOGEUSDT', price: 0.45, change24h: 5.5, volume: 800000000 },
        'DOTUSDT': { symbol: 'DOTUSDT', price: 8.5, change24h: 2.1, volume: 600000000 },
        'DYDXUSDT': { symbol: 'DYDXUSDT', price: 6.2, change24h: -2.3, volume: 400000000 },
        'AVAXUSDT': { symbol: 'AVAXUSDT', price: 35, change24h: 1.5, volume: 500000000 },
      }
    };

    // Intentar cargar data_crypto.js si existe
    let dataCrypto = mockData;
    try {
      dataCrypto = require('../../src/data_crypto.js');
      if (!dataCrypto.cryptos) {
        dataCrypto = mockData;
      }
    } catch (e) {
      console.log('Using mock data - data_crypto.js not available yet');
    }

    const cryptos = Object.values(dataCrypto.cryptos);
    
    const stats = {
      avgPrice: (cryptos.reduce((a, b) => a + (b.price || 0), 0) / cryptos.length).toFixed(2),
      avgChange: (cryptos.reduce((a, b) => a + (b.change24h || 0), 0) / cryptos.length).toFixed(2),
      totalVolume: cryptos.reduce((a, b) => a + (b.volume || 0), 0).toFixed(0),
      gainers: cryptos.sort((a, b) => (b.change24h || 0) - (a.change24h || 0)).slice(0, 5),
      losers: cryptos.sort((a, b) => (a.change24h || 0) - (b.change24h || 0)).slice(0, 5)
    };

    res.status(200).json({
      success: true,
      timestamp: dataCrypto.timestamp,
      analysis: {
        top50: cryptos.slice(0, 5),
        volatility: cryptos.slice(5, 8),
        stables: cryptos.slice(8, 10)
      },
      stats,
      totalCryptos: cryptos.length
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze data',
      message: error.message
    });
  }
}
