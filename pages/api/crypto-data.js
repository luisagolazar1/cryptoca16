// API ENDPOINT - Obtener datos reales de Binance

import { getMultipleCryptos, getHistoricalData } from '../../lib/binanceAPI';
import { getAllCryptos } from '../../lib/cryptoData';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const { action, symbol, interval, limit } = req.query;
      
      // Acción: obtener todos los precios
      if (action === 'all') {
        const cryptoList = getAllCryptos();
        const symbols = cryptoList.map(c => c.symbol);
        
        // Obtener datos reales de Binance
        const realData = await getMultipleCryptos(symbols);
        
        // Merge con nombres de la base de datos
        const merged = cryptoList.map(crypto => {
          const binanceData = realData.find(r => r.symbol === crypto.symbol);
          
          if (binanceData) {
            return {
              ...crypto,
              price: binanceData.price,
              change24h: binanceData.change24h,
              volume: binanceData.volume,
              high24h: binanceData.high24h,
              low24h: binanceData.low24h,
              lastUpdate: new Date().toISOString(),
            };
          }
          
          return crypto; // Fallback a datos mock
        });
        
        return res.status(200).json({
          success: true,
          data: merged,
          timestamp: new Date().toISOString(),
        });
      }
      
      // Acción: obtener histórico de un símbolo
      if (action === 'historical' && symbol) {
        const historicalData = await getHistoricalData(
          symbol,
          interval || '1d',
          parseInt(limit) || 90
        );
        
        return res.status(200).json({
          success: true,
          symbol,
          data: historicalData,
          count: historicalData.length,
        });
      }
      
      // Acción por defecto
      return res.status(400).json({
        success: false,
        error: 'Invalid action. Use ?action=all or ?action=historical&symbol=BTCUSDT',
      });
      
    } catch (error) {
      console.error('API Error:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
