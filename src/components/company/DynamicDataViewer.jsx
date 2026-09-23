import React, { useState, useMemo } from 'react';
import { 
  ChevronDownIcon, 
  ChevronRightIcon, 
  SearchIcon, 
  FilterIcon,
  CodeIcon,
  CloseIcon
} from '../icons/Icons';
import { 
  formatCurrency, 
  formatDate, 
  formatCep, 
  formatBoolean, 
  maskCnpj 
} from '../../utils/formatters';

// Formatador inteligente para valores primitivos de acordo com a chave
function formatDynamicValue(key, value) {
  if (value === null || value === undefined) {
    return <span className="text-slate-400 italic">null</span>;
  }

  if (typeof value === 'boolean') {
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
        value ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
      }`}>
        {formatBoolean(value)}
      </span>
    );
  }

  const strKey = String(key).toLowerCase();
  const strVal = String(value);

  // Formatação de Capital Social / Valores Monetários
  if (strKey.includes('capital') || strKey.includes('valor')) {
    const num = parseFloat(strVal);
    if (!isNaN(num) && num > 0) {
      return <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(num)}</span>;
    }
  }

  // Formatação de Datas
  if (strKey.includes('data') || strKey.includes('atualizado_em')) {
    if (strVal.match(/^\d{4}-\d{2}-\d{2}/)) {
      return <span className="font-medium text-slate-800 dark:text-slate-200">{formatDate(strVal)}</span>;
    }
  }

  // Formatação de CEP
  if (strKey === 'cep') {
    return <span className="font-mono text-slate-800 dark:text-slate-200">{formatCep(strVal)}</span>;
  }

  // Formatação de CNPJ
  if (strKey === 'cnpj' && strVal.length === 14) {
    return <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">{maskCnpj(strVal)}</span>;
  }

  return <span className="text-slate-800 dark:text-slate-200 font-medium break-all">{strVal}</span>;
}

// Nó dinâmico recursivo
function DynamicNode({ label, value, level = 0, defaultOpen = false, searchTerm = '' }) {
  const [isOpen, setIsOpen] = useState(defaultOpen || level < 1);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const isArray = Array.isArray(value);
  const isObject = typeof value === 'object' && value !== null && !isArray;
  const isComplex = isArray || isObject;

  // Filtragem de busca
  const matchesSearch = useMemo(() => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const strLabel = String(label).toLowerCase();
    if (strLabel.includes(term)) return true;

    try {
      const jsonStr = JSON.stringify(value).toLowerCase();
      return jsonStr.includes(term);
    } catch {
      return false;
    }
  }, [label, value, searchTerm]);

  if (!matchesSearch) return null;

  // Formatação amigável do título da chave (ex: razao_social -> Razão Social)
  const readableLabel = String(label)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  if (!isComplex) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 px-3 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 rounded-xl transition-colors border-b border-slate-100 dark:border-slate-800/60 text-xs sm:text-sm">
        <span className="font-semibold text-slate-600 dark:text-slate-400 min-w-[200px] mb-1 sm:mb-0">
          {readableLabel}:
        </span>
        <div className="text-right sm:text-left flex-1 sm:pl-4">
          {formatDynamicValue(label, value)}
        </div>
      </div>
    );
  }

  // Lista simples (primitivos como strings/números)
  if (isArray && value.every(item => typeof item !== 'object' || item === null)) {
    return (
      <div className="py-2.5 px-3 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {readableLabel} ({value.length} itens):
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {value.length === 0 ? (
            <span className="text-xs text-slate-400 italic">Lista vazia</span>
          ) : (
            value.map((item, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                {String(item)}
              </span>
            ))
          )}
        </div>
      </div>
    );
  }

  // Listas de Objetos com Paginação
  if (isArray) {
    const totalItems = value.length;
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);
    const paginatedItems = value.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
      <div className="my-2 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/40">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3.5 bg-slate-100/60 dark:bg-slate-800/60 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors text-left"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2">
            {isOpen ? <ChevronDownIcon className="w-4 h-4 text-blue-500" /> : <ChevronRightIcon className="w-4 h-4 text-slate-400" />}
            <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              {readableLabel}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">
              {totalItems} {totalItems === 1 ? 'item' : 'itens'}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            {isOpen ? 'Recolher' : 'Expandir'}
          </span>
        </button>

        {isOpen && (
          <div className="p-3 sm:p-4 space-y-3">
            {totalItems === 0 ? (
              <p className="text-xs text-slate-400 italic">Nenhum registro encontrado nesta lista.</p>
            ) : (
              paginatedItems.map((child, idx) => {
                const itemIndex = (page - 1) * PAGE_SIZE + idx;
                return (
                  <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 block mb-2">
                      #{itemIndex + 1}
                    </span>
                    <DynamicNode value={child} level={level + 1} searchTerm={searchTerm} />
                  </div>
                );
              })
            )}

            {/* Paginação se tiver mais de 5 itens */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  Página {page} de {totalPages} ({totalItems} itens)
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300"
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Objeto Aninhado
  const keys = Object.keys(value);

  return (
    <div className={`my-2 ${level > 0 ? 'border border-slate-200/80 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/60 overflow-hidden' : ''}`}>
      {level > 0 && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2">
            {isOpen ? <ChevronDownIcon className="w-4 h-4 text-blue-500" /> : <ChevronRightIcon className="w-4 h-4 text-slate-400" />}
            <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              {readableLabel}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            {isOpen ? 'Recolher' : 'Expandir'}
          </span>
        </button>
      )}

      {(isOpen || level === 0) && (
        <div className={level > 0 ? 'p-3 space-y-1' : 'space-y-1'}>
          {keys.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Objeto vazio</p>
          ) : (
            keys.map(k => (
              <DynamicNode 
                key={k} 
                label={k} 
                value={value[k]} 
                level={level + 1} 
                searchTerm={searchTerm} 
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function DynamicDataViewer({ data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandKey, setExpandKey] = useState(0);

  if (!data || typeof data !== 'object') return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 mb-8 shadow-sm">
      {/* Header do componente dinâmico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <CodeIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Explorador Dinâmico de Dados
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Renderização adaptável e genérica de todos os campos retornados no JSON
            </p>
          </div>
        </div>

        {/* Barra de Busca de Campos */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <SearchIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar campos ou valores..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
            >
              <CloseIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Renderização da Árvore */}
      <div key={expandKey}>
        <DynamicNode value={data} level={0} searchTerm={searchTerm} defaultOpen={true} />
      </div>
    </div>
  );
}
