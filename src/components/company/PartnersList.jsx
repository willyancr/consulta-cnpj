import React from 'react';
import { UserGroupIcon } from '../icons/Icons';
import { formatDate } from '../../utils/formatters';
import { Tooltip } from '../common/Tooltip';
import { TOOLTIPS } from '../../utils/tooltipsData';

export function PartnersList({ socios = [] }) {
  if (!Array.isArray(socios) || socios.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 mb-8 text-center text-slate-400 dark:text-slate-500">
        <UserGroupIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
        <h3 className="font-semibold text-slate-700 dark:text-slate-300">Quadro Societário (QSA)</h3>
        <p className="text-xs mt-1">Nenhum sócio ou administrador listado para este CNPJ na base pública.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 mb-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <UserGroupIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Quadro de Sócios e Administradores (QSA)
              </h2>
              <Tooltip {...TOOLTIPS.qsa} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total de {socios.length} {socios.length === 1 ? 'membro cadastrado' : 'membros cadastrados'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {socios.map((socio, idx) => {
          const qualif = socio.qualificacao_socio?.descricao || 'Sócio';
          const pais = socio.pais?.nome || 'Brasil';
          const doc = socio.cpf_cnpj_socio || 'Não informado';
          const faixa = socio.faixa_etaria;
          const dataEntrada = formatDate(socio.data_entrada);

          return (
            <div 
              key={idx}
              className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100/70 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                    {qualif}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {socio.tipo || 'Pessoa'}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {socio.nome}
                </h3>

                <div className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Documento:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{doc}</span>
                  </div>
                  {faixa && (
                    <div className="flex items-center justify-between">
                      <span>Faixa Etária:</span>
                      <span className="text-slate-700 dark:text-slate-300">{faixa}</span>
                    </div>
                  )}
                  {socio.data_entrada && (
                    <div className="flex items-center justify-between">
                      <span>Entrada na Sociedade:</span>
                      <span className="text-slate-700 dark:text-slate-300">{dataEntrada}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>País de Origem:</span>
                    <span className="text-slate-700 dark:text-slate-300">{pais}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
