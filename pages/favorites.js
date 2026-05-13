import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CryptoDetailModal from '../components/CryptoDetailModal';
import { getAllCryptos, updatePrices } from '../lib/cryptoData';
import { getFavorites, toggleFavorite } from '../lib/favorites';
import { getLiquidityLabel, fmtVol } from '../lib/liquidity';

export default function FavoritesPage() {
  const router = useRouter();
  const [allCryptos, setAllCryptos] = useState([]);
  const [favorites, setFavorites]   = useState([]);
  const [volumes, setVolumes]       = useState({});
  const [selected, setSelected]     = useState(null);
  const [loading, setLoading]       = useState(false);

  useEffect(() => {
    try { setAllCryptos(getAllCryptos()); } catch(e) {}
    setFavorites(getFavorites());
    loadVolumes();
  }, []);

  async function loadVolumes() {
    try {
      const res = await fetch('https://api.binance.com/api/v3/ticker/24hr');
      const all = await res.json();
      const map = {};
      all.forEach(t => { map[t.symbol] = parseFloat(t.quoteVolume); });
      setVolumes(map);
    } catch(e) {}
  }

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      try { setAllCryptos(prev => updatePrices(prev)); } catch(e) {}
      setLoading(false);
      loadVolumes();
    }, 800);
  };

  const handleRemoveFav = (e, symbol) => {
    e.stopPropagation();
    toggleFavorite(symbol);
    setFavorites(getFavorites());
  };

  const favCryptos = allCryptos
    .filter(c => favorites.includes(c.symbol))
    .map(c => {
      const sym = c.symbol.includes('USDT') ? c.symbol : c.symbol + 'USDT';
      const vol = volumes[sym] || volumes[c.symbol] || 0;
      return {
        ...c,
        signal: c.change24h > 3 ? 'BUY' : c.change24h < -3 ? 'SELL' : 'HOLD',
        volume24h: vol,
        liquidity: getLiquidityLabel(vol),
      };
    });

  const totalValue = favCryptos.reduce((a, c) => a + c.price, 0);
  const avgChange  = favCryptos.length
    ? (favCryptos.reduce((a,c) => a + c.change24h, 0) / favCryptos.length).toFixed(2)
    : '0';
  const buyCount  = favCryptos.filter(c => c.signal === 'BUY').length;
  const sellCount = favCryptos.filter(c => c.signal === 'SELL').length;
  const holdCount = favCryptos.filter(c => c.signal === 'HOLD').length;

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0d1117]/96 backdrop-blur border-b border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.push('/')}
            className="text-gray-400 hover:text-white text-xl flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 transition-colors">
            ←
          </button>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xl">⭐</span>
            <h1 className="font-black text-lg" style={{background:'linear-gradient(90deg,#a855f7,#3b82f6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
              Mis Favoritos
            </h1>
            <span className="bg-purple-800/50 text-purple-300 text-xs px-2 py-0.5 rounded-full font-semibold">
              {favCryptos.length}
            </span>
          </div>
          <button onClick={handleRefresh} disabled={loading}
            className="px-3 py-1.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
            style={{background:'linear-gradient(135deg,#a855f7,#3b82f6)'}}>
            {loading ? '⏳' : '🔄'}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4">

        {favCryptos.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <span className="text-6xl">⭐</span>
            <h2 className="text-xl font-bold text-white">Sin favoritos aún</h2>
            <p className="text-gray-500 text-sm max-w-xs">
              Tocá la estrella ☆ en cualquier cripto del dashboard para agregarla acá.
            </p>
            <button onClick={() => router.push('/')}
              className="mt-2 px-6 py-3 rounded-xl font-bold text-white"
              style={{background:'linear-gradient(135deg,#a855f7,#3b82f6)'}}>
              Ir al Dashboard
            </button>
          </div>
        ) : (
          <>
            {/* RESUMEN */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="col-span-2 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-4 border border-purple-700/30">
                <p className="text-gray-400 text-xs mb-1">Cambio promedio 24h</p>
                <p className={`text-3xl font-black ${parseFloat(avgChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {parseFloat(avgChange) >= 0 ? '+' : ''}{avgChange}%
                </p>
              </div>
              <div className="bg-green-900/20 rounded-xl p-3 border border-green-900/40 text-center">
                <p className="text-gray-500 text-xs">🚀 Comprar</p>
                <p className="text-2xl font-black text-green-400">{buyCount}</p>
              </div>
              <div className="bg-red-900/20 rounded-xl p-3 border border-red-900/40 text-center">
                <p className="text-gray-500 text-xs">📉 Vender</p>
                <p className="text-2xl font-black text-red-400">{sellCount}</p>
              </div>
              <div className="bg-yellow-900/20 rounded-xl p-3 border border-yellow-900/30 text-center">
                <p className="text-gray-500 text-xs">⏸ Hold</p>
                <p className="text-2xl font-black text-yellow-400">{holdCount}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700 text-center">
                <p className="text-gray-500 text-xs">📊 Total</p>
                <p className="text-2xl font-black text-white">{favCryptos.length}</p>
              </div>
            </div>

            {/* LISTA */}
            <div className="divide-y divide-gray-800/50">
              {favCryptos.map((c, i) => {
                const isPos = c.change24h >= 0;
                return (
                  <div key={c.symbol} onClick={() => setSelected(c)}
                    className="cursor-pointer hover:bg-gray-800/25 transition-colors py-3">
                    <div className="flex items-center gap-3">
                      {/* Remove fav */}
                      <button onClick={(e) => handleRemoveFav(e, c.symbol)}
                        className="text-yellow-400 hover:text-gray-500 transition-colors text-lg flex-shrink-0">
                        ⭐
                      </button>

                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-sm font-black flex-shrink-0">
                        {c.symbol.charAt(0)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{c.symbol.replace('USDT','')}</span>
                          <span className={`text-xs ${c.liquidity.color}`}>{c.liquidity.label}</span>
                        </div>
                        <p className="text-gray-500 text-xs truncate">{c.name} · Vol: {fmtVol(c.volume24h)}</p>
                      </div>

                      {/* Precio + cambio */}
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-sm text-white">
                          ${c.price < 0.01 ? c.price.toFixed(6) : c.price < 1 ? c.price.toFixed(4) : c.price.toFixed(2)}
                        </p>
                        <p className={`text-xs font-bold ${isPos ? 'text-green-400' : 'text-red-400'}`}>
                          {isPos ? '+' : ''}{c.change24h.toFixed(2)}%
                        </p>
                      </div>

                      {/* Señal */}
                      <span className={`text-xs font-bold px-2 py-1 rounded flex-shrink-0 ${
                        c.signal==='BUY'  ? 'bg-green-900/50 text-green-400' :
                        c.signal==='SELL' ? 'bg-red-900/50 text-red-400' :
                        'bg-yellow-900/30 text-yellow-500'}`}>
                        {c.signal==='BUY' ? 'COMPRAR' : c.signal==='SELL' ? 'VENDER' : 'HOLD'}
                      </span>
                    </div>

                    {/* Barra liquidez */}
                    <div className="ml-12 mt-1.5 flex items-center gap-2">
                      <div className="flex-1 bg-gray-800 rounded h-1">
                        <div className={`h-1 rounded ${c.liquidity.score>=4?'bg-green-500':c.liquidity.score===3?'bg-yellow-500':c.liquidity.score===2?'bg-orange-500':'bg-red-500'}`}
                          style={{width:`${c.liquidity.score*20}%`}}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AGREGAR MÁS */}
            <button onClick={() => router.push('/')}
              className="w-full mt-6 py-3 rounded-xl border border-purple-700/50 text-purple-400 text-sm font-semibold hover:bg-purple-900/20 transition-colors">
              + Agregar más favoritos
            </button>
          </>
        )}
      </main>

      {selected && <CryptoDetailModal crypto={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
