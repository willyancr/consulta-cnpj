import React, { useState } from 'react';
import { maskCnpj, cleanCnpj, validateCnpj } from '../../utils/cnpjValidator';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { SituacaoBadge } from '../common/Badge';
import { 
  CompareIcon, 
  SearchIcon, 
  SpinnerIcon, 
  BuildingIcon, 
  CheckCircleIcon,
  CloseIcon 
} from '../icons/Icons';
import { fetchCnpj } from '../../services/api';
import { SAMPLE_BANCO_DO_BRASIL, SAMPLE_PETROBRAS } from '../../types/cnpj';

export function CnpjComparator({ history = [], favorites = [] }) {
  const [cnpj1, setCnpj1] = useState('00.000.000/0001-91');
  const [cnpj2, setCnpj2] = useState('33.000.167/0001-01');

  const [data1, setData1] = useState(SAMPLE_BANCO_DO_BRASIL);
  const [data2, setData2] = useState(SAMPLE_PETROBRAS);

  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [error1, setError1] = useState(null);
  const [error2, setError2] = useState(null);

  const handleSearch = async (slot) => {
    const rawValue = slot === 1 ? cnpj1 : cnpj2;
    const cleaned = cleanCnpj(rawValue);
    const validation = validateCnpj(cleaned);

    if (!validation.isValid) {
      if (slot === 1) setError1(validation.message);
      else setError2(validation.message);
      return;
    }

    if (slot === 1) {
      setLoading1(true);
      setError1(null);
    } else {
      setLoading2(true);
      setError2(null);
    }

    try {
      const res = await fetchCnpj(cleaned);
      if (res.success) {
        if (slot === 1) setData1(res.data);
        else setData2(res.data);
      } else {
        if (slot === 1) setError1(res.error?.message || 'Falha ao consultar CNPJ');
        else setError2(res.error?.message || 'Falha ao consultar CNPJ');
      }
    } catch (e) {
      if (slot === 1) setError1(e.message);
      else setError2(e.message);
    } finally {
      if (slot === 1) setLoading1(false);
      else setLoading2(false);
    }
  };

  const getCompanyProps = (data) => {
    if (!data) return null;
    const est = data.estabelecimento || {};
    return {
      razao: data.razao_social || 'Não informada',
      fantasia: est.nome_fantasia || '-',
      cnpj: est.cnpj || data.cnpj_raiz || '',
      situacao: est.situacao_cadastral,
      abertura: formatDate(est.data_inicio_atividade),
      capital: parseFloat(data.capital_social) || 0,
      capitalFormatted: formatCurrency(data.capital_social),
      porte: data.porte?.descricao || '-',
      natureza: data.natureza_juridica?.descricao || '-',
      simples: data.simples?.simples || 'Não',
      mei: data.simples?.mei || 'Não',
      cnae: est.atividade_principal ? `${est.atividade_principal.subclasse} - ${est.atividade_principal.descricao}` : '-',
      local: est.cidade?.nome ? `${est.cidade.nome}/${est.estado?.sigla || ''}` : '-',
      sociosCount: Array.isArray(data.socios) ? data.socios.length : 0
    };
  };

  const c1 = getCompanyProps(data1);
  const c2 = getCompanyProps(data2);

  const compareRows = [
    { label: 'Razão Social', v1: c1?.razao, v2: c2?.razao, highlight: true },
    { label: 'Nome Fantasia', v1: c1?.fantasia, v2: c2?.fantasia },
    { 
      label: 'Situação Cadastral', 
      custom: (
        <>
          <div className="py-1">{c1 ? <SituacaoBadge situacao={c1.situacao} /> : '-'}</div>
          <div className="py-1">{c2 ? <SituacaoBadge situacao={c2.situacao} /> : '-'}</div>
        </>
      ) 
    },
    { label: 'Data de Abertura', v1: c1?.abertura, v2: c2?.abertura },
    { 
      label: 'Capital Social', 
      v1: c1?.capitalFormatted, 
      v2: c2?.capitalFormatted,
      isCapital: true 
    },
    { label: 'Porte', v1: c1?.porte, v2: c2?.porte },
    { label: 'Natureza Jurídica', v1: c1?.natureza, v2: c2?.natureza },
    { label: 'Simples Nacional', v1: c1?.simples, v2: c2?.simples },
    { label: 'MEI', v1: c1?.mei, v2: c2?.mei },
    { label: 'CNAE Principal', v1: c1?.cnae, v2: c2?.cnae },
    { label: 'Localização', v1: c1?.local, v2: c2?.local },
    { label: 'Quadro de Sócios', v1: c1 ? `${c1.sociosCount} sócios` : '-', v2: c2 ? `${c2.sociosCount} sócios` : '-' },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CompareIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span>Comparador Lado a Lado de CNPJs</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Analise e compare a saúde societária, capital social, porte e dados cadastrais de duas empresas simultaneamente.
        </p>
      </div>

      {/* Inputs para Empresa 1 e Empresa 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Painel CNPJ 1 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-2">
            Empresa 1
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              value={cnpj1}
              onChange={(e) => setCnpj1(maskCnpj(e.target.value))}
              placeholder="00.000.000/0000-00"
              className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              disabled={loading1}
              onClick={() => handleSearch(1)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all disabled:opacity-50"
            >
              {loading1 ? <SpinnerIcon className="w-4 h-4" /> : 'Carregar'}
            </button>
          </div>
          {error1 && <p className="text-xs text-rose-500 mt-2">{error1}</p>}
        </div>

        {/* Painel CNPJ 2 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-2">
            Empresa 2
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              value={cnpj2}
              onChange={(e) => setCnpj2(maskCnpj(e.target.value))}
              placeholder="00.000.000/0000-00"
              className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              disabled={loading2}
              onClick={() => handleSearch(2)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all disabled:opacity-50"
            >
              {loading2 ? <SpinnerIcon className="w-4 h-4" /> : 'Carregar'}
            </button>
          </div>
          {error2 && <p className="text-xs text-rose-500 mt-2">{error2}</p>}
        </div>
      </div>

      {/* Tabela de Comparação Lado a Lado */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50">
                <th className="py-4 px-6 font-bold text-slate-500 dark:text-slate-400 uppercase text-xs w-1/4">
                  Atributo
                </th>
                <th className="py-4 px-6 font-extrabold text-blue-600 dark:text-blue-400 text-sm sm:text-base w-[37.5%]">
                  {c1?.razao || 'Empresa 1'}
                </th>
                <th className="py-4 px-6 font-extrabold text-indigo-600 dark:text-indigo-400 text-sm sm:text-base w-[37.5%]">
                  {c2?.razao || 'Empresa 2'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {compareRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-6 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">
                    {row.label}
                  </td>
                  {row.custom ? (
                    <>
                      <td className="py-3 px-6">{row.custom.props.children[0]}</td>
                      <td className="py-3 px-6">{row.custom.props.children[1]}</td>
                    </>
                  ) : (
                    <>
                      <td className={`py-3 px-6 ${row.isCapital ? 'font-black text-emerald-600 dark:text-emerald-400 text-base' : 'text-slate-900 dark:text-slate-100'}`}>
                        {row.v1 || '-'}
                      </td>
                      <td className={`py-3 px-6 ${row.isCapital ? 'font-black text-emerald-600 dark:text-emerald-400 text-base' : 'text-slate-900 dark:text-slate-100'}`}>
                        {row.v2 || '-'}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
