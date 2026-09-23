import React from 'react';
import { formatCurrency, formatBoolean } from '../../utils/formatters';
import { calculateFilledStats } from '../../utils/jsonHelpers';
import { Tooltip } from '../common/Tooltip';
import { TOOLTIPS } from '../../utils/tooltipsData';
import { BuildingIcon, UserGroupIcon, CheckCircleIcon } from '../icons/Icons';

export function MetricCards({ data }) {
  if (!data) return null;

  const capital = data.capital_social;
  const natureza = data.natureza_juridica?.descricao || 'Não informada';
  const porte = data.porte?.descricao || 'Não informado';
  const simples = data.simples?.simples;
  const mei = data.simples?.mei;
  const totalSocios = Array.isArray(data.socios) ? data.socios.length : 0;

  // Contador de campos preenchidos
  const stats = calculateFilledStats(data);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Card 1: Capital Social */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Capital Social
          </span>
          <Tooltip {...TOOLTIPS.capitalSocial} />
        </div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {formatCurrency(capital)}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Valor integralizado pelos sócios
        </p>
      </div>

      {/* Card 2: Porte & Natureza Jurídica */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Porte & Natureza
          </span>
          <Tooltip {...TOOLTIPS.naturezaJuridica} />
        </div>
        <div className="text-lg font-bold text-slate-900 dark:text-white truncate" title={porte}>
          {porte}
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-1" title={natureza}>
          {natureza}
        </p>
      </div>

      {/* Card 3: Regime Tributário (Simples / MEI) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Regime Tributário
          </span>
          <Tooltip {...TOOLTIPS.simplesNacional} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Simples Nacional:</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            formatBoolean(simples) === 'Sim'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
          }`}>
            {formatBoolean(simples)}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">MEI:</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            formatBoolean(mei) === 'Sim'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
          }`}>
            {formatBoolean(mei)}
          </span>
        </div>
      </div>

      {/* Card 4: Contador de Campos Preenchidos & QSA */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Completude de Dados
          </span>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
            {stats.percentage}%
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500" 
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{stats.filled} de {stats.total} campos preenchidos</span>
          <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
            <UserGroupIcon className="w-3.5 h-3.5 text-blue-500" />
            {totalSocios} {totalSocios === 1 ? 'sócio' : 'sócios'}
          </span>
        </div>
      </div>
    </div>
  );
}
