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
  const all = [
    ...CRYPTO_DATABASE.stables,
    ...CRYPTO_DATABASE.highVolatility,
    ...CRYPTO_DATABASE.lowMediumVolatility,
    ...CRYPTO_DATABASE_2,
  ];
  // Eliminar duplicados por symbol
  const seen = new Set();
  return all.filter(c => {
    if (seen.has(c.symbol)) return false;
    seen.add(c.symbol);
    return true;
  });
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

// ============================================================
// 50 CRIPTOS ADICIONALES
// ============================================================
export const CRYPTO_DATABASE_2 = [
  // Layer 1 / Ecosistemas
  { symbol: 'TRXUSDT',    name: 'Tron',             price: 0.12,    change24h: 1.8,   volume: 1200000000 },
  { symbol: 'TONUSDT',    name: 'Toncoin',           price: 6.8,     change24h: 3.2,   volume: 900000000  },
  { symbol: 'XLMUSDT',    name: 'Stellar',           price: 0.13,    change24h: 2.1,   volume: 600000000  },
  { symbol: 'EOSUSDT',    name: 'EOS',               price: 0.85,    change24h: -1.5,  volume: 300000000  },
  { symbol: 'XTZUSDT',    name: 'Tezos',             price: 0.95,    change24h: 1.2,   volume: 200000000  },
  { symbol: 'FLOWUSDT',   name: 'Flow',              price: 0.72,    change24h: 2.8,   volume: 150000000  },
  { symbol: 'EGLDUSDT',   name: 'MultiversX',        price: 38.5,    change24h: 4.1,   volume: 180000000  },
  { symbol: 'ONEUSDT',    name: 'Harmony',           price: 0.018,   change24h: 1.5,   volume: 80000000   },
  { symbol: 'ZILUSDT',    name: 'Zilliqa',           price: 0.022,   change24h: 2.3,   volume: 90000000   },
  { symbol: 'KASUSDT',    name: 'Kaspa',             price: 0.145,   change24h: 5.2,   volume: 350000000  },

  // DeFi
  { symbol: 'AAVEUSDT',   name: 'Aave',              price: 185,     change24h: 3.5,   volume: 400000000  },
  { symbol: 'MKRUSDT',    name: 'Maker',             price: 1850,    change24h: 2.1,   volume: 150000000  },
  { symbol: 'CRVUSDT',    name: 'Curve',             price: 0.42,    change24h: -2.8,  volume: 200000000  },
  { symbol: 'SNXUSDT',    name: 'Synthetix',         price: 2.8,     change24h: 1.9,   volume: 120000000  },
  { symbol: 'COMPUSDT',   name: 'Compound',          price: 65,      change24h: 2.4,   volume: 100000000  },
  { symbol: 'BALUSDT',    name: 'Balancer',          price: 3.2,     change24h: 1.7,   volume: 80000000   },
  { symbol: '1INCHUSDT',  name: '1inch',             price: 0.38,    change24h: -1.2,  volume: 90000000   },
  { symbol: 'SUSHIUSDT',  name: 'SushiSwap',         price: 1.45,    change24h: 2.9,   volume: 110000000  },
  { symbol: 'DYDXUSDT',   name: 'dYdX',              price: 1.85,    change24h: 3.8,   volume: 160000000  },
  { symbol: 'GMXUSDT',    name: 'GMX',               price: 22,      change24h: 2.5,   volume: 95000000   },

  // Gaming / Metaverso / NFT
  { symbol: 'AXSUSDT',    name: 'Axie Infinity',     price: 6.5,     change24h: 4.2,   volume: 250000000  },
  { symbol: 'SANDUSDT',   name: 'The Sandbox',       price: 0.38,    change24h: 3.1,   volume: 300000000  },
  { symbol: 'MANAUSDT',   name: 'Decentraland',      price: 0.35,    change24h: 2.8,   volume: 280000000  },
  { symbol: 'GALAUSDT',   name: 'Gala',              price: 0.025,   change24h: 5.5,   volume: 220000000  },
  { symbol: 'IMXUSDT',    name: 'Immutable',         price: 1.65,    change24h: 4.8,   volume: 190000000  },
  { symbol: 'ILVUSDT',    name: 'Illuvium',          price: 55,      change24h: 3.2,   volume: 85000000   },
  { symbol: 'YGGUSDT',    name: 'Yield Guild',       price: 0.28,    change24h: 2.1,   volume: 60000000   },

  // Layer 2 / Infraestructura
  { symbol: 'STRKUSDT',   name: 'Starknet',          price: 0.48,    change24h: 6.2,   volume: 280000000  },
  { symbol: 'ZKUSDT',     name: 'zkSync',            price: 0.12,    change24h: 4.5,   volume: 220000000  },
  { symbol: 'LRCUSDT',    name: 'Loopring',          price: 0.22,    change24h: 1.8,   volume: 95000000   },
  { symbol: 'CELOUSDT',   name: 'Celo',              price: 0.58,    change24h: 2.4,   volume: 70000000   },
  { symbol: 'METISUSDT',  name: 'Metis',             price: 38,      change24h: 3.7,   volume: 65000000   },

  // IA / Data / Oracle
  { symbol: 'TAOUSDT',    name: 'Bittensor',         price: 285,     change24h: 5.8,   volume: 180000000  },
  { symbol: 'AGIXUSDT',   name: 'SingularityNET',    price: 0.72,    change24h: 4.2,   volume: 160000000  },
  { symbol: 'OCEANUSDT',  name: 'Ocean Protocol',    price: 0.82,    change24h: 3.5,   volume: 140000000  },
  { symbol: 'BANDUSDT',   name: 'Band Protocol',     price: 1.45,    change24h: 2.1,   volume: 75000000   },
  { symbol: 'APIUSDT',    name: 'API3',              price: 1.85,    change24h: 3.8,   volume: 80000000   },

  // Exchange Tokens
  { symbol: 'OKBUSDT',    name: 'OKB',               price: 48,      change24h: 2.2,   volume: 120000000  },
  { symbol: 'HTUSDT',     name: 'Huobi Token',       price: 2.8,     change24h: 1.5,   volume: 85000000   },
  { symbol: 'KCSUSDT',    name: 'KuCoin Token',      price: 8.5,     change24h: 1.8,   volume: 75000000   },
  { symbol: 'CAKEUSDT',   name: 'PancakeSwap',       price: 2.45,    change24h: 2.9,   volume: 200000000  },

  // Privacidad
  { symbol: 'XMRUSDT',    name: 'Monero',            price: 165,     change24h: 1.2,   volume: 200000000  },
  { symbol: 'ZECUSDT',    name: 'Zcash',             price: 28,      change24h: 1.8,   volume: 90000000   },
  { symbol: 'DASHUSDT',   name: 'Dash',              price: 28,      change24h: 1.5,   volume: 80000000   },
  { symbol: 'SCRTUSDT',   name: 'Secret Network',    price: 0.48,    change24h: 2.2,   volume: 45000000   },

  // RWA / Nuevos
  { symbol: 'ONDOUSDT',   name: 'Ondo Finance',      price: 1.05,    change24h: 4.5,   volume: 180000000  },
  { symbol: 'CFGUSDT',    name: 'Centrifuge',        price: 0.52,    change24h: 3.1,   volume: 55000000   },
  { symbol: 'ACHUSDT',    name: 'Axelar',            price: 0.85,    change24h: 2.8,   volume: 95000000   },
  { symbol: 'JUPUSDT',    name: 'Jupiter',           price: 1.25,    change24h: 5.2,   volume: 350000000  },
];
