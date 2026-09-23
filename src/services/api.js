/**
 * Serviço de integração para consulta de CNPJ com redundância de provedores:
 * 1. Provedor Primário: publica.cnpj.ws (consulta direta ou proxy local)
 * 2. Provedor Secundário (Fallback Resiliente): minhareceita.org (Open source, sem cota de 3 req/min)
 * Inclui suporte a timeout, cache automático, adaptação de esquemas e mensagens amigáveis
 */

import { cacheService } from './cacheService.js';
import { SAMPLE_BANCO_DO_BRASIL, SAMPLE_PETROBRAS } from '../types/cnpj.js';

const TIMEOUT_MS = 12000;

/**
 * Normaliza os dados do Minha Receita para o esquema padrão do sistema (baseado no cnpj.ws)
 */
function adaptMinhaReceita(raw) {
  const cleanCnpj = String(raw.cnpj || '').replace(/\D/g, '');
  const cnpjRaiz = cleanCnpj.slice(0, 8);
  const cnpjOrdem = cleanCnpj.slice(8, 12);
  const cnpjDv = cleanCnpj.slice(12, 14);

  // Formata o telefone
  const rawPhone = raw.ddd_telefone_1 ? String(raw.ddd_telefone_1).replace(/\D/g, '') : '';
  const ddd1 = rawPhone.length >= 10 ? rawPhone.slice(0, 2) : '';
  const telefone1 = rawPhone.length >= 10 ? rawPhone.slice(2) : rawPhone;

  return {
    cnpj_raiz: cnpjRaiz,
    razao_social: raw.razao_social || 'Razão Social não informada',
    capital_social: String(raw.capital_social || '0.00'),
    responsavel_federativo: raw.ente_federativo_responsavel || '',
    atualizado_em: raw.data_situacao_cadastral ? `${raw.data_situacao_cadastral}T00:00:00.000Z` : new Date().toISOString(),
    porte: {
      id: String(raw.codigo_porte || ''),
      descricao: raw.porte || 'Não informado'
    },
    natureza_juridica: {
      id: String(raw.codigo_natureza_juridica || ''),
      descricao: raw.natureza_juridica || 'Não informada'
    },
    qualificacao_do_responsavel: {
      id: raw.qualificacao_do_responsavel || 0,
      descricao: String(raw.qualificacao_do_responsavel || 'Sócio-Administrador')
    },
    socios: (raw.qsa || []).map(s => ({
      cpf_cnpj_socio: s.cnpj_cpf_do_socio || '',
      nome: s.nome_socio || '',
      tipo: s.identificador_de_socio === 1 ? 'Pessoa Jurídica' : 'Pessoa Física',
      data_entrada: s.data_entrada_sociedade || '',
      cpf_representante_legal: s.cpf_representante_legal || '',
      nome_representante: s.nome_representante_legal || null,
      faixa_etaria: s.faixa_etaria || '',
      qualificacao_socio: {
        id: s.codigo_qualificacao_socio || 0,
        descricao: s.qualificacao_socio || 'Sócio'
      },
      pais: {
        nome: s.pais || 'Brasil'
      }
    })),
    simples: {
      simples: raw.opcao_pelo_simples ? 'Sim' : 'Não',
      mei: raw.opcao_pelo_mei ? 'Sim' : 'Não',
      data_opcao_simples: raw.data_opcao_pelo_simples || null,
      data_exclusao_simples: raw.data_exclusao_do_simples || null,
      data_opcao_mei: raw.data_opcao_pelo_mei || null,
      data_exclusao_mei: raw.data_exclusao_do_mei || null
    },
    estabelecimento: {
      cnpj: cleanCnpj,
      cnpj_raiz: cnpjRaiz,
      cnpj_ordem: cnpjOrdem,
      cnpj_digito_verificador: cnpjDv,
      tipo: raw.descricao_identificador_matriz_filial
        ? raw.descricao_identificador_matriz_filial.charAt(0).toUpperCase() + raw.descricao_identificador_matriz_filial.slice(1).toLowerCase()
        : 'Matriz',
      nome_fantasia: raw.nome_fantasia || raw.razao_social,
      situacao_cadastral: raw.descricao_situacao_cadastral
        ? raw.descricao_situacao_cadastral.charAt(0).toUpperCase() + raw.descricao_situacao_cadastral.slice(1).toLowerCase()
        : 'Ativa',
      data_situacao_cadastral: raw.data_situacao_cadastral,
      data_inicio_atividade: raw.data_inicio_atividade,
      tipo_logradouro: raw.descricao_tipo_de_logradouro || '',
      logradouro: raw.logradouro || '',
      numero: raw.numero || 'S/N',
      complemento: raw.complemento || '',
      bairro: raw.bairro || '',
      cep: raw.cep ? String(raw.cep).replace(/\D/g, '') : '',
      ddd1,
      telefone1,
      email: raw.email || '',
      situacao_especial: raw.situacao_especial || null,
      data_situacao_especial: raw.data_situacao_especial || null,
      atualizado_em: raw.data_situacao_cadastral ? `${raw.data_situacao_cadastral}T00:00:00.000Z` : new Date().toISOString(),
      atividade_principal: {
        id: String(raw.cnae_fiscal || ''),
        descricao: raw.cnae_fiscal_descricao || 'Atividade principal não informada'
      },
      atividades_secundarias: (raw.cnaes_secundarios || []).map(c => ({
        id: String(c.codigo),
        descricao: c.descricao
      })),
      pais: {
        nome: raw.pais || 'Brasil'
      },
      estado: {
        nome: raw.uf,
        sigla: raw.uf
      },
      cidade: {
        nome: raw.municipio
      },
      motivo_situacao_cadastral: raw.descricao_motivo_situacao_cadastral || null,
      inscricoes_estaduais: []
    }
  };
}

/**
 * Executa uma requisição com timeout
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * Consulta na API pública publica.cnpj.ws
 */
async function fetchFromCnpjWs(cnpj) {
  // Tenta primeiro a API direta (que suporta CORS abertamente) e fallback para o proxy local
  const urls = [
    `https://publica.cnpj.ws/cnpj/${cnpj}`,
    `/api-cnpj/${cnpj}`
  ];

  for (const url of urls) {
    try {
      const response = await fetchWithTimeout(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data, source: 'cnpj.ws' };
      }

      // Se for 404 no proxy relativo, pode ser apenas que o proxy local não está configurado na build estática
      // Não aborta prematuramente se for a URL relativa
      if (response.status === 404 && url.startsWith('/api-cnpj')) {
        continue;
      }

      if (response.status === 429) {
        return { success: false, status: 429, errorTitle: 'Limite de Requisições (429)' };
      }

      if (response.status === 404) {
        return { success: false, status: 404, notFound: true };
      }
    } catch {
      // Falha de rede na URL atual, tenta a próxima URL
      continue;
    }
  }

  return { success: false, status: 0, networkError: true };
}

/**
 * Consulta na API Minha Receita (espelho de dados abertos da Receita Federal)
 */
async function fetchFromMinhaReceita(cnpj) {
  try {
    const response = await fetchWithTimeout(`https://minhareceita.org/${cnpj}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const raw = await response.json();
      const adapted = adaptMinhaReceita(raw);
      return { success: true, data: adapted, source: 'minhareceita.org' };
    }

    if (response.status === 404) {
      return { success: false, status: 404, notFound: true };
    }

    return { success: false, status: response.status };
  } catch {
    return { success: false, status: 0, networkError: true };
  }
}

/**
 * Consulta dados do CNPJ na API pública com fallback resiliente
 * @param {string} rawCnpj - Número do CNPJ (formatado ou limpo)
 * @param {object} options - Opções de busca { forceRefresh: boolean, useCache: boolean }
 */
export async function fetchCnpj(rawCnpj, options = {}) {
  const { forceRefresh = false, useCache = true } = options;
  const cnpj = String(rawCnpj).replace(/\D/g, '');

  if (!cnpj || cnpj.length !== 14) {
    return {
      success: false,
      error: {
        title: 'CNPJ Inválido',
        message: 'O CNPJ informado deve possuir exatamente 14 dígitos numéricos.',
        status: 400
      }
    };
  }

  // 1. Verifica cache local se habilitado e não for refresh forçado
  if (useCache && !forceRefresh) {
    const cached = cacheService.get(cnpj);
    if (cached) {
      return {
        success: true,
        data: cached.data,
        cachedAt: cached.cachedAt,
        fromCache: true
      };
    }
  }

  // Pre-check para dados de demonstração conhecidos
  const isBancoDoBrasil = cnpj === '00000000000191';
  const isPetrobras = cnpj === '33000167000101';

  // 2. Consulta Provedor 1: publica.cnpj.ws
  const cnpjWsResult = await fetchFromCnpjWs(cnpj);

  if (cnpjWsResult.success) {
    cacheService.set(cnpj, cnpjWsResult.data);
    return {
      success: true,
      data: cnpjWsResult.data,
      fromCache: false
    };
  }

  // 3. Fallback Provedor 2: minhareceita.org
  // Acionado caso o cnpj.ws tenha retornado 429 (rate limit), 404 (base desatualizada) ou erro de rede/servidor
  const fallbackResult = await fetchFromMinhaReceita(cnpj);

  if (fallbackResult.success) {
    cacheService.set(cnpj, fallbackResult.data);
    return {
      success: true,
      data: fallbackResult.data,
      fromCache: false,
      rateLimitWarning: cnpjWsResult.status === 429
        ? 'Limite da API principal atingido. Dados obtidos com sucesso através do provedor secundário (Minha Receita).'
        : null
    };
  }

  // 4. Fallback para demonstrações conhecidas caso a rede esteja indisponível
  if (isBancoDoBrasil) {
    return {
      success: true,
      data: SAMPLE_BANCO_DO_BRASIL,
      fromCache: true,
      demoFallback: true
    };
  }
  if (isPetrobras) {
    return {
      success: true,
      data: SAMPLE_PETROBRAS,
      fromCache: true,
      demoFallback: true
    };
  }

  // 5. Se ambos retornaram 404, o CNPJ realmente não está disponível nas bases de Dados Abertos
  if (cnpjWsResult.notFound || fallbackResult.notFound) {
    return {
      success: false,
      error: {
        title: 'CNPJ Não Encontrado (404)',
        message: 'O CNPJ informado não foi localizado nas bases públicas de dados abertos. Empresas recém-abertas ou com alterações recentes podem levar algumas semanas para serem sincronizadas pelos espelhos públicos da Receita Federal.',
        status: 404,
        receitaUrl: 'https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/Cnpjreva_Solicitacao.asp'
      }
    };
  }

  // 6. Caso tenha sido bloqueado por rate limit e o fallback também falhou
  if (cnpjWsResult.status === 429) {
    return {
      success: false,
      error: {
        title: 'Limite de Requisições Atingido (429)',
        message: 'O limite de consultas por minuto foi atingido. Aguarde alguns segundos e tente novamente.',
        status: 429,
        isRateLimit: true
      }
    };
  }

  // 7. Erro genérico de conexão/instabilidade
  return {
    success: false,
    error: {
      title: 'Serviço Temporariamente Indisponível',
      message: 'Não foi possível conectar aos servidores de consulta pública de CNPJ. Verifique sua conexão à internet e tente novamente.',
      status: 503
    }
  };
}
