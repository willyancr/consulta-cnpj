/**
 * Utilitário para validação e máscara de CNPJ
 * Baseado no algoritmo oficial da Receita Federal (Módulo 11)
 */

export function cleanCnpj(value) {
  if (!value) return '';
  return String(value).replace(/\D/g, '');
}

export function maskCnpj(value) {
  const digits = cleanCnpj(value).slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export function validateCnpj(cnpj) {
  const cleaned = cleanCnpj(cnpj);

  if (!cleaned) {
    return { isValid: false, message: 'Informe o número do CNPJ.' };
  }

  if (cleaned.length !== 14) {
    return { isValid: false, message: `O CNPJ deve conter 14 dígitos (atual: ${cleaned.length}).` };
  }

  // Verifica se todos os dígitos são iguais (ex: 00000000000000, 11111111111111)
  if (/^(\d)\1{13}$/.test(cleaned)) {
    return { isValid: false, message: 'CNPJ inválido: todos os dígitos são idênticos.' };
  }

  // Cálculo do primeiro dígito verificador
  let tamanho = cleaned.length - 2;
  let numeros = cleaned.substring(0, tamanho);
  const digitos = cleaned.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i), 10) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0), 10)) {
    return { isValid: false, message: 'Dígito verificador do CNPJ inválido.' };
  }

  // Cálculo do segundo dígito verificador
  tamanho = tamanho + 1;
  numeros = cleaned.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i), 10) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1), 10)) {
    return { isValid: false, message: 'Dígito verificador do CNPJ inválido.' };
  }

  return { isValid: true, message: 'CNPJ válido.' };
}
