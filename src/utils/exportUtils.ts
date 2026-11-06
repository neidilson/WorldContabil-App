import { FinancialTransaction, FiscalComplianceReport } from '../types';

export function exportTransactionsToCSV(transactions: FinancialTransaction[], filename = 'extrato_financeiro_worldcontabil.csv') {
  const headers = ['ID Transação', 'Banco', 'Descrição', 'Valor (R$)', 'Tipo', 'Categoria', 'Data', 'Suspeita', 'Status', 'Motivo Alerta'];
  
  const rows = transactions.map(t => [
    `"${t.id}"`,
    `"${t.bankName}"`,
    `"${t.description.replace(/"/g, '""')}"`,
    `"${t.amount.toFixed(2)}"`,
    `"${t.type}"`,
    `"${t.category}"`,
    `"${t.date}"`,
    `"${t.isSuspicious ? 'SIM (ALERTA)' : 'NÃO'}"`,
    `"${t.status}"`,
    `"${(t.flagReason || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportFiscalReportToCSV(report: FiscalComplianceReport) {
  const lines = [
    ['WORLDCONTABIL - RELATÓRIO DE CONFORMIDADE FISCAL E DRE'],
    [`Empresa: ${report.companyName}`],
    [`CNPJ: ${report.cnpj}`],
    [`Período: ${report.period}`],
    [`Data de Emissão: ${new Date(report.generatedAt).toLocaleDateString('pt-BR')}`],
    [`Status: ${report.status}`],
    [''],
    ['CONTA CONTÁBIL / LINHA DA DRE', 'VALOR (R$)'],
    ['(+) Receita Operacional Bruta', report.grossRevenue.toFixed(2)],
    ['(-) Deduções e Tributos sobre Vendas', report.deductions.toFixed(2)],
    ['(=) Receita Operacional Líquida', report.netRevenue.toFixed(2)],
    ['(-) Custos Operacionais e CPV/CSP', report.operationalCosts.toFixed(2)],
    ['(-) Provisão para Tributos (IRPJ/CSLL/DAS)', report.taxPayable.toFixed(2)],
    ['(=) Lucro Líquido do Período', report.netIncome.toFixed(2)],
    [''],
    ['NORMAS TÉCNICAS APLICÁVEIS:'],
    ...report.cpcReferences.map(ref => [`- ${ref}`]),
    [''],
    [`Parecer / Notas: ${report.notes}`],
  ];

  const csvContent = '\uFEFF' + lines.map(line => line.map(item => `"${String(item).replace(/"/g, '""')}"`).join(';')).join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `relatorio_${report.id}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function triggerPrintReport() {
  window.print();
}
