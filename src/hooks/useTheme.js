import { useState, useEffect } from 'react';

/**
 * Hook para gerenciamento de Dark Mode
 * Sincroniza com a classe 'dark' no elemento raiz html e salva a preferência no localStorage
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('cnpj_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('cnpj_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme
  };
}
