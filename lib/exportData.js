// SISTEMA DE EXPORTACIÓN PDF Y EXCEL

/**
 * Exportar análisis a CSV
 */
export function exportToCSV(cryptos, filename = 'cryptoca16_analisis.csv') {
  try {
    const headers = ['Símbolo', 'Nombre', 'Precio', 'Cambio 24h', 'Volumen', 'Señal'];
    const rows = cryptos.map(c => [
      c.symbol,
      c.name,
      c.price.toFixed(6),
      c.change24h.toFixed(2),
      (c.volume / 1e9).toFixed(2) + 'B',
      c.signal || 'N/A'
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    downloadFile(csv, filename, 'text/csv');
    return true;
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return false;
  }
}

/**
 * Exportar reporte de trading
 */
export function exportTradingReport(trades, filename = 'trading_report.csv') {
  try {
    const headers = ['Fecha', 'Símbolo', 'Tipo', 'Precio', 'Cantidad', 'Total', 'Razón'];
    const rows = trades.map(t => [
      new Date(t.timestamp).toLocaleString('es-AR'),
      t.symbol,
      t.type,
      t.price.toFixed(6),
      t.quantity.toFixed(4),
      (t.price * t.quantity).toFixed(2),
      t.reason || 'N/A'
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    downloadFile(csv, filename, 'text/csv');
    return true;
  } catch (error) {
    console.error('Error exporting trading report:', error);
    return false;
  }
}

/**
 * Exportar alertas configuradas
 */
export function exportAlerts(alerts, filename = 'alerts_backup.json') {
  try {
    const json = JSON.stringify(alerts, null, 2);
    downloadFile(json, filename, 'application/json');
    return true;
  } catch (error) {
    console.error('Error exporting alerts:', error);
    return false;
  }
}

/**
 * Generar reporte en texto plano
 */
export function generateTextReport(crypto, analysis) {
  const report = `
================================================================================
REPORTE DE ANÁLISIS - CRYPTOCA16
================================================================================

CRIPTOMONEDA: ${crypto.name} (${crypto.symbol})
FECHA: ${new Date().toLocaleString('es-AR')}

INFORMACIÓN ACTUAL
================================================================================
Precio: $${crypto.price.toFixed(6)}
Cambio 24h: ${crypto.change24h.toFixed(2)}%
Volumen: ${(crypto.volume / 1e9).toFixed(2)}B
Señal: ${analysis.signal || 'N/A'}

ANÁLISIS TÉCNICO
================================================================================
Score: ${analysis.technicalScore}/100
Fibonacci Levels:
  - 0%: ${analysis.fibonacci?.level_0?.toFixed(2) || 'N/A'}
  - 23.6%: ${analysis.fibonacci?.level_236?.toFixed(2) || 'N/A'}
  - 38.2%: ${analysis.fibonacci?.level_382?.toFixed(2) || 'N/A'}
  - 50%: ${analysis.fibonacci?.level_500?.toFixed(2) || 'N/A'}
  - 61.8%: ${analysis.fibonacci?.level_618?.toFixed(2) || 'N/A'}
  - 100%: ${analysis.fibonacci?.level_100?.toFixed(2) || 'N/A'}

SOPORTE/RESISTENCIA
================================================================================
${analysis.supportResistance?.map((s, i) => `${i + 1}. ${s.type}: $${s.price.toFixed(6)} (${s.touches} toques)`).join('\n')}

RECOMENDACIÓN
================================================================================
${analysis.recommendation || 'Análisis en proceso...'}

NOTAS
================================================================================
Este reporte es generado automáticamente por CRYPTOCA16.
Para más información, visita: https://cryptoca16.vercel.app

================================================================================
  `;
  
  return report;
}

/**
 * Descargar archivo
 */
function downloadFile(content, filename, mimeType) {
  const element = document.createElement('a');
  element.setAttribute('href', `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/**
 * Exportar a formato HTML (para impresión)
 */
export function exportToHTML(crypto, analysis) {
  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Análisis ${crypto.symbol}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: #111827;
      color: #f3f4f6;
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      border-bottom: 3px solid #10b981;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .title {
      font-size: 32px;
      font-weight: bold;
      color: #10b981;
    }
    .subtitle {
      color: #9ca3af;
      font-size: 14px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #10b981;
      margin-bottom: 15px;
      border-bottom: 2px solid #1f2937;
      padding-bottom: 10px;
    }
    .metric {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #1f2937;
    }
    .metric-label {
      color: #9ca3af;
    }
    .metric-value {
      font-weight: bold;
      color: #10b981;
    }
    .positive {
      color: #10b981;
    }
    .negative {
      color: #ef4444;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">CRYPTOCA16</div>
    <div class="subtitle">Análisis de ${crypto.name} (${crypto.symbol})</div>
    <div class="subtitle">Generado: ${new Date().toLocaleString('es-AR')}</div>
  </div>

  <div class="section">
    <div class="section-title">Información Actual</div>
    <div class="metric">
      <span class="metric-label">Precio</span>
      <span class="metric-value">$${crypto.price.toFixed(6)}</span>
    </div>
    <div class="metric">
      <span class="metric-label">Cambio 24h</span>
      <span class="metric-value ${crypto.change24h >= 0 ? 'positive' : 'negative'}">
        ${crypto.change24h >= 0 ? '+' : ''}${crypto.change24h.toFixed(2)}%
      </span>
    </div>
    <div class="metric">
      <span class="metric-label">Volumen</span>
      <span class="metric-value">${(crypto.volume / 1e9).toFixed(2)}B</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Análisis Técnico</div>
    <div class="metric">
      <span class="metric-label">Score</span>
      <span class="metric-value">${analysis.technicalScore || 0}/100</span>
    </div>
    <div class="metric">
      <span class="metric-label">Señal</span>
      <span class="metric-value">${analysis.signal || 'N/A'}</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Fibonacci Retracements</div>
    <div class="metric">
      <span class="metric-label">0.0%</span>
      <span class="metric-value">$${analysis.fibonacci?.level_0?.toFixed(6) || '0'}</span>
    </div>
    <div class="metric">
      <span class="metric-label">23.6%</span>
      <span class="metric-value">$${analysis.fibonacci?.level_236?.toFixed(6) || '0'}</span>
    </div>
    <div class="metric">
      <span class="metric-label">38.2%</span>
      <span class="metric-value">$${analysis.fibonacci?.level_382?.toFixed(6) || '0'}</span>
    </div>
    <div class="metric">
      <span class="metric-label">50.0%</span>
      <span class="metric-value">$${analysis.fibonacci?.level_500?.toFixed(6) || '0'}</span>
    </div>
    <div class="metric">
      <span class="metric-label">61.8%</span>
      <span class="metric-value">$${analysis.fibonacci?.level_618?.toFixed(6) || '0'}</span>
    </div>
    <div class="metric">
      <span class="metric-label">100.0%</span>
      <span class="metric-value">$${analysis.fibonacci?.level_100?.toFixed(6) || '0'}</span>
    </div>
  </div>
</body>
</html>
  `;

  downloadFile(html, `${crypto.symbol}_analisis.html`, 'text/html');
}
