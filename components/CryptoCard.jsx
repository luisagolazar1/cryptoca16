export default function CryptoCard({ crypto }) {
  const isGainer = crypto.change24h >= 0;
  
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 border border-gray-700 hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-white">{crypto.symbol}</h3>
          <p className="text-xs text-gray-400">24h Change</p>
        </div>
        <div className={`text-right ${isGainer ? 'text-green-400' : 'text-red-400'}`}>
          <p className="text-xl font-bold">
            {isGainer ? '+' : ''}{crypto.change24h.toFixed(2)}%
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Price:</span>
          <span className="text-white font-mono">${crypto.price.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Volume:</span>
          <span className="text-gray-300 font-mono text-xs">
            ${(crypto.volume / 1e9).toFixed(2)}B
          </span>
        </div>
      </div>
      
      <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${isGainer ? 'bg-green-500' : 'bg-red-500'}`}
          style={{width: `${Math.min(Math.abs(crypto.change24h), 100)}%`}}
        />
      </div>
    </div>
  );
}
