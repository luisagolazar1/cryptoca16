import { useState, useEffect } from 'react';
import CryptoDetailModal from '../components/CryptoDetailModal';
import { getAllCryptos, updatePrices } from '../lib/cryptoData';

export default function Dashboard() {
  const [cryptos, setCryptos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState('');

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
    totalMarketCap: cryptos.reduce((a,b) => a + (b.price * (b.volume || 1000000)), 0),
    avgChange: cryptos.length ? (cryptos.reduce((a,b) => a+b.change24h, 0)/cryptos.length).toFixed(2) : '0',
    buy: withSignals.filter(c=>c.signal==='BUY').length,
    sell: withSignals.filter(c=>c.signal==='SELL').length,
    hold: withSignals.filter(c=>c.signal==='HOLD').length,
  };

  const displayed = withSignals
    .filter(c => filter === 'all' ? true : filter === 'buy' ? c.signal==='BUY' : filter === 'sell' ? c.signal==='SELL' : c.signal==='HOLD')
    .filter(c => search === '' ? true : c.symbol.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase()));

  const fmt = (n) => n >= 1e9 ? `$${(n/1e9).toFixed(2)}B` : n >= 1e6 ? `$${(n/1e6).toFixed(2)}M` : `$${n.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">

      {/* TOP STATS BAR */}
      <div className="bg-[#0d1117] border-b border-gray-800 text-xs text-gray-400 py-2 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex gap-6 overflow-x-auto">
          <span>Criptomonedas: <b className="text-white">{cryptos.length}</b></span>
          <span>Miedo y Codicia: <b className="text-yellow-400">49 Neutral</b></span>
          <span>Señales Compra: <b className="text-green-400">{stats.buy}</b></span>
          <span>Señales Venta: <b className="text-red-400">{stats.sell}</b></span>
          <span>Cambio Prom 24h: <b className={parseFloat(stats.avgChange)>=0?'text-green-400':'text-red-400'}>{parseFloat(stats.avgChange)>=0?'+':''}{stats.avgChange}%</b></span>
          {lastUpdate && <span className="ml-auto">Actualizado: {lastUpdate.toLocaleTimeString('es-AR')}</span>}
        </div>
      </div>

      {/* HEADER STICKY */}
      <header className="sticky top-0 z-50 bg-[#0d1117]/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">

          {/* LOGO + SEARCH + REFRESH */}
          <div className="flex items-center gap-3 py-3">
            <div className="flex items-center gap-2 flex-shrink-0">
              <img src="/icon-192.png" alt="logo" className="w-8 h-8 rounded-lg" />
              <span className="font-black text-lg" style={{background:'linear-gradient(90deg,#a855f7,#3b82f6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>
                FXCA16 CRYPTO
              </span>
            </div>

            <div className="flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Buscar criptomoneda..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:border-purple-500 outline-none placeholder-gray-500"
              />
            </div>

            <button onClick={handleRefresh} disabled={loading}
              className="flex-shrink-0 px-3 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
              style={{background:'linear-gradient(135deg,#a855f7,#3b82f6)'}}>
              {loading ? '⏳' : '🔄'} {!scrolled && 'Actualizar'}
            </button>
          </div>

          {/* FILTER TABS */}
          <div className="flex gap-1 pb-2 overflow-x-auto">
            {[
              {key:'all',  label:`🌐 Todas (${cryptos.length})`},
              {key:'buy',  label:`🚀 Comprar (${stats.buy})`},
              {key:'hold', label:`⏸ Hold (${stats.hold})`},
              {key:'sell', label:`📉 Vender (${stats.sell})`},
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all border"
                style={{
                  background: filter===f.key ? 'linear-gradient(135deg,#a855f7,#3b82f6)' : 'transparent',
                  borderColor: filter===f.key ? 'transparent' : '#374151',
                  color: filter===f.key ? 'white' : '#9ca3af'
                }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* TABLE */}
      <main className="max-w-7xl mx-auto px-4 py-4">

        {/* HEADER DE TABLA */}
        <div className="hidden sm:grid text-xs text-gray-500 font-semibold px-4 py-2 border-b border-gray-800"
          style={{gridTemplateColumns:'40px 2fr 1fr 1fr 1fr 1fr 1fr'}}>
          <span>#</span>
          <span>Nombre</span>
          <span className="text-right">Precio</span>
          <span className="text-right">24h %</span>
          <span className="text-right">7d %</span>
          <span className="text-right">Volumen</span>
          <span className="text-right">Señal</span>
        </div>

        {/* FILAS */}
        <div className="divide-y divide-gray-800/50">
          {displayed.map((crypto, i) => {
            const change = crypto.change24h;
            const change7d = (Math.random() * 20 - 10).toFixed(2);
            const vol = fmt(crypto.volume || crypto.price * 1000000);
            const isPos = change >= 0;
            const signal = crypto.signal;

            return (
              <div key={crypto.symbol}
                onClick={() => setSelectedCrypto(crypto)}
                className="cursor-pointer hover:bg-gray-800/30 transition-colors px-4 py-3">

                {/* MOBILE */}
                <div className="sm:hidden flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 text-xs w-5">{i+1}</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {crypto.symbol.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white">{crypto.symbol.replace('USDT','')}</p>
                      <p className="text-gray-500 text-xs">{crypto.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-white">${crypto.price < 0.01 ? crypto.price.toFixed(6) : crypto.price.toFixed(2)}</p>
                    <p className={`text-xs font-semibold ${isPos?'text-green-400':'text-red-400'}`}>
                      {isPos?'+':''}{change.toFixed(2)}%
                    </p>
                  </div>
                  <span className={`ml-3 px-2 py-0.5 rounded text-xs font-bold flex-shrink-0 ${
                    signal==='BUY'?'bg-green-900/50 text-green-400':
                    signal==='SELL'?'bg-red-900/50 text-red-400':
                    'bg-yellow-900/30 text-yellow-500'}`}>
                    {signal==='BUY'?'COMPRAR':signal==='SELL'?'VENDER':'HOLD'}
                  </span>
                </div>

                {/* DESKTOP */}
                <div className="hidden sm:grid items-center"
                  style={{gridTemplateColumns:'40px 2fr 1fr 1fr 1fr 1fr 1fr'}}>
                  <span className="text-gray-600 text-sm">{i+1}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {crypto.symbol.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white">{crypto.symbol.replace('USDT','')}</p>
                      <p className="text-gray-500 text-xs">{crypto.name}</p>
                    </div>
                  </div>
                  <p className="text-right font-semibold text-sm">
                    ${crypto.price < 0.01 ? crypto.price.toFixed(6) : crypto.price < 1 ? crypto.price.toFixed(4) : crypto.price.toFixed(2)}
                  </p>
                  <p className={`text-right text-sm font-semibold ${isPos?'text-green-400':'text-red-400'}`}>
                    {isPos?'+':''}{change.toFixed(2)}%
                  </p>
                  <p className={`text-right text-sm font-semibold ${parseFloat(change7d)>=0?'text-green-400':'text-red-400'}`}>
                    {parseFloat(change7d)>=0?'+':''}{change7d}%
                  </p>
                  <p className="text-right text-sm text-gray-300">{vol}</p>
                  <div className="flex justify-end">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      signal==='BUY'?'bg-green-900/50 text-green-400':
                      signal==='SELL'?'bg-red-900/50 text-red-400':
                      'bg-yellow-900/30 text-yellow-500'}`}>
                      {signal==='BUY'?'COMPRAR':signal==='SELL'?'VENDER':'HOLD'}
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

      {selectedCrypto && (
        <CryptoDetailModal crypto={selectedCrypto} onClose={() => setSelectedCrypto(null)} />
      )}
    </div>
  );
}
