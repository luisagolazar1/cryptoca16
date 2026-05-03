const fs = require('fs');
const https = require('https');

const CRYPTOS = {
  top50: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'SOLUSDT', 'DOGEUSDT', 'DOTUSDT', 'DYDXUSDT', 'AVAXUSDT', 'LINKUSDT', 'MATICUSDT', 'UNIUSDT', 'ATOMUSDT', 'LTCUSDT', 'VETUSDT', 'FILUSDT', 'AXSUSDT', 'CHZUSDT', 'EGLDUSDT', 'THETAUSDT', 'SANDUSDT', 'MANAUSDT', 'ZECUSDT', 'XMRUSDT', 'ENJUSDT', 'FLOWUSDT', 'ICXUSDT', 'KSMUSDT', 'SCRTUSDT', 'ALPHAUSDT', 'AUDIOUSDT', 'COTIUSDT', 'GHSTUSDT', 'IMXUSDT', 'LRCUSDT', 'MASKUSDT', 'MTLUSDT', 'OMGUSDT', 'PERLUSDT', 'RNDRUSDT', 'SKLUSDT', 'SNXUSDT', 'STMXUSDT', 'STORJUSDT', 'SUSHIUSDT', 'SXPUSDT', 'TOMOUSDT', 'TRBUSDT', 'TRUUSDT'],
  stables: ['USDCUSDT', 'DAIUSDT', 'TUSDUSDT', 'BUSDUSDT', 'FDUSDUSDT', 'PAXUSDT', 'USDPUSDT', 'CUSDUSDT', 'USDDUSDT', 'ORSUSDT', 'OUSUSDT', 'PYUSUSDT', 'AEUSDT', 'GTUSDT', 'WBETHUSDT', 'RETHUSDT', 'LSETHUSDT', 'STETHUSDT', 'XMUSDT', 'STONUSDT'],
  volatility: ['SHIBUSDT', 'PEPEUSDT', 'DOGSUSDT', 'FLOKIUSDT', 'BONKUSDT', 'WIFUSDT', 'SUIUSDT', 'APTUSDT', 'ARBITRUSDT', 'OPUSDT', 'MAGICUSDT', 'GFTUSDT', 'ONTUSDT', 'RNDR', 'JUPUSDT', 'PHBUSDT', 'AMUSDT', 'ZKUSDT', 'ORDIUSDT', 'VEROUSDT']
};

function fetchPrice(symbol) {
  return new Promise((resolve, reject) => {
    https.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({
            symbol,
            price: parseFloat(json.lastPrice),
            change24h: parseFloat(json.priceChangePercent),
            volume: parseFloat(json.quoteAssetVolume)
          });
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  const allCryptos = [...CRYPTOS.top50, ...CRYPTOS.stables, ...CRYPTOS.volatility];
  const data = { timestamp: new Date().toISOString(), cryptos: {} };
  
  console.log(`Fetching ${allCryptos.length} cryptos...`);
  
  for (const symbol of allCryptos) {
    try {
      const crypto = await fetchPrice(symbol);
      data.cryptos[symbol] = crypto;
      console.log(`✓ ${symbol}`);
    } catch (e) {
      console.error(`✗ ${symbol}: ${e.message}`);
    }
  }
  
  fs.writeFileSync('src/data_crypto.js', `module.exports = ${JSON.stringify(data, null, 2)};`);
  console.log('✅ data_crypto.js created');
}

main().catch(console.error);
