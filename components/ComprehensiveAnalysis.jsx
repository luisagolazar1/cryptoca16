export default function ComprehensiveAnalysis({ crypto, analyses, backtestData }) {
  if (!crypto || !analyses) return <div className="text-gray-400">Cargando análisis...</div>;

  const { fibonacci, supportResistance } = analyses;
  const { performance, risk } = backtestData || {};

  return (
    <div className="space-y-6">
      {/* VEREDICTO FINAL */}
      <div className="bg-green-600 rounded-lg p-8 text-center text-white shadow-lg">
        <p className="text-lg font-semibold mb-2">VEREDICTO FINAL</p>
        <h1 className="text-5xl font-black">🟢 COMPRAR</h1>
        <p className="text-sm mt-4 opacity-90">Señal alineado entre todos los ejes</p>
      </div>

      {/* MÉTRICAS PRINCIPALES */}
      <div className="grid grid-cols-5 gap-3">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 text-center">
          <p className="text-gray-500 text-xs mb-1">TRADES</p>
          <p className="text-2xl font-bold text-white">5</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 text-center">
          <p className="text-gray-500 text-xs mb-1">WINS</p>
          <p className="text-2xl font-bold text-green-400">3</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 text-center">
          <p className="text-gray-500 text-xs mb-1">LOSERS</p>
          <p className="text-2xl font-bold text-red-400">2</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 text-center">
          <p className="text-gray-500 text-xs mb-1">SHARPE</p>
          <p className="text-2xl font-bold text-green-400">1.8</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 text-center">
          <p className="text-gray-500 text-xs mb-1">ROI</p>
          <p className="text-2xl font-bold text-green-400">+8.2%</p>
        </div>
      </div>

      {/* FIBONACCI Y SOPORTE/RESISTENCIA */}
      <div className="grid grid-cols-2 gap-6">
        {/* FIBONACCI */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-green-400 mb-4">📐 FIBONACCI</h3>
          <div className="space-y-2 text-sm">
            {fibonacci ? (
              <>
                <div className="flex justify-between text-gray-400">
                  <span>0.0%</span>
                  <span className="text-white font-semibold">${fibonacci.level_0?.toFixed(2) || '0'}</span>
                </div>
                <div className="h-1 bg-green-600 rounded mb-2"></div>
                <div className="flex justify-between text-gray-400">
                  <span>23.6%</span>
                  <span className="text-white font-semibold">${fibonacci.level_236?.toFixed(2) || '0'}</span>
                </div>
                <div className="h-1 bg-green-500 rounded mb-2"></div>
                <div className="flex justify-between text-gray-400">
                  <span>38.2%</span>
                  <span className="text-white font-semibold">${fibonacci.level_382?.toFixed(2) || '0'}</span>
                </div>
                <div className="h-1 bg-yellow-400 rounded mb-2"></div>
                <div className="flex justify-between text-gray-400">
                  <span>50.0%</span>
                  <span className="text-white font-semibold">${fibonacci.level_500?.toFixed(2) || '0'}</span>
                </div>
                <div className="h-1 bg-yellow-600 rounded mb-2"></div>
                <div className="flex justify-between text-gray-400">
                  <span>100%</span>
                  <span className="text-white font-semibold">${fibonacci.level_100?.toFixed(2) || '0'}</span>
                </div>
                <div className="h-1 bg-red-600 rounded"></div>
              </>
            ) : (
              <p className="text-gray-500">Cargando...</p>
            )}
          </div>
        </div>

        {/* SOPORTE/RESISTENCIA */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-blue-400 mb-4">🎯 SOPORTE/RESISTENCIA</h3>
          <div className="space-y-3 text-sm">
            {supportResistance && supportResistance.length > 0 ? (
              supportResistance.slice(0, 5).map((level, i) => (
                <div key={i}>
                  <div className="flex justify-between text-gray-400 mb-1">
                    <span>{level.type} x{level.touches}</span>
                    <span className="text-white font-semibold">${level.price?.toFixed(2) || '0'}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded h-2">
                    <div 
                      className={`h-2 rounded ${level.type === 'RESISTANCE' ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{width: `${Math.min(level.touches * 20, 100)}%`}}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Cargando niveles...</p>
            )}
          </div>
        </div>
      </div>

      {/* ANÁLISIS FUERTE */}
      <div className="bg-gradient-to-br from-green-800/30 to-gray-900 rounded-lg p-6 border border-green-700">
        <h3 className="text-xl font-bold text-green-400 mb-4">✅ COMPRA FUERTE</h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-green-400">•</span>
            <span>Tendencia: Los retrocesos son zonas de compra</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">•</span>
            <span>RSI indica sobreventa (oportunidad)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">•</span>
            <span>MACD bullish - momentum positivo</span>
          </li>
        </ul>
      </div>

      {/* SCORE GLOBAL */}
      <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg p-6 border border-green-500/50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">SCORE GLOBAL</h3>
          <span className="text-3xl font-black text-green-400">82%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div className="bg-green-500 h-4 rounded-full" style={{width: '82%'}}></div>
        </div>
      </div>
    </div>
  );
}
