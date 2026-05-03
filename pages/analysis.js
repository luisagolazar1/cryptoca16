import { useState, useEffect } from 'react';
import { rankInvestments, simulateInvestment, generateHistoricalData } from '../lib/prediction';
import { generateSignal } from '../lib/technicalAnalysis';
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

export default function AnalysisPage() {
  const [ranked, setRanked] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [investAmount, setInvestAmount] = useState(1000);
  const [timeframe, setTimeframe] = useState(7);

  useEffect(() => {
    const rankedData = rankInvestments(mockCryptos);
    setRanked(rankedData);
    setSelectedCrypto(rankedData[0]);
  }, []);

  const getSignalColor = (signal) => {
    if (signal.includes('BUY')) return 'text-green-400 bg-green-500/20';
    if (signal.includes('SELL')) return 'text-red-400 bg-red-500/20';
    return 'text-yellow-400 bg-yellow-500/20';
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
            🤖 AI Analysis & Predictions
          </h1>
          <p className="text-gray-400">Análisis técnico avanzado con predicciones ML</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Top Rankings */}
        <section>
          <h2 className="text-2xl font-bold mb-6">🏆 Top Investment Opportunities</h2>
          <div className="grid grid-cols-1 gap-4">
            {ranked.slice(0, 5).map((crypto, index) => (
              <div 
                key={crypto.symbol}
                onClick={() => setSelectedCrypto(crypto)}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700 hover:border-green-500 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-gray-600">#{index + 1}</span>
                    <div>
                      <h3 className="text-xl font-bold">{crypto.symbol}</h3>
                      <p className="text-sm text-gray-400">${crypto.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-4 py-2 rounded-lg font-bold ${getSignalColor(crypto.recommendation)}`}>
                      {crypto.recommendation}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Score</p>
                    <p className={`text-2xl font-bold ${getScoreColor(crypto.score)}`}>
                      {crypto.score.toFixed(0)}/100
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ROI 7d</p>
                    <p className={`text-lg font-bold ${crypto.simulation7d.roi > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {crypto.simulation7d.roi > 0 ? '+' : ''}{crypto.simulation7d.roi.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Risk</p>
                    <p className="text-lg font-bold text-orange-400">{crypto.simulation7d.riskLevel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Win Rate</p>
                    <p className="text-lg font-bold text-blue-400">
                      {crypto.simulation7d.successProbability.toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Simulador */}
        {selectedCrypto && (
          <section className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6">💰 Investment Simulator - {selectedCrypto.symbol}</h2>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Investment Amount (USD)</label>
                <input
                  type="number"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(parseFloat(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Timeframe</label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value={1}>1 Day</option>
                  <option value={7}>7 Days</option>
                  <option value={30}>30 Days</option>
                  <option value={90}>90 Days</option>
                </select>
              </div>
            </div>

            {(() => {
              const sim = simulateInvestment(selectedCrypto, investAmount, timeframe);
              return (
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-1">Initial</p>
                    <p className="text-xl font-bold text-white">${sim.initialAmount.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-1">Final</p>
                    <p className="text-xl font-bold text-green-400">${sim.finalAmount.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-1">Profit</p>
                    <p className={`text-xl font-bold ${sim.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {sim.profit > 0 ? '+' : ''}${sim.profit.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-1">ROI</p>
                    <p className={`text-xl font-bold ${sim.roi > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {sim.roi > 0 ? '+' : ''}{sim.roi.toFixed(2)}%
                    </p>
                  </div>
                </div>
              );
            })()}
          </section>
        )}
      </main>
    </div>
  );
}
