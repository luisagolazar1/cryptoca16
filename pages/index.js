import { useState, useEffect } from 'react';
import CryptoCard from '../components/CryptoCard';
import CryptoDetailModal from '../components/CryptoDetailModal';
import { getAllCryptos, updatePrices } from '../lib/cryptoData';

export default function Dashboard() {
  const [cryptos, setCryptos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    try {
      const allCryptos = getAllCryptos();
      setCryptos(allCryptos);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading cryptos:', error);
    }

    // Detectar scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        const updated = updatePrices(cryptos);
        setCryptos(updated);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error refreshing:', error);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  // Generar señales simples
  const cryptosWithSignals = cryptos.map(crypto => {
    let signal = 'HOLD';
    if (crypto.change24h > 3) signal = 'BUY';
    else if (crypto.change24h < -3) signal = 'SELL';
    
    return { ...crypto, signal };
  });

  const stats = {
    avgPrice: cryptos.length > 0 ? (cryptos.reduce((a, b) => a + b.price, 0) / cryptos.length).toFixed(2) : '0',
    avgChange: cryptos.length > 0 ? (cryptos.reduce((a, b) => a + b.change24h, 0) / cryptos.length).toFixed(2) : '0',
    buySignals: cryptosWithSignals.filter(c => c.signal === 'BUY').length,
    sellSignals: cryptosWithSignals.filter(c => c.signal === 'SELL').length,
    holdSignals: cryptosWithSignals.filter(c => c.signal === 'HOLD').length,
  };

  let displayCryptos = cryptosWithSignals;
  if (filter === 'buy') displayCryptos = cryptosWithSignals.filter(c => c.signal === 'BUY');
  else if (filter === 'sell') displayCryptos = cryptosWithSignals.filter(c => c.signal === 'SELL');
  else if (filter === 'hold') displayCryptos = cryptosWithSignals.filter(c => c.signal === 'HOLD');

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Header - Compacto cuando scrollea */}
      <header className={`border-b border-gray-800 bg-black/50 backdrop-blur sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-8'}`}>
        <div className="max-w-7xl mx-auto px-6">
          {!isScrolled && (
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
                {loading ? '🔄 Actualizando...' : '🔄 Actualizar'}
              </button>
            </div>
          )}

          {/* Stats Grid */}
          <div className={`grid gap-4 transition-all ${isScrolled ? 'grid-cols-2 md:grid-cols-5 text-sm' : 'grid-cols-2 md:grid-cols-5'}`}>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 border border-gray-700">
              <p className={`text-gray-400 mb-1 ${isScrolled ? 'text-xs' : 'text-xs'}`}>📊 Precio</p>
              <p className={`font-bold text-green-400 ${isScrolled ? 'text-lg' : 'text-2xl'}`}>${stats.avgPrice}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 border border-gray-700">
              <p className={`text-gray-400 mb-1 ${isScrolled ? 'text-xs' : 'text-xs'}`}>📈 Cambio</p>
              <p className={`font-bold ${stats.avgChange >= 0 ? 'text-green-400' : 'text-red-400'} ${isScrolled ? 'text-lg' : 'text-2xl'}`}>
                {stats.avgChange >= 0 ? '+' : ''}{stats.avgChange}%
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-800/30 to-gray-900 rounded-lg p-4 border border-green-700">
              <p className={`text-gray-400 mb-1 ${isScrolled ? 'text-xs' : 'text-xs'}`}>🚀 Compra</p>
              <p className={`font-bold text-green-400 ${isScrolled ? 'text-lg' : 'text-2xl'}`}>{stats.buySignals}</p>
            </div>
            <div className="bg-gradient-to-br from-red-800/30 to-gray-900 rounded-lg p-4 border border-red-700">
              <p className={`text-gray-400 mb-1 ${isScrolled ? 'text-xs' : 'text-xs'}`}>📉 Venta</p>
              <p className={`font-bold text-red-400 ${isScrolled ? 'text-lg' : 'text-2xl'}`}>{stats.sellSignals}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-800/30 to-gray-900 rounded-lg p-4 border border-yellow-700">
              <p className={`text-gray-400 mb-1 ${isScrolled ? 'text-xs' : 'text-xs'}`}>⏸️ Hold</p>
              <p className={`font-bold text-yellow-400 ${isScrolled ? 'text-lg' : 'text-2xl'}`}>{stats.holdSignals}</p>
            </div>
          </div>

          {!isScrolled && (
            <p className="text-xs text-gray-500 mt-4">
              Actualizado: {lastUpdate.toLocaleTimeString('es-AR')}
            </p>
          )}
        </div>
      </header>

      {/* Filtros */}
      <div className="border-b border-gray-800 bg-black/50 sticky top-[var(--header-height,120px)] z-30">
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
                    ? f.color === 'green' ? 'bg-gradient-to-r from-green-600 to-green-500 text-white' :
                      f.color === 'yellow' ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white' :
                      f.color === 'red' ? 'bg-gradient-to-r from-red-600 to-red-500 text-white' :
                      'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
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
            <div 
              key={crypto.symbol} 
              onClick={() => setSelectedCrypto(crypto)} 
              className="cursor-pointer"
            >
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
