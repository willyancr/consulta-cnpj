import React, { useState, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import { useHistory } from './hooks/useHistory';
import { useFavorites } from './hooks/useFavorites';
import { useCnpjSearch } from './hooks/useCnpjSearch';

import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Drawer } from './components/common/Drawer';
import { Toast } from './components/common/Toast';

import { SearchBar } from './components/search/SearchBar';
import { QuickExamples } from './components/search/QuickExamples';
import { HistoryFavorites } from './components/search/HistoryFavorites';

import { CompanySummary } from './components/company/CompanySummary';
import { MetricCards } from './components/company/MetricCards';
import { PartnersList } from './components/company/PartnersList';
import { DynamicDataViewer } from './components/company/DynamicDataViewer';
import { CnpjCharts } from './components/charts/CnpjCharts';
import { CnpjComparator } from './components/comparison/CnpjComparator';
import { RawJsonViewer } from './components/raw/RawJsonViewer';

import { SAMPLE_BANCO_DO_BRASIL } from './types/cnpj';

export function App() {
  const { isDark, toggleTheme } = useTheme();
  const { history, addToHistory, removeFromHistory, clearHistory } = useHistory();
  const { favorites, isFavorite, toggleFavorite, removeFavorite } = useFavorites();

  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'compare'
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [hasCopied, setHasCopied] = useState(false);
  const [currentSearchInput, setCurrentSearchInput] = useState('00.000.000/0001-91');

  // Callback ao completar busca com sucesso
  const handleSearchSuccess = (companyData) => {
    addToHistory(companyData);
  };

  const {
    data,
    setData,
    loading,
    error,
    fromCache,
    rateLimitWarning,
    lastSearchedCnpj,
    executeSearch,
    refreshCurrent
  } = useCnpjSearch({ onSearchSuccess: handleSearchSuccess });

  // Carrega exemplo inicial para o usuário não ver uma tela vazia
  useEffect(() => {
    if (!data) {
      setData(SAMPLE_BANCO_DO_BRASIL);
      addToHistory(SAMPLE_BANCO_DO_BRASIL);
    }
  }, []);

  const handleSelectExample = (cnpj) => {
    setCurrentSearchInput(cnpj);
    executeSearch(cnpj);
  };

  const handleCopyJson = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setHasCopied(true);
      setToastMessage('JSON copiado com sucesso para a área de transferência!');
      setToastType('success');
      setTimeout(() => setHasCopied(false), 2500);
    } catch {
      setToastMessage('Falha ao copiar JSON para a área de transferência.');
      setToastType('error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header Fixo */}
      <Header
        isDark={isDark}
        onToggleTheme={toggleTheme}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'search' ? (
          <div>
            {/* Seção de Busca */}
            <div className="max-w-3xl mx-auto mb-8 no-print">
              <div className="text-center mb-6">
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Consulta de CNPJ
                </h1>
                <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
                  Pesquise dados cadastrais completos, quadro de sócios, situação e CNAE em tempo real.
                </p>
              </div>

              {/* Barra de Pesquisa */}
              <SearchBar
                initialValue={currentSearchInput}
                onSearch={(cnpj) => {
                  setCurrentSearchInput(cnpj);
                  executeSearch(cnpj);
                }}
                loading={loading}
                error={error}
                rateLimitWarning={rateLimitWarning}
                fromCache={fromCache}
                onRefresh={refreshCurrent}
              />

              {/* Exemplos Rápidos */}
              <QuickExamples onSelectExample={handleSelectExample} />

              {/* Histórico e Favoritos */}
              <HistoryFavorites
                history={history}
                favorites={favorites}
                onSelectCnpj={handleSelectExample}
                onRemoveHistory={removeFromHistory}
                onClearHistory={clearHistory}
                onRemoveFavorite={removeFavorite}
              />
            </div>

            {/* Exibição dos Dados da Empresa Consultada */}
            {data && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Resumo da Empresa (Cabeçalho, Contato, Endereço, CNAE, IE) */}
                <CompanySummary
                  data={data}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                  onOpenRawJson={() => setIsDrawerOpen(true)}
                  onCopyJson={handleCopyJson}
                  hasCopied={hasCopied}
                />

                {/* Cartões de Métricas (Capital, Porte, Regime, Completude) */}
                <MetricCards data={data} />

                {/* Gráficos Nacionais em SVG */}
                <CnpjCharts data={data} />

                {/* Quadro de Sócios (QSA) */}
                <PartnersList socios={data.socios} />

                {/* Explorador Dinâmico e Genérico de Todos os Campos do JSON */}
                <DynamicDataViewer data={data} />
              </div>
            )}
          </div>
        ) : (
          /* Aba de Comparação Lado a Lado de Dois CNPJs */
          <div className="animate-in fade-in duration-200">
            <CnpjComparator history={history} favorites={favorites} />
          </div>
        )}
      </main>

      {/* Drawer Lateral com o JSON Bruto */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Estrutura de Dados em JSON Bruto"
        width="max-w-3xl"
      >
        <RawJsonViewer
          data={data}
          onCopy={handleCopyJson}
          hasCopied={hasCopied}
        />
      </Drawer>

      {/* Notificação Flutuante Toast */}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />

      {/* Rodapé */}
      <Footer />
    </div>
  );
}
export default App;
