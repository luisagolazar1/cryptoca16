export default function CryptoCard({ crypto }) {
  const isGainer = crypto.change24h >= 0;
  const priceChange = parseFloat(crypto.change24h);
  
  return (
    <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-5 border border-gray-700 hover:border-green-500 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors">{crypto.symbol}</h3>
          <p className="text-xs text-gray-500">24h Performance</p>
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
            <p className="text-xs text-gray-500 mb-1">Price</p>
            <p className="text-2xl font-bold text-white">${crypto.price.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Volume</p>
            <p className="text-sm text-gray-300">${(crypto.volume / 1e9).toFixed(2)}B</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${isGainer ? 'bg-gradient-to-r from-green-500 to-green-400' : 'bg-gradient-to-r from-red-500 to-red-400'}`}
            style={{width: `${Math.min(Math.abs(priceChange) * 3, 100)}%`}}
          />
        </div>

        {/* Additional info */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="bg-gray-700/30 rounded p-2">
            <p className="text-xs text-gray-500">Change</p>
            <p className={`text-sm font-semibold ${isGainer ? 'text-green-400' : 'text-red-400'}`}>
              {isGainer ? '+' : ''}{priceChange.toFixed(2)}%
            </p>
          </div>
          <div className="bg-gray-700/30 rounded p-2">
            <p className="text-xs text-gray-500">Status</p>
            <p className={`text-sm font-semibold ${isGainer ? 'text-green-400' : 'text-red-400'}`}>
              {isGainer ? 'Bull' : 'Bear'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
