import { analyzeTopCryptos, getMarketStats } from '../../lib/analysis';

export default function handler(req, res) {
  try {
    // Importar datos de data_crypto.js
    const dataCrypto = require('../../src/data_crypto.js');
    
    if (!dataCrypto || !dataCrypto.cryptos) {
      return res.status(500).json({ 
        error: 'Crypto data not available',
        message: 'data_crypto.js no cargó correctamente'
      });
    }
    
    const cryptos = Object.values(dataCrypto.cryptos);
    const analysis = analyzeTopCryptos(dataCrypto);
    const stats = getMarketStats(cryptos);
    
    res.status(200).json({
      success: true,
      timestamp: dataCrypto.timestamp,
      analysis,
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
