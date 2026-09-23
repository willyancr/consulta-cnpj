/**
 * Auxiliares para análise e navegação dinâmica em JSON
 */

/**
 * Conta recursivamente o número de campos preenchidos e totais em um objeto/array
 */
export function calculateFilledStats(data) {
  let total = 0;
  let filled = 0;

  function traverse(value) {
    if (value === null || value === undefined) {
      total++;
      return;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        total++;
        return;
      }
      value.forEach(item => traverse(item));
      return;
    }

    if (typeof value === 'object') {
      const keys = Object.keys(value);
      if (keys.length === 0) {
        total++;
        return;
      }
      keys.forEach(k => {
        traverse(value[k]);
      });
      return;
    }

    // Valores primitivos
    total++;
    const str = String(value).trim();
    if (str !== '' && str !== 'null' && str !== 'undefined') {
      filled++;
    }
  }

  traverse(data);

  const percentage = total > 0 ? Math.round((filled / total) * 100) : 0;
  return { filled, total, percentage };
}

/**
 * Retorna o tipo semântico de um valor
 */
export function getValueType(value) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

/**
 * Filtra chaves de um objeto ou lista baseado em um termo de busca
 */
export function filterJsonTree(data, query) {
  if (!query || query.trim() === '') return data;
  const q = query.toLowerCase();

  function match(val) {
    if (val === null || val === undefined) return false;
    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
      return String(val).toLowerCase().includes(q);
    }
    if (Array.isArray(val)) {
      return val.some(item => match(item));
    }
    if (typeof val === 'object') {
      return Object.entries(val).some(([key, child]) => key.toLowerCase().includes(q) || match(child));
    }
    return false;
  }

  return match(data);
}
