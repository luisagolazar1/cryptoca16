export default function TradingSignal({ signal }) {
  const getSignalStyle = () => {
    switch(signal.signal) {
      case 'STRONG BUY':
        return 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/50';
      case 'BUY':
        return 'bg-green-500/20 text-green-400 border border-green-500';
      case 'HOLD':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500';
      case 'SELL':
        return 'bg-red-500/20 text-red-400 border border-red-500';
      case 'STRONG SELL':
        return 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500';
    }
  };

  const getIcon = () => {
    if (signal.signal.includes('BUY')) return '🚀';
    if (signal.signal.includes('SELL')) return '📉';
    return '⏸️';
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Trading Signal</h3>
        <span className="text-2xl">{getIcon()}</span>
      </div>

      <div className={`px-6 py-4 rounded-lg font-bold text-center text-xl mb-4 ${getSignalStyle()}`}>
        {signal.signal}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Strength:</span>
          <span className="text-white font-semibold">{signal.strength}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Score:</span>
          <span className={signal.score > 0 ? 'text-green-400' : 'text-red-400'}>
            {signal.score > 0 ? '+' : ''}{signal.score}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">RSI:</span>
          <span className={`font-semibold ${
            signal.indicators.rsi < 30 ? 'text-green-400' :
            signal.indicators.rsi > 70 ? 'text-red-400' : 'text-gray-300'
          }`}>
            {signal.indicators.rsi.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-4">
        <p className="text-xs text-gray-500 mb-2">Key Factors:</p>
        <div className="space-y-1">
          {signal.reasons.slice(0, 3).map((reason, i) => (
            <div key={i} className="text-xs text-gray-400 flex items-center gap-2">
              <span className="text-green-400">•</span>
              {reason}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
