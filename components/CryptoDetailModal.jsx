import { generateSignal } from '../lib/technicalAnalysis';
import { generateHistoricalData } from '../lib/predictionImproved';
import { calculateFibonacci } from '../lib/advancedIndicators';
import { detectSupportResistance } from '../lib/patternDetection';
import ComprehensiveAnalysis from './ComprehensiveAnalysis';

export default function CryptoDetailModal({ crypto, onClose }) {
  if (!crypto) return null;

  try {
    const historicalData = generateHistoricalData(crypto, 90);
    const signal = generateSignal(crypto, historicalData);
    
    // Generar datos para análisis completo
    const fibonacci = calculateFibonacci(historicalData.prices);
    const supportResistance = detectSupportResistance(historicalData.prices);

    // Datos para backtesting (simulado)
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
      comparison: {
        strategyReturn: '8.2',
        buyHoldReturn: '5.5',
        outperformance: '2.7'
      }
    };

    const analyses = {
      fibonacci,
      supportResistance,
      technicalScore: 82,
      fundamentalScore: 85,
      signal
    };

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl max-w-5xl w-full max-h-[95vh] overflow-y-auto border border-gray-700" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="sticky top-0 bg-gray-900/95 backdrop-blur border-b border-gray-700 p-6 flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">{crypto.name}</h2>
              <p className="text-gray-400">{crypto.symbol} - ${crypto.price.toFixed(6)}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
          </div>

          {/* Content */}
          <div className="p-8">
            <ComprehensiveAnalysis 
              crypto={crypto}
              analyses={analyses}
              backtestData={backtestData}
              riskData={backtestData.risk}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in CryptoDetailModal:', error);
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-700">
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl mb-4">✕</button>
          <p className="text-red-400 font-semibold mb-2">Error al cargar análisis</p>
          <p className="text-gray-400 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }
}
