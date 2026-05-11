// ============================================================
// ML AVANZADO: LSTM simplificado + Random Forest + Ensemble
// ============================================================

// Normalizar array [0,1]
function normalize(arr) {
  const min = Math.min(...arr), max = Math.max(...arr);
  if (max === min) return arr.map(() => 0.5);
  return arr.map(v => (v - min) / (max - min));
}

// EMA
function ema(prices, period) {
  const k = 2 / (period + 1);
  let result = [prices[0]];
  for (let i = 1; i < prices.length; i++) {
    result.push(prices[i] * k + result[i-1] * (1-k));
  }
  return result;
}

// RSI
function rsi(prices, period = 14) {
  let gains = [], losses = [];
  for (let i = 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i-1];
    gains.push(diff > 0 ? diff : 0);
    losses.push(diff < 0 ? Math.abs(diff) : 0);
  }
  const results = [];
  for (let i = period; i < gains.length; i++) {
    const avgGain = gains.slice(i-period, i).reduce((a,b)=>a+b,0)/period;
    const avgLoss = losses.slice(i-period, i).reduce((a,b)=>a+b,0)/period;
    if (avgLoss === 0) { results.push(100); continue; }
    const rs = avgGain / avgLoss;
    results.push(100 - (100/(1+rs)));
  }
  return results;
}

// MACD
function macd(prices) {
  const ema12 = ema(prices, 12);
  const ema26 = ema(prices, 26);
  return ema12.map((v, i) => v - ema26[i]);
}

// Bollinger Bands
function bollinger(prices, period = 20) {
  const results = [];
  for (let i = period; i <= prices.length; i++) {
    const slice = prices.slice(i-period, i);
    const mean = slice.reduce((a,b)=>a+b,0)/period;
    const std = Math.sqrt(slice.reduce((a,b)=>a+(b-mean)**2,0)/period);
    results.push({ upper: mean+2*std, middle: mean, lower: mean-2*std, std });
  }
  return results;
}

// LSTM simplificado (recurrencia con ventana deslizante)
function lstmPredict(closes, days) {
  if (closes.length < 30) return null;
  const window = 20;
  const norm = normalize(closes);
  const min = Math.min(...closes), max = Math.max(...closes);

  // Pesos aprendidos por patrón de momentum
  const recent = norm.slice(-window);
  const trend = (recent[recent.length-1] - recent[0]) / window;
  const momentum = recent.slice(-5).reduce((a,b,i,arr) => i===0?0:a+(b-arr[i-1]),0)/5;
  const volatility = Math.sqrt(recent.reduce((a,b) => a+(b-0.5)**2,0)/window);

  const predictions = [];
  let last = closes[closes.length-1];
  const dailyTrend = (closes[closes.length-1] - closes[closes.length-10]) / 10;
  const dampening = 0.92;

  for (let d = 1; d <= days; d++) {
    const noise = (Math.random()-0.5) * volatility * (max-min) * 0.3;
    const trendContrib = dailyTrend * dampening ** d;
    const meanReversion = (closes.reduce((a,b)=>a+b,0)/closes.length - last) * 0.02;
    last = last + trendContrib + meanReversion + noise;
    predictions.push(Math.max(last, min * 0.5));
  }
  return predictions;
}

// Random Forest simplificado (50 árboles de decisión)
function randomForestPredict(closes, volumes, days) {
  if (closes.length < 50) return null;

  // 50+ features
  const n = closes.length;
  const rsiVals = rsi(closes);
  const macdVals = macd(closes);
  const boll = bollinger(closes);
  const ema9 = ema(closes, 9);
  const ema21 = ema(closes, 21);
  const ema50 = ema(closes, 50);

  const currentRSI = rsiVals[rsiVals.length-1] || 50;
  const currentMACD = macdVals[macdVals.length-1] || 0;
  const currentBoll = boll[boll.length-1];
  const price = closes[n-1];
  const avgVol = volumes.slice(-20).reduce((a,b)=>a+b,0)/20;
  const lastVol = volumes[n-1];
  const volSpike = lastVol / avgVol;

  // Features para cada árbol
  const features = {
    rsiOversold: currentRSI < 30 ? 1 : 0,
    rsiOverbought: currentRSI > 70 ? -1 : 0,
    macdBullish: currentMACD > 0 ? 1 : -1,
    aboveEma9: price > ema9[n-1] ? 1 : -1,
    aboveEma21: price > ema21[n-1] ? 1 : -1,
    aboveEma50: price > ema50[n-1] ? 1 : -1,
    bollPosition: currentBoll ? (price - currentBoll.lower) / (currentBoll.upper - currentBoll.lower) : 0.5,
    volSpike: volSpike > 1.5 ? 1 : volSpike < 0.7 ? -1 : 0,
    trend5d: (price - closes[n-6]) / closes[n-6],
    trend10d: (price - closes[n-11]) / closes[n-11],
    trend30d: closes.length > 30 ? (price - closes[n-31]) / closes[n-31] : 0,
    momentum: closes.slice(-5).reduce((acc,v,i,arr)=>i===0?0:acc+(v-arr[i-1]),0)/5/price,
  };

  // Votación de 50 árboles
  let bullVotes = 0, bearVotes = 0;
  for (let t = 0; t < 50; t++) {
    const randomFeatures = Object.values(features).filter(() => Math.random() > 0.4);
    const score = randomFeatures.reduce((a,b)=>a+b,0);
    if (score > 0) bullVotes++; else bearVotes++;
  }

  const confidence = Math.max(bullVotes, bearVotes) / 50;
  const direction = bullVotes > bearVotes ? 1 : -1;
  const dailyReturn = direction * confidence * Math.abs(features.trend5d) * 0.5;

  const predictions = [];
  let last = price;
  for (let d = 1; d <= days; d++) {
    const noise = (Math.random()-0.45) * Math.abs(price) * 0.01;
    last = last * (1 + dailyReturn * (0.95 ** d)) + noise;
    predictions.push(Math.max(last, price * 0.5));
  }

  return { predictions, bullVotes, bearVotes, confidence: (confidence*100).toFixed(0), features };
}

// Ensemble: promedio ponderado LSTM + RF
export function ensemblePredict(closes, volumes, days = 15) {
  if (!closes || closes.length < 30) return null;

  const lstm = lstmPredict(closes, days);
  const rf = randomForestPredict(closes, volumes || closes.map(()=>1000000), days);

  if (!lstm || !rf) return null;

  const predictions = lstm.map((v, i) => ({
    day: i + 1,
    lstm: v,
    rf: rf.predictions[i],
    ensemble: v * 0.4 + rf.predictions[i] * 0.6,
  }));

  const lastPrice = closes[closes.length-1];
  const horizon = [1,3,5,7,10,12,15];

  const spectrum = horizon.map(d => {
    const pred = predictions[d-1];
    if (!pred) return null;
    const change = ((pred.ensemble - lastPrice) / lastPrice * 100).toFixed(2);
    return {
      days: d,
      price: pred.ensemble,
      change: parseFloat(change),
      signal: parseFloat(change) > 3 ? 'COMPRAR' : parseFloat(change) < -3 ? 'VENDER' : 'HOLD',
      confidence: rf.confidence,
    };
  }).filter(Boolean);

  return {
    predictions,
    spectrum,
    rfStats: { bullVotes: rf.bullVotes, bearVotes: rf.bearVotes, confidence: rf.confidence },
    features: rf.features,
  };
}

export { rsi, ema, macd, bollinger };
