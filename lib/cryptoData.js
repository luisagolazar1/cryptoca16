// BASE DE DATOS DE 50 CRIPTOMONEDAS

export const CRYPTO_DATABASE = {
  // 10 USDT (Stablecoins y pares estables)
  stables: [
    { symbol: 'USDCUSDT', name: 'USD Coin', price: 1.00, change24h: 0.01, volume: 5000000000 },
    { symbol: 'DAIUSDT', name: 'Dai', price: 1.00, change24h: -0.02, volume: 3000000000 },
    { symbol: 'TUSDUSDT', name: 'TrueUSD', price: 1.00, change24h: 0.00, volume: 1000000000 },
    { symbol: 'BUSDUSDT', name: 'Binance USD', price: 1.00, change24h: 0.01, volume: 2000000000 },
    { symbol: 'USDPUSDT', name: 'Pax Dollar', price: 1.00, change24h: 0.00, volume: 800000000 },
    { symbol: 'FDUSDUSDT', name: 'First Digital USD', price: 1.00, change24h: 0.01, volume: 600000000 },
    { symbol: 'PAXGUSDT', name: 'PAX Gold', price: 2850, change24h: 0.5, volume: 400000000 },
    { symbol: 'WBTCUSDT', name: 'Wrapped Bitcoin', price: 67500, change24h: 2.5, volume: 1500000000 },
    { symbol: 'WETHUSDT', name: 'Wrapped Ethereum', price: 3500, change24h: 1.8, volume: 1200000000 },
    { symbol: 'LDOUSDT', name: 'Lido DAO', price: 2.2, change24h: 1.2, volume: 500000000 },
  ],

  // 20 Alta Volatilidad
  highVolatility: [
    { symbol: 'SHIBUSDT', name: 'Shiba Inu', price: 0.000025, change24h: 12.5, volume: 2500000000 },
    { symbol: 'PEPEUSDT', name: 'Pepe', price: 0.0000085, change24h: -8.3, volume: 1800000000 },
    { symbol: 'FLOKIUSDT', name: 'Floki', price: 0.00015, change24h: 15.2, volume: 900000000 },
    { symbol: 'BONKUSDT', name: 'Bonk', price: 0.000018, change24h: -6.8, volume: 700000000 },
    { symbol: 'WIFUSDT', name: 'dogwifhat', price: 2.45, change24h: 18.5, volume: 600000000 },
    { symbol: 'DOGSUSDT', name: 'Dogs', price: 0.00055, change24h: -12.3, volume: 500000000 },
    { symbol: 'APTUSDT', name: 'Aptos', price: 12.5, change24h: 9.2, volume: 800000000 },
    { symbol: 'SUIUSDT', name: 'Sui', price: 3.8, change24h: 14.7, volume: 750000000 },
    { symbol: 'ARBUSDT', name: 'Arbitrum', price: 1.85, change24h: -7.5, volume: 850000000 },
    { symbol: 'OPUSDT', name: 'Optimism', price: 2.95, change24h: 11.3, volume: 650000000 },
    { symbol: 'INJUSDT', name: 'Injective', price: 28.5, change24h: -9.8, volume: 550000000 },
    { symbol: 'TIAUSDT', name: 'Celestia', price: 7.2, change24h: 16.4, volume: 450000000 },
    { symbol: 'SEISDT', name: 'Sei', price: 0.58, change24h: -11.2, volume: 400000000 },
    { symbol: 'ORDIUSDT', name: 'Ordinals', price: 45.8, change24h: 13.8, volume: 380000000 },
    { symbol: 'JUPUSDT', name: 'Jupiter', price: 1.25, change24h: -8.9, volume: 350000000 },
    { symbol: 'PYTHUSDT', name: 'Pyth Network', price: 0.45, change24h: 17.2, volume: 320000000 },
    { symbol: 'WLDUSDT', name: 'Worldcoin', price: 3.2, change24h: -10.5, volume: 300000000 },
    { symbol: 'RENDERUSDT', name: 'Render', price: 8.5, change24h: 12.8, volume: 280000000 },
    { symbol: 'GRTUSDT', name: 'The Graph', price: 0.28, change24h: -7.3, volume: 260000000 },
    { symbol: 'FETUSDT', name: 'Fetch.ai', price: 1.85, change24h: 14.9, volume: 240000000 },
  ],

  // 20 Volatilidad Baja/Media
  lowMediumVolatility: [
    { symbol: 'BTCUSDT', name: 'Bitcoin', price: 67500, change24h: 2.5, volume: 45000000000 },
    { symbol: 'ETHUSDT', name: 'Ethereum', price: 3500, change24h: 1.8, volume: 30000000000 },
    { symbol: 'BNBUSDT', name: 'BNB', price: 650, change24h: 3.2, volume: 2500000000 },
    { symbol: 'XRPUSDT', name: 'XRP', price: 2.8, change24h: -1.5, volume: 1800000000 },
    { symbol: 'ADAUSDT', name: 'Cardano', price: 1.2, change24h: 0.8, volume: 900000000 },
    { symbol: 'SOLUSDT', name: 'Solana', price: 185, change24h: 4.2, volume: 1200000000 },
    { symbol: 'DOGEUSDT', name: 'Dogecoin', price: 0.45, change24h: 2.5, volume: 800000000 },
    { symbol: 'DOTUSDT', name: 'Polkadot', price: 8.5, change24h: 2.1, volume: 600000000 },
    { symbol: 'AVAXUSDT', name: 'Avalanche', price: 35, change24h: 1.5, volume: 500000000 },
    { symbol: 'LINKUSDT', name: 'Chainlink', price: 18.5, change24h: 3.8, volume: 750000000 },
    { symbol: 'MATICUSDT', name: 'Polygon', price: 0.95, change24h: 2.2, volume: 650000000 },
    { symbol: 'UNIUSDT', name: 'Uniswap', price: 12.5, change24h: 1.9, volume: 550000000 },
    { symbol: 'ATOMUSDT', name: 'Cosmos', price: 9.8, change24h: 2.7, volume: 450000000 },
    { symbol: 'LTCUSDT', name: 'Litecoin', price: 95, change24h: 1.2, volume: 800000000 },
    { symbol: 'ICPUSDT', name: 'Internet Computer', price: 12.8, change24h: 3.5, volume: 400000000 },
    { symbol: 'VETUSDT', name: 'VeChain', price: 0.045, change24h: 1.8, volume: 350000000 },
    { symbol: 'NEARUSDT', name: 'NEAR Protocol', price: 7.5, change24h: 2.9, volume: 380000000 },
    { symbol: 'FTMUSDT', name: 'Fantom', price: 0.85, change24h: 3.1, volume: 320000000 },
    { symbol: 'ALGOUSDT', name: 'Algorand', price: 0.38, change24h: 1.5, volume: 300000000 },
    { symbol: 'HBARUSDT', name: 'Hedera', price: 0.12, change24h: 2.3, volume: 280000000 },
  ]
};

// Función para obtener todas las criptos
export function getAllCryptos() {
  return [
    ...CRYPTO_DATABASE.stables,
    ...CRYPTO_DATABASE.highVolatility,
    ...CRYPTO_DATABASE.lowMediumVolatility,
  ];
}

// Función para simular actualización de precios
export function updatePrices(cryptos) {
  return cryptos.map(crypto => {
    // Simular cambio de precio realista
    const volatilityFactor = CRYPTO_DATABASE.highVolatility.find(c => c.symbol === crypto.symbol) ? 0.05 :
                            CRYPTO_DATABASE.stables.find(c => c.symbol === crypto.symbol) ? 0.001 : 0.02;
    
    const priceChange = (Math.random() - 0.5) * crypto.price * volatilityFactor;
    const newPrice = crypto.price + priceChange;
    const newChange24h = ((newPrice - crypto.price) / crypto.price) * 100;
    
    return {
      ...crypto,
      price: newPrice,
      change24h: crypto.change24h + newChange24h * 0.1, // Actualización gradual
      volume: crypto.volume * (0.9 + Math.random() * 0.2),
    };
  });
}
