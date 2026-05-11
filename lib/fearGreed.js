// Fear & Greed Index real - alternative.me
export async function getFearGreedIndex() {
  try {
    const res = await fetch('https://api.alternative.me/fng/?limit=7');
    const data = await res.json();
    return {
      current: {
        value: parseInt(data.data[0].value),
        label: data.data[0].value_classification,
        timestamp: data.data[0].timestamp,
      },
      history: data.data.map(d => ({
        value: parseInt(d.value),
        label: d.value_classification,
        date: new Date(d.timestamp * 1000).toLocaleDateString('es-AR'),
      })),
    };
  } catch(e) {
    return { current: { value: 50, label: 'Neutral', timestamp: Date.now() }, history: [] };
  }
}
