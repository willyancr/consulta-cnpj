/**
 * Utilitários de formatação de dados para padrões brasileiros (pt-BR)
 */

export { cleanCnpj, maskCnpj } from './cnpjValidator';

export function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return 'Não informado';
  const numeric = typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'));
  if (isNaN(numeric)) return String(value);

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
}

export function formatDate(dateString) {
  if (!dateString) return 'Não informada';
  
  // Trata formato YYYY-MM-DD ou ISO com timestamp
  const dateOnly = String(dateString).split('T')[0];
  const parts = dateOnly.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    const [year, month, day] = parts;
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }

  // Fallback caso venha em outro formato parseável
  const d = new Date(dateString);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString('pt-BR');
  }

  return dateString;
}

export function formatCep(cep) {
  if (!cep) return 'Não informado';
  const digits = String(cep).replace(/\D/g, '');
  if (digits.length === 8) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return cep;
}

export function formatPhone(ddd, phone) {
  if (!phone) return 'Não informado';
  const cleanDdd = ddd ? String(ddd).replace(/\D/g, '') : '';
  const cleanPhone = String(phone).replace(/\D/g, '');

  if (cleanPhone.length === 9) {
    const formatted = `${cleanPhone.slice(0, 5)}-${cleanPhone.slice(5)}`;
    return cleanDdd ? `(${cleanDdd}) ${formatted}` : formatted;
  }
  if (cleanPhone.length === 8) {
    const formatted = `${cleanPhone.slice(0, 4)}-${cleanPhone.slice(4)}`;
    return cleanDdd ? `(${cleanDdd}) ${formatted}` : formatted;
  }
  return cleanDdd ? `(${cleanDdd}) ${phone}` : phone;
}

export function formatBoolean(val) {
  if (val === true || val === 'true' || val === 'Sim' || val === 'SIM') return 'Sim';
  if (val === false || val === 'false' || val === 'Não' || val === 'NÃO' || val === 'Nao') return 'Não';
  if (val === null || val === undefined) return 'Não informado';
  return String(val);
}

export function formatCpfCnpj(doc) {
  if (!doc) return 'Não informado';
  const digits = String(doc).replace(/\D/g, '');
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }
  if (digits.length === 14) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
  }
  return doc;
}
