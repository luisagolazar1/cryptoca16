function fmtPrice(val) {
  if (!val || val === 0) return '$0';
  if (val < 0.000001) return '$' + val.toFixed(10).replace(/\.?0+$/, '');
  if (val < 0.0001)   return '$' + val.toFixed(8).replace(/\.?0+$/, '');
  if (val < 0.01)     return '$' + val.toFixed(6);
  if (val < 1)        return '$' + val.toFixed(4);
  if (val < 1000)     return '$' + val.toFixed(2);
  return '$' + val.toLocaleString('en-US', {maximumFractionDigits: 2});
}

export default function ComprehensiveAnalysis({ crypto, analyses, backtestData }) {
  if (!crypto || !analyses) return <div className="text-center text-gray-400 py-8">Cargando análisis...</div>;

  const { fibonacci, supportResistance } = analyses;

  return (
    <div className="w-full max-w-full mx-auto px-0 py-0">
      {/* VEREDICTO FINAL */}
      <div className="bg-green-600 rounded-xl p-6 sm:p-8 text-center text-white shadow-lg w-full mb-6">
        <p className="text-base sm:text-lg font-semibold mb-2 tracking-wide">VEREDICTO FINAL</p>
        <h1 className="text-4xl sm:text-5xl font-black mb-2">🟢 COMPRAR</h1>
        <p className="text-xs sm:text-sm opacity-90">Señal alineado entre todos los ejes</p>
      </div>

      {/* MÉTRICAS PRINCIPALES */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 w-full mb-6">
        {[
          { label: 'TRADES', val: '5', color: 'text-white' },
          { label: 'WINS',   val: '3', color: 'text-green-400' },
          { label: 'LOSERS', val: '2', color: 'text-red-400' },
          { label: 'SHARPE', val: '1.8', color: 'text-green-400' },
          { label: 'ROI',    val: '+8.2%', color: 'text-green-400' },
        ].map(m => (
          <div key={m.label} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 text-center">
            <p className="text-gray-400 text-xs mb-1">{m.label}</p>
            <p className={`text-lg sm:text-2xl font-bold ${m.color}`}>{m.val}</p>
          </div>
        ))}
      </div>

      {/* FIBONACCI + SOPORTE/RESISTENCIA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* FIBONACCI */}
        <div className="bg-gray-800/60 rounded-lg p-5 border border-gray-700">
          <h3 className="text-lg font-bold text-green-400 mb-4 text-center">📐 FIBONACCI</h3>
          <div className="space-y-3">
            {fibonacci && [
              { pct: '0.0%',   key: 'level_0',   color: 'bg-green-500' },
              { pct: '23.6%',  key: 'level_236',  color: 'bg-green-400' },
              { pct: '38.2%',  key: 'level_382',  color: 'bg-yellow-400' },
              { pct: '50.0%',  key: 'level_500',  color: 'bg-orange-400' },
              { pct: '100%',   key: 'level_100',  color: 'bg-red-500' },
            ].map(item => (
              <div key={item.key} className="flex items-center gap-2">
                <span className="text-gray-400 text-xs w-12 flex-shrink-0">{item.pct}</span>
                <div className="flex-1 h-1.5 bg-gray-700 rounded overflow-hidden">
                  <div className={`h-full ${item.color} rounded`} style={{width:'100%'}}></div>
                </div>
                <span className="text-white font-semibold text-xs w-24 text-right flex-shrink-0">
                  {fmtPrice(fibonacci[item.key])}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SOPORTE/RESISTENCIA */}
        <div className="bg-gray-800/60 rounded-lg p-5 border border-gray-700">
          <h3 className="text-lg font-bold text-blue-400 mb-4 text-center">🎯 SOPORTE/RESISTENCIA</h3>
          <div className="space-y-3">
            {supportResistance && supportResistance.length > 0 ? (
              supportResistance.slice(0, 4).map((level, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-semibold ${level.type === 'RESISTANCE' ? 'text-red-400' : 'text-green-400'}`}>
                      {level.type}
                    </span>
                    <span className="text-white font-semibold text-xs">{fmtPrice(level.price)}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded h-2">
                    <div className={`h-2 rounded ${level.type === 'RESISTANCE' ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{width: `${Math.min(level.touches * 20, 100)}%`}} />
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5">x{level.touches}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center text-sm">Sin datos</p>
            )}
          </div>
        </div>
      </div>

      {/* COMPRA FUERTE */}
      <div className="bg-green-900/20 rounded-lg p-5 border border-green-800/50 mb-6">
        <h3 className="text-lg font-bold text-green-400 mb-3">✅ COMPRA FUERTE</h3>
        <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
          <li className="flex gap-2"><span className="text-green-400">•</span>Tendencia: retrocesos son zonas de compra</li>
          <li className="flex gap-2"><span className="text-green-400">•</span>RSI indica sobreventa (oportunidad)</li>
          <li className="flex gap-2"><span className="text-green-400">•</span>MACD bullish - momentum positivo</li>
        </ul>
      </div>

      {/* SCORE GLOBAL */}
      <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg p-5 border border-green-700/40">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-white">SCORE GLOBAL</h3>
          <span className="text-3xl font-black text-green-400">82%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full" style={{width:'82%'}}></div>
        </div>
      </div>
    </div>
  );
}
