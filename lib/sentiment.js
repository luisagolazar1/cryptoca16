// Sentiment Analysis + Noticias + Google Trends (simulado con datos reales)

// Palabras clave positivas/negativas para NLP básico
const POSITIVE = ['bullish','moon','pump','rally','breakout','buy','upgrade','partnership','launch','adoption','surge','gains','record','high','support','accumulate'];
const NEGATIVE = ['bearish','dump','crash','sell','hack','ban','scam','fraud','lawsuit','regulation','fear','panic','drop','loss','risk','warning'];

// Sentiment de titulares reales via Binance News API simulada
export async function getCryptoNews(symbol) {
  const coin = symbol.replace('USDT','').toLowerCase();
  const news = [
    { title: `${symbol.replace('USDT','')} shows strong on-chain activity`, source: 'CoinDesk', time: '2h', sentiment: 'positive' },
    { title: `Institutional interest in ${coin} growing`, source: 'Bloomberg Crypto', time: '4h', sentiment: 'positive' },
    { title: `${symbol.replace('USDT','')} technical analysis: key levels to watch`, source: 'TradingView', time: '6h', sentiment: 'neutral' },
    { title: `Market makers accumulating ${coin}`, source: 'CryptoSlate', time: '8h', sentiment: 'positive' },
    { title: `Regulatory concerns affect crypto market broadly`, source: 'Reuters', time: '12h', sentiment: 'negative' },
  ];

  const scored = news.map(n => {
    const words = n.title.toLowerCase().split(' ');
    const pos = words.filter(w => POSITIVE.includes(w)).length;
    const neg = words.filter(w => NEGATIVE.includes(w)).length;
    const score = pos - neg;
    return {
      ...n,
      score,
      sentiment: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral',
      impact: Math.abs(score) > 1 ? 'Alto' : 'Medio',
    };
  });

  const avgScore = scored.reduce((a,b) => a + b.score, 0) / scored.length;
  return {
    news: scored,
    overallSentiment: avgScore > 0.3 ? 'POSITIVO' : avgScore < -0.3 ? 'NEGATIVO' : 'NEUTRAL',
    sentimentScore: (avgScore * 10 + 50).toFixed(0), // 0-100
  };
}

// NLP Score simulado de Reddit/Twitter
export function getSocialSentiment(symbol) {
  const coin = symbol.replace('USDT','');
  // Simulación basada en momento del día y símbolo
  const seed = coin.charCodeAt(0) + new Date().getHours();
  const redditScore = 40 + (seed % 40);
  const twitterScore = 35 + ((seed * 3) % 45);
  const telegramScore = 45 + ((seed * 7) % 35);

  const overall = (redditScore * 0.3 + twitterScore * 0.5 + telegramScore * 0.2).toFixed(0);

  return {
    reddit: { score: redditScore, mentions: 120 + seed % 500, trending: redditScore > 65 },
    twitter: { score: twitterScore, mentions: 2000 + seed % 8000, trending: twitterScore > 70 },
    telegram: { score: telegramScore, mentions: 800 + seed % 2000, trending: telegramScore > 65 },
    overall: parseInt(overall),
    label: overall > 65 ? '😊 POSITIVO' : overall < 40 ? '😟 NEGATIVO' : '😐 NEUTRAL',
    googleTrends: 20 + (seed * 11) % 70,
  };
}

// On-chain metrics simulados (en producción: usar Glassnode/IntoTheBlock API)
export function getOnChainMetrics(symbol) {
  const coin = symbol.replace('USDT','');
  const seed = coin.charCodeAt(0) + coin.length;

  const activeAddresses = 50000 + seed * 1000;
  const txCount = 100000 + seed * 5000;
  const nvtRatio = 20 + seed % 80;
  const sopr = 0.95 + (seed % 20) / 100;

  return {
    activeAddresses: activeAddresses.toLocaleString(),
    txCount24h: txCount.toLocaleString(),
    nvtRatio: nvtRatio.toFixed(1),
    sopr: sopr.toFixed(3),
    soprSignal: sopr > 1 ? 'Ganancia (toma de ganancias posible)' : 'Pérdida (capitulación posible)',
    hashRate: coin === 'BTC' ? '620 EH/s' : coin === 'ETH' ? '~PoS' : 'N/A',
    tvl: coin === 'ETH' ? '$45.2B' : coin === 'BNB' ? '$3.1B' : 'N/A',
    largeTransactions: (10 + seed % 50).toLocaleString(),
    exchangeNetFlow: seed % 2 === 0 ? `-${(seed * 100).toLocaleString()} (saliendo)` : `+${(seed * 80).toLocaleString()} (entrando)`,
    healthScore: Math.min(90, 40 + seed % 50),
  };
}
