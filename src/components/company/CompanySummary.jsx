import React from 'react';
import { SituacaoBadge } from '../common/Badge';
import { Tooltip } from '../common/Tooltip';
import { TOOLTIPS } from '../../utils/tooltipsData';
import { 
  BuildingIcon, 
  MapPinIcon, 
  PhoneIcon, 
  MailIcon, 
  GlobeIcon, 
  StarIcon, 
  CopyIcon,
  DownloadIcon,
  PrinterIcon,
  CodeIcon,
  CheckIcon
} from '../icons/Icons';
import { 
  maskCnpj, 
  formatCep, 
  formatPhone, 
  formatDate 
} from '../../utils/formatters';
import { exportToCsv, triggerPrintPdf } from '../../utils/exporters';

export function CompanySummary({ 
  data, 
  isFavorite, 
  onToggleFavorite, 
  onOpenRawJson, 
  onCopyJson, 
  hasCopied 
}) {
  if (!data) return null;

  const est = data.estabelecimento || {};
  const cnpj = est.cnpj || data.cnpj_raiz || '';
  const razaoSocial = data.razao_social || 'Razão Social não informada';
  const nomeFantasia = est.nome_fantasia || null;
  const situacao = est.situacao_cadastral;
  const dataSituacao = formatDate(est.data_situacao_cadastral);
  const dataAbertura = formatDate(est.data_inicio_atividade);
  const tipoEstabelecimento = est.tipo || 'Matriz';

  // Endereço completo formatado
  const logradouroParts = [
    est.tipo_logradouro,
    est.logradouro,
    est.numero ? `Nº ${est.numero}` : null,
    est.complemento ? `(${est.complemento})` : null
  ].filter(Boolean).join(' ');

  const localidadeParts = [
    est.bairro,
    est.cidade?.nome,
    est.estado?.sigla
  ].filter(Boolean).join(' - ');

  const fullAddress = `${logradouroParts}, ${localidadeParts}, CEP: ${formatCep(est.cep)}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${logradouroParts}, ${est.cidade?.nome || ''} ${est.estado?.sigla || ''}`
  )}`;

  const telefone = formatPhone(est.ddd1, est.telefone1);
  const email = est.email;
  const cnaePrincipal = est.atividade_principal;
  const inscricoes = est.inscricoes_estaduais || [];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8 transition-colors">
      {/* Top Banner / Cabeçalho da Empresa */}
      <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-transparent dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-transparent">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          {/* Título & Identificação */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="font-mono text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400 bg-blue-100/70 dark:bg-blue-950/80 px-3 py-1 rounded-xl border border-blue-200 dark:border-blue-900">
                {maskCnpj(cnpj)}
              </span>

              <SituacaoBadge situacao={situacao} />

              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <span>{tipoEstabelecimento}</span>
                <Tooltip {...TOOLTIPS.matrizFilial} />
              </span>

              <span className="text-xs text-slate-500 dark:text-slate-400">
                Desde {dataAbertura}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                {razaoSocial}
              </h1>

              {/* Botão de Favoritar */}
              <button
                type="button"
                onClick={() => onToggleFavorite(data)}
                className={`p-2 rounded-xl transition-all ${
                  isFavorite(cnpj)
                    ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100'
                    : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={isFavorite(cnpj) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                aria-label="Marcar como favorito"
              >
                <StarIcon className="w-6 h-6" filled={isFavorite(cnpj)} />
              </button>
            </div>

            {nomeFantasia && (
              <p className="mt-1 text-base text-slate-600 dark:text-slate-300 font-medium">
                Nome Fantasia: <span className="text-slate-900 dark:text-white font-semibold">{nomeFantasia}</span>
              </p>
            )}

            {est.data_situacao_cadastral && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span>Situação cadastral atualizada em: <strong>{dataSituacao}</strong></span>
                <Tooltip {...TOOLTIPS.situacaoCadastral} />
              </div>
            )}
          </div>

          {/* Barra de Ações Rápidas (Exportar, PDF, JSON, Copiar) */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 self-start no-print">
            <button
              type="button"
              onClick={() => exportToCsv(data)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
              title="Baixar planilha CSV com os dados cadastrais"
            >
              <DownloadIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>CSV</span>
            </button>

            <button
              type="button"
              onClick={triggerPrintPdf}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
              title="Imprimir ou Salvar em PDF"
            >
              <PrinterIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>PDF</span>
            </button>

            <button
              type="button"
              onClick={onOpenRawJson}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
              title="Visualizar estrutura de JSON bruto"
            >
              <CodeIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Ver JSON</span>
            </button>

            <button
              type="button"
              onClick={onCopyJson}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition-all active:scale-95"
              title="Copiar JSON completo para a área de transferência"
            >
              {hasCopied ? (
                <>
                  <CheckIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <CopyIcon className="w-4 h-4" />
                  <span>Copiar JSON</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Informações Chave: Endereço, Contato, CNAE, IE */}
      <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
        {/* Bloco de Endereço */}
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">
            <MapPinIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Endereço Completo
            </span>
            <p className="text-slate-900 dark:text-slate-100 font-medium leading-relaxed">
              {logradouroParts || 'Logradouro não informado'}
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">
              {localidadeParts}
            </p>
            <p className="text-slate-500 text-xs mt-0.5 font-mono">
              CEP: {formatCep(est.cep)}
            </p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2 font-medium no-print"
            >
              <span>Ver no Google Maps</span>
              <GlobeIcon className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Bloco de Contato (Telefone + E-mail) */}
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5">
            <PhoneIcon className="w-5 h-5" />
          </div>
          <div className="space-y-3 flex-1 min-w-0">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Telefone de Contato
              </span>
              {est.telefone1 ? (
                <a
                  href={`tel:${est.ddd1 || ''}${est.telefone1}`}
                  className="font-medium text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {telefone}
                </a>
              ) : (
                <span className="text-slate-400">Não informado</span>
              )}
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                E-mail Institucional
              </span>
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline break-all"
                >
                  {email}
                </a>
              ) : (
                <span className="text-slate-400">Não informado</span>
              )}
            </div>
          </div>
        </div>

        {/* Bloco de CNAE Principal e Inscrições Estaduais */}
        <div className="flex items-start gap-3.5 md:col-span-2 lg:col-span-1">
          <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5">
            <BuildingIcon className="w-5 h-5" />
          </div>
          <div className="space-y-3 flex-1 min-w-0">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  CNAE Principal
                </span>
                <Tooltip {...TOOLTIPS.cnae} />
              </div>
              {cnaePrincipal ? (
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                    {cnaePrincipal.subclasse || cnaePrincipal.id}
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium leading-snug">
                    {cnaePrincipal.descricao}
                  </p>
                </div>
              ) : (
                <span className="text-slate-400 text-xs">Não informado</span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Inscrições Estaduais
                </span>
                <Tooltip {...TOOLTIPS.inscricaoEstadual} />
              </div>
              {inscricoes.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {inscricoes.map((ie, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{ie.estado?.sigla || 'UF'}:</span>
                      <span>{ie.inscricao_estadual}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${ie.ativo ? 'bg-emerald-500' : 'bg-rose-500'}`} title={ie.ativo ? 'Ativo' : 'Inativo'} />
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-slate-400 text-xs">Nenhuma inscrição informada</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
