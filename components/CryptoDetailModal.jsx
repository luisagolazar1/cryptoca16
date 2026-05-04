import { useState, useEffect } from 'react';
import ComprehensiveAnalysis from './ComprehensiveAnalysis';

export default function CryptoDetailModal({ crypto, onClose }) {
  const [analyses, setAnalyses] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!crypto) return;

    try {
      const fibonacci = {
        level_0: crypto.price,
        level_236: crypto.price * 0.764,
        level_382: crypto.price * 0.618,
        level_500: crypto.price * 0.5,
        level_618: crypto.price * 0.382,
        level_100: crypto.price * 0,
      };

      const supportResistance = [
        { price: crypto.price * 1.05, type: 'RESISTANCE', touches: 5 },
        { price: crypto.price * 0.95, type: 'SUPPORT', touches: 4 },
        { price: crypto.price * 1.10, type: 'RESISTANCE', touches: 3 },
        { price: crypto.price * 0.85, type: 'SUPPORT', touches: 3 },
      ];

      setAnalyses({
        fibonacci,
        supportResistance,
        technicalScore: 82,
        fundamentalScore: 85,
      });
    } catch (error) {
      console.error('Error generating analyses:', error);
    } finally {
      setLoading(false);
    }
  }, [crypto]);

  if (!crypto) return null;

  const backtestData = {
    performance: {
      initialCapital: 10000,
      finalCapital: 10820,
      totalReturn: 8.2,
      trades: 5,
    },
    risk: {
      volatility: '2.5',
      sharpeRatio: '1.8',
      maxDrawdown: '-3.5',
      winRate: '65%'
    },
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto safe-area-inset"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl w-full max-w-3xl border border-gray-700 shadow-2xl my-4 sm:my-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Sticky */}
        <div className="sticky top-0 bg-gray-900/98 backdrop-blur border-b border-gray-700 px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-start gap-4 z-20">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{crypto.name}</h2>
            <p className="text-xs sm:text-sm text-gray-400 truncate">{crypto.symbol} - ${crypto.price.toFixed(6)}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-2xl sm:text-3xl leading-none flex-shrink-0 w-8 h-8 flex items-center justify-center hover:bg-gray-800 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          {loading ? (
            <div className="text-center text-gray-400 py-12 sm:py-16">
              <p className="text-sm sm:text-base">Cargando análisis...</p>
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border border-gray-700 border-t-green-500"></div>
              </div>
            </div>
          ) : analyses ? (
            <ComprehensiveAnalysis 
              crypto={crypto}
              analyses={analyses}
              backtestData={backtestData}
            />
          ) : (
            <div className="text-center text-red-400 py-12 sm:py-16">
              <p className="text-sm sm:text-base">Error al cargar el análisis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
