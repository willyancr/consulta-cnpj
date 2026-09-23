/**
 * Serviço de integração com a API pública publica.cnpj.ws
 * Inclui suporte a timeout, retry, cache automático e mensagens amigáveis
 */

import { cacheService } from './cacheService';
import { SAMPLE_BANCO_DO_BRASIL, SAMPLE_PETROBRAS } from '../types/cnpj';

const TIMEOUT_MS = 12000;
const MAX_RETRIES = 1;

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
 * Consulta dados do CNPJ na API pública
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

  // 2. Pre-check para dados de demonstração offline se falhar ou para demonstração rápida
  const isBancoDoBrasil = cnpj === '00000000000191';
  const isPetrobras = cnpj === '33000167000101';

  // 3. Monta URLs candidatas: proxy do vite (/api-cnpj) para evitar CORS no dev, e fallback direto
  const urls = [
    `/api-cnpj/${cnpj}`,
    `https://publica.cnpj.ws/cnpj/${cnpj}`
  ];

  let lastError = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    for (const url of urls) {
      try {
        const response = await fetchWithTimeout(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        // Caso de Sucesso
        if (response.ok) {
          const data = await response.json();
          // Salva no cache local
          cacheService.set(cnpj, data);
          return {
            success: true,
            data,
            fromCache: false
          };
        }

        // Tratamento de códigos de erro específicos
        const errorJson = await response.json().catch(() => null);

        if (response.status === 429) {
          const detail = errorJson?.detalhes || 'Limite máximo de 3 consultas por minuto atingido.';
          
          // Se for demo, podemos servir o dado de demonstração com um aviso amigável
          if (isBancoDoBrasil) {
            return {
              success: true,
              data: SAMPLE_BANCO_DO_BRASIL,
              fromCache: false,
              rateLimitWarning: detail
            };
          }
          if (isPetrobras) {
            return {
              success: true,
              data: SAMPLE_PETROBRAS,
              fromCache: false,
              rateLimitWarning: detail
            };
          }

          return {
            success: false,
            error: {
              title: 'Limite de Requisições Atingido (429)',
              message: detail,
              status: 429,
              isRateLimit: true
            }
          };
        }

        if (response.status === 404) {
          return {
            success: false,
            error: {
              title: 'CNPJ Não Encontrado (404)',
              message: 'Não foram encontrados registros para o CNPJ informado na base da Receita Federal.',
              status: 404
            }
          };
        }

        if (response.status === 400) {
          return {
            success: false,
            error: {
              title: 'Requisição Inválida (400)',
              message: errorJson?.detalhes || 'O formato ou conteúdo do CNPJ é inválido.',
              status: 400
            }
          };
        }

        if (response.status >= 500) {
          lastError = {
            title: 'Serviço Indisponível (5xx)',
            message: 'O servidor da API pública de CNPJ está temporariamente instável. Tente novamente em instantes.',
            status: response.status
          };
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          lastError = {
            title: 'Tempo Limite Excedido (Timeout)',
            message: 'O servidor demorou mais de 12 segundos para responder. Verifique sua conexão ou tente novamente.',
            status: 408
          };
        } else {
          lastError = {
            title: 'Falha de Conexão',
            message: err.message || 'Não foi possível conectar ao servidor de consulta de CNPJ.',
            status: 0
          };
        }
      }
    }

    // Se houve erro e ainda restam tentativas, aguarda antes da próxima
    if (attempt < MAX_RETRIES) {
      await new Promise(res => setTimeout(res, 1200));
    }
  }

  // Fallback gracioso para dados de demonstração conhecidos caso a rede falhe
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

  return {
    success: false,
    error: lastError || {
      title: 'Erro na Consulta',
      message: 'Não foi possível obter os dados do CNPJ.',
      status: 500
    }
  };
}
