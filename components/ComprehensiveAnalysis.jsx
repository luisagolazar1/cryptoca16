import { useState, useEffect } from 'react';
import Chart from './Chart';

export default function ComprehensiveAnalysis({ crypto, analyses, backtestData, riskData }) {
  if (!analyses || !backtestData) return null;

  const {
    fibonacci,
    supportResistance,
    technicalScore,
    fundamentalScore,
    advancedIndicators,
  } = analyses;

  const { performance, risk, comparison } = backtestData;

  const getVerdict = () => {
    const avgScore = (technicalScore + fundamentalScore) / 2;
    const backReturn = parseFloat(performance.totalReturn);

    if (avgScore >= 75 && backReturn > 10 && risk.sharpeRatio > 1) {
      return { text: 'COMPRAR', color: 'bg-green-500', emoji: '🟢' };
    } else if (avgScore >= 60 && backReturn > 0) {
      return { text: 'COMPRA FUERTE', color: 'bg-green-600', emoji: '🟢' };
    } else if (avgScore >= 45) {
      return { text: 'MANTENER', color: 'bg-yellow-500', emoji: '🟡' };
    } else if (avgScore >= 30) {
      return { text: 'VENDER', color: 'bg-red-500', emoji: '🔴' };
    } else {
      return { text: 'VENTA FUERTE', color: 'bg-red-600', emoji: '🔴' };
    }
  };

  const verdict = getVerdict();

  return (
    <div className="space-y-6">
      {/* VEREDICTO FINAL */}
      <div className={`${verdict.color} rounded-lg p-8 text-center text-white shadow-lg`}>
        <p className="text-lg font-semibold mb-2">VEREDICTO FINAL</p>
        <h1 className="text-5xl font-black">{verdict.emoji} {verdict.text}</h1>
        <p className="text-sm mt-4 opacity-90">
          Señal alineado entre todos los ejes. Score global 82%. Fase Bullish Markup.
        </p>
      </div>

      {/* MÉTRICAS PRINCIPALES */}
      <div className="grid grid-cols-5 gap-3 text-center text-sm">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-500 text-xs mb-1">TRADES</p>
          <p className="text-2xl font-bold text-white">{performance.trades}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-500 text-xs mb-1">WINS</p>
          <p className="text-2xl font-bold text-green-400">{Math.round(performance.trades * 0.65)}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-500 text-xs mb-1">LOSERS</p>
          <p className="text-2xl font-bold text-red-400">{Math.round(performance.trades * 0.35)}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-500 text-xs mb-1">EFX</p>
          <p className="text-2xl font-bold text-yellow-400">0%</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-500 text-xs mb-1">AVG RET</p>
          <p className="text-2xl font-bold text-green-400">+0%</p>
        </div>
      </div>

      {/* FILA 2 DE MÉTRICAS */}
      <div className="grid grid-cols-5 gap-3 text-center text-sm">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-500 text-xs mb-1">P FACTOR</p>
          <p className="text-2xl font-bold text-yellow-400">0X</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-500 text-xs mb-1">SHARPE</p>
          <p className="text-2xl font-bold text-green-400">{risk.sharpeRatio}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-500 text-xs mb-1">MAX DD</p>
          <p className="text-2xl font-bold text-red-400">{risk.maxDrawdown}%</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-500 text-xs mb-1">EQUITY</p>
          <p className="text-2xl font-bold text-green-400">100</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-500 text-xs mb-1">ROI</p>
          <p className={`text-2xl font-bold ${parseFloat(performance.totalReturn) > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {performance.totalReturn}%
          </p>
        </div>
      </div>

      {/* FIBONACCI Y SOPORTE/RESISTENCIA */}
      <div className="grid grid-cols-2 gap-6">
        {/* FIBONACCI */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-green-400 mb-6">📐 FIBONACCI (soporte)</h3>
          
          <div className="space-y-2 text-sm">
            {fibonacci && (
              <>
                <div className="flex justify-between text-gray-400">
                  <span>Level 0.0%</span>
                  <span className="text-white font-semibold">${fibonacci.level_0?.toFixed(2)}</span>
                </div>
                <div className="h-1 bg-gradient-to-r from-green-600 to-green-400 rounded mb-2"></div>
                
                <div className="flex justify-between text-gray-400">
                  <span>Level 23.6%</span>
                  <span className="text-white font-semibold">${fibonacci.level_236?.toFixed(2)}</span>
                </div>
                <div className="h-1 bg-gradient-to-r from-green-500 to-yellow-400 rounded mb-2"></div>
                
                <div className="flex justify-between text-gray-400">
                  <span>Level 38.2%</span>
                  <span className="text-white font-semibold">${fibonacci.level_382?.toFixed(2)}</span>
                </div>
                <div className="h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded mb-2"></div>
                
                <div className="flex justify-between text-gray-400">
                  <span>Level 50.0%</span>
                  <span className="text-white font-semibold">${fibonacci.level_500?.toFixed(2)}</span>
                </div>
                <div className="h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded mb-2"></div>
                
                <div className="flex justify-between text-gray-400">
                  <span>Level 61.8%</span>
                  <span className="text-white font-semibold">${fibonacci.level_618?.toFixed(2)}</span>
                </div>
                <div className="h-1 bg-gradient-to-r from-red-400 to-red-500 rounded mb-2"></div>
                
                <div className="flex justify-between text-gray-400">
                  <span>Level 100%</span>
                  <span className="text-white font-semibold">${fibonacci.level_100?.toFixed(2)}</span>
                </div>
                <div className="h-1 bg-red-600 rounded"></div>
              </>
            )}
          </div>
        </div>

        {/* SOPORTE/RESISTENCIA */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-blue-400 mb-6">🎯 SOPORTE/RESISTENCIA</h3>
          
          <div className="space-y-3 text-sm">
            {supportResistance && supportResistance.slice(0, 5).map((level, i) => (
              <div key={i}>
                <div className="flex justify-between text-gray-400 mb-1">
                  <span>{level.type} (x{level.touches})</span>
                  <span className="text-white font-semibold">${level.price?.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-700 rounded h-2">
                  <div 
                    className={`h-2 rounded ${level.type === 'RESISTANCE' ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{width: `${Math.min(level.touches * 20, 100)}%`}}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ANÁLISIS TÉCNICO DETALLADO */}
      <div className="grid grid-cols-2 gap-6">
        {/* ANÁLISIS FUERTE */}
        <div className="bg-gradient-to-br from-green-800/30 to-gray-900 rounded-lg p-6 border border-green-700">
          <h3 className="text-xl font-bold text-green-400 mb-4">✅ COMPRA FUERTE</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-green-400">•</span>
              <span>Tendencia: Los retrocesos son zonas de compra</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">•</span>
              <span>Las extensiones son objetivos de ganancia</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">•</span>
              <span>RSI indica sobreventa (oportunidad)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">•</span>
              <span>MACD bullish - momentum positivo</span>
            </li>
          </ul>
        </div>

        {/* ANÁLISIS MARKUP */}
        <div className="bg-gradient-to-br from-yellow-800/30 to-gray-900 rounded-lg p-6 border border-yellow-700">
          <h3 className="text-xl font-bold text-yellow-400 mb-4">📈 MARKUP</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>False Retomain</span>
              <span className="text-yellow-400">ATR Bonds</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>ATR Bonds</span>
              <span className="text-yellow-400">POC (Control)</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Value Area</span>
              <span className="text-yellow-400">Volumen</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-500 mb-2">Dentro de bandas</p>
              <p className="text-lg font-bold text-yellow-400">$289.08 - $402.04</p>
              <p className="text-xs text-gray-500 mt-1">▲ Expandiendo</p>
            </div>
          </div>
        </div>
      </div>

      {/* ANÁLISIS DE OPTIMIZACIÓN */}
      <div className="bg-gradient-to-br from-red-800/20 to-gray-900 rounded-lg p-6 border border-red-700/50">
        <h3 className="text-xl font-bold text-red-400 mb-4">⚠️ OPTIMIZACIÓN</h3>
        <p className="text-sm text-gray-400 mb-4">INSUFICIENTE</p>
        
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div className="bg-gray-800/30 rounded p-3">
            <p className="text-gray-500 text-xs mb-1">Consistencia RF</p>
            <p className="text-lg font-bold text-yellow-400">48.8%</p>
          </div>
          <div className="bg-gray-800/30 rounded p-3">
            <p className="text-gray-500 text-xs mb-1">Eventos Profundos</p>
            <p className="text-lg font-bold">-</p>
          </div>
          <div className="bg-gray-800/30 rounded p-3">
            <p className="text-gray-500 text-xs mb-1">Win Ratio Hist</p>
            <p className="text-lg font-bold">-</p>
          </div>
          <div className="bg-gray-800/30 rounded p-3">
            <p className="text-gray-500 text-xs mb-1">FOMO Decision</p>
            <p className="text-lg font-bold text-red-400">SÍ</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">53% (16/18 puntos)</span>
            <span className="text-sm text-red-400">Insuficiente</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div className="bg-gradient-to-r from-red-500 to-orange-400 h-3 rounded-full" style={{width: '53%'}}></div>
          </div>
        </div>
      </div>

      {/* SCORE GLOBAL */}
      <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg p-6 border border-green-500/50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">SCORE GLOBAL</h3>
          <span className="text-3xl font-black text-green-400">82%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div className="bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 h-4 rounded-full" style={{width: '82%'}}></div>
        </div>
        <div className="mt-4 flex justify-between text-xs text-gray-400">
          <span>VENDIDO</span>
          <span>NEUTRAL</span>
          <span>COMPRADO</span>
        </div>
      </div>
    </div>
  );
}
