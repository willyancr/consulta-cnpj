import React, { useMemo } from 'react';
import { ChartBarIcon, ChartPieIcon, UserGroupIcon } from '../icons/Icons';

export function CnpjCharts({ data }) {
  if (!data) return null;

  const socios = Array.isArray(data.socios) ? data.socios : [];
  const atividades = data.estabelecimento?.atividades_secundarias || [];
  const inscricoes = data.estabelecimento?.inscricoes_estaduais || [];

  // 1. Distribuição de Sócios por Qualificação
  const qualificacoesDist = useMemo(() => {
    const counts = {};
    socios.forEach(s => {
      const q = s.qualificacao_socio?.descricao || 'Outros';
      counts[q] = (counts[q] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / socios.length) * 100)
    })).sort((a, b) => b.count - a.count);
  }, [socios]);

  // 2. Distribuição por Faixa Etária
  const faixasDist = useMemo(() => {
    const counts = {};
    socios.forEach(s => {
      const f = s.faixa_etaria || 'Não informada';
      counts[f] = (counts[f] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / socios.length) * 100)
    })).sort((a, b) => b.count - a.count);
  }, [socios]);

  if (socios.length === 0 && atividades.length === 0 && inscricoes.length === 0) {
    return null;
  }

  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1'
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 mb-8 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
          <ChartBarIcon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Distribuição Visual e Gráficos
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Análise gráfica do quadro societário e estrutura corporativa
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico 1: Barras - Qualificação dos Sócios */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <ChartBarIcon className="w-4 h-4 text-blue-500" />
              <span>Funções dos Sócios / Administradores</span>
            </span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              {socios.length} total
            </span>
          </div>

          {socios.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-6 text-center">Nenhum sócio para gerar gráfico.</p>
          ) : (
            <div className="space-y-3">
              {qualificacoesDist.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px]" title={item.name}>
                      {item.name}
                    </span>
                    <span className="text-slate-500 font-mono">
                      {item.count} ({item.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${item.percent}%`,
                        backgroundColor: colors[idx % colors.length]
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gráfico 2: Barras / Distribuição - Faixas Etárias */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <ChartPieIcon className="w-4 h-4 text-purple-500" />
              <span>Faixas Etárias dos Sócios</span>
            </span>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
              {faixasDist.length} faixas
            </span>
          </div>

          {socios.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-6 text-center">Nenhum sócio para gerar gráfico.</p>
          ) : (
            <div className="space-y-3">
              {faixasDist.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {item.name}
                    </span>
                    <span className="text-slate-500 font-mono">
                      {item.count} ({item.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${item.percent}%`,
                        backgroundColor: colors[(idx + 2) % colors.length]
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
