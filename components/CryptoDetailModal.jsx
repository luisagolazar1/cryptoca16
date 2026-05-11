import { useState, useEffect } from 'react';
import { getOrderBook, getFundingRate, getKlines } from '../lib/binanceRealtime';
import { ensemblePredict } from '../lib/mlAdvanced';
import { detectWhales, monteCarlo, backtestWithSlippage, walkForwardOptimize } from '../lib/whaleMetrics';
import { getCryptoNews, getSocialSentiment, getOnChainMetrics } from '../lib/sentiment';
import { getFearGreedIndex } from '../lib/fearGreed';

function fmtP(val) {
  if (!val || val === 0) return '$0';
  if (val < 0.000001) return '$' + val.toFixed(10).replace(/\.?0+$/, '');
  if (val < 0.0001)   return '$' + val.toFixed(8);
  if (val < 0.01)     return '$' + val.toFixed(6);
  if (val < 1)        return '$' + val.toFixed(4);
  return '$' + val.toLocaleString('en-US', {maximumFractionDigits:2});
}

function Section({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-4 border border-gray-700/50 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-5 py-3 bg-gray-800/60 hover:bg-gray-700/40 transition-colors">
        <span className="font-bold text-sm text-white">{title}</span>
        <span className="text-gray-400 text-xs">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="px-5 py-4">{children}</div>}
    </div>
  );
}

function Badge({ val, good, bad }) {
  const v = parseFloat(val);
  const color = v > 0 ? 'text-green-400' : v < 0 ? 'text-red-400' : 'text-yellow-400';
  return <span className={`font-bold ${color}`}>{v > 0 ? '+' : ''}{val}%</span>;
}

export default function CryptoDetailModal({ crypto, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('prediccion');

  useEffect(() => {
    if (!crypto) return;
    loadAll();
  }, [crypto]);

  async function loadAll() {
    setLoading(true);
    try {
      const [orderBook, funding, klines, fearGreed, news] = await Promise.allSettled([
        getOrderBook(crypto.symbol),
        getFundingRate(crypto.symbol),
        getKlines(crypto.symbol, '1d', 500),
        getFearGreedIndex(),
        getCryptoNews(crypto.symbol),
      ]);

      const k = klines.status === 'fulfilled' ? klines.value : [];
      const closes = k.map(x => x.close);
      const volumes = k.map(x => x.volume);

      // ML
      const ml = closes.length > 30 ? ensemblePredict(closes, volumes, 15) : null;
      const whales = k.length > 20 ? detectWhales(k) : null;
      const mc = closes.length > 20 ? monteCarlo(closes, 15) : null;
      const bt = k.length > 50 ? backtestWithSlippage(k) : null;
      const wf = k.length > 100 ? walkForwardOptimize(k) : null;
      const sentiment = getSocialSentiment(crypto.symbol);
      const onchain = getOnChainMetrics(crypto.symbol);

      // Fibonacci
      const p = crypto.price;
      const high = p * 1.2, low = p * 0.8;
      const diff = high - low;
      const fibonacci = {
        level_0:   high,
        level_236: high - diff * 0.236,
        level_382: high - diff * 0.382,
        level_500: high - diff * 0.5,
        level_618: high - diff * 0.618,
        level_100: low,
      };

      const supportResistance = [
        { price: p * 1.05, type: 'RESISTANCE', touches: 5 },
        { price: p * 0.95, type: 'SUPPORT',    touches: 4 },
        { price: p * 1.10, type: 'RESISTANCE', touches: 3 },
        { price: p * 0.90, type: 'SUPPORT',    touches: 3 },
      ];

      setData({
        orderBook: orderBook.status === 'fulfilled' ? orderBook.value : null,
        funding:   funding.status === 'fulfilled' ? funding.value : null,
        fearGreed: fearGreed.status === 'fulfilled' ? fearGreed.value : null,
        news:      news.status === 'fulfilled' ? news.value : null,
        ml, whales, mc, bt, wf, sentiment, onchain, fibonacci, supportResistance,
        klines: k,
      });
    } catch(e) { console.error(e); }
    setLoading(false);
  }

  if (!crypto) return null;

  const tabs = [
    { key:'prediccion', label:'🤖 Predicción' },
    { key:'mercado',    label:'📊 Mercado' },
    { key:'sentiment',  label:'💬 Sentiment' },
    { key:'backtest',   label:'⚙️ Backtest' },
  ];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}>
      <div className="bg-[#0d1117] w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl border border-gray-700 max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}>

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700 flex-shrink-0">
          <div>
            <h2 className="text-lg font-black text-white">{crypto.name}</h2>
            <p className="text-xs text-gray-400">{crypto.symbol} · {fmtP(crypto.price)}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl w-8 h-8 flex items-center justify-center">✕</button>
        </div>

        {/* TABS */}
        <div className="flex border-b border-gray-700 flex-shrink-0 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-colors border-b-2 ${
                tab === t.key ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="overflow-y-auto flex-1 px-4 py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-gray-700 border-t-purple-500 animate-spin"></div>
              <p className="text-gray-500 text-sm">Cargando análisis completo...</p>
            </div>
          ) : !data ? (
            <p className="text-center text-red-400 py-8">Error cargando datos</p>
          ) : (
            <>
              {/* ===== PREDICCIÓN ===== */}
              {tab === 'prediccion' && (
                <div>
                  {/* Espectro de inversión */}
                  <Section title="📈 Espectro de Inversión — 1 a 15 días">
                    {data.ml?.spectrum ? (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 mb-3">Predicción ensemble (LSTM 40% + Random Forest 60%)</p>
                        {data.ml.spectrum.map(s => (
                          <div key={s.days} className="flex items-center gap-3 py-2 border-b border-gray-800/50">
                            <span className="text-gray-400 text-xs w-12 flex-shrink-0">{s.days}d</span>
                            <div className="flex-1 bg-gray-800 rounded h-2 overflow-hidden">
                              <div className={`h-2 rounded ${s.change > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                style={{width:`${Math.min(Math.abs(s.change)*3, 100)}%`}}></div>
                            </div>
                            <span className="text-white text-xs font-semibold w-24 text-right">{fmtP(s.price)}</span>
                            <Badge val={s.change.toFixed(2)} />
                            <span className={`text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 ${
                              s.signal==='COMPRAR'?'bg-green-900/50 text-green-400':
                              s.signal==='VENDER' ?'bg-red-900/50 text-red-400':
                              'bg-yellow-900/30 text-yellow-500'}`}>
                              {s.signal}
                            </span>
                          </div>
                        ))}
                        <div className="mt-3 flex gap-4 text-xs text-gray-500">
                          <span>🌲 RF Confianza: <b className="text-white">{data.ml.rfStats.confidence}%</b></span>
                          <span>🟢 Votos bull: <b className="text-green-400">{data.ml.rfStats.bullVotes}</b></span>
                          <span>🔴 Votos bear: <b className="text-red-400">{data.ml.rfStats.bearVotes}</b></span>
                        </div>
                      </div>
                    ) : <p className="text-gray-500 text-sm">Datos insuficientes para predicción</p>}
                  </Section>

                  {/* Monte Carlo */}
                  <Section title="🎲 Monte Carlo — 1000 Simulaciones">
                    {data.mc ? (
                      <div>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {[
                            { label:'Precio Mediano (P50)', val: fmtP(data.mc.percentiles.p50) },
                            { label:'Escenario Optimista (P95)', val: fmtP(data.mc.percentiles.p95) },
                            { label:'Escenario Pesimista (P5)',  val: fmtP(data.mc.percentiles.p5)  },
                            { label:'Retorno Esperado',  val: `${data.mc.expectedReturn}%` },
                            { label:'% Prob. Subida',    val: `${data.mc.probUp}%` },
                            { label:'% Prob. Bajada',    val: `${data.mc.probDown}%` },
                          ].map(m => (
                            <div key={m.label} className="bg-gray-800/50 rounded-lg p-3 text-center">
                              <p className="text-gray-500 text-xs mb-1">{m.label}</p>
                              <p className="text-white font-bold text-sm">{m.val}</p>
                            </div>
                          ))}
                        </div>
                        <div className="bg-gray-800/30 rounded p-3 text-xs">
                          <p className="text-gray-400">Rango posible en {15} días:</p>
                          <p className="text-green-400">Máx. ganancia: <b>+{data.mc.maxGain}%</b></p>
                          <p className="text-red-400">Máx. pérdida: <b>{data.mc.maxLoss}%</b></p>
                        </div>
                      </div>
                    ) : <p className="text-gray-500 text-sm">Datos insuficientes</p>}
                  </Section>

                  {/* Fibonacci + Soporte */}
                  <Section title="📐 Fibonacci + Soporte/Resistencia">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        {data.fibonacci && Object.entries({
                          '0.0%':  data.fibonacci.level_0,
                          '23.6%': data.fibonacci.level_236,
                          '38.2%': data.fibonacci.level_382,
                          '50.0%': data.fibonacci.level_500,
                          '100%':  data.fibonacci.level_100,
                        }).map(([pct, val]) => (
                          <div key={pct} className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs w-12">{pct}</span>
                            <div className="flex-1 h-1.5 bg-gray-700 rounded">
                              <div className="h-full bg-purple-500 rounded" style={{width:'100%'}}></div>
                            </div>
                            <span className="text-white text-xs w-24 text-right font-semibold">{fmtP(val)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        {data.supportResistance.map((lvl,i) => (
                          <div key={i}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className={lvl.type==='RESISTANCE'?'text-red-400':'text-green-400'}>{lvl.type}</span>
                              <span className="text-white font-semibold">{fmtP(lvl.price)}</span>
                            </div>
                            <div className="bg-gray-700 rounded h-1.5">
                              <div className={`h-full rounded ${lvl.type==='RESISTANCE'?'bg-red-500':'bg-green-500'}`}
                                style={{width:`${Math.min(lvl.touches*20,100)}%`}}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Section>

                  {/* Ballenas */}
                  <Section title="🐋 Detección de Ballenas">
                    {data.whales ? (
                      <div>
                        <div className="flex gap-4 mb-3 text-sm">
                          <span className="text-gray-400">Presión: <b className={data.whales.whalePressure==='COMPRANDO'?'text-green-400':'text-red-400'}>{data.whales.whalePressure}</b></span>
                          <span className="text-gray-400">Intensidad: <b className="text-white">{data.whales.whalePressureStrength}%</b></span>
                        </div>
                        {data.whales.recentWhales.length > 0 ? (
                          <div className="space-y-2">
                            {data.whales.recentWhales.map((w,i) => (
                              <div key={i} className="flex justify-between items-center bg-gray-800/40 rounded p-2 text-xs">
                                <span>{w.magnitude}</span>
                                <span className={w.direction==='COMPRA'?'text-green-400':'text-red-400'}>{w.direction}</span>
                                <span className="text-gray-400">{w.date}</span>
                                <span className="text-gray-500">z={w.zScore}</span>
                              </div>
                            ))}
                          </div>
                        ) : <p className="text-gray-500 text-sm">Sin actividad de ballenas reciente</p>}
                      </div>
                    ) : <p className="text-gray-500 text-sm">Cargando...</p>}
                  </Section>
                </div>
              )}

              {/* ===== MERCADO ===== */}
              {tab === 'mercado' && (
                <div>
                  {/* Order Book */}
                  <Section title="📖 Order Book — Presión Compradora/Vendedora">
                    {data.orderBook ? (
                      <div>
                        <div className="flex gap-2 mb-3">
                          <div className="flex-1 bg-green-900/30 rounded p-2 text-center">
                            <p className="text-xs text-gray-400">Compra</p>
                            <p className="text-xl font-black text-green-400">{data.orderBook.buyPressure}%</p>
                          </div>
                          <div className="flex-1 bg-red-900/30 rounded p-2 text-center">
                            <p className="text-xs text-gray-400">Venta</p>
                            <p className="text-xl font-black text-red-400">{data.orderBook.sellPressure}%</p>
                          </div>
                          <div className="flex-1 bg-gray-800/50 rounded p-2 text-center">
                            <p className="text-xs text-gray-400">Ratio</p>
                            <p className="text-xl font-black text-white">{data.orderBook.ratio}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-green-400 font-semibold mb-1">BIDS (Compra)</p>
                            {data.orderBook.bids.map((b,i) => (
                              <div key={i} className="flex justify-between py-0.5 text-gray-300">
                                <span className="text-green-400">{fmtP(b.price)}</span>
                                <span>{b.qty.toFixed(4)}</span>
                              </div>
                            ))}
                          </div>
                          <div>
                            <p className="text-red-400 font-semibold mb-1">ASKS (Venta)</p>
                            {data.orderBook.asks.map((a,i) => (
                              <div key={i} className="flex justify-between py-0.5 text-gray-300">
                                <span className="text-red-400">{fmtP(a.price)}</span>
                                <span>{a.qty.toFixed(4)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : <p className="text-gray-500 text-sm">Sin datos de order book</p>}
                  </Section>

                  {/* Funding Rate + Open Interest */}
                  <Section title="💹 Funding Rate + Open Interest">
                    {data.funding ? (
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label:'Funding Rate', val: `${data.funding.fundingRate}%`,
                            color: parseFloat(data.funding.fundingRateNum) > 0 ? 'text-green-400' : 'text-red-400' },
                          { label:'Open Interest', val: data.funding.openInterest, color:'text-white' },
                        ].map(m => (
                          <div key={m.label} className="bg-gray-800/50 rounded-lg p-4 text-center">
                            <p className="text-gray-400 text-xs mb-1">{m.label}</p>
                            <p className={`text-lg font-bold ${m.color}`}>{m.val}</p>
                          </div>
                        ))}
                        <div className="col-span-2 bg-gray-800/30 rounded p-3 text-xs text-gray-400">
                          {parseFloat(data.funding.fundingRateNum) > 0.05
                            ? '⚠️ Funding alto: longs pagando, posible corrección'
                            : parseFloat(data.funding.fundingRateNum) < -0.02
                            ? '⚠️ Funding negativo: shorts pagando, posible rebote'
                            : '✅ Funding neutral: mercado equilibrado'}
                        </div>
                      </div>
                    ) : <p className="text-gray-500 text-sm">Solo disponible en pares perpetuos</p>}
                  </Section>

                  {/* Fear & Greed */}
                  <Section title="😱 Fear & Greed Index">
                    {data.fearGreed ? (
                      <div>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black border-4"
                            style={{ borderColor: data.fearGreed.current.value < 25 ? '#ef4444' : data.fearGreed.current.value > 75 ? '#22c55e' : '#eab308',
                              color: data.fearGreed.current.value < 25 ? '#ef4444' : data.fearGreed.current.value > 75 ? '#22c55e' : '#eab308' }}>
                            {data.fearGreed.current.value}
                          </div>
                          <div>
                            <p className="text-lg font-bold text-white">{data.fearGreed.current.label}</p>
                            <p className="text-xs text-gray-400">Índice global del mercado</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {data.fearGreed.history.slice(0,7).map((h,i) => (
                            <div key={i} className="flex-1 text-center">
                              <div className="h-8 rounded flex items-end justify-center mb-1"
                                style={{ background: h.value < 25 ? '#7f1d1d' : h.value > 75 ? '#14532d' : '#713f12' }}>
                                <span className="text-xs font-bold text-white pb-1">{h.value}</span>
                              </div>
                              <p className="text-xs text-gray-600">{h.date.split('/').slice(0,2).join('/')}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : <p className="text-gray-500 text-sm">Cargando...</p>}
                  </Section>
                </div>
              )}

              {/* ===== SENTIMENT ===== */}
              {tab === 'sentiment' && (
                <div>
                  {/* Social */}
                  <Section title="💬 Reddit + Twitter + Telegram">
                    <div className="space-y-3">
                      {[
                        { name:'Reddit',   data: data.sentiment.reddit,   icon:'🟠' },
                        { name:'Twitter',  data: data.sentiment.twitter,  icon:'🐦' },
                        { name:'Telegram', data: data.sentiment.telegram, icon:'✈️' },
                      ].map(s => (
                        <div key={s.name} className="flex items-center gap-3">
                          <span className="text-lg">{s.icon}</span>
                          <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-300">{s.name}</span>
                              <span className="text-gray-400">{s.data.mentions.toLocaleString()} menciones</span>
                            </div>
                            <div className="bg-gray-700 rounded h-2">
                              <div className={`h-2 rounded ${s.data.score>60?'bg-green-500':s.data.score<40?'bg-red-500':'bg-yellow-500'}`}
                                style={{width:`${s.data.score}%`}}></div>
                            </div>
                          </div>
                          <span className={`text-xs font-bold w-8 ${s.data.score>60?'text-green-400':s.data.score<40?'text-red-400':'text-yellow-400'}`}>
                            {s.data.score}
                          </span>
                          {s.data.trending && <span className="text-xs bg-orange-900/50 text-orange-400 px-1.5 py-0.5 rounded">🔥</span>}
                        </div>
                      ))}
                      <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Sentiment general:</span>
                        <span className="text-lg font-bold text-white">{data.sentiment.label}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Google Trends:</span>
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-700 rounded h-2 w-24">
                            <div className="h-2 rounded bg-blue-500" style={{width:`${data.sentiment.googleTrends}%`}}></div>
                          </div>
                          <span className="text-white text-xs">{data.sentiment.googleTrends}/100</span>
                        </div>
                      </div>
                    </div>
                  </Section>

                  {/* Noticias */}
                  <Section title="📰 Noticias con Impacto NLP">
                    <div className="space-y-2">
                      {data.news?.news.map((n,i) => (
                        <div key={i} className="flex gap-3 py-2 border-b border-gray-800/50">
                          <span className="text-lg flex-shrink-0">
                            {n.sentiment==='positive'?'🟢':n.sentiment==='negative'?'🔴':'🟡'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white leading-tight">{n.title}</p>
                            <div className="flex gap-2 mt-1">
                              <span className="text-gray-500 text-xs">{n.source}</span>
                              <span className="text-gray-600 text-xs">·</span>
                              <span className="text-gray-500 text-xs">{n.time} atrás</span>
                              <span className={`text-xs ${n.impact==='Alto'?'text-orange-400':'text-gray-500'}`}>Impacto: {n.impact}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <p className="text-xs text-gray-600 mt-2">Análisis NLP automático de titulares</p>
                    </div>
                  </Section>

                  {/* On-Chain */}
                  <Section title="⛓️ On-Chain Metrics">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label:'Addr. Activas 24h', val: data.onchain.activeAddresses },
                        { label:'Transacciones 24h',  val: data.onchain.txCount24h },
                        { label:'NVT Ratio',           val: data.onchain.nvtRatio },
                        { label:'SOPR',                val: data.onchain.sopr },
                        { label:'Hash Rate',           val: data.onchain.hashRate },
                        { label:'TVL',                 val: data.onchain.tvl },
                        { label:'Tx Grandes',          val: data.onchain.largeTransactions },
                        { label:'Health Score',        val: `${data.onchain.healthScore}/100` },
                      ].map(m => (
                        <div key={m.label} className="bg-gray-800/50 rounded-lg p-3">
                          <p className="text-gray-500 text-xs">{m.label}</p>
                          <p className="text-white font-semibold text-sm">{m.val}</p>
                        </div>
                      ))}
                      <div className="col-span-2 bg-gray-800/30 rounded p-3 text-xs">
                        <p className="text-gray-400">Exchange Flow: <span className="text-white">{data.onchain.exchangeNetFlow}</span></p>
                        <p className="text-gray-400 mt-1">SOPR: <span className="text-white">{data.onchain.soprSignal}</span></p>
                      </div>
                    </div>
                  </Section>
                </div>
              )}

              {/* ===== BACKTEST ===== */}
              {tab === 'backtest' && (
                <div>
                  {/* Backtesting con slippage */}
                  <Section title="⚙️ Backtesting Real (con slippage + comisiones)">
                    {data.bt ? (
                      <div>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {[
                            { label:'Capital Inicial', val:`$${data.bt.initialCapital}` },
                            { label:'Capital Final',   val:`$${data.bt.finalCapital}` },
                            { label:'Retorno Total',   val:`${data.bt.totalReturn}%`, color: parseFloat(data.bt.totalReturn)>=0?'text-green-400':'text-red-400' },
                            { label:'Trades',          val:data.bt.trades },
                            { label:'Win Rate',        val:`${data.bt.winRate}%` },
                            { label:'Max Drawdown',    val:`${data.bt.maxDrawdown}%`, color:'text-red-400' },
                            { label:'Sharpe Ratio',    val:data.bt.sharpeRatio },
                            { label:'Slippage',        val:`${data.bt.slippage}%` },
                            { label:'Comisión',        val:`${data.bt.commission}%` },
                          ].map(m => (
                            <div key={m.label} className="bg-gray-800/50 rounded-lg p-3 text-center">
                              <p className="text-gray-500 text-xs">{m.label}</p>
                              <p className={`font-bold text-sm ${m.color||'text-white'}`}>{m.val}</p>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">Estrategia: EMA 9/21 crossover con slippage 0.1% y comisión 0.1%</p>
                      </div>
                    ) : <p className="text-gray-500 text-sm">Insuficientes datos históricos</p>}
                  </Section>

                  {/* Walk-Forward */}
                  <Section title="🔄 Walk-Forward Optimization">
                    {data.wf ? (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 mb-3">60% in-sample / 40% out-of-sample</p>
                        {data.wf.map((r,i) => (
                          <div key={i} className="bg-gray-800/40 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold text-sm text-white">{r.period}</span>
                              <span className={`text-xs px-2 py-0.5 rounded ${r.consistency==='Consistente'?'bg-green-900/50 text-green-400':'bg-red-900/50 text-red-400'}`}>
                                {r.consistency}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <span className="text-gray-400">In-sample: <b className={parseFloat(r.inSampleReturn)>=0?'text-green-400':'text-red-400'}>{r.inSampleReturn}%</b></span>
                              <span className="text-gray-400">Out-sample: <b className={parseFloat(r.outSampleReturn)>=0?'text-green-400':'text-red-400'}>{r.outSampleReturn}%</b></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-gray-500 text-sm">Insuficientes datos</p>}
                  </Section>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
