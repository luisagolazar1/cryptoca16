// API BINANCE EN TIEMPO REAL

const BINANCE_API = 'https://api.binance.com/api/v3';
const BINANCE_WEBSOCKET = 'wss://stream.binance.com:9443/ws';

/**
 * Obtener precio en tiempo real
 */
export async function getRealTimePrice(symbol) {
  try {
    const response = await fetch(`${BINANCE_API}/ticker/price?symbol=${symbol}`);
    if (!response.ok) throw new Error('Error fetching price');
    const data = await response.json();
    return parseFloat(data.price);
  } catch (error) {
    console.error('Error getting real-time price:', error);
    return null;
  }
}

/**
 * Obtener múltiples precios en tiempo real
 */
export async function getRealTimePrices(symbols) {
  try {
    const promises = symbols.map(s => getRealTimePrice(s));
    const prices = await Promise.all(promises);
    return symbols.reduce((acc, symbol, i) => ({
      ...acc,
      [symbol]: prices[i]
    }), {});
  } catch (error) {
    console.error('Error getting multiple prices:', error);
    return {};
  }
}

/**
 * Obtener estadísticas de 24h
 */
export async function get24hrStats(symbol) {
  try {
    const response = await fetch(`${BINANCE_API}/ticker/24hr?symbol=${symbol}`);
    if (!response.ok) throw new Error('Error fetching 24hr stats');
    const data = await response.json();
    return {
      symbol: data.symbol,
      price: parseFloat(data.lastPrice),
      change24h: parseFloat(data.priceChangePercent),
      volume: parseFloat(data.volume) * parseFloat(data.lastPrice),
      high24h: parseFloat(data.highPrice),
      low24h: parseFloat(data.lowPrice),
      bid: parseFloat(data.bidPrice),
      ask: parseFloat(data.askPrice),
    };
  } catch (error) {
    console.error('Error getting 24hr stats:', error);
    return null;
  }
}

/**
 * Obtener datos históricos con más precision
 */
export async function getHistoricalDataReal(symbol, interval = '1d', limit = 500) {
  try {
    const response = await fetch(
      `${BINANCE_API}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );
    
    if (!response.ok) throw new Error('Error fetching historical data');
    
    const data = await response.json();
    
    return {
      symbol,
      interval,
      candles: data.map(kline => ({
        timestamp: kline[0],
        open: parseFloat(kline[1]),
        high: parseFloat(kline[2]),
        low: parseFloat(kline[3]),
        close: parseFloat(kline[4]),
        volume: parseFloat(kline[7]),
        quoteVolume: parseFloat(kline[8]),
      })),
    };
  } catch (error) {
    console.error('Error getting historical data:', error);
    return null;
  }
}

/**
 * Obtener orden book
 */
export async function getOrderBook(symbol, limit = 20) {
  try {
    const response = await fetch(
      `${BINANCE_API}/depth?symbol=${symbol}&limit=${limit}`
    );
    
    if (!response.ok) throw new Error('Error fetching order book');
    
    const data = await response.json();
    
    return {
      symbol,
      bids: data.bids.map(bid => ({ price: parseFloat(bid[0]), quantity: parseFloat(bid[1]) })),
      asks: data.asks.map(ask => ({ price: parseFloat(ask[0]), quantity: parseFloat(ask[1]) })),
      lastUpdateId: data.lastUpdateId,
    };
  } catch (error) {
    console.error('Error getting order book:', error);
    return null;
  }
}

/**
 * WebSocket para actualizaciones en tiempo real
 */
export class BinanceWebSocket {
  constructor() {
    this.ws = null;
    this.listeners = {};
    this.isConnected = false;
  }

  /**
   * Conectar a WebSocket
   */
  connect(symbols) {
    try {
      const streams = symbols
        .map(s => `${s.toLowerCase()}@miniTicker`)
        .join('/');
      
      const wsUrl = `${BINANCE_WEBSOCKET}/${streams}`;
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnected = false;
      };
      
      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
      };
      
      return true;
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      return false;
    }
  }

  /**
   * Manejar mensajes del WebSocket
   */
  handleMessage(data) {
    const symbol = data.s;
    const price = parseFloat(data.c);
    const change = parseFloat(data.P);
    
    if (this.listeners[symbol]) {
      this.listeners[symbol].forEach(callback => {
        callback({
          symbol,
          price,
          change,
          time: new Date(data.E),
        });
      });
    }
  }

  /**
   * Escuchar cambios de símbolo
   */
  on(symbol, callback) {
    if (!this.listeners[symbol]) {
      this.listeners[symbol] = [];
    }
    this.listeners[symbol].push(callback);
  }

  /**
   * Desconectar
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

/**
 * Instancia global del WebSocket
 */
export const binanceWS = new BinanceWebSocket();

/**
 * Función helper para obtener todos los datos de una cripto
 */
export async function getCompleteCryptoData(symbol) {
  try {
    const [stats, historical, orderBook] = await Promise.all([
      get24hrStats(symbol),
      getHistoricalDataReal(symbol, '1h', 168), // Última semana con intervalos de 1h
      getOrderBook(symbol),
    ]);

    return {
      symbol,
      stats,
      historical,
      orderBook,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting complete crypto data:', error);
    return null;
  }
}
