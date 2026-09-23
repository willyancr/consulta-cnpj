/**
 * Constantes, exemplos de CNPJ e dados de demonstração
 */

export const QUICK_EXAMPLES = [
  { cnpj: '00000000000191', name: 'Banco do Brasil S.A.', badge: 'Bancos' },
  { cnpj: '33000167000101', name: 'Petrobras', badge: 'Energia' },
  { cnpj: '33592510000154', name: 'Vale S.A.', badge: 'Mineração' },
  { cnpj: '47960950000121', name: 'Magazine Luiza S.A.', badge: 'Varejo' },
  { cnpj: '06990590000123', name: 'Google Brasil Internet Ltda.', badge: 'Tecnologia' }
];

// Dados completos pré-carregados do Banco do Brasil para teste imediato e demonstração
export const SAMPLE_BANCO_DO_BRASIL = {
  cnpj_raiz: "00000000",
  razao_social: "BANCO DO BRASIL SA",
  capital_social: "12000000000.00",
  responsavel_federativo: null,
  atualizado_em: "2026-09-12T03:00:00.000Z",
  porte: {
    id: "05",
    descricao: "Demais"
  },
  natureza_juridica: {
    id: "2038",
    descricao: "Sociedade de Economia Mista"
  },
  qualificacao_do_responsavel: {
    id: 10,
    descricao: "Diretor"
  },
  simples: {
    simples: "Não",
    mei: "Não",
    data_opcao_simples: null,
    data_exclusao_simples: null,
    data_opcao_mei: null,
    data_exclusao_mei: null,
    atualizado_em: "2026-09-12T03:00:00.000Z"
  },
  estabelecimento: {
    cnpj: "00000000000191",
    cnpj_raiz: "00000000",
    cnpj_ordem: "0001",
    cnpj_digito_verificador: "91",
    tipo: "Matriz",
    nome_fantasia: "DIRECAO GERAL",
    situacao_cadastral: "Ativa",
    data_situacao_cadastral: "2005-11-03",
    data_inicio_atividade: "1966-08-01",
    nome_cidade_exterior: null,
    tipo_logradouro: "QUADRA",
    logradouro: "SAUN QUADRA 5 BLOCO B TORRE I, II, III",
    numero: "SN",
    complemento: "ANDAR T I SL S101 A S1602 T II SL C101 A C1602 TIII SL N101 A N1602",
    bairro: "ASA NORTE",
    cep: "70040912",
    ddd1: "61",
    telefone1: "34939002",
    ddd2: null,
    telefone2: null,
    ddd_fax: "61",
    fax: "34931040",
    email: "secex@bb.com.br",
    situacao_especial: null,
    data_situacao_especial: null,
    atualizado_em: "2026-09-12T03:00:00.000Z",
    atividade_principal: {
      id: "6422100",
      secao: "K",
      divisao: "64",
      grupo: "64.2",
      classe: "64.22-1",
      subclasse: "6422-1/00",
      descricao: "Bancos múltiplos, com carteira comercial"
    },
    atividades_secundarias: [
      {
        id: "6499999",
        secao: "K",
        divisao: "64",
        grupo: "64.9",
        classe: "64.99-9",
        subclasse: "6499-9/99",
        descricao: "Outras atividades de serviços financeiros não especificadas anteriormente"
      }
    ],
    pais: {
      id: "1058",
      iso2: "BR",
      iso3: "BRA",
      nome: "Brasil",
      comex_id: "105"
    },
    estado: {
      id: 7,
      nome: "Distrito Federal",
      sigla: "DF",
      ibge_id: 53
    },
    cidade: {
      id: 5570,
      nome: "Brasília",
      ibge_id: 5300108,
      siafi_id: "9701"
    },
    motivo_situacao_cadastral: null,
    inscricoes_estaduais: [
      {
        inscricao_estadual: "0809427800174",
        ativo: true,
        atualizado_em: "2025-10-10T13:40:01.080Z",
        estado: {
          id: 7,
          nome: "Distrito Federal",
          sigla: "DF",
          ibge_id: 53
        }
      }
    ]
  },
  socios: [
    {
      cpf_cnpj_socio: "***637827**",
      nome: "BARBARA FAVERO DOS SANTOS BOSI",
      tipo: "Pessoa Física",
      data_entrada: "2026-05-27",
      faixa_etaria: "41 a 50 anos",
      qualificacao_socio: {
        id: 10,
        descricao: "Diretor"
      },
      pais: { nome: "Brasil" }
    },
    {
      cpf_cnpj_socio: "***834987**",
      nome: "BRUNO ALVES DO NASCIMENTO",
      tipo: "Pessoa Física",
      data_entrada: "2026-05-27",
      faixa_etaria: "41 a 50 anos",
      qualificacao_socio: {
        id: 10,
        descricao: "Diretor"
      },
      pais: { nome: "Brasil" }
    },
    {
      cpf_cnpj_socio: "***129845**",
      nome: "TARCISIO HUEB DE CASTRO",
      tipo: "Pessoa Física",
      data_entrada: "2023-01-16",
      faixa_etaria: "51 a 60 anos",
      qualificacao_socio: {
        id: 10,
        descricao: "Diretor"
      },
      pais: { nome: "Brasil" }
    },
    {
      cpf_cnpj_socio: "***441238**",
      nome: "TARCISIO GODINHO GOMES",
      tipo: "Pessoa Física",
      data_entrada: "2023-04-10",
      faixa_etaria: "51 a 60 anos",
      qualificacao_socio: {
        id: 16,
        descricao: "Presidente"
      },
      pais: { nome: "Brasil" }
    }
  ]
};

// Segundo CNPJ de demonstração: Petrobras
export const SAMPLE_PETROBRAS = {
  cnpj_raiz: "33000167",
  razao_social: "PETROLEO BRASILEIRO S.A. - PETROBRAS",
  capital_social: "205431960000.00",
  responsavel_federativo: null,
  atualizado_em: "2026-09-12T03:00:00.000Z",
  porte: {
    id: "05",
    descricao: "Demais"
  },
  natureza_juridica: {
    id: "2038",
    descricao: "Sociedade de Economia Mista"
  },
  qualificacao_do_responsavel: {
    id: 16,
    descricao: "Presidente"
  },
  simples: {
    simples: "Não",
    mei: "Não"
  },
  estabelecimento: {
    cnpj: "33000167000101",
    cnpj_raiz: "33000167",
    cnpj_ordem: "0001",
    cnpj_digito_verificador: "01",
    tipo: "Matriz",
    nome_fantasia: "PETROBRAS",
    situacao_cadastral: "Ativa",
    data_situacao_cadastral: "2005-11-03",
    data_inicio_atividade: "1966-09-08",
    tipo_logradouro: "AVENIDA",
    logradouro: "REPUBLICA DO CHILE",
    numero: "65",
    complemento: "ANDAR 23 SALA 2302",
    bairro: "CENTRO",
    cep: "20031912",
    ddd1: "21",
    telefone1: "32244477",
    email: "tributario_societario@petrobras.com.br",
    atividade_principal: {
      id: "0600001",
      descricao: "Extração de petróleo e gás natural"
    },
    estado: {
      sigla: "RJ",
      nome: "Rio de Janeiro"
    },
    cidade: {
      nome: "Rio de Janeiro"
    },
    inscricoes_estaduais: [
      {
        inscricao_estadual: "81655070",
        ativo: true,
        estado: { sigla: "RJ" }
      }
    ]
  },
  socios: [
    {
      nome: "MAGDA MARIA DE REGINA CHAMBRIARD",
      tipo: "Pessoa Física",
      faixa_etaria: "61 a 70 anos",
      qualificacao_socio: { descricao: "Presidente" },
      pais: { nome: "Brasil" }
    },
    {
      nome: "FERNANDO ZACARIAS PENHA",
      tipo: "Pessoa Física",
      faixa_etaria: "51 a 60 anos",
      qualificacao_socio: { descricao: "Diretor" },
      pais: { nome: "Brasil" }
    }
  ]
};
