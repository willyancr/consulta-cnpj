import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'cnpj_favorites_list';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Falha ao salvar favoritos:', e);
    }
  }, [favorites]);

  const isFavorite = (cnpj) => {
    if (!cnpj) return false;
    const clean = String(cnpj).replace(/\D/g, '');
    return favorites.some(f => String(f.cnpj).replace(/\D/g, '') === clean);
  };

  const toggleFavorite = (companyData) => {
    if (!companyData) return;
    const est = companyData.estabelecimento || {};
    const cnpj = est.cnpj || companyData.cnpj_raiz;
    if (!cnpj) return;

    const clean = String(cnpj).replace(/\D/g, '');

    setFavorites(prev => {
      const exists = prev.some(f => String(f.cnpj).replace(/\D/g, '') === clean);
      if (exists) {
        return prev.filter(f => String(f.cnpj).replace(/\D/g, '') !== clean);
      } else {
        const item = {
          cnpj,
          razao_social: companyData.razao_social || 'Empresa',
          nome_fantasia: est.nome_fantasia || null,
          situacao: est.situacao_cadastral || 'Desconhecida',
          cidade: est.cidade?.nome || null,
          uf: est.estado?.sigla || null,
          savedAt: new Date().toISOString()
        };
        return [item, ...prev];
      }
    });
  };

  const removeFavorite = (cnpj) => {
    const clean = String(cnpj).replace(/\D/g, '');
    setFavorites(prev => prev.filter(f => String(f.cnpj).replace(/\D/g, '') !== clean));
  };

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite
  };
}
