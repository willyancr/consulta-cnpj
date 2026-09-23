import { useState, useEffect } from 'react';

const HISTORY_KEY = 'cnpj_history_list';
const MAX_HISTORY = 30;

export function useHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Falha ao salvar histórico:', e);
    }
  }, [history]);

  const addToHistory = (companyData) => {
    if (!companyData) return;
    const est = companyData.estabelecimento || {};
    const cnpj = est.cnpj || companyData.cnpj_raiz;
    if (!cnpj) return;

    const entry = {
      cnpj,
      razao_social: companyData.razao_social || 'Empresa',
      nome_fantasia: est.nome_fantasia || null,
      situacao: est.situacao_cadastral || 'Desconhecida',
      cidade: est.cidade?.nome || null,
      uf: est.estado?.sigla || null,
      searchedAt: new Date().toISOString()
    };

    setHistory(prev => {
      // Remove ocorrência anterior do mesmo CNPJ para colocar no topo
      const filtered = prev.filter(item => item.cnpj !== cnpj);
      return [entry, ...filtered].slice(0, MAX_HISTORY);
    });
  };

  const removeFromHistory = (cnpj) => {
    setHistory(prev => prev.filter(item => item.cnpj !== cnpj));
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {}
  };

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory
  };
}
