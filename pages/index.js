import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CryptoDetailModal from '../components/CryptoDetailModal';
import { getAllCryptos, updatePrices } from '../lib/cryptoData';
import { getVolumes, getLiquidityLabel, fmtVol } from '../lib/liquidity';
import { getFavorites, toggleFavorite, isFavorite } from '../lib/favorites';

export default function Dashboard() {
  const router = useRouter();
  const [cryptos, setCryptos]       = useState([]);
  const [volumes, setVolumes]       = useState({});
  const [filter, setFilter]         = useState('all');
  const [selected, setSelected]     = useState(null);
  const [loading, setLoading]       = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [search, setSearch]         = useState('');
  const [sortBy, setSortBy]         = useState('signal'); // signal | volume | change
  const [favorites, setFavorites]   = useState([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleToggleFav = (e, symbol) => {
    e.stopPropagation();
    const updated = toggleFavorite(symbol);
    setFavorites([...updated]);
  };

  useEffect(() => {
    try { setCryptos(getAllCryptos()); setLastUpdate(new Date()); } catch(e) {}
    loadVolumes();
  }, []);

  async function loadVolumes() {
    try {
      const data = await getVolumes([]);
      const map = {};
      data.forEach(d => { map[d.symbol] = d.volume24h; });
      // también cargar directamente
      const res = await fetch('https://api.binance.com/api/v3/ticker/24hr');
      const all = await res.json();
      all.forEach(t => { map[t.symbol] = parseFloat(t.quoteVolume); });
      setVolumes(map);
    } catch(e) {}
  }

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      try { setCryptos(prev => updatePrices(prev)); setLastUpdate(new Date()); } catch(e) {}
      setLoading(false);
      loadVolumes();
    }, 800);
  };

  const withData = cryptos.map(c => {
    const sym = c.symbol.includes('USDT') ? c.symbol : c.symbol + 'USDT';
    const vol = volumes[sym] || volumes[c.symbol] || 0;
    const liq = getLiquidityLabel(vol);
    return {
      ...c,
      signal: c.change24h > 3 ? 'BUY' : c.change24h < -3 ? 'SELL' : 'HOLD',
      volume24h: vol,
      liquidity: liq,
    };
  });

  const stats = {
    buy:  withData.filter(c=>c.signal==='BUY').length,
    sell: withData.filter(c=>c.signal==='SELL').length,
    hold: withData.filter(c=>c.signal==='HOLD').length,
    avgChange: withData.length ? (withData.reduce((a,b)=>a+b.change24h,0)/withData.length).toFixed(2) : '0',
  };

  let displayed = withData
    .filter(c => {
      if (filter === 'fav')  return favorites.includes(c.symbol);
      if (filter === 'buy')  return c.signal === 'BUY';
      if (filter === 'sell') return c.signal === 'SELL';
      if (filter === 'hold') return c.signal === 'HOLD';
      return true;
    })
    .filter(c => !search || c.symbol.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase()));

  // Ordenamiento
  if (sortBy === 'volume') displayed = [...displayed].sort((a,b) => b.volume24h - a.volume24h);
  if (sortBy === 'change') displayed = [...displayed].sort((a,b) => b.change24h - a.change24h);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">

      {/* STATS BAR */}
      <div className="bg-[#0d1117] border-b border-gray-800 text-xs text-gray-400 py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex gap-6 overflow-x-auto">
          <span>Total: <b className="text-white">{cryptos.length}</b></span>
          <span>🚀 Comprar: <b className="text-green-400">{stats.buy}</b></span>
          <span>📉 Vender: <b className="text-red-400">{stats.sell}</b></span>
          <span>⏸ Hold: <b className="text-yellow-400">{stats.hold}</b></span>
          <span>Cambio prom: <b className={parseFloat(stats.avgChange)>=0?'text-green-400':'text-red-400'}>{parseFloat(stats.avgChange)>=0?'+':''}{stats.avgChange}%</b></span>
          {lastUpdate && <span className="ml-auto">Actualizado: {lastUpdate.toLocaleTimeString('es-AR')}</span>}
        </div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0d1117]/96 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-3">
          <div className="flex items-center gap-2 py-2.5">
            <img src="/icon-192.png" alt="logo" className="w-8 h-8 rounded-lg flex-shrink-0" />
            <span className="font-black text-base hidden sm:block" style={{background:'linear-gradient(90deg,#a855f7,#3b82f6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
              FXCA16 CRYPTO
            </span>
            <button onClick={() => router.push('/favorites')}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-yellow-900/30 border border-yellow-700/40 hover:bg-yellow-900/50 transition-colors flex-shrink-0">
              <span className="text-sm">⭐</span>
              {favorites.length > 0 && <span className="text-yellow-400 text-xs font-bold">{favorites.length}</span>}
            </button>
            <input type="text" placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)}
              className="flex-1 bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:border-purple-500 outline-none placeholder-gray-500 min-w-0" />
            <button onClick={handleRefresh} disabled={loading}
              className="flex-shrink-0 px-3 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50 flex items-center gap-1"
              style={{background:'linear-gradient(135deg,#a855f7,#3b82f6)'}}>
              <span>{loading?'⏳':'🔄'}</span>
              <span className="hidden sm:inline">Actualizar</span>
            </button>
          </div>

          {/* FILTROS + ORDENAR */}
          <div className="flex items-center gap-2 pb-2 overflow-x-auto">
            <div className="flex gap-1 flex-shrink-0">
              {[
                {key:'all',  label:`🌐 Todas (${cryptos.length})`},
                {key:'fav',  label:`⭐ Favoritos (${favorites.length})`},
                {key:'buy',  label:`🚀 Comprar (${stats.buy})`},
                {key:'hold', label:`⏸ Hold (${stats.hold})`},
                {key:'sell', label:`📉 Vender (${stats.sell})`},
              ].map(f => (
                <button key={f.key} onClick={()=>setFilter(f.key)}
                  className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all border"
                  style={{
                    background: filter===f.key?'linear-gradient(135deg,#a855f7,#3b82f6)':'transparent',
                    borderColor: filter===f.key?'transparent':'#374151',
                    color: filter===f.key?'white':'#9ca3af'
                  }}>
                  {f.label}
                </button>
              ))}
            </div>
            <div className="ml-auto flex gap-1 flex-shrink-0">
              <span className="text-xs text-gray-500 self-center">Ordenar:</span>
              {[
                {key:'signal', label:'Señal'},
                {key:'volume', label:'💧 Volumen'},
                {key:'change', label:'📈 Cambio'},
              ].map(s => (
                <button key={s.key} onClick={()=>setSortBy(s.key)}
                  className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${sortBy===s.key?'bg-purple-700 text-white':'bg-gray-800 text-gray-400'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* TABLA */}
      <main className="max-w-7xl mx-auto px-3 py-3">

        {/* LEYENDA DE LIQUIDEZ */}
        <div className="flex gap-2 flex-wrap mb-3 text-xs">
          <span className="text-gray-500">Liquidez:</span>
          {[
            { label:'🔥 Ultra Alta', sub:'>$500M', color:'text-green-400' },
            { label:'✅ Alta',       sub:'>$100M', color:'text-green-400' },
            { label:'🟡 Media',      sub:'>$20M',  color:'text-yellow-400' },
            { label:'🟠 Baja',       sub:'>$5M',   color:'text-orange-400' },
            { label:'🔴 Muy Baja',   sub:'<$5M',   color:'text-red-400' },
          ].map(l => (
            <span key={l.label} className={`${l.color}`}>{l.label} <span className="text-gray-600">({l.sub})</span></span>
          ))}
        </div>

        {/* HEADER TABLA DESKTOP */}
        <div className="hidden sm:grid text-xs text-gray-500 font-semibold px-3 py-2 border-b border-gray-800"
          style={{gridTemplateColumns:'36px 2fr 1fr 1fr 1fr 1fr 80px'}}>
          <span>#</span>
          <span>Nombre</span>
          <span className="text-right">Precio</span>
          <span className="text-right">24h %</span>
          <span className="text-right cursor-pointer hover:text-white" onClick={()=>setSortBy('volume')}>
            Volumen 24h {sortBy==='volume'?'▼':''}
          </span>
          <span className="text-right">Liquidez</span>
          <span className="text-right">Señal</span>
        </div>

        <div className="divide-y divide-gray-800/40">
          {displayed.map((c, i) => {
            const isPos = c.change24h >= 0;
            return (
              <div key={c.symbol} onClick={()=>setSelected(c)}
                className="cursor-pointer hover:bg-gray-800/25 transition-colors px-3 py-3">

                {/* MOBILE */}
                <div className="sm:hidden">
                  <div className="flex items-center gap-3 mb-1">
                    <button onClick={(e) => handleToggleFav(e, c.symbol)}
                      className="text-base flex-shrink-0 w-5 text-center">
                      {favorites.includes(c.symbol) ? '⭐' : '☆'}
                    </button>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xs font-black flex-shrink-0">
                      {c.symbol.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{c.symbol.replace('USDT','')}</span>
                        <span className={`text-xs ${c.liquidity.color}`}>{c.liquidity.label}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{c.name}</span>
                        <span>·</span>
                        <span className={c.liquidity.color}>Vol: {fmtVol(c.volume24h)}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-sm">${c.price<0.01?c.price.toFixed(6):c.price<1?c.price.toFixed(4):c.price.toFixed(2)}</p>
                      <p className={`text-xs font-bold ${isPos?'text-green-400':'text-red-400'}`}>{isPos?'+':''}{c.change24h.toFixed(2)}%</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded flex-shrink-0 ${
                      c.signal==='BUY'?'bg-green-900/50 text-green-400':
                      c.signal==='SELL'?'bg-red-900/50 text-red-400':
                      'bg-yellow-900/30 text-yellow-500'}`}>
                      {c.signal==='BUY'?'COMPRAR':c.signal==='SELL'?'VENDER':'HOLD'}
                    </span>
                  </div>
                  {/* Barra de liquidez */}
                  <div className="ml-8 flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-800 rounded h-1">
                      <div className={`h-1 rounded ${c.liquidity.score>=4?'bg-green-500':c.liquidity.score===3?'bg-yellow-500':c.liquidity.score===2?'bg-orange-500':'bg-red-500'}`}
                        style={{width:`${c.liquidity.score*20}%`}}></div>
                    </div>
                    <span className="text-xs text-gray-600">{fmtVol(c.volume24h)}</span>
                  </div>
                </div>

                {/* DESKTOP */}
                <div className="hidden sm:grid items-center gap-2"
                  style={{gridTemplateColumns:'36px 2fr 1fr 1fr 1fr 1fr 80px'}}>
                  <button onClick={(e) => handleToggleFav(e, c.symbol)}
                    className="text-base text-center w-full">
                    {favorites.includes(c.symbol) ? '⭐' : <span className="text-gray-700 hover:text-yellow-400 transition-colors">☆</span>}
                  </button>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xs font-black flex-shrink-0">
                      {c.symbol.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">{c.symbol.replace('USDT','')}</p>
                      <p className="text-gray-500 text-xs truncate">{c.name}</p>
                    </div>
                  </div>
                  <p className="text-right font-semibold text-sm">
                    ${c.price<0.01?c.price.toFixed(6):c.price<1?c.price.toFixed(4):c.price.toFixed(2)}
                  </p>
                  <p className={`text-right text-sm font-bold ${isPos?'text-green-400':'text-red-400'}`}>
                    {isPos?'+':''}{c.change24h.toFixed(2)}%
                  </p>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${c.liquidity.color}`}>{fmtVol(c.volume24h)}</p>
                    <div className="flex justify-end mt-1">
                      <div className="w-16 bg-gray-800 rounded h-1">
                        <div className={`h-1 rounded ${c.liquidity.score>=4?'bg-green-500':c.liquidity.score===3?'bg-yellow-500':c.liquidity.score===2?'bg-orange-500':'bg-red-500'}`}
                          style={{width:`${c.liquidity.score*20}%`}}></div>
                      </div>
                    </div>
                  </div>
                  <p className={`text-right text-xs font-semibold ${c.liquidity.color}`}>{c.liquidity.label}</p>
                  <div className="flex justify-end">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      c.signal==='BUY'?'bg-green-900/50 text-green-400':
                      c.signal==='SELL'?'bg-red-900/50 text-red-400':
                      'bg-yellow-900/30 text-yellow-500'}`}>
                      {c.signal==='BUY'?'COMPRAR':c.signal==='SELL'?'VENDER':'HOLD'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {displayed.length === 0 && (
          <div className="text-center py-16 text-gray-500">Sin resultados</div>
        )}
      </main>

      {selected && <CryptoDetailModal crypto={selected} onClose={()=>setSelected(null)} />}
    </div>
  );
}
