import { useEffect, useState } from 'react';
import CryptoCard from '../components/CryptoCard';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAnalysis();
    const interval = setInterval(fetchAnalysis, 30000); // Refresh cada 30s
    return () => clearInterval(interval);
  }, []);

  async function fetchAnalysis() {
    try {
      setLoading(true);
      const res = await fetch('/api/analyze');
      const json = await res.json();
      if (json.success) {
        setData(json);
        setError(null);
      } else {
        setError(json.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-2 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Analizando criptomonedas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl mb-4">Error: {error}</p>
          <button 
            onClick={fetchAnalysis}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { stats, analysis } = data;
  const allCryptos = [...(analysis.top50 || []), ...(analysis.volatility || []), ...(analysis.stables || [])];
  
  let displayCryptos = allCryptos;
  if (filter === 'gainers') displayCryptos = stats.gainers || [];
  else if (filter === 'losers') displayCryptos = stats.losers || [];
  else if (filter === 'top50') displayCryptos = analysis.top50 || [];
  else if (filter === 'volatility') displayCryptos = analysis.volatility || [];
  else if (filter === 'stables') displayCryptos = analysis.stables || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
              CRYPTOCA16
            </h1>
            <p className="text-gray-400">Advanced Cryptocurrency Analysis System</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <p className="text-xs text-gray-400 mb-1">Avg Price (24h)</p>
              <p className="text-xl font-bold text-green-400">${stats.avgPrice}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <p className="text-xs text-gray-400 mb-1">Avg Change (24h)</p>
              <p className={`text-xl font-bold ${stats.avgChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.avgChange >= 0 ? '+' : ''}{stats.avgChange}%
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <p className="text-xs text-gray-400 mb-1">Total Volume</p>
              <p className="text-xl font-bold text-blue-400">${(stats.totalVolume / 1e9).toFixed(2)}B</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <p className="text-xs text-gray-400 mb-1">Analyzed</p>
              <p className="text-xl font-bold text-purple-400">{data.totalCryptos}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Filtros */}
      <div className="border-b border-gray-800 bg-black/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['all', 'top50', 'volatility', 'stables', 'gainers', 'losers'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  filter === f
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {f === 'all' ? '📊 Todas' : 
                 f === 'top50' ? '🏆 Top 50' :
                 f === 'volatility' ? '📈 Volatilidad' :
                 f === 'stables' ? '💎 Estables' :
                 f === 'gainers' ? '🚀 Ganadores' :
                 f === 'losers' ? '📉 Perdedores' : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {filter === 'all' ? 'Todas las Criptos' : 
             filter === 'top50' ? 'Top 50' :
             filter === 'volatility' ? 'Alta Volatilidad' :
             filter === 'stables' ? 'Stablecoins' :
             filter === 'gainers' ? 'Ganadores 🚀' :
             filter === 'losers' ? 'Perdedores 📉' : 'Análisis'}
          </h2>
          <p className="text-xs text-gray-500">
            Actualizado: {new Date(data.timestamp).toLocaleTimeString()}
          </p>
        </div>

        {/* Grid de Criptos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayCryptos.map(crypto => (
            <CryptoCard key={crypto.symbol} crypto={crypto} />
          ))}
        </div>

        {displayCryptos.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No hay datos disponibles para este filtro</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/50 mt-12 py-6 text-center text-gray-500 text-sm">
        <p>CRYPTOCA16 © 2026 | Datos actualizados cada 6 horas</p>
      </footer>
    </div>
  );
}
