import { useState, useEffect } from 'react';
import { alertManager, ALERT_TYPES } from '../lib/alertSystem';
import { saveAlert, getAllAlerts, deleteAlert } from '../lib/database';

export default function AlertPanel() {
  const [alerts, setAlerts] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [newAlert, setNewAlert] = useState({
    symbol: 'BTCUSDT',
    type: ALERT_TYPES.PRICE_ABOVE,
    value: 100000,
    browserNotification: true,
    emailNotification: false,
    telegramNotification: false,
  });

  useEffect(() => {
    setAlerts(getAllAlerts());
  }, []);

  const handleAddAlert = () => {
    const alertConfig = {
      ...newAlert,
      symbol: newAlert.symbol || 'BTCUSDT',
    };
    
    saveAlert(alertConfig);
    setAlerts(getAllAlerts());
    setShowNew(false);
    setNewAlert({
      symbol: 'BTCUSDT',
      type: ALERT_TYPES.PRICE_ABOVE,
      value: 100000,
      browserNotification: true,
      emailNotification: false,
      telegramNotification: false,
    });
  };

  const handleDeleteAlert = (alertId) => {
    deleteAlert(alertId);
    setAlerts(getAllAlerts());
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-green-400">🔔 MIS ALERTAS</h3>
        <button
          onClick={() => setShowNew(!showNew)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-all"
        >
          {showNew ? '✕' : '+ Nueva Alerta'}
        </button>
      </div>

      {showNew && (
        <div className="bg-gray-700/50 rounded-lg p-4 mb-4 border border-gray-600">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Símbolo</label>
              <input
                type="text"
                value={newAlert.symbol}
                onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value.toUpperCase() })}
                className="w-full bg-gray-800 text-white rounded px-3 py-2 border border-gray-600 focus:border-green-500 outline-none"
                placeholder="BTCUSDT"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Tipo</label>
              <select
                value={newAlert.type}
                onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                className="w-full bg-gray-800 text-white rounded px-3 py-2 border border-gray-600 focus:border-green-500 outline-none"
              >
                <option value={ALERT_TYPES.PRICE_ABOVE}>Precio Arriba</option>
                <option value={ALERT_TYPES.PRICE_BELOW}>Precio Abajo</option>
                <option value={ALERT_TYPES.CHANGE_PERCENT}>Cambio %</option>
                <option value={ALERT_TYPES.RSI_OVERBOUGHT}>RSI Sobrecomprado</option>
                <option value={ALERT_TYPES.RSI_OVERSOLD}>RSI Sobrevendido</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Valor</label>
              <input
                type="number"
                value={newAlert.value}
                onChange={(e) => setNewAlert({ ...newAlert, value: parseFloat(e.target.value) })}
                className="w-full bg-gray-800 text-white rounded px-3 py-2 border border-gray-600 focus:border-green-500 outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Email</label>
              <input
                type="email"
                value={newAlert.emailAddress || ''}
                onChange={(e) => setNewAlert({ ...newAlert, emailAddress: e.target.value })}
                className="w-full bg-gray-800 text-white rounded px-3 py-2 border border-gray-600 focus:border-green-500 outline-none"
                placeholder="opcional"
              />
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={newAlert.browserNotification}
                onChange={(e) => setNewAlert({ ...newAlert, browserNotification: e.target.checked })}
                className="w-4 h-4"
              />
              Navegador
            </label>
            <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={newAlert.emailNotification}
                onChange={(e) => setNewAlert({ ...newAlert, emailNotification: e.target.checked })}
                className="w-4 h-4"
              />
              Email
            </label>
            <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={newAlert.telegramNotification}
                onChange={(e) => setNewAlert({ ...newAlert, telegramNotification: e.target.checked })}
                className="w-4 h-4"
              />
              Telegram
            </label>
          </div>

          <button
            onClick={handleAddAlert}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-all"
          >
            ✓ Crear Alerta
          </button>
        </div>
      )}

      {alerts.length > 0 ? (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-gray-700/30 rounded-lg p-3 border border-gray-600 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">{alert.symbol}</p>
                <p className="text-sm text-gray-400">
                  {alert.type}: {alert.value}
                </p>
                <div className="flex gap-2 mt-1">
                  {alert.notifications.browser && <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded">🔔</span>}
                  {alert.notifications.email && <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded">✉️</span>}
                  {alert.notifications.telegram && <span className="text-xs bg-cyan-900 text-cyan-300 px-2 py-1 rounded">💬</span>}
                </div>
              </div>
              <button
                onClick={() => handleDeleteAlert(alert.id)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-all"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-4">No hay alertas configuradas</p>
      )}
    </div>
  );
}
