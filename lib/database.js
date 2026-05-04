// SISTEMA DE BASE DE DATOS (localStorage + simulación de persistencia)

/**
 * Guardar histórico de criptomoneda
 */
export function saveHistorical(symbol, data) {
  try {
    const key = `historical_${symbol}`;
    const stored = {
      symbol,
      prices: data.prices,
      volumes: data.volumes,
      timestamps: data.timestamps,
      lastUpdate: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(stored));
    return true;
  } catch (error) {
    console.error('Error saving historical:', error);
    return false;
  }
}

/**
 * Obtener histórico de criptomoneda
 */
export function getHistorical(symbol) {
  try {
    const key = `historical_${symbol}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting historical:', error);
    return null;
  }
}

/**
 * Guardar predicciones
 */
export function savePrediction(symbol, prediction) {
  try {
    const key = `prediction_${symbol}`;
    const stored = {
      symbol,
      prediction,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(stored));
    return true;
  } catch (error) {
    console.error('Error saving prediction:', error);
    return false;
  }
}

/**
 * Obtener predicciones guardadas
 */
export function getPrediction(symbol) {
  try {
    const key = `prediction_${symbol}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting prediction:', error);
    return null;
  }
}

/**
 * Guardar alertas
 */
export function saveAlert(alert) {
  try {
    const alerts = getAllAlerts();
    alerts.push({
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('alerts', JSON.stringify(alerts));
    return true;
  } catch (error) {
    console.error('Error saving alert:', error);
    return false;
  }
}

/**
 * Obtener todas las alertas
 */
export function getAllAlerts() {
  try {
    const data = localStorage.getItem('alerts');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting alerts:', error);
    return [];
  }
}

/**
 * Eliminar alerta
 */
export function deleteAlert(alertId) {
  try {
    const alerts = getAllAlerts();
    const filtered = alerts.filter(a => a.id !== alertId);
    localStorage.setItem('alerts', JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting alert:', error);
    return false;
  }
}

/**
 * Guardar trading log
 */
export function saveTradingLog(trade) {
  try {
    const logs = getTradingLogs();
    logs.push({
      ...trade,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('trading_logs', JSON.stringify(logs));
    return true;
  } catch (error) {
    console.error('Error saving trading log:', error);
    return false;
  }
}

/**
 * Obtener logs de trading
 */
export function getTradingLogs() {
  try {
    const data = localStorage.getItem('trading_logs');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting trading logs:', error);
    return [];
  }
}

/**
 * Guardar configuración de usuario
 */
export function saveUserConfig(config) {
  try {
    localStorage.setItem('user_config', JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Error saving config:', error);
    return false;
  }
}

/**
 * Obtener configuración de usuario
 */
export function getUserConfig() {
  try {
    const data = localStorage.getItem('user_config');
    return data ? JSON.parse(data) : {
      theme: 'dark',
      notifications: true,
      emailAlerts: false,
      telegramAlerts: false,
    };
  } catch (error) {
    console.error('Error getting config:', error);
    return {};
  }
}

/**
 * Exportar todos los datos
 */
export function exportAllData() {
  const data = {
    alerts: getAllAlerts(),
    tradingLogs: getTradingLogs(),
    userConfig: getUserConfig(),
    exportDate: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

/**
 * Limpiar base de datos
 */
export function clearDatabase() {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing database:', error);
    return false;
  }
}
