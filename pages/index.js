import { useState, useEffect, useRef } from 'react';
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
  const headerRef = useRef(null);
  const filtersRef = useRef(null);

  useEffect(() => {
    try { setCryptos(getAllCryptos()); setLastUpdate(new Date()); } catch(e) {}
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      try { setCryptos(prev => updatePrices(prev)); setLastUpdate(new Date()); } catch(e) {}
      setLoading(false);
    }, 800);
  };

  const withSignals = cryptos.map(c => ({
    ...c,
    signal: c.change24h > 3 ? 'BUY' : c.change24h < -3 ? 'SELL' : 'HOLD',
  }));

  const stats = {
    avgPrice: cryptos.length ? (cryptos.reduce((a,b)=>a+b.price,0)/cryptos.length).toFixed(2) : '0',
    avgChange: cryptos.length ? (cryptos.reduce((a,b)=>a+b.change24h,0)/cryptos.length).toFixed(2) : '0',
    buy: withSignals.filter(c=>c.signal==='BUY').length,
    sell: withSignals.filter(c=>c.signal==='SELL').length,
    hold: withSignals.filter(c=>c.signal==='HOLD').length,
  };

  const displayed = filter==='buy' ? withSignals.filter(c=>c.signal==='BUY')
    : filter==='sell' ? withSignals.filter(c=>c.signal==='SELL')
    : filter==='hold' ? withSignals.filter(c=>c.signal==='HOLD')
    : withSignals;

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HEADER COMPRIMIBLE */}
      <header ref={headerRef} className="sticky top-0 z-50 bg-black border-b border-gray-800"
        style={{ transition: 'all 0.25s ease' }}>

        {!scrolled ? (
          /* EXPANDIDO */
          <div className="px-4 pt-5 pb-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-black" style={{background:'linear-gradient(90deg,#c026d3,#9333ea)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>
                  FXCA16 CRYPTO
                </h1>
                <p className="text-gray-500 text-xs mt-0.5">Sistema de Análisis de Criptomonedas</p>
              </div>
              <button onClick={handleRefresh} disabled={loading}
                className="px-3 py-2 rounded-xl font-bold text-sm text-white disabled:opacity-50"
                style={{background:'linear-gradient(135deg,#c026d3,#7c3aed)'}}>
                {loading ? '⏳' : '🔄'} Actualizar
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {[
                { label:'📊 Precio Prom.', val:`$${stats.avgPrice}`, color:'text-purple-400' },
                { label:'📈 Cambio 24h',   val:`${parseFloat(stats.avgChange)>=0?'+':''}${stats.avgChange}%`,
                  color: parseFloat(stats.avgChange)>=0?'text-green-400':'text-red-400' },
                { label:'🚀 Compra',  val:stats.buy,  color:'text-green-400' },
                { label:'📉 Venta',   val:stats.sell, color:'text-red-400' },
              ].map(s=>(
                <div key={s.label} className="bg-gray-900 rounded-xl p-3 border border-gray-800">
                  <p className="text-gray-500 text-xs">{s.label}</p>
                  <p className={`text-xl font-bold ${s.color}`}>{s.val}</p>
                </div>
              ))}
            </div>
            <div className="bg-gray-900 rounded-xl p-3 border border-gray-800 flex justify-between items-center">
              <p className="text-gray-500 text-xs">⏸️ Hold</p>
              <p className="text-lg font-bold text-yellow-400">{stats.hold}</p>
            </div>
            {lastUpdate && <p className="text-gray-600 text-xs text-right mt-1">{lastUpdate.toLocaleTimeString('es-AR')}</p>}
          </div>
        ) : (
          /* COMPRIMIDO */
          <div className="px-4 py-2 max-w-2xl mx-auto flex items-center justify-between">
            <span className="text-sm font-black" style={{background:'linear-gradient(90deg,#c026d3,#9333ea)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>
              FXCA16 CRYPTO
            </span>
            <div className="flex gap-3 text-xs font-bold items-center">
              <span className="text-green-400">🚀{stats.buy}</span>
              <span className="text-red-400">📉{stats.sell}</span>
              <span className="text-yellow-400">⏸️{stats.hold}</span>
              <button onClick={handleRefresh} disabled={loading}
                className="px-2 py-1 rounded-lg text-white text-xs"
                style={{background:'linear-gradient(135deg,#c026d3,#7c3aed)'}}>
                {loading?'⏳':'🔄'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* FILTROS — siempre sticky justo debajo del header */}
      <div ref={filtersRef} className="sticky z-40 bg-black border-b border-gray-800 px-4 py-2"
        style={{ top: scrolled ? '42px' : '0px', position: 'sticky' }}>
        <div className="max-w-2xl mx-auto flex gap-2 overflow-x-auto scrollbar-hide">
          {[
            { key:'all',  label:`📊 Todas (${cryptos.length})`, bg:'#1d4ed8' },
            { key:'buy',  label:`🚀 Comprar (${stats.buy})`,    bg:'#15803d' },
            { key:'hold', label:`⏸️ Hold (${stats.hold})`,       bg:'#a16207' },
            { key:'sell', label:`📉 Vender (${stats.sell})`,     bg:'#b91c1c' },
          ].map(f=>(
            <button key={f.key} onClick={()=>setFilter(f.key)}
              className="px-4 py-2 rounded-lg whitespace-nowrap text-sm font-semibold flex-shrink-0 transition-all"
              style={{ background: filter===f.key ? f.bg : '#111827', color:'white', opacity: filter===f.key?1:0.6 }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* LISTA */}
      <main className="max-w-2xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 gap-3">
          {displayed.map(crypto=>(
            <div key={crypto.symbol} onClick={()=>setSelectedCrypto(crypto)} className="cursor-pointer">
              <CryptoCard crypto={crypto} signal={crypto.signal} />
            </div>
          ))}
        </div>
        {displayed.length===0 && (
          <div className="text-center py-16 text-gray-500">Sin criptomonedas en esta categoría</div>
        )}
      </main>

      {selectedCrypto && (
        <CryptoDetailModal crypto={selectedCrypto} onClose={()=>setSelectedCrypto(null)} />
      )}
    </div>
  );
}
