// SISTEMA DE ALERTAS

/**
 * Tipos de alertas
 */
export const AlertTypes = {
  PRICE_ABOVE: 'PRICE_ABOVE',
  PRICE_BELOW: 'PRICE_BELOW',
  PRICE_CHANGE: 'PRICE_CHANGE',
  VOLUME_SPIKE: 'VOLUME_SPIKE',
  SIGNAL_CHANGE: 'SIGNAL_CHANGE',
  PATTERN_DETECTED: 'PATTERN_DETECTED',
  RISK_WARNING: 'RISK_WARNING',
};

/**
 * Crear alerta de precio
 */
export function createPriceAlert(crypto, targetPrice, type = 'ABOVE') {
  return {
    id: generateAlertId(),
    cryptoSymbol: crypto.symbol,
    type: type === 'ABOVE' ? AlertTypes.PRICE_ABOVE : AlertTypes.PRICE_BELOW,
    targetPrice,
    currentPrice: crypto.price,
    createdAt: new Date().toISOString(),
    triggered: false,
  };
}

/**
 * Crear alerta de cambio de precio porcentual
 */
export function createPercentChangeAlert(crypto, percentThreshold, direction = 'UP') {
  return {
    id: generateAlertId(),
    cryptoSymbol: crypto.symbol,
    type: AlertTypes.PRICE_CHANGE,
    percentThreshold,
    direction,
    basePrice: crypto.price,
    createdAt: new Date().toISOString(),
    triggered: false,
  };
}

/**
 * Crear alerta de señal
 */
export function createSignalAlert(crypto, targetSignal) {
  return {
    id: generateAlertId(),
    cryptoSymbol: crypto.symbol,
    type: AlertTypes.SIGNAL_CHANGE,
    targetSignal, // 'BUY', 'SELL', 'HOLD', etc
    createdAt: new Date().toISOString(),
    triggered: false,
  };
}

/**
 * Verificar si una alerta debe activarse
 */
export function checkAlert(alert, currentData) {
  switch (alert.type) {
    case AlertTypes.PRICE_ABOVE:
      return currentData.price >= alert.targetPrice;
      
    case AlertTypes.PRICE_BELOW:
      return currentData.price <= alert.targetPrice;
      
    case AlertTypes.PRICE_CHANGE:
      const changePercent = ((currentData.price - alert.basePrice) / alert.basePrice) * 100;
      if (alert.direction === 'UP') {
        return changePercent >= alert.percentThreshold;
      } else {
        return changePercent <= -alert.percentThreshold;
      }
      
    case AlertTypes.VOLUME_SPIKE:
      return currentData.volume > alert.baseVolume * (1 + alert.spikeThreshold / 100);
      
    case AlertTypes.SIGNAL_CHANGE:
      return currentData.signal === alert.targetSignal;
      
    case AlertTypes.PATTERN_DETECTED:
      return currentData.pattern === alert.targetPattern;
      
    case AlertTypes.RISK_WARNING:
      return currentData.riskLevel === 'HIGH' || currentData.riskLevel === 'VERY_HIGH';
      
    default:
      return false;
  }
}

/**
 * Generar notificación para alerta activada
 */
export function generateNotification(alert, currentData) {
  let title = '';
  let message = '';
  let priority = 'NORMAL';
  
  switch (alert.type) {
    case AlertTypes.PRICE_ABOVE:
      title = `${alert.cryptoSymbol} - Precio Alcanzado`;
      message = `El precio ha superado $${alert.targetPrice}. Precio actual: $${currentData.price.toFixed(6)}`;
      priority = 'HIGH';
      break;
      
    case AlertTypes.PRICE_BELOW:
      title = `${alert.cryptoSymbol} - Precio Alcanzado`;
      message = `El precio ha caído por debajo de $${alert.targetPrice}. Precio actual: $${currentData.price.toFixed(6)}`;
      priority = 'HIGH';
      break;
      
    case AlertTypes.PRICE_CHANGE:
      const change = ((currentData.price - alert.basePrice) / alert.basePrice) * 100;
      title = `${alert.cryptoSymbol} - Cambio de Precio`;
      message = `Cambio de ${change.toFixed(2)}% desde $${alert.basePrice.toFixed(6)}`;
      priority = Math.abs(change) > 10 ? 'URGENT' : 'HIGH';
      break;
      
    case AlertTypes.SIGNAL_CHANGE:
      title = `${alert.cryptoSymbol} - Señal ${alert.targetSignal}`;
      message = `Nueva señal detectada: ${alert.targetSignal}`;
      priority = alert.targetSignal.includes('BUY') ? 'HIGH' : 'URGENT';
      break;
      
    case AlertTypes.PATTERN_DETECTED:
      title = `${alert.cryptoSymbol} - Patrón Detectado`;
      message = `Patrón ${alert.targetPattern} identificado`;
      priority = 'HIGH';
      break;
      
    case AlertTypes.RISK_WARNING:
      title = `${alert.cryptoSymbol} - Advertencia de Riesgo`;
      message = `Nivel de riesgo: ${currentData.riskLevel}`;
      priority = 'URGENT';
      break;
  }
  
  return {
    id: generateAlertId(),
    alertId: alert.id,
    title,
    message,
    priority,
    cryptoSymbol: alert.cryptoSymbol,
    timestamp: new Date().toISOString(),
    read: false,
  };
}

/**
 * Procesar múltiples alertas
 */
export function processAlerts(alerts, currentDataMap) {
  const triggeredNotifications = [];
  
  for (const alert of alerts) {
    if (alert.triggered) continue;
    
    const currentData = currentDataMap.get(alert.cryptoSymbol);
    if (!currentData) continue;
    
    if (checkAlert(alert, currentData)) {
      const notification = generateNotification(alert, currentData);
      triggeredNotifications.push(notification);
      alert.triggered = true;
      alert.triggeredAt = new Date().toISOString();
    }
  }
  
  return triggeredNotifications;
}

/**
 * Formatear alerta para Email
 */
export function formatEmailAlert(notification) {
  return {
    subject: `[CRYPTOCA16] ${notification.title}`,
    body: `
      ${notification.title}
      
      ${notification.message}
      
      Prioridad: ${notification.priority}
      Fecha: ${new Date(notification.timestamp).toLocaleString('es-AR')}
      
      ---
      CRYPTOCA16 - Sistema de Análisis de Criptomonedas
    `,
  };
}

/**
 * Formatear alerta para Telegram
 */
export function formatTelegramAlert(notification) {
  const emoji = 
    notification.priority === 'URGENT' ? '🚨' :
    notification.priority === 'HIGH' ? '⚠️' : 'ℹ️';
  
  return `${emoji} *${notification.title}*\n\n${notification.message}\n\n_${new Date(notification.timestamp).toLocaleString('es-AR')}_`;
}

/**
 * Sistema de alertas en memoria (simula DB)
 */
class AlertManager {
  constructor() {
    this.alerts = [];
    this.notifications = [];
  }
  
  addAlert(alert) {
    this.alerts.push(alert);
    return alert.id;
  }
  
  removeAlert(alertId) {
    this.alerts = this.alerts.filter(a => a.id !== alertId);
  }
  
  getAlerts() {
    return this.alerts;
  }
  
  getActiveAlerts() {
    return this.alerts.filter(a => !a.triggered);
  }
  
  checkAllAlerts(currentDataMap) {
    const newNotifications = processAlerts(this.alerts, currentDataMap);
    this.notifications.push(...newNotifications);
    return newNotifications;
  }
  
  getNotifications(unreadOnly = false) {
    return unreadOnly 
      ? this.notifications.filter(n => !n.read)
      : this.notifications;
  }
  
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) notification.read = true;
  }
}

function generateAlertId() {
  return 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Exportar instancia global
export const alertManager = new AlertManager();
