import React, { useState } from 'react';
import { HistoryIcon, StarIcon, TrashIcon, CloseIcon } from '../icons/Icons';
import { maskCnpj } from '../../utils/cnpjValidator';
import { SituacaoBadge } from '../common/Badge';

export function HistoryFavorites({ 
  history = [], 
  favorites = [], 
  onSelectCnpj, 
  onRemoveHistory, 
  onClearHistory, 
  onRemoveFavorite 
}) {
  const [activeTab, setActiveTab] = useState('history'); // 'history' | 'favorites'

  const hasHistory = history.length > 0;
  const hasFavorites = favorites.length > 0;

  if (!hasHistory && !hasFavorites) {
    return null;
  }

  const currentList = activeTab === 'history' ? history : favorites;

  return (
    <div className="mt-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm no-print">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
        {/* Abas */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <HistoryIcon className="w-3.5 h-3.5" />
            <span>Consultas Recentes ({history.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'favorites'
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <StarIcon className="w-3.5 h-3.5" filled={activeTab === 'favorites'} />
            <span>Favoritos ({favorites.length})</span>
          </button>
        </div>

        {/* Ação Limpar Histórico */}
        {activeTab === 'history' && hasHistory && (
          <button
            type="button"
            onClick={onClearHistory}
            className="text-xs text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1"
            title="Limpar todo o histórico de consultas"
          >
            <TrashIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Limpar histórico</span>
          </button>
        )}
      </div>

      {/* Lista Horizontal ou Grade de Itens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
        {currentList.length === 0 ? (
          <div className="col-span-full py-4 text-center text-xs text-slate-400">
            {activeTab === 'history' 
              ? 'Nenhuma consulta recente registrada ainda.' 
              : 'Nenhum CNPJ favoritado ainda. Clique na estrela ao lado da razão social para favoritar!'}
          </div>
        ) : (
          currentList.map((item) => (
            <div
              key={item.cnpj}
              className="group flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/60 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition-all text-left"
            >
              <button
                type="button"
                onClick={() => onSelectCnpj(item.cnpj)}
                className="flex-1 min-w-0 pr-2 text-left"
              >
                <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {item.razao_social}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    {maskCnpj(item.cnpj)}
                  </span>
                  {item.situacao && <SituacaoBadge situacao={item.situacao} />}
                </div>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (activeTab === 'history') {
                    onRemoveHistory(item.cnpj);
                  } else {
                    onRemoveFavorite(item.cnpj);
                  }
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                title={activeTab === 'history' ? 'Remover do histórico' : 'Remover dos favoritos'}
                aria-label="Remover item"
              >
                <CloseIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
