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

      {/* MÉTRICAS PRINCIPALES - 5 COLUMNAS */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 w-full mb-6">
        <div className="bg-gray-800/50 backdrop-blur rounded-lg p-3 sm:p-4 border border-gray-700 text-center flex flex-col justify-center">
          <p className="text-gray-400 text-xs sm:text-xs mb-1 sm:mb-2 font-medium">TRADES</p>
          <p className="text-xl sm:text-2xl font-bold text-white">5</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur rounded-lg p-3 sm:p-4 border border-gray-700 text-center flex flex-col justify-center">
          <p className="text-gray-400 text-xs sm:text-xs mb-1 sm:mb-2 font-medium">WINS</p>
          <p className="text-xl sm:text-2xl font-bold text-green-400">3</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur rounded-lg p-3 sm:p-4 border border-gray-700 text-center flex flex-col justify-center">
          <p className="text-gray-400 text-xs sm:text-xs mb-1 sm:mb-2 font-medium">LOSERS</p>
          <p className="text-xl sm:text-2xl font-bold text-red-400">2</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur rounded-lg p-3 sm:p-4 border border-gray-700 text-center flex flex-col justify-center">
          <p className="text-gray-400 text-xs sm:text-xs mb-1 sm:mb-2 font-medium">SHARPE</p>
          <p className="text-xl sm:text-2xl font-bold text-green-400">1.8</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur rounded-lg p-3 sm:p-4 border border-gray-700 text-center flex flex-col justify-center">
          <p className="text-gray-400 text-xs sm:text-xs mb-1 sm:mb-2 font-medium">ROI</p>
          <p className="text-xl sm:text-2xl font-bold text-green-400">+8.2%</p>
        </div>
      </div>

      {/* FIBONACCI Y SOPORTE/RESISTENCIA - 2 COLUMNAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full mb-6">
        {/* FIBONACCI */}
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur rounded-lg p-6 border border-gray-700/50 w-full">
          <h3 className="text-lg sm:text-xl font-bold text-green-400 mb-4 text-center flex items-center justify-center gap-2">
            <span>📐</span> FIBONACCI
          </h3>
          <div className="space-y-3">
            {fibonacci ? (
              <>
                {[
                  { pct: '0.0%', key: 'level_0', color: 'bg-green-600' },
                  { pct: '23.6%', key: 'level_236', color: 'bg-green-500' },
                  { pct: '38.2%', key: 'level_382', color: 'bg-yellow-400' },
                  { pct: '50.0%', key: 'level_500', color: 'bg-yellow-600' },
                  { pct: '100%', key: 'level_100', color: 'bg-red-600' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center gap-2 w-full">
                    <span className="text-gray-400 text-xs sm:text-sm min-w-[40px]">{item.pct}</span>
                    <div className="flex-1 h-1 sm:h-1.5 bg-gray-700 rounded overflow-hidden">
                      <div className={`h-full ${item.color} rounded`}></div>
                    </div>
                    <span className="text-white font-semibold text-xs sm:text-sm min-w-[50px] text-right">
                      ${fibonacci[item.key]?.toFixed(2) || '0'}
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-gray-500 text-center text-sm">Cargando...</p>
            )}
          </div>
        </div>

        {/* SOPORTE/RESISTENCIA */}
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur rounded-lg p-6 border border-gray-700/50 w-full">
          <h3 className="text-lg sm:text-xl font-bold text-blue-400 mb-4 text-center flex items-center justify-center gap-2">
            <span>🎯</span> SOPORTE/RESISTENCIA
          </h3>
          <div className="space-y-3">
            {supportResistance && supportResistance.length > 0 ? (
              supportResistance.slice(0, 5).map((level, i) => (
                <div key={i} className="w-full">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-400 text-xs sm:text-sm">{level.type}</span>
                    <span className="text-white font-semibold text-xs sm:text-sm">${level.price?.toFixed(2) || '0'}</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded h-2">
                    <div 
                      className={`h-2 rounded ${level.type === 'RESISTANCE' ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{width: `${Math.min(level.touches * 20, 100)}%`}}
                    />
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5">x{level.touches}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center text-sm">Cargando niveles...</p>
            )}
          </div>
        </div>
      </div>

      {/* ANÁLISIS FUERTE */}
      <div className="bg-gradient-to-br from-green-800/30 to-gray-900/40 rounded-lg p-6 border border-green-700/50 w-full mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
          <span>✅</span> COMPRA FUERTE
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
          <li className="flex items-start gap-3">
            <span className="text-green-400 flex-shrink-0 mt-0.5">•</span>
            <span>Tendencia: Los retrocesos son zonas de compra</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400 flex-shrink-0 mt-0.5">•</span>
            <span>RSI indica sobreventa (oportunidad)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400 flex-shrink-0 mt-0.5">•</span>
            <span>MACD bullish - momentum positivo</span>
          </li>
        </ul>
      </div>

      {/* SCORE GLOBAL */}
      <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg p-6 border border-green-500/50 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-white text-center sm:text-left">SCORE GLOBAL</h3>
          <span className="text-3xl sm:text-4xl font-black text-green-400">82%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 sm:h-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-green-500 to-green-400 h-3 sm:h-4 rounded-full transition-all duration-500" 
            style={{width: '82%'}}
          ></div>
        </div>
      </div>
    </div>
  );
}
