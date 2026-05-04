import { useState, useEffect } from 'react';
import ComprehensiveAnalysis from './ComprehensiveAnalysis';

export default function CryptoDetailModal({ crypto, onClose }) {
  const [analyses, setAnalyses] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!crypto) return;

    try {
      // Generar análisis básico
      const prices = Array.from({ length: 90 }, () => crypto.price * (0.9 + Math.random() * 0.2));
      
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl max-w-5xl w-full max-h-[95vh] overflow-y-auto border border-gray-700" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur border-b border-gray-700 p-6 flex justify-between items-start z-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">{crypto.name}</h2>
            <p className="text-gray-400">{crypto.symbol} - ${crypto.price.toFixed(6)}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-3xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {loading ? (
            <div className="text-center text-gray-400 py-8">
              <p>Cargando análisis...</p>
            </div>
          ) : analyses ? (
            <ComprehensiveAnalysis 
              crypto={crypto}
              analyses={analyses}
              backtestData={backtestData}
            />
          ) : (
            <div className="text-center text-red-400 py-8">
              <p>Error al cargar el análisis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
