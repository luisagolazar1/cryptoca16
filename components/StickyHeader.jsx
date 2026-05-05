import { useState, useEffect } from 'react';

export default function StickyHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-40 transition-all duration-300 ease-out ${
        isScrolled ? 'bg-black/95 py-2' : 'bg-black py-6'
      } border-b border-gray-800`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {!isScrolled && (
          <>
            {/* Full Header */}
            <div className="mb-6">
              <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
                CRYPTOCA16
              </h1>
              <p className="text-gray-400 text-sm">
                Sistema Avanzado de Análisis de Criptomonedas
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-6">
              <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-700 text-center">
                <p className="text-gray-500 text-xs mb-1">PRECIO</p>
                <p className="text-xl sm:text-2xl font-bold text-green-400">$2920</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-700 text-center">
                <p className="text-gray-500 text-xs mb-1">CAMBIO</p>
                <p className="text-xl sm:text-2xl font-bold text-green-400">+2.48%</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-green-700/50 text-center">
                <p className="text-gray-500 text-xs mb-1">COMPRA</p>
                <p className="text-xl sm:text-2xl font-bold text-green-400">16</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-red-700/50 text-center">
                <p className="text-gray-500 text-xs mb-1">VENTA</p>
                <p className="text-xl sm:text-2xl font-bold text-red-400">9</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-yellow-700/50 text-center">
                <p className="text-gray-500 text-xs mb-1">HOLD</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-400">25</p>
              </div>
            </div>
          </>
        )}

        {isScrolled && (
          /* Compact Header */
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                CRYPTOCA16
              </h2>
              <p className="text-gray-500 text-xs">Análisis de Criptomonedas</p>
            </div>
            <div className="flex gap-3 text-right">
              <div className="text-center">
                <p className="text-gray-500 text-xs">COMPRA/VENTA</p>
                <p className="text-sm font-bold text-green-400">16 / <span className="text-red-400">9</span></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
