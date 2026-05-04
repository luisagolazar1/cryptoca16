// SISTEMA DE ALERTAS AVANZADO

/**
 * Tipos de alertas
 */
export const ALERT_TYPES = {
  PRICE_ABOVE: 'PRICE_ABOVE',
  PRICE_BELOW: 'PRICE_BELOW',
  CHANGE_PERCENT: 'CHANGE_PERCENT',
  SIGNAL_CHANGE: 'SIGNAL_CHANGE',
  RSI_OVERBOUGHT: 'RSI_OVERBOUGHT',
  RSI_OVERSOLD: 'RSI_OVERSOLD',
  VOLUME_SPIKE: 'VOLUME_SPIKE',
  FIBONACCI_LEVEL: 'FIBONACCI_LEVEL',
};

/**
 * Crear alerta
 */
export function createAlert(config) {
  return {
    id: Date.now().toString(),
    symbol: config.symbol,
    type: config.type,
    value: config.value,
    enabled: true,
    notifications: {
      browser: config.browserNotification !== false,
      email: config.emailNotification || false,
      telegram: config.telegramNotification || false,
    },
    emailAddress: config.emailAddress || '',
    telegramId: config.telegramId || '',
    createdAt: new Date().toISOString(),
    lastTriggered: null,
    triggerCount: 0,
  };
}

/**
 * Verificar si alerta debe dispararse
 */
export function checkAlert(alert, crypto, indicators) {
  if (!alert.enabled) return false;

  let shouldTrigger = false;

  switch (alert.type) {
    case ALERT_TYPES.PRICE_ABOVE:
      shouldTrigger = crypto.price > alert.value;
      break;
    
    case ALERT_TYPES.PRICE_BELOW:
      shouldTrigger = crypto.price < alert.value;
      break;
    
    case ALERT_TYPES.CHANGE_PERCENT:
      shouldTrigger = Math.abs(crypto.change24h) > alert.value;
      break;
    
    case ALERT_TYPES.SIGNAL_CHANGE:
      shouldTrigger = indicators.signal === alert.value;
      break;
    
    case ALERT_TYPES.RSI_OVERBOUGHT:
      shouldTrigger = indicators.rsi > 70;
      break;
    
    case ALERT_TYPES.RSI_OVERSOLD:
      shouldTrigger = indicators.rsi < 30;
      break;
    
    case ALERT_TYPES.VOLUME_SPIKE:
      shouldTrigger = crypto.volume > alert.value;
      break;
  }

  return shouldTrigger;
}

/**
 * Generar notificación
 */
export function generateNotification(alert, crypto) {
  const messages = {
    PRICE_ABOVE: `${crypto.symbol} alcanzó $${alert.value}`,
    PRICE_BELOW: `${crypto.symbol} bajó por debajo de $${alert.value}`,
    CHANGE_PERCENT: `${crypto.symbol} cambió ${crypto.change24h}%`,
    SIGNAL_CHANGE: `${crypto.symbol} cambió a señal ${alert.value}`,
    RSI_OVERBOUGHT: `${crypto.symbol} RSI en sobreventa`,
    RSI_OVERSOLD: `${crypto.symbol} RSI en sobreventa`,
    VOLUME_SPIKE: `${crypto.symbol} volumen aumentó a ${crypto.volume}`,
  };

  return {
    title: '🔔 ALERTA CRYPTOCA16',
    message: messages[alert.type] || 'Alerta disparada',
    symbol: crypto.symbol,
    price: crypto.price,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Enviar notificación por navegador
 */
export function sendBrowserNotification(notification) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(notification.title, {
      body: notification.message,
      icon: '🪙',
      tag: notification.symbol,
    });
  }
}

/**
 * Preparar email
 */
export function formatEmailAlert(notification, alert) {
  return {
    to: alert.emailAddress,
    subject: `${notification.title} - ${notification.symbol}`,
    body: `
      <h2>${notification.title}</h2>
      <p><strong>Símbolo:</strong> ${notification.symbol}</p>
      <p><strong>Mensaje:</strong> ${notification.message}</p>
      <p><strong>Precio:</strong> $${notification.price.toFixed(6)}</p>
      <p><strong>Hora:</strong> ${new Date(notification.timestamp).toLocaleString('es-AR')}</p>
      <p>---</p>
      <p>Recibiste esta alerta porque la configuraste en CRYPTOCA16</p>
    `,
  };
}

/**
 * Preparar mensaje Telegram
 */
export function formatTelegramAlert(notification, alert) {
  return {
    chatId: alert.telegramId,
    text: `🔔 ${notification.title}\n\n` +
          `${notification.symbol}\n` +
          `${notification.message}\n\n` +
          `💰 Precio: $${notification.price.toFixed(6)}\n` +
          `⏰ ${new Date(notification.timestamp).toLocaleString('es-AR')}`,
  };
}

/**
 * Sistema de alertas - Manejador principal
 */
export class AlertManager {
  constructor() {
    this.alerts = [];
    this.notificationHistory = [];
  }

  addAlert(alertConfig) {
    const alert = createAlert(alertConfig);
    this.alerts.push(alert);
    return alert;
  }

  removeAlert(alertId) {
    this.alerts = this.alerts.filter(a => a.id !== alertId);
  }

  checkAllAlerts(cryptos, indicators) {
    const triggeredAlerts = [];

    for (const alert of this.alerts) {
      const crypto = cryptos.find(c => c.symbol === alert.symbol);
      const cryptoIndicators = indicators[alert.symbol] || {};

      if (crypto && checkAlert(alert, crypto, cryptoIndicators)) {
        const notification = generateNotification(alert, crypto);
        triggeredAlerts.push({
          alert,
          notification,
          crypto,
        });

        // Registrar en historial
        this.notificationHistory.push({
          ...notification,
          alertId: alert.id,
        });

        // Actualizar última activación
        alert.lastTriggered = new Date().toISOString();
        alert.triggerCount++;
      }
    }

    return triggeredAlerts;
  }

  getNotificationHistory(limit = 50) {
    return this.notificationHistory.slice(-limit).reverse();
  }

  clearHistory() {
    this.notificationHistory = [];
  }

  exportAlerts() {
    return JSON.stringify(this.alerts, null, 2);
  }

  importAlerts(jsonString) {
    try {
      this.alerts = JSON.parse(jsonString);
      return true;
    } catch (error) {
      console.error('Error importing alerts:', error);
      return false;
    }
  }
}

/**
 * Instancia global del AlertManager
 */
export const alertManager = new AlertManager();

/**
 * Solicitar permisos de notificación
 */
export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}
