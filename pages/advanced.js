import { useState, useEffect } from 'react';
import AlertPanel from '../components/AlertPanel';
import ExportPanel from '../components/ExportPanel';
import { getAllCryptos } from '../lib/cryptoData';
import {
  calculateWilliamsR,
  calculateCCI,
  calculateMFI,
  calculateKeltnerChannels,
  calculateDonchianChannels,
  calculateADLine,
  calculateCalmarRatio,
  calculateSortinoRatio,
  calculateUlcerIndex,
} from '../lib/advancedIndicators2';

export default function AdvancedPage() {
  const [cryptos, setCryptos] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [indicators, setIndicators] = useState(null);
  const [activeTab, setActiveTab] = useState('indicators');

  useEffect(() => {
    const allCryptos = getAllCryptos();
    setCryptos(allCryptos);
    if (allCryptos.length > 0) {
      setSelectedCrypto(allCryptos[0]);
    }
  }, []);

  const generateIndicators = (crypto) => {
    // Datos simulados para demostración
    const prices = Array.from({ length: 100 }, () => crypto.price * (0.9 + Math.random() * 0.2));
    const highs = prices.map(p => p * 1.02);
    const lows = prices.map(p => p * 0.98);
    const volumes = Array.from({ length: 100 }, () => crypto.volume * (0.8 + Math.random() * 0.4));

    const williamsR = calculateWilliamsR(highs, lows, prices, 14);
    const cci = calculateCCI(highs, lows, prices, 20);
    const mfi = calculateMFI(highs, lows, prices, volumes, 14);
    const keltner = calculateKeltnerChannels(highs, lows, prices, 20, 2);
    const donchian = calculateDonchianChannels(highs, lows, 20);
    const adLine = calculateADLine(highs, lows, prices, volumes);
    const calmar = calculateCalmarRatio(
      prices.slice(1).map((p, i) => (p - prices[i]) / prices[i]),
      0.05
    );
    const sortino = calculateSortinoRatio(
      prices.slice(1).map((p, i) => (p - prices[i]) / prices[i])
    );
    const ulcer = calculateUlcerIndex(prices);

    setIndicators({
      williamsR: williamsR[williamsR.length - 1] || 0,
      cci: cci[cci.length - 1] || 0,
      mfi: mfi[mfi.length - 1] || 0,
      keltner: {
        upper: keltner.upper[keltner.upper.length - 1] || 0,
        middle: keltner.middle[keltner.middle.length - 1] || 0,
        lower: keltner.lower[keltner.lower.length - 1] || 0,
      },
      donchian: {
        upper: donchian.upper[donchian.upper.length - 1] || 0,
        lower: donchian.lower[donchian.lower.length - 1] || 0,
      },
      adLine: adLine[adLine.length - 1] || 0,
      calmar,
      sortino,
      ulcer,
    });
  };

  useEffect(() => {
    if (selectedCrypto) {
      generateIndicators(selectedCrypto);
    }
  }, [selectedCrypto]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur sticky top-0 z-20 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent mb-2">
            ANÁLISIS AVANZADO
          </h1>
          <p className="text-gray-400">Indicadores técnicos avanzados y alertas</p>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Selector de Cripto */}
        <div className="mb-8">
          <label className="block text-gray-400 mb-3">Selecciona una criptomoneda:</label>
          <select
            value={selectedCrypto?.symbol || ''}
            onChange={(e) => setSelectedCrypto(cryptos.find(c => c.symbol === e.target.value))}
            className="w-full md:w-96 bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-blue-500 outline-none"
          >
            {cryptos.map(c => (
              <option key={c.symbol} value={c.symbol}>
                {c.symbol} - {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-800 flex-wrap">
          {['indicators', 'alerts', 'export'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold transition-all border-b-2 ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'indicators' && '📊 Indicadores Avanzados'}
              {tab === 'alerts' && '🔔 Alertas'}
              {tab === 'export' && '📥 Exportar'}
            </button>
          ))}
        </div>

        {/* Contenido por Tab */}
        {activeTab === 'indicators' && selectedCrypto && indicators && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">{selectedCrypto.symbol}</h2>
              <p className="text-gray-400 mb-4">${selectedCrypto.price.toFixed(6)} - {selectedCrypto.change24h.toFixed(2)}%</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Williams %R</p>
                  <p className="text-2xl font-bold text-blue-400">{indicators.williamsR.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-2">Rango: -100 a 0</p>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">CCI (Commodity Channel)</p>
                  <p className="text-2xl font-bold text-cyan-400">{indicators.cci.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-2">Sobreventa: < -100</p>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">MFI (Money Flow)</p>
                  <p className="text-2xl font-bold text-purple-400">{indicators.mfi.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-2">Rango: 0 a 100</p>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Keltner Upper</p>
                  <p className="text-2xl font-bold text-green-400">${indicators.keltner.upper.toFixed(6)}</p>
                  <p className="text-xs text-gray-500 mt-2">Resistencia dinámico</p>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Keltner Lower</p>
                  <p className="text-2xl font-bold text-red-400">${indicators.keltner.lower.toFixed(6)}</p>
                  <p className="text-xs text-gray-500 mt-2">Soporte dinámico</p>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Donchian Range</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    ${(indicators.donchian.upper - indicators.donchian.lower).toFixed(6)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Alto - Bajo</p>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Calmar Ratio</p>
                  <p className="text-2xl font-bold text-blue-400">{indicators.calmar.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-2">Retorno/Drawdown</p>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Sortino Ratio</p>
                  <p className="text-2xl font-bold text-cyan-400">{indicators.sortino.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-2">Riesgo-Ajustado</p>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Ulcer Index</p>
                  <p className="text-2xl font-bold text-orange-400">{indicators.ulcer.toFixed(4)}</p>
                  <p className="text-xs text-gray-500 mt-2">Volatilidad de riesgo</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                💡 <strong>Tip:</strong> Usa estos indicadores avanzados para confirmar señales de trading.
                CCI > 100 = Sobreventa, MFI > 80 = Sobrecomprado
              </p>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <AlertPanel />
        )}

        {activeTab === 'export' && (
          <ExportPanel cryptos={cryptos} selectedCrypto={selectedCrypto} analysis={indicators} />
        )}
      </main>
    </div>
  );
}
