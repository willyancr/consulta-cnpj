# Consulta CNPJ - Frontend Moderno em React + TailwindCSS

Aplicação web profissional, responsiva e acessível para consulta, análise e comparação de dados cadastrais de CNPJs utilizando a API pública da Receita Federal (`https://publica.cnpj.ws/cnpj/{cnpj}`).

---

## 🚀 Funcionalidades

### 1. Busca e Validação
- **Máscara Automática**: formata números de CNPJ dinamicamente no padrão `00.000.000/0000-00`.
- **Validação de Dígitos Verificadores**: cálculo oficial módulo 11 da Receita Federal com feedback em tempo real.
- **Botão com Loading**: indicador de carregamento com animação SVG e bloqueio contra duplo clique.
- **Exemplos Rápidos**: botões para consulta imediata de empresas de grande porte (Banco do Brasil, Petrobras, Vale, Magazine Luiza, Google Brasil).

### 2. Resumo Cadastral e Métricas
- **Resumo Estilizado**:
  - Razão Social e Nome Fantasia
  - Situação Cadastral com badges coloridas (Ativa, Baixada, Suspensa, Inapta, Nula)
  - Endereço completo com link direto para o Google Maps
  - CNAE Principal (código + descrição detalhada com tooltip)
  - Contatos (Telefone formatado com link `tel:` e E-mail com `mailto:`)
  - Inscrições Estaduais por UF com status ativo/inativo
- **Cartões de Métricas**:
  - Capital Social formatado em `R$` com separadores de milhar
  - Porte e Natureza Jurídica
  - Regime Tributário (Simples Nacional e MEI)
  - **Contador de Campos Preenchidos**: cálculo percentual de completude cadastral e número de campos preenchidos vs. totais.

### 3. Explorador Dinâmico de Dados
- Renderizador universal e recursivo capaz de processar qualquer resposta JSON:
  - Objetos aninhados com expansão/recolhimento
  - Listas simples de valores
  - Listas de objetos complexos com **paginação interna** (5 itens por página)
  - Campo de busca interna para filtrar chaves e valores instantaneamente
  - Formatação automática de Moedas, Datas (`DD/MM/YYYY`), Booleanos (`Sim`/`Não`), CEPs e CNPJs.

### 4. Análise e Recursos Extras
- **Gráficos Nativos em SVG / Tailwind**:
  - Distribuição percentual por cargos/qualificações do QSA (Quadro de Sócios).
  - Distribuição por faixas etárias dos sócios.
- **Comparador Lado a Lado de Dois CNPJs**:
  - Tabela comparativa detalhada entre duas empresas (Capital Social, Porte, Sócios, CNAE, Situação, Regime).
- **Drawer / Modal de JSON Bruto**:
  - Exibição do JSON formatado com numeração de linhas, busca textual, botão de copiar e download de arquivo `.json`.
- **Exportação de Dados**:
  - **CSV**: planilha compatível com Microsoft Excel (com UTF-8 BOM).
  - **PDF**: folha de estilo de impressão pronta para salvar como PDF via navegador (`@media print`).
- **Histórico e Favoritos**:
  - Armazenamento em `localStorage` com opção de reconsulta em um clique, exclusão individual e limpeza geral.
- **Resiliência de Rede**:
  - **Cache Local com TTL**: salva consultas com sucesso para evitar repetição de chamadas e contornar o limite de 3 requisições por minuto da API pública.
  - **Timeout e Retentativas**: timeout de 12 segundos com suporte a retentativas em caso de instabilidade.
  - **Tratamento de Rate-Limit (429)**: alerta visual com tempo restante informado pela API.
- **Dark Mode**:
  - Alternância de tema Claro / Escuro com persistência em `localStorage` e detecção do tema do sistema operacional.
- **Restrição de Ícones**:
  - **Zero bibliotecas externas de ícones**: todos os ícones foram criados como componentes SVG puros integrados com TailwindCSS.

---

## 🛠️ Tecnologias Utilizadas

- **React 18** (Vite)
- **TailwindCSS 3.4** (com suporte a Dark Mode por classe)
- **JavaScript Moderno (ESModules)**
- **CSS3 / Media Print**

---

## 📂 Estrutura de Pastas

```text
consulta-cnpj/
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   └── CnpjCharts.jsx          # Gráficos SVG nativos (socios, qualificações)
│   │   ├── common/
│   │   │   ├── Badge.jsx               # Badges coloridas com variantes de status
│   │   │   ├── Drawer.jsx              # Painel lateral retrátil
│   │   │   ├── Footer.jsx              # Rodapé da aplicação
│   │   │   ├── Header.jsx              # Cabeçalho, tema e navegação
│   │   │   ├── Modal.jsx               # Diálogo modal acessível
│   │   │   ├── Toast.jsx               # Notificação flutuante de ações
│   │   │   └── Tooltip.jsx             # Dicas de termos técnicos (CNAE, QSA, etc.)
│   │   ├── company/
│   │   │   ├── CompanySummary.jsx      # Resumo cadastral principal
│   │   │   ├── DynamicDataViewer.jsx   # Renderizador recursivo para JSON
│   │   │   ├── MetricCards.jsx         # Cartões de métricas e completude
│   │   │   └── PartnersList.jsx        # Quadro de sócios (QSA)
│   │   ├── comparison/
│   │   │   └── CnpjComparator.jsx      # Comparador lado a lado
│   │   ├── icons/
│   │   │   └── Icons.jsx               # Ícones SVG nativos em Tailwind
│   │   ├── raw/
│   │   │   └── RawJsonViewer.jsx       # Visualizador com cópia e download
│   │   └── search/
│   │       ├── HistoryFavorites.jsx    # Abas de histórico e favoritos
│   │       ├── QuickExamples.jsx       # Atalhos de empresas de exemplo
│   │       └── SearchBar.jsx           # Campo com máscara e validação
│   ├── hooks/
│   │   ├── useCnpjSearch.js            # Orquestrador de busca e cache
│   │   ├── useFavorites.js             # Gerenciador de favoritos
│   │   ├── useHistory.js               # Gerenciador de histórico
│   │   └── useTheme.js                 # Gerenciador de Dark Mode
│   ├── services/
│   │   ├── api.js                      # Cliente de requisições com retry e timeout
│   │   └── cacheService.js             # Cache local em localStorage
│   ├── types/
│   │   └── cnpj.js                     # Constantes e dados de demonstração
│   ├── utils/
│   │   ├── cnpjValidator.js            # Validação oficial de CNPJ
│   │   ├── exporters.js                # Exportadores para CSV e PDF
│   │   ├── formatters.js               # Formatadores de moeda, data, CEP, etc.
│   │   ├── jsonHelpers.js              # Contador de campos preenchidos e busca
│   │   └── tooltipsData.js             # Dicionário de termos cadastrais
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 💻 Como Rodar o Projeto

1. Certifique-se de ter o **Node.js (v18+)** instalado.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Para gerar a versão de produção otimizada:
   ```bash
   npm run build
   ```
5. Para testar o preview da versão de produção:
   ```bash
   npx vite preview --port 3000
   ```
