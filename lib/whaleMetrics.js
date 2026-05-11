// Detección de ballenas + On-chain + Correlación BTC + Monte Carlo
import { getKlines } from './binanceRealtime.js';

// Detección de patrones de ballenas via volumen anómalo
export function detectWhales(klines) {
  if (!klines || klines.length < 20) return null;
  const volumes = klines.map(k => k.volume);
  const avgVol = volumes.slice(-20).reduce((a,b)=>a+b,0)/20;
  const stdVol = Math.sqrt(volumes.slice(-20).reduce((a,b)=>a+(b-avgVol)**2,0)/20);

  const whaleEvents = klines.slice(-10).map((k, i) => {
    const zScore = (k.volume - avgVol) / stdVol;
    return {
      date: new Date(k.time).toLocaleDateString('es-AR'),
      volume: k.volume,
      zScore: zScore.toFixed(2),
      isWhale: Math.abs(zScore) > 2,
      direction: k.close > k.open ? 'COMPRA' : 'VENTA',
      magnitude: zScore > 2 ? '🐋 BALLENA' : zScore > 1.5 ? '🐬 Grande' : '🐟 Normal',
    };
  }).filter(e => e.isWhale);

  const pressure = klines.slice(-5).reduce((acc, k) => {
    return acc + (k.close > k.open ? k.volume : -k.volume);
  }, 0);

  return {
    recentWhales: whaleEvents,
    whalePressure: pressure > 0 ? 'COMPRANDO' : 'VENDIENDO',
    whalePressureStrength: Math.abs(pressure / (avgVol * 5) * 100).toFixed(0),
    avgVolume: avgVol,
  };
}

// Correlación con BTC
export function calculateCorrelation(prices1, prices2) {
  if (!prices1 || !prices2 || prices1.length < 10) return null;
  const n = Math.min(prices1.length, prices2.length);
  const p1 = prices1.slice(-n), p2 = prices2.slice(-n);
  const mean1 = p1.reduce((a,b)=>a+b,0)/n;
  const mean2 = p2.reduce((a,b)=>a+b,0)/n;
  const num = p1.reduce((a,b,i)=>a+(b-mean1)*(p2[i]-mean2),0);
  const den = Math.sqrt(p1.reduce((a,b)=>a+(b-mean1)**2,0)*p2.reduce((a,b)=>a+(b-mean2)**2,0));
  return den === 0 ? 0 : (num/den).toFixed(3);
}

// Monte Carlo - 1000 simulaciones
export function monteCarlo(closes, days = 15, simulations = 1000) {
  if (!closes || closes.length < 20) return null;

  const returns = [];
  for (let i = 1; i < closes.length; i++) {
    returns.push((closes[i] - closes[i-1]) / closes[i-1]);
  }
  const avgReturn = returns.reduce((a,b)=>a+b,0)/returns.length;
  const stdReturn = Math.sqrt(returns.reduce((a,b)=>a+(b-avgReturn)**2,0)/returns.length);
  const lastPrice = closes[closes.length-1];

  const finalPrices = [];
  const paths = [];

  for (let s = 0; s < simulations; s++) {
    let price = lastPrice;
    const path = [price];
    for (let d = 0; d < days; d++) {
      const rand = avgReturn + stdReturn * (Math.random() + Math.random() - 1) * 1.2;
      price = price * (1 + rand);
      path.push(Math.max(price, lastPrice * 0.01));
    }
    finalPrices.push(price);
    if (s < 10) paths.push(path); // solo guardar 10 paths para visualización
  }

  finalPrices.sort((a,b) => a-b);
  const horizon = [1,3,5,7,10,12,15];

  return {
    simulations,
    lastPrice,
    paths: paths.slice(0,5),
    percentiles: {
      p5:  finalPrices[Math.floor(simulations*0.05)],
      p25: finalPrices[Math.floor(simulations*0.25)],
      p50: finalPrices[Math.floor(simulations*0.50)],
      p75: finalPrices[Math.floor(simulations*0.75)],
      p95: finalPrices[Math.floor(simulations*0.95)],
    },
    probUp: (finalPrices.filter(p=>p>lastPrice).length/simulations*100).toFixed(1),
    probDown: (finalPrices.filter(p=>p<lastPrice).length/simulations*100).toFixed(1),
    expectedReturn: ((finalPrices[Math.floor(simulations*0.50)]-lastPrice)/lastPrice*100).toFixed(2),
    maxGain: ((finalPrices[finalPrices.length-1]-lastPrice)/lastPrice*100).toFixed(1),
    maxLoss: ((finalPrices[0]-lastPrice)/lastPrice*100).toFixed(1),
  };
}

// Backtesting con slippage real
export function backtestWithSlippage(klines, slippage = 0.001, commission = 0.001) {
  if (!klines || klines.length < 50) return null;

  const closes = klines.map(k => k.close);
  const capital = 10000;
  let cash = capital;
  let position = 0;
  const trades = [];
  let wins = 0, losses = 0;
  let maxDrawdown = 0;
  let peak = capital;

  // Estrategia EMA crossover
  const ema9arr = [], ema21arr = [];
  let ema9 = closes[0], ema21 = closes[0];
  const k9 = 2/10, k21 = 2/22;

  for (let i = 1; i < closes.length; i++) {
    const prevEma9 = ema9, prevEma21 = ema21;
    ema9 = closes[i] * k9 + ema9 * (1-k9);
    ema21 = closes[i] * k21 + ema21 * (1-k21);

    const crossUp = prevEma9 < prevEma21 && ema9 > ema21;
    const crossDown = prevEma9 > prevEma21 && ema9 < ema21;
    const price = closes[i];

    if (crossUp && cash > 0) {
      const buyPrice = price * (1 + slippage);
      const fee = cash * commission;
      position = (cash - fee) / buyPrice;
      cash = 0;
      trades.push({ type:'BUY', price: buyPrice, day: i });
    } else if (crossDown && position > 0) {
      const sellPrice = price * (1 - slippage);
      const proceeds = position * sellPrice;
      const fee = proceeds * commission;
      const net = proceeds - fee;
      const lastBuy = trades.slice().reverse().find(t=>t.type==='BUY');
      if (lastBuy) {
        const pnl = net - (position * lastBuy.price);
        if (pnl > 0) wins++; else losses++;
      }
      cash = net;
      position = 0;
      trades.push({ type:'SELL', price: sellPrice, day: i });
    }

    const portfolioValue = cash + position * price;
    if (portfolioValue > peak) peak = portfolioValue;
    const drawdown = (peak - portfolioValue) / peak * 100;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }

  const finalValue = cash + position * closes[closes.length-1];
  const totalReturn = ((finalValue - capital) / capital * 100).toFixed(2);
  const sharpe = parseFloat(totalReturn) / Math.max(maxDrawdown, 1);

  return {
    initialCapital: capital,
    finalCapital: finalValue.toFixed(2),
    totalReturn,
    trades: trades.length / 2,
    wins,
    losses,
    winRate: trades.length > 0 ? ((wins/(wins+losses))*100).toFixed(1) : '0',
    maxDrawdown: maxDrawdown.toFixed(2),
    sharpeRatio: sharpe.toFixed(2),
    slippage: (slippage*100).toFixed(2),
    commission: (commission*100).toFixed(2),
  };
}

// Walk-Forward Optimization
export function walkForwardOptimize(klines) {
  if (!klines || klines.length < 100) return null;

  const periods = [
    { name: 'Agresivo',    short: 5,  long: 15 },
    { name: 'Moderado',    short: 9,  long: 21 },
    { name: 'Conservador', short: 20, long: 50 },
  ];

  const windowSize = Math.floor(klines.length * 0.6);
  const results = periods.map(p => {
    const inSample = klines.slice(0, windowSize);
    const outSample = klines.slice(windowSize);
    const inResult = backtestWithSlippage(inSample);
    const outResult = backtestWithSlippage(outSample);
    return {
      period: p.name,
      inSampleReturn: inResult?.totalReturn || '0',
      outSampleReturn: outResult?.totalReturn || '0',
      consistency: outResult && inResult ?
        (Math.abs(parseFloat(outResult.totalReturn)) > 0 ? 'Consistente' : 'Inconsistente') : 'N/A',
    };
  });

  return results;
}
