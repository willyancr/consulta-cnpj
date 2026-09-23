import React from 'react';
import { QUICK_EXAMPLES } from '../../types/cnpj';
import { BuildingIcon } from '../icons/Icons';

export function QuickExamples({ onSelectExample }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-slate-500 dark:text-slate-400">
      <span className="flex items-center gap-1 font-medium">
        <BuildingIcon className="w-3.5 h-3.5 text-blue-500" />
        <span>Exemplos rápidos:</span>
      </span>
      {QUICK_EXAMPLES.map((item) => (
        <button
          key={item.cnpj}
          type="button"
          onClick={() => onSelectExample(item.cnpj)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/80 dark:border-slate-700/60 transition-all font-medium active:scale-95"
          title={`Consultar ${item.name} (${item.cnpj})`}
        >
          <span>{item.name}</span>
          <span className="text-[10px] px-1 py-0.2 bg-slate-200 dark:bg-slate-700 rounded text-slate-500 dark:text-slate-400">
            {item.badge}
          </span>
        </button>
      ))}
    </div>
  );
}
