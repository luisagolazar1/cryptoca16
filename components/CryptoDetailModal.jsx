import { generateSignal } from '../lib/technicalAnalysis';
import { simulateInvestment, generateHistoricalData, calculateInvestmentScore } from '../lib/prediction';
import Chart from './Chart';

export default function CryptoDetailModal({ crypto, onClose }) {
  if (!crypto) return null;

  const historicalData = generateHistoricalData(crypto, 90);
  const signal = generateSignal(crypto, historicalData);
  const score = calculateInvestmentScore(crypto, historicalData);
  const sim1d = simulateInvestment(crypto, 1000, 1);
  const sim7d = simulateInvestment(crypto, 1000, 7);
  const sim30d = simulateInvestment(crypto, 1000, 30);

  const getSignalColor = (sig) => {
    if (sig.includes('BUY')) return 'bg-green-500';
    if (sig.includes('SELL')) return 'bg-red-500';
    return 'bg-yellow-500';
  };

  const chartData = historicalData.prices.slice(-30).map((price, i) => ({
    name: `D${i + 1}`,
    value: price
  }));

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur border-b border-gray-700 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">{crypto.name}</h2>
            <p className="text-gray-400">{crypto.symbol}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Precio y Señal */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Precio Actual</p>
              <p className="text-4xl font-bold text-white">${crypto.price.toFixed(6)}</p>
              <p className={`text-lg mt-2 ${crypto.change24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {crypto.change24h > 0 ? '▲' : '▼'} {Math.abs(crypto.change24h).toFixed(2)}% (24h)
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Señal de Trading</p>
              <div className={`${getSignalColor(signal.signal)} text-white font-bold text-2xl py-3 px-4 rounded-lg text-center mb-2`}>
                {signal.signal === 'STRONG BUY' ? '🚀 COMPRA FUERTE' :
                 signal.signal === 'BUY' ? '📈 COMPRA' :
                 signal.signal === 'HOLD' ? '⏸️ MANTENER' :
                 signal.signal === 'SELL' ? '📉 VENTA' :
                 '⚠️ VENTA FUERTE'}
              </div>
              <p className="text-sm text-gray-400">Confianza: {signal.strength}</p>
            </div>
          </div>

          {/* Score */}
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Puntuación de Inversión</h3>
              <span className={`text-3xl font-bold ${
                score >= 70 ? 'text-green-400' :
                score >= 60 ? 'text-blue-400' :
                score >= 40 ? 'text-yellow-400' : 'text-red-400'
              }`}>{score.toFixed(0)}/100</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div 
                className={`h-4 rounded-full transition-all ${
                  score >= 70 ? 'bg-green-500' :
                  score >= 60 ? 'bg-blue-500' :
                  score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{width: `${score}%`}}
              />
            </div>
          </div>

          {/* Indicadores Técnicos */}
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Indicadores Técnicos</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">RSI</p>
                <p className={`text-2xl font-bold ${
                  signal.indicators.rsi < 30 ? 'text-green-400' :
                  signal.indicators.rsi > 70 ? 'text-red-400' : 'text-gray-300'
                }`}>
                  {signal.indicators.rsi.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {signal.indicators.rsi < 30 ? 'Sobreventa (Oportunidad)' :
                   signal.indicators.rsi > 70 ? 'Sobrecompra (Riesgo)' : 'Neutral'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">MACD</p>
                <p className={`text-2xl font-bold ${signal.indicators.macd.histogram > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {signal.indicators.macd.macd.toFixed(4)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {signal.indicators.macd.histogram > 0 ? 'Tendencia Alcista' : 'Tendencia Bajista'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Bollinger</p>
                <p className="text-2xl font-bold text-blue-400">
                  ${signal.indicators.bollinger.middle.toFixed(6)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Banda Media</p>
              </div>
            </div>
          </div>

          {/* Gráfico */}
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Histórico de Precios (30 días)</h3>
            <Chart data={chartData} type="line" />
          </div>

          {/* Simulaciones */}
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Simulación de Inversión ($1,000 USD)</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: '1 Día', data: sim1d },
                { label: '7 Días', data: sim7d },
                { label: '30 Días', data: sim30d },
              ].map(({ label, data }) => (
                <div key={label} className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">{label}</p>
                  <p className="text-xl font-bold text-white mb-1">${data.finalAmount.toFixed(2)}</p>
                  <p className={`text-sm font-semibold ${data.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {data.profit > 0 ? '+' : ''}${data.profit.toFixed(2)} ({data.roi.toFixed(2)}%)
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Riesgo: {data.riskLevel}</p>
                  <p className="text-xs text-gray-500">Éxito: {data.successProbability.toFixed(0)}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Razones */}
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Razones del Análisis</h3>
            <ul className="space-y-2">
              {signal.reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300">
                  <span className="text-green-400 mt-1">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
