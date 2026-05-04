import { exportToCSV, exportTradingReport, exportToHTML, generateTextReport } from '../lib/exportData';
import { getTradingLogs } from '../lib/database';

export default function ExportPanel({ cryptos, selectedCrypto, analysis }) {
  const handleExportCSV = () => {
    exportToCSV(cryptos);
  };

  const handleExportTradingLogs = () => {
    const logs = getTradingLogs();
    if (logs.length > 0) {
      exportTradingReport(logs);
    } else {
      alert('No hay logs de trading para exportar');
    }
  };

  const handleExportHTML = () => {
    if (selectedCrypto && analysis) {
      exportToHTML(selectedCrypto, analysis);
    } else {
      alert('Selecciona una criptomoneda primero');
    }
  };

  const handleExportText = () => {
    if (selectedCrypto && analysis) {
      const report = generateTextReport(selectedCrypto, analysis);
      const element = document.createElement('a');
      element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(report)}`);
      element.setAttribute('download', `${selectedCrypto.symbol}_report.txt`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      alert('Selecciona una criptomoneda primero');
    }
  };

  const handleExportJSON = () => {
    const data = {
      cryptos,
      exportDate: new Date().toISOString(),
    };
    const json = JSON.stringify(data, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', `data:application/json;charset=utf-8,${encodeURIComponent(json)}`);
    element.setAttribute('download', 'cryptoca16_data.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-gradient-to-br from-blue-800/30 to-gray-900 rounded-lg p-6 border border-blue-700">
      <h3 className="text-xl font-bold text-blue-400 mb-4">📥 EXPORTAR DATOS</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <button
          onClick={handleExportCSV}
          className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg font-semibold transition-all text-sm"
        >
          📊 CSV
        </button>
        
        <button
          onClick={handleExportJSON}
          className="px-4 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 rounded-lg font-semibold transition-all text-sm"
        >
          💾 JSON
        </button>
        
        <button
          onClick={handleExportHTML}
          className="px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 rounded-lg font-semibold transition-all text-sm"
        >
          📄 HTML
        </button>
        
        <button
          onClick={handleExportText}
          className="px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 rounded-lg font-semibold transition-all text-sm"
        >
          📝 TXT
        </button>
        
        <button
          onClick={handleExportTradingLogs}
          className="px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 rounded-lg font-semibold transition-all text-sm"
        >
          📈 Trading
        </button>

        <button
          onClick={() => window.print()}
          className="px-4 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 rounded-lg font-semibold transition-all text-sm"
        >
          🖨️ Imprimir
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Exporta tus datos en múltiples formatos. Los archivos se descargarán automáticamente.
      </p>
    </div>
  );
}
