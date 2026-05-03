import { useEffect, useState } from 'react';
import CryptoCard from '../components/CryptoCard';

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

export default function Dashboard() {
  const [filter, setFilter] = useState('all');

  const stats = {
    avgPrice: (mockCryptos.reduce((a, b) => a + b.price, 0) / mockCryptos.length).toFixed(2),
    avgChange: (mockCryptos.reduce((a, b) => a + b.change24h, 0) / mockCryptos.length).toFixed(2),
    totalVolume: mockCryptos.reduce((a, b) => a + b.volume, 0),
    gainers: [...mockCryptos].sort((a, b) => b.change24h - a.change24h).slice(0, 5),
    losers: [...mockCryptos].sort((a, b) => a.change24h - b.change24h).slice(0, 5)
  };

  let displayCryptos = mockCryptos;
  if (filter === 'gainers') displayCryptos = stats.gainers;
  else if (filter === 'losers') displayCryptos = stats.losers;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
              CRYPTOCA16
            </h1>
            <p className="text-gray-400">Advanced Cryptocurrency Analysis System</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <p className="text-xs text-gray-400 mb-1">Avg Price</p>
              <p className="text-xl font-bold text-green-400">${stats.avgPrice}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <p className="text-xs text-gray-400 mb-1">Avg Change (24h)</p>
              <p className={`text-xl font-bold ${stats.avgChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.avgChange >= 0 ? '+' : ''}{stats.avgChange}%
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <p className="text-xs text-gray-400 mb-1">Total Volume</p>
              <p className="text-xl font-bold text-blue-400">${(stats.totalVolume / 1e9).toFixed(2)}B</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <p className="text-xs text-gray-400 mb-1">Coins Analyzed</p>
              <p className="text-xl font-bold text-purple-400">{mockCryptos.length}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Filtros */}
      <div className="border-b border-gray-800 bg-black/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['all', 'gainers', 'losers'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  filter === f
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {f === 'all' ? '📊 Todas' : 
                 f === 'gainers' ? '🚀 Ganadores' :
                 f === 'losers' ? '📉 Perdedores' : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6">
          {filter === 'all' ? 'Todas las Criptos' : 
           filter === 'gainers' ? 'Ganadores 🚀' : 'Perdedores 📉'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayCryptos.map(crypto => (
            <CryptoCard key={crypto.symbol} crypto={crypto} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/50 mt-12 py-6 text-center text-gray-500 text-sm">
        <p>CRYPTOCA16 © 2026 | Dashboard en vivo</p>
      </footer>
    </div>
  );
}
