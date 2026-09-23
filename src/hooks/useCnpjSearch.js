import { useState, useCallback } from 'react';
import { fetchCnpj } from '../services/api';
import { validateCnpj, cleanCnpj } from '../utils/cnpjValidator';

export function useCnpjSearch({ onSearchSuccess } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fromCache, setFromCache] = useState(false);
  const [rateLimitWarning, setRateLimitWarning] = useState(null);
  const [lastSearchedCnpj, setLastSearchedCnpj] = useState('');

  const executeSearch = useCallback(async (cnpjInput, { forceRefresh = false } = {}) => {
    const cleaned = cleanCnpj(cnpjInput);

    // 1. Validação local prévia com dígitos verificadores
    const validation = validateCnpj(cleaned);
    if (!validation.isValid) {
      setError({
        title: 'CNPJ com Formato Inválido',
        message: validation.message,
        isValidationError: true
      });
      return false;
    }

    setLoading(true);
    setError(null);
    setRateLimitWarning(null);
    setLastSearchedCnpj(cleaned);

    try {
      const result = await fetchCnpj(cleaned, { forceRefresh });

      if (result.success) {
        setData(result.data);
        setFromCache(!!result.fromCache);
        setRateLimitWarning(result.rateLimitWarning || null);
        
        if (onSearchSuccess) {
          onSearchSuccess(result.data);
        }
        return true;
      } else {
        setError(result.error);
        return false;
      }
    } catch (err) {
      setError({
        title: 'Erro Inesperado',
        message: err.message || 'Ocorreu um erro ao processar a consulta.',
        status: 500
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [onSearchSuccess]);

  const refreshCurrent = useCallback(() => {
    if (lastSearchedCnpj) {
      return executeSearch(lastSearchedCnpj, { forceRefresh: true });
    }
  }, [lastSearchedCnpj, executeSearch]);

  const clearResults = useCallback(() => {
    setData(null);
    setError(null);
    setRateLimitWarning(null);
  }, []);

  return {
    data,
    setData,
    loading,
    error,
    fromCache,
    rateLimitWarning,
    lastSearchedCnpj,
    executeSearch,
    refreshCurrent,
    clearResults
  };
}
