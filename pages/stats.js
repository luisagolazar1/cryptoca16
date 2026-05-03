import { useState, useEffect } from 'react';
import Chart from '../components/Chart';

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

export default function StatsPage() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const data = mockCryptos.map(c => ({
      name: c.symbol.replace('USDT', ''),
      value: c.change24h
    }));
    setChartData(data);
  }, []);

  const volatility = Math.sqrt(
    mockCryptos.reduce((sum, c) => sum + Math.pow(c.change24h, 2), 0) / mockCryptos.length
  ).toFixed(2);

  const bullishCount = mockCryptos.filter(c => c.change24h > 0).length;
  const bearishCount = mockCryptos.filter(c => c.change24h < 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Market Statistics
          </h1>
          <p className="text-gray-400">Análisis detallado del mercado de criptomonedas</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700">
            <p className="text-sm text-gray-400 mb-2">Market Volatility</p>
            <p className="text-3xl font-bold text-orange-400">{volatility}%</p>
            <p className="text-xs text-gray-500 mt-2">Standard deviation</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700">
            <p className="text-sm text-gray-400 mb-2">Bullish Coins</p>
            <p className="text-3xl font-bold text-green-400">{bullishCount}</p>
            <p className="text-xs text-gray-500 mt-2">{((bullishCount/mockCryptos.length)*100).toFixed(0)}% del mercado</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700">
            <p className="text-sm text-gray-400 mb-2">Bearish Coins</p>
            <p className="text-3xl font-bold text-red-400">{bearishCount}</p>
            <p className="text-xs text-gray-500 mt-2">{((bearishCount/mockCryptos.length)*100).toFixed(0)}% del mercado</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700">
            <p className="text-sm text-gray-400 mb-2">Neutral Coins</p>
            <p className="text-3xl font-bold text-gray-400">{mockCryptos.filter(c => c.change24h === 0).length}</p>
            <p className="text-xs text-gray-500 mt-2">Sin cambios</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-6 text-green-400">24h Change Distribution</h2>
            <Chart data={chartData} type="bar" />
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-6 text-blue-400">Market Sentiment</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Bullish</span>
                  <span className="text-sm font-bold text-green-400">{((bullishCount/mockCryptos.length)*100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{width: `${(bullishCount/mockCryptos.length)*100}%`}}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Bearish</span>
                  <span className="text-sm font-bold text-red-400">{((bearishCount/mockCryptos.length)*100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-red-500 h-3 rounded-full transition-all duration-500"
                    style={{width: `${(bearishCount/mockCryptos.length)*100}%`}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
