import React from 'react';
import { BuildingIcon } from '../icons/Icons';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 py-8 no-print transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <BuildingIcon className="w-4 h-4 text-blue-500" />
          <span>Consulta CNPJ • Base de dados pública da Receita Federal</span>
        </div>
        <div className="flex items-center gap-4">
          <span>API publica.cnpj.ws</span>
          <span>•</span>
          <span>Cache inteligente e offline</span>
          <span>•</span>
          <span>Respeito ao rate limit (3 req/min)</span>
        </div>
      </div>
    </footer>
  );
}
