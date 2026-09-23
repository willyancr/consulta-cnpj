/**
 * Serviço de Cache Local (localStorage) para consultas de CNPJ
 * Reduz consumo de requisições e contorna o limite de 3 req/min da API pública
 */

const CACHE_PREFIX = 'cnpj_cache_';
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas

export const cacheService = {
  get(cnpj) {
    if (!cnpj) return null;
    const clean = String(cnpj).replace(/\D/g, '');
    try {
      const itemStr = localStorage.getItem(`${CACHE_PREFIX}${clean}`);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      const now = Date.now();

      if (now > item.expiresAt) {
        localStorage.removeItem(`${CACHE_PREFIX}${clean}`);
        return null;
      }

      return {
        data: item.data,
        cachedAt: item.cachedAt,
        fromCache: true
      };
    } catch (e) {
      console.warn('Erro ao ler do cache:', e);
      return null;
    }
  },

  set(cnpj, data, ttlMs = DEFAULT_TTL_MS) {
    if (!cnpj || !data) return;
    const clean = String(cnpj).replace(/\D/g, '');
    try {
      const now = Date.now();
      const payload = {
        data,
        cachedAt: now,
        expiresAt: now + ttlMs,
      };
      localStorage.setItem(`${CACHE_PREFIX}${clean}`, JSON.stringify(payload));
    } catch (e) {
      console.warn('Erro ao salvar no cache:', e);
    }
  },

  remove(cnpj) {
    if (!cnpj) return;
    const clean = String(cnpj).replace(/\D/g, '');
    localStorage.removeItem(`${CACHE_PREFIX}${clean}`);
  },

  clearAll() {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (e) {
      console.warn('Erro ao limpar cache:', e);
    }
  }
};
