/**
 * lib/dataService.js
 * Servicio consolidado de datos con caché inteligente
 */

class CryptoDataService {
  constructor() {
    this.cache = { 
      data: null, 
      timestamp: 0,
      error: null 
    };
    this.TTL = 60 * 1000; // 1 minuto
    this.maxRetries = 3;
    this.retryDelay = 1000;
  }

  async fetchWithRetry(url, maxAttempts = this.maxRetries) {
    let lastError;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      } catch (err) {
        lastError = err;
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
        }
      }
    }
    throw new Error(`Failed after ${maxAttempts}: ${lastError.message}`);
  }

  async fetchCryptos() {
    const now = Date.now();
    if (this.cache.data && now - this.cache.timestamp < this.TTL) {
      return { data: this.cache.data, cached: true, age:
