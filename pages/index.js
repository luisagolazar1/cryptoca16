import { useState, useEffect } from 'react';
import CryptoCard from '../components/CryptoCard';
import Chart from '../components/Chart';
import CryptoDetailModal from '../components/CryptoDetailModal';
import { getAllCryptos, updatePrices } from '../lib/cryptoData';
import { generateSignal } from '../lib/technicalAnalysis';
import { generateHistoricalData } from '../lib/prediction';

export default function Dashboard() {
  const [cryptos, setCryptos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [chartData, setChartData] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    loadCryptos();
  }, []);

  const loadCryptos = () => {
    const allCryptos = getAllCryptos();
    setCryptos(allCryptos);
    
    const data = allCryptos.slice(0, 8).map((c) => ({
      name: c.symbol.replace('USDT', ''),
      value: c.price
    }));
    setChartData(data);
    setLastUpdate(new Date());
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      const updated = updatePrices(cryptos);
      setCryptos(updated);
      setLastUpdate(new Date());
      setLoading(false);
    }, 1000);
  };

  // Generar señales para todos
  const cryptosWithSignals = cryptos.map(crypto => {
    const historicalData = generateHistoricalData(crypto, 90);
    const signal = generateSignal(crypto, historicalData);
    return { ...crypto, signal: signal.signal };
  });

  const stats = {
    avgPrice: cryptos.length > 0 ? (cryptos.reduce((a, b) => a + b.price, 0) / cryptos.length).toFixed(2) : '0',
    avgChange: cryptos.length > 0 ? (cryptos.reduce((a, b) => a + b.change24h, 0) / cryptos.length).toFixed(2) : '0',
    totalVolume: cryptos.reduce((a, b) => a + b.volume, 0),
    buySignals: cryptosWithSignals.filter(c => c.signal && c.signal.includes('BUY')).length,
    sellSignals: cryptosWithSignals.filter(c => c.signal && c.signal.includes('SELL')).length,
    holdSignals: cryptosWithSignals.filter(c => c.signal === 'HOLD').length,
  };

  let displayCryptos = cryptosWithSignals;
  if (filter === 'buy') displayCryptos = cryptosWithSignals.filter(c => c.signal && c.signal.includes('BUY'));
  else if (filter === 'sell') displayCryptos = cryptosWithSignals.filter(c => c.signal && c.signal.includes('SELL'));
  else if (filter === 'hold') displayCryptos = cryptosWithSignals.filter(c => c.signal === 'HOLD');

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
                CRYPTOCA16
              </h1>
              <p className="text-gray-400">Sistema Avanzado de Análisis de Criptomonedas</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                loading 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:shadow-lg hover:shadow-green-500/50'
              }`}
            >
              {loading ? '🔄 Actualizando...' : '🔄 Actualizar Precios'}
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 border border-gray-700">
              <p className="text-xs text-gray-400 mb-1">📊 Precio Promedio</p>
              <p className="text-2xl font-bold text-green-400">${stats.avgPrice}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 border border-gray-700">
              <p className="text-xs text-gray-400 mb-1">📈 Cambio Promedio</p>
              <p className={`text-2xl font-bold ${stats.avgChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.avgChange >= 0 ? '+' : ''}{stats.avgChange}%
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-800/30 to-gray-900 rounded-lg p-4 border border-green-700">
              <p className="text-xs text-gray-400 mb-1">🚀 Señales Compra</p>
              <p className="text-2xl font-bold text-green-400">{stats.buySignals}</p>
            </div>
            <div className="bg-gradient-to-br from-red-800/30 to-gray-900 rounded-lg p-4 border border-red-700">
              <p className="text-xs text-gray-400 mb-1">📉 Señales Venta</p>
              <p className="text-2xl font-bold text-red-400">{stats.sellSignals}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-800/30 to-gray-900 rounded-lg p-4 border border-yellow-700">
              <p className="text-xs text-gray-400 mb-1">⏸️ Mantener</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.holdSignals}</p>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Última actualización: {lastUpdate.toLocaleTimeString('es-AR')}
          </p>
        </div>
      </header>

      {/* Chart Section */}
      {chartData.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-6 text-green-400">Vista General de Precios</h2>
            <Chart data={chartData} type="line" />
          </div>
        </section>
      )}

      {/* Filtros */}
      <div className="border-b border-gray-800 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[
              { key: 'all', label: '📊 Todas', count: cryptos.length },
              { key: 'buy', label: '🚀 Comprar', count: stats.buySignals, color: 'green' },
              { key: 'hold', label: '⏸️ Mantener', count: stats.holdSignals, color: 'yellow' },
              { key: 'sell', label: '📉 Vender', count: stats.sellSignals, color: 'red' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-6 py-2 rounded-lg whitespace-nowrap transition-all font-semibold ${
                  filter === f.key
                    ? f.color === 'green' ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/50' :
                      f.color === 'yellow' ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-lg shadow-yellow-500/50' :
                      f.color === 'red' ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/50' :
                      'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-6">
          {filter === 'all' ? '🌍 Todas las Criptomonedas' : 
           filter === 'buy' ? '🚀 Señales de Compra' : 
           filter === 'hold' ? '⏸️ Mantener Posición' :
           '📉 Señales de Venta'}
        </h2>

        {/* Grid de Criptos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayCryptos.map(crypto => (
            <div key={crypto.symbol} onClick={() => setSelectedCrypto(crypto)} className="cursor-pointer">
              <CryptoCard crypto={crypto} signal={crypto.signal} />
            </div>
          ))}
        </div>

        {displayCryptos.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-xl">No hay criptomonedas en esta categoría</p>
          </div>
        )}
      </main>

      {/* Modal de Detalle */}
      {selectedCrypto && (
        <CryptoDetailModal 
          crypto={selectedCrypto} 
          onClose={() => setSelectedCrypto(null)} 
        />
      )}
    </div>
  );
}
