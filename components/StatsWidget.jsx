export default function StatsWidget({ icon, label, value, change, color = 'green' }) {
  const colorClasses = {
    green: 'text-green-400 border-green-500/30 hover:border-green-500',
    blue: 'text-blue-400 border-blue-500/30 hover:border-blue-500',
    purple: 'text-purple-400 border-purple-500/30 hover:border-purple-500',
    orange: 'text-orange-400 border-orange-500/30 hover:border-orange-500',
  };

  const isPositive = change >= 0;

  return (
    <div className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border ${colorClasses[color]} transition-all hover:shadow-lg hover:shadow-${color}-500/20`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs px-2 py-1 rounded ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {isPositive ? '+' : ''}{change?.toFixed(2)}%
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</p>
    </div>
  );
}
