// Configuración global de la aplicación

export const APP_CONFIG = {
  name: 'CRYPTOCA16',
  version: '1.0.0',
  description: 'Advanced Cryptocurrency Analysis System',
  
  // API
  binanceApi: process.env.NEXT_PUBLIC_BINANCE_API || 'https://api.binance.com/api/v3',
  updateInterval: parseInt(process.env.NEXT_PUBLIC_UPDATE_INTERVAL || '360000'), // 6 horas
  
  // Colores
  colors: {
    primary: '#10B981',    // Verde
    secondary: '#3B82F6',  // Azul
    danger: '#EF4444',     // Rojo
    warning: '#F59E0B',    // Naranja
  },
  
  // Límites
  limits: {
    topCryptos: 50,
    volatileCryptos: 20,
    stableCryptos: 20,
    topGainers: 5,
    topLosers: 5,
  },
  
  // URLs
  urls: {
    github: 'https://github.com/luisagolazar1/cryptoca16',
    twitter: 'https://twitter.com',
    telegram: 'https://telegram.org',
  }
};

// Categorías de criptomonedas
export const CRYPTO_CATEGORIES = {
  TOP_50: 'top50',
  VOLATILITY: 'volatility',
  STABLES: 'stables'
};

// Estados del mercado
export const MARKET_STATES = {
  BULLISH: 'bullish',
  BEARISH: 'bearish',
  NEUTRAL: 'neutral'
};
