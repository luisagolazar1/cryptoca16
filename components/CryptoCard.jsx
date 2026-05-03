export default function CryptoCard({ crypto, signal }) {
  const isGainer = crypto.change24h >= 0;
  const priceChange = parseFloat(crypto.change24h);
  
  // Determinar color de señal
  const getSignalStyle = () => {
    if (signal && signal.includes('BUY')) {
      return { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400', label: signal.includes('STRONG') ? '🚀 COMPRA FUERTE' : '📈 COMPRAR' };
    } else if (signal && signal.includes('SELL')) {
      return { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400', label: signal.includes('STRONG') ? '⚠️ VENTA FUERTE' : '📉 VENDER' };
    } else {
      return { bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-400', label: '⏸️ MANTENER' };
    }
  };

  const signalStyle = getSignalStyle();
  
  return (
    <div className={`group bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-5 border-2 ${signalStyle.border} hover:shadow-xl hover:shadow-${signalStyle.border}/50 hover:-translate-y-1 transition-all duration-300`}>
      {/* Señal Badge */}
      <div className={`${signalStyle.bg} ${signalStyle.text} px-3 py-1 rounded-lg text-xs font-bold mb-3 text-center`}>
        {signalStyle.label}
      </div>

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors">{crypto.symbol}</h3>
          <p className="text-xs text-gray-500">{crypto.name || crypto.symbol}</p>
        </div>
        <div className={`text-right px-3 py-1 rounded-lg ${isGainer ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          <p className="text-sm font-bold">
            {isGainer ? '📈' : '📉'} {isGainer ? '+' : ''}{priceChange.toFixed(2)}%
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-gray-500 mb-1">Precio</p>
            <p className="text-2xl font-bold text-white">${crypto.price < 1 ? crypto.price.toFixed(6) : crypto.price.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Volumen</p>
            <p className="text-sm text-gray-300">${(crypto.volume / 1e9).toFixed(2)}B</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              signal && signal.includes('BUY') ? 'bg-gradient-to-r from-green-500 to-green-400' :
              signal && signal.includes('SELL') ? 'bg-gradient-to-r from-red-500 to-red-400' :
              'bg-gradient-to-r from-yellow-500 to-yellow-400'
            }`}
            style={{width: `${Math.min(Math.abs(priceChange) * 3, 100)}%`}}
          />
        </div>

        {/* Click para detalle */}
        <div className="pt-2 text-center">
          <p className="text-xs text-gray-500 group-hover:text-green-400 transition-colors">
            👆 Click para ver análisis completo
          </p>
        </div>
      </div>
    </div>
  );
}
