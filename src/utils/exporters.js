/**
 * Utilitários para exportação de dados em CSV e impressão em PDF
 */

import { formatCurrency, formatDate, formatPhone, formatCep } from './formatters';

/**
 * Exporta os dados cadastrais da empresa em formato CSV compatível com Excel (com BOM UTF-8)
 */
export function exportToCsv(data) {
  if (!data) return;

  const est = data.estabelecimento || {};
  const razao = data.razao_social || '';
  const fantasia = est.nome_fantasia || 'Não informado';
  const cnpj = est.cnpj || data.cnpj_raiz || '';
  const situacao = est.situacao_cadastral || 'Não informada';
  const dataSituacao = formatDate(est.data_situacao_cadastral);
  const capital = formatCurrency(data.capital_social);
  const natureza = data.natureza_juridica?.descricao || 'Não informada';
  const porte = data.porte?.descricao || 'Não informado';
  const cnaePrincipal = est.atividade_principal 
    ? `${est.atividade_principal.subclasse} - ${est.atividade_principal.descricao}`
    : 'Não informado';
  
  const endereco = [
    `${est.tipo_logradouro || ''} ${est.logradouro || ''}`.trim(),
    est.numero ? `Nº ${est.numero}` : '',
    est.complemento ? `(${est.complemento})` : '',
    est.bairro ? `- ${est.bairro}` : '',
    est.cidade?.nome ? `- ${est.cidade.nome}/${est.estado?.sigla || ''}` : '',
    est.cep ? `CEP: ${formatCep(est.cep)}` : ''
  ].filter(Boolean).join(' ');

  const telefone = formatPhone(est.ddd1, est.telefone1);
  const email = est.email || 'Não informado';

  const rows = [
    ['CAMPO', 'VALOR'],
    ['Razão Social', `"${razao.replace(/"/g, '""')}"`],
    ['Nome Fantasia', `"${fantasia.replace(/"/g, '""')}"`],
    ['CNPJ', `"${cnpj}"`],
    ['Situação Cadastral', `"${situacao}"`],
    ['Data da Situação', `"${dataSituacao}"`],
    ['Capital Social', `"${capital}"`],
    ['Porte', `"${porte}"`],
    ['Natureza Jurídica', `"${natureza}"`],
    ['CNAE Principal', `"${cnaePrincipal.replace(/"/g, '""')}"`],
    ['Endereço Completo', `"${endereco.replace(/"/g, '""')}"`],
    ['Telefone', `"${telefone}"`],
    ['E-mail', `"${email}"`],
    [],
    ['QUADRO DE SÓCIOS E ADMINISTRADORES (QSA)'],
    ['Nome', 'Documento', 'Qualificação', 'Faixa Etária', 'País']
  ];

  if (Array.isArray(data.socios) && data.socios.length > 0) {
    data.socios.forEach(s => {
      rows.push([
        `"${(s.nome || '').replace(/"/g, '""')}"`,
        `"${s.cpf_cnpj_socio || ''}"`,
        `"${(s.qualificacao_socio?.descricao || '').replace(/"/g, '""')}"`,
        `"${s.faixa_etaria || ''}"`,
        `"${s.pais?.nome || ''}"`
      ]);
    });
  } else {
    rows.push(['Nenhum sócio listado']);
  }

  // Se houver inscrições estaduais
  if (Array.isArray(est.inscricoes_estaduais) && est.inscricoes_estaduais.length > 0) {
    rows.push([]);
    rows.push(['INSCRIÇÕES ESTADUAIS']);
    rows.push(['Inscrição', 'UF', 'Status']);
    est.inscricoes_estaduais.forEach(ie => {
      rows.push([
        `"${ie.inscricao_estadual || ''}"`,
        `"${ie.estado?.sigla || ''}"`,
        `"${ie.ativo ? 'Ativo' : 'Inativo'}"`
      ]);
    });
  }

  const csvContent = '\uFEFF' + rows.map(r => r.join(';')).join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `cnpj_${cnpj || 'empresa'}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Aciona o diálogo de impressão do navegador com o layout otimizado para PDF
 */
export function triggerPrintPdf() {
  window.print();
}
