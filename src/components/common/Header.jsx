import React from 'react';
import { BuildingIcon, SunIcon, MoonIcon, CompareIcon, SearchIcon } from '../icons/Icons';

export function Header({ 
  isDark, 
  onToggleTheme, 
  activeTab, 
  onTabChange 
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md no-print transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Nome */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <BuildingIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
                  Consulta CNPJ
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                  Receita Federal
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Consulta pública, análise cadastral e inteligência empresarial
              </p>
            </div>
          </div>

          {/* Navegação entre Consulta e Comparação */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => onTabChange('search')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'search'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              aria-label="Aba de Consulta Cadastral"
            >
              <SearchIcon className="w-4 h-4" />
              <span>Consulta</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('compare')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'compare'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              aria-label="Aba de Comparação de CNPJs"
            >
              <CompareIcon className="w-4 h-4" />
              <span>Comparar</span>
            </button>
          </div>

          {/* Ações (Dark Mode toggle) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isDark ? (
                <SunIcon className="w-5 h-5 text-amber-400" />
              ) : (
                <MoonIcon className="w-5 h-5 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
