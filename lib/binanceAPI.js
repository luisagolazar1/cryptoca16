// CLIENTE API DE BINANCE - DATOS REALES

const BINANCE_API = 'https://api.binance.com/api/v3';

/**
 * Obtener precio actual de una criptomoneda
 */
export async function getCurrentPrice(symbol) {
  try {
    const response = await fetch(`${BINANCE_API}/ticker/price?symbol=${symbol}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return parseFloat(data.price);
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return null;
  }
}

/**
 * Obtener datos de 24h (precio, volumen, cambio)
 */
export async function get24hrStats(symbol) {
  try {
    const response = await fetch(`${BINANCE_API}/ticker/24hr?symbol=${symbol}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    return {
      symbol: data.symbol,
      price: parseFloat(data.lastPrice),
      change24h: parseFloat(data.priceChangePercent),
      volume: parseFloat(data.volume) * parseFloat(data.lastPrice), // Volume in USD
      high24h: parseFloat(data.highPrice),
      low24h: parseFloat(data.lowPrice),
      trades: parseInt(data.count),
    };
  } catch (error) {
    console.error(`Error fetching 24hr stats for ${symbol}:`, error);
    return null;
  }
}

/**
 * Obtener datos históricos (klines/candlesticks)
 */
export async function getHistoricalData(symbol, interval = '1d', limit = 90) {
  try {
    const response = await fetch(
      `${BINANCE_API}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    return data.map(candle => ({
      timestamp: candle[0],
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
      volume: parseFloat(candle[5]),
    }));
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    return [];
  }
}

/**
 * Obtener datos de múltiples criptos en paralelo
 */
export async function getMultipleCryptos(symbols) {
  try {
    const promises = symbols.map(symbol => get24hrStats(symbol));
    const results = await Promise.all(promises);
    return results.filter(r => r !== null);
  } catch (error) {
    console.error('Error fetching multiple cryptos:', error);
    return [];
  }
}

/**
 * Obtener todos los tickers del mercado
 */
export async function getAllTickers() {
  try {
    const response = await fetch(`${BINANCE_API}/ticker/24hr`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    return data
      .filter(ticker => ticker.symbol.endsWith('USDT'))
      .map(ticker => ({
        symbol: ticker.symbol,
        price: parseFloat(ticker.lastPrice),
        change24h: parseFloat(ticker.priceChangePercent),
        volume: parseFloat(ticker.volume) * parseFloat(ticker.lastPrice),
      }))
      .sort((a, b) => b.volume - a.volume);
  } catch (error) {
    console.error('Error fetching all tickers:', error);
    return [];
  }
}

/**
 * Validar si un símbolo existe en Binance
 */
export async function validateSymbol(symbol) {
  try {
    const response = await fetch(`${BINANCE_API}/ticker/price?symbol=${symbol}`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Obtener profundidad del mercado (order book)
 */
export async function getOrderBook(symbol, limit = 10) {
  try {
    const response = await fetch(`${BINANCE_API}/depth?symbol=${symbol}&limit=${limit}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    return {
      bids: data.bids.map(([price, quantity]) => ({
        price: parseFloat(price),
        quantity: parseFloat(quantity),
      })),
      asks: data.asks.map(([price, quantity]) => ({
        price: parseFloat(price),
        quantity: parseFloat(quantity),
      })),
    };
  } catch (error) {
    console.error(`Error fetching order book for ${symbol}:`, error);
    return { bids: [], asks: [] };
  }
}
