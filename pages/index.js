import { useState, useEffect } from 'react';
import CryptoCard from '../components/CryptoCard';
import CryptoDetailModal from '../components/CryptoDetailModal';
import { getAllCryptos, updatePrices } from '../lib/cryptoData';

export default function Dashboard() {
  const [cryptos, setCryptos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    try {
      setCryptos(getAllCryptos());
      setLastUpdate(new Date());
    } catch (e) { console.error(e); }

    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        setCryptos(prev => updatePrices(prev));
        setLastUpdate(new Date());
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }, 800);
  };

  const withSignals = cryptos.map(c => ({
    ...c,
    signal: c.change24h > 3 ? 'BUY' : c.change24h < -3 ? 'SELL' : 'HOLD',
  }));

  const stats = {
    avgPrice: cryptos.length ? (cryptos.reduce((a, b) => a + b.price, 0) / cryptos.length).toFixed(2) : '0',
    avgChange: cryptos.length ? (cryptos.reduce((a, b) => a + b.change24h, 0) / cryptos.length).toFixed(2) : '0',
    buy: withSignals.filter(c => c.signal === 'BUY').length,
    sell: withSignals.filter(c => c.signal === 'SELL').length,
    hold: withSignals.filter(c => c.signal === 'HOLD').length,
  };

  const displayed = filter === 'buy' ? withSignals.filter(c => c.signal === 'BUY')
    : filter === 'sell' ? withSignals.filter(c => c.signal === 'SELL')
    : filter === 'hold' ? withSignals.filter(c => c.signal === 'HOLD')
    : withSignals;

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ===== HEADER STICKY COMPRIMIBLE ===== */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-gray-800"
        style={{ transition: 'padding 0.3s', padding: scrolled ? '6px 16px' : '20px 16px 16px' }}>

        {/* EXPANDIDO */}
        {!scrolled && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  CRYPTOCA16
                </h1>
                <p className="text-gray-500 text-xs mt-0.5">Sistema Avanzado de Análisis</p>
              </div>
              <button onClick={handleRefresh} disabled={loading}
                className="px-4 py-2 rounded-xl font-bold text-sm bg-green-600 active:bg-green-700 text-white disabled:opacity-50">
                {loading ? '⏳' : '🔄'} Actualizar
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="bg-gray-900 rounded-xl p-3 border border-gray-800">
                <p className="text-gray-500 text-xs">📊 Precio Prom.</p>
                <p className="text-xl font-bold text-green-400">${stats.avgPrice}</p>
              </div>
              <div className="bg-gray-900 rounded-xl p-3 border border-gray-800">
                <p className="text-gray-500 text-xs">📈 Cambio 24h</p>
                <p className={`text-xl font-bold ${parseFloat(stats.avgChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {parseFloat(stats.avgChange) >= 0 ? '+' : ''}{stats.avgChange}%
                </p>
              </div>
              <div className="bg-green-900/30 rounded-xl p-3 border border-green-900">
                <p className="text-gray-500 text-xs">🚀 Compra</p>
                <p className="text-xl font-bold text-green-400">{stats.buy}</p>
              </div>
              <div className="bg-red-900/20 rounded-xl p-3 border border-red-900/50">
                <p className="text-gray-500 text-xs">📉 Venta</p>
                <p className="text-xl font-bold text-red-400">{stats.sell}</p>
              </div>
            </div>
            <div className="bg-yellow-900/20 rounded-xl p-3 border border-yellow-900/30 flex justify-between items-center">
              <p className="text-gray-500 text-xs">⏸️ Hold</p>
              <p className="text-lg font-bold text-yellow-400">{stats.hold}</p>
            </div>
            {lastUpdate && (
              <p className="text-gray-600 text-xs text-right mt-2">
                Actualizado: {lastUpdate.toLocaleTimeString('es-AR')}
              </p>
            )}
          </div>
        )}

        {/* COMPRIMIDO — solo el 10% de la pantalla */}
        {scrolled && (
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <span className="text-base font-black bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              CRYPTOCA16
            </span>
            <div className="flex gap-3 text-xs font-bold items-center">
              <span className="text-green-400">🚀 {stats.buy}</span>
              <span className="text-red-400">📉 {stats.sell}</span>
              <span className="text-yellow-400">⏸️ {stats.hold}</span>
              <button onClick={handleRefresh} disabled={loading}
                className="px-2 py-1 rounded-lg bg-green-700 text-white disabled:opacity-50">
                {loading ? '⏳' : '🔄'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ===== FILTROS ===== */}
      <div className="bg-black border-b border-gray-800 px-4 py-2 sticky z-40"
        style={{ top: scrolled ? '44px' : '268px' }}>
        <div className="max-w-2xl mx-auto flex gap-2 overflow-x-auto">
          {[
            { key: 'all', label: `📊 Todas (${cryptos.length})`, active: 'bg-blue-600' },
            { key: 'buy', label: `🚀 Comprar (${stats.buy})`, active: 'bg-green-600' },
            { key: 'hold', label: `⏸️ Hold (${stats.hold})`, active: 'bg-yellow-600' },
            { key: 'sell', label: `📉 Vender (${stats.sell})`, active: 'bg-red-600' },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-semibold flex-shrink-0 transition-all ${
                filter === f.key ? `${f.active} text-white` : 'bg-gray-900 text-gray-400'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== LISTA ===== */}
      <main className="max-w-2xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 gap-3">
          {displayed.map(crypto => (
            <div key={crypto.symbol} onClick={() => setSelectedCrypto(crypto)} className="cursor-pointer">
              <CryptoCard crypto={crypto} signal={crypto.signal} />
            </div>
          ))}
        </div>
        {displayed.length === 0 && (
          <div className="text-center py-16 text-gray-500">Sin criptomonedas en esta categoría</div>
        )}
      </main>

      {selectedCrypto && (
        <CryptoDetailModal crypto={selectedCrypto} onClose={() => setSelectedCrypto(null)} />
      )}
    </div>
  );
}
