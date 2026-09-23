import React, { useState, useEffect } from 'react';
import { maskCnpj, cleanCnpj, validateCnpj } from '../../utils/cnpjValidator';
import { 
  SearchIcon, 
  SpinnerIcon, 
  CheckCircleIcon, 
  AlertCircleIcon, 
  AlertTriangleIcon,
  RefreshIcon
} from '../icons/Icons';

export function SearchBar({ 
  onSearch, 
  loading, 
  error, 
  rateLimitWarning, 
  fromCache,
  onRefresh,
  initialValue = '' 
}) {
  const [inputValue, setInputValue] = useState(initialValue ? maskCnpj(initialValue) : '');
  const [validationState, setValidationState] = useState({ isValid: false, message: '' });
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (initialValue) {
      setInputValue(maskCnpj(initialValue));
      setValidationState(validateCnpj(initialValue));
    }
  }, [initialValue]);

  const handleChange = (e) => {
    const raw = e.target.value;
    const masked = maskCnpj(raw);
    setInputValue(masked);
    setTouched(true);

    const cleaned = cleanCnpj(masked);
    if (cleaned.length === 14) {
      setValidationState(validateCnpj(cleaned));
    } else {
      setValidationState({ 
        isValid: false, 
        message: cleaned.length > 0 ? `Faltam ${14 - cleaned.length} dígitos` : '' 
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    const cleaned = cleanCnpj(inputValue);
    const validation = validateCnpj(cleaned);
    setValidationState(validation);

    if (validation.isValid) {
      onSearch(cleaned);
    }
  };

  const isComplete = cleanCnpj(inputValue).length === 14;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          {/* Campo de Entrada de CNPJ com Máscara Automática */}
          <div className="relative flex-1">
            <label htmlFor="cnpj-input" className="sr-only">
              Número do CNPJ
            </label>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <SearchIcon className="w-5 h-5" />
            </div>

            <input
              id="cnpj-input"
              type="text"
              inputMode="numeric"
              maxLength={18}
              value={inputValue}
              onChange={handleChange}
              placeholder="Digite o CNPJ (ex: 00.000.000/0000-00)"
              autoComplete="off"
              spellCheck="false"
              className={`w-full pl-11 pr-11 py-3.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl border text-base sm:text-lg font-mono tracking-wider shadow-sm transition-all focus:outline-none focus:ring-4 ${
                touched && isComplete && !validationState.isValid
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                  : touched && validationState.isValid
                  ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
              aria-invalid={touched && isComplete && !validationState.isValid}
              aria-describedby="cnpj-feedback"
            />

            {/* Ícone de status de validação no final do input */}
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              {isComplete && validationState.isValid && (
                <span title="Dígitos verificadores válidos">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                </span>
              )}
              {isComplete && !validationState.isValid && (
                <span title="Dígito verificador inválido">
                  <AlertCircleIcon className="w-5 h-5 text-rose-500" />
                </span>
              )}
            </div>
          </div>

          {/* Botão Consultar com estado de loading */}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] shadow-md shadow-blue-500/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/30 text-base"
          >
            {loading ? (
              <>
                <SpinnerIcon className="w-5 h-5" />
                <span>Consultando...</span>
              </>
            ) : (
              <>
                <SearchIcon className="w-5 h-5" />
                <span>Consultar</span>
              </>
            )}
          </button>
        </div>

        {/* Feedback visual inline de validação */}
        {touched && inputValue && !validationState.isValid && (
          <p id="cnpj-feedback" className="mt-2 text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1">
            <AlertCircleIcon className="w-4 h-4 flex-shrink-0" />
            <span>{validationState.message || 'CNPJ incompleto ou inválido.'}</span>
          </p>
        )}
      </form>

      {/* Alerta de Erro Visual da API */}
      {error && (
        <div className="mt-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 flex items-start justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <AlertCircleIcon className="w-6 h-6 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm text-rose-900 dark:text-rose-100">{error.title}</h4>
              <p className="text-sm mt-0.5 text-rose-700 dark:text-rose-300">{error.message}</p>
            </div>
          </div>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 hover:bg-rose-200 dark:hover:bg-rose-800 transition-colors flex items-center gap-1.5 flex-shrink-0"
            >
              <RefreshIcon className="w-3.5 h-3.5" />
              <span>Tentar novamente</span>
            </button>
          )}
        </div>
      )}

      {/* Alerta de Limite de Requisições / Aviso 429 com dica de cache */}
      {rateLimitWarning && (
        <div className="mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 flex items-start gap-3 animate-in fade-in duration-200">
          <AlertTriangleIcon className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold">Aviso de Limite da API Pública: </span>
            <span>{rateLimitWarning}</span>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
              Os dados foram recuperados com sucesso usando o cache local inteligente para não interromper seu trabalho.
            </p>
          </div>
        </div>
      )}

      {/* Indicador de Cache Local Ativo */}
      {fromCache && (
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>Exibindo dados do cache local (instantâneo e sem consumo de cota)</span>
          </div>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <RefreshIcon className="w-3 h-3" />
              <span>Forçar atualização na API</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
