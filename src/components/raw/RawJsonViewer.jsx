import React, { useState } from 'react';
import { CopyIcon, CheckIcon, DownloadIcon, SearchIcon, CloseIcon } from '../icons/Icons';

export function RawJsonViewer({ data, onCopy, hasCopied }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!data) return null;

  const jsonString = JSON.stringify(data, null, 2);

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const cnpj = data.estabelecimento?.cnpj || data.cnpj_raiz || 'empresa';
    a.href = url;
    a.download = `cnpj_${cnpj}_raw.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Linhas do JSON
  const lines = jsonString.split('\n');

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Controles do visualizador */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <SearchIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar no JSON..."
            className="w-full pl-9 pr-8 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400"
            >
              <CloseIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition-all active:scale-95"
          >
            {hasCopied ? (
              <>
                <CheckIcon className="w-4 h-4 text-emerald-600" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <CopyIcon className="w-4 h-4" />
                <span>Copiar</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
          >
            <DownloadIcon className="w-4 h-4" />
            <span>Baixar .json</span>
          </button>
        </div>
      </div>

      {/* Bloco de Código com Scroll e Realce */}
      <div className="flex-1 overflow-auto rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs p-4 border border-slate-800 leading-relaxed select-text">
        <pre className="whitespace-pre">
          {lines.map((line, idx) => {
            const isMatch = searchTerm && line.toLowerCase().includes(searchTerm.toLowerCase());
            return (
              <div 
                key={idx} 
                className={`flex hover:bg-slate-900/80 px-1 rounded ${isMatch ? 'bg-amber-500/20 text-amber-200' : ''}`}
              >
                <span className="select-none text-slate-600 w-10 text-right pr-3 flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="flex-1">{line}</span>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}
