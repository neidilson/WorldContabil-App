import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Filter,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Percent,
  Calendar,
  Building2,
  FileCheck2,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { FiscalComplianceReport, UserProfile } from '../types';
import { FISCAL_REPORTS } from '../data/mockData';
import { exportFiscalReportToCSV, triggerPrintReport } from '../utils/exportUtils';

interface FiscalReportsViewProps {
  currentUser: UserProfile;
  onOpenAIChat: () => void;
}

export const FiscalReportsView: React.FC<FiscalReportsViewProps> = ({
  currentUser,
  onOpenAIChat,
}) => {
  const [reports, setReports] = useState<FiscalComplianceReport[]>(FISCAL_REPORTS);
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0].id);

  // Advanced filters state
  const [filterRegime, setFilterRegime] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Custom simulation slider overrides
  const [overrideTaxRate, setOverrideTaxRate] = useState<number>(0); // adjustment in %

  const activeReport = reports.find((r) => r.id === selectedReportId) || reports[0];

  // Calculated adjusted metrics
  const effectiveGrossRevenue = activeReport.grossRevenue;
  const effectiveDeductions = activeReport.deductions;
  const effectiveNetRevenue = effectiveGrossRevenue - effectiveDeductions;
  const effectiveCosts = activeReport.operationalCosts;
  const baseTax = activeReport.taxPayable;
  const adjustedTax = Math.max(0, baseTax * (1 + overrideTaxRate / 100));
  const effectiveNetIncome = effectiveNetRevenue - effectiveCosts - adjustedTax;
  const netMarginPercent = effectiveNetRevenue > 0 ? (effectiveNetIncome / effectiveNetRevenue) * 100 : 0;
  const ebitdaEstimated = effectiveNetIncome + adjustedTax + effectiveCosts * 0.15;

  const handleExportCSV = () => {
    exportFiscalReportToCSV({
      ...activeReport,
      taxPayable: adjustedTax,
      netIncome: effectiveNetIncome,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner (hidden during print) */}
      <div className="no-print bg-gradient-to-r from-blue-900 via-indigo-900 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-400 text-slate-900 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <FileCheck2 className="w-3.5 h-3.5" /> Conformidade Fiscal Automatizada
            </span>
            <span className="text-xs text-blue-200">
              Gerador de DRE & Demonstrativos Auditáveis
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Relatórios Fiscais, DRE e Demonstrações Financeiras
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-2 leading-relaxed">
            Apuração automática em conformidade com as Normas Brasileiras de Contabilidade (NBC TG 1000 / CPC 26) e leis tributárias federais. Filtros avançados para personalização de cenários tributários e exportação instantânea em PDF e CSV.
          </p>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={handleExportCSV}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span>Exportar Dados em CSV</span>
            </button>
            <button
              onClick={triggerPrintReport}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Exportar Relatório em PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters Bar (no-print) */}
      <div className="no-print bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>Filtros Avançados e Seleção de Relatório</span>
          </h3>
          <span className="text-xs text-slate-500">
            Selecione o demonstrativo contábil desejado
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Demonstrativo Selecionado
            </label>
            <select
              value={selectedReportId}
              onChange={(e) => setSelectedReportId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:border-blue-600 outline-none"
            >
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.period})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Regime Tributário
            </label>
            <select
              value={filterRegime}
              onChange={(e) => setFilterRegime(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:border-blue-600 outline-none"
            >
              <option value="ALL">Todos os Regimes</option>
              <option value="SIMPLES">Simples Nacional (LC 123)</option>
              <option value="PRESUMIDO">Lucro Presumido</option>
              <option value="REAL">Lucro Real (Trimestral/Anual)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Ajuste de Carga Tributária ({overrideTaxRate >= 0 ? `+${overrideTaxRate}%` : `${overrideTaxRate}%`})
            </label>
            <input
              type="range"
              min={-30}
              max={30}
              step={5}
              value={overrideTaxRate}
              onChange={(e) => setOverrideTaxRate(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>-30% (Incentivo Fiscal)</span>
              <span>0% Padrão</span>
              <span>+30% (Majoração)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Metrics Dashboard KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Receita Operacional Líquida
          </span>
          <span className="text-xl font-black text-slate-900 mt-1 block">
            R$ {effectiveNetRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
            Base tributável apurada
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Custos Operacionais & CPV
          </span>
          <span className="text-xl font-black text-slate-900 mt-1 block">
            R$ {effectiveCosts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">
            CPC 16 / Custos absorvidos
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Tributos Apurados (Provisão)
          </span>
          <span className="text-xl font-black text-rose-700 mt-1 block">
            R$ {adjustedTax.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">
            DARF / DAS a recolher
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Lucro Líquido do Exercício
          </span>
          <span className="text-xl font-black text-emerald-600 mt-1 block">
            R$ {effectiveNetIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-emerald-700 font-bold mt-0.5 block">
            Margem Líquida: {netMarginPercent.toFixed(1)}% • EBITDA: R$ {(ebitdaEstimated / 1000).toFixed(0)}k
          </span>
        </div>
      </div>

      {/* Main Printable Document Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm printable-card">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between pb-6 border-b-2 border-slate-900 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-blue-900">World</span>
              <span className="text-xl font-black text-emerald-600">Contábil</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono ml-2">
                DOC AUDITADO #DOC-{activeReport.id.toUpperCase()}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 mt-2">
              DEMONSTRAÇÃO DO RESULTADO DO EXERCÍCIO (DRE GERENCIAL)
            </h2>
            <p className="text-xs text-slate-600">
              Conformidade com CPC 26 (R1), NBC TG 1000 e Lei nº 6.404/1976
            </p>
          </div>

          <div className="text-right text-xs text-slate-600 space-y-0.5">
            <div><strong>Empresa:</strong> {activeReport.companyName}</div>
            <div><strong>CNPJ:</strong> {activeReport.cnpj}</div>
            <div><strong>Período Contábil:</strong> {activeReport.period}</div>
            <div><strong>Data de Emissão:</strong> {new Date().toLocaleDateString('pt-BR')}</div>
          </div>
        </div>

        {/* Structured DRE Financial Statement Table */}
        <div className="mt-6 space-y-2">
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-300 text-slate-700 font-bold">
                  <th className="py-2.5 text-left font-sans">Discriminação das Contas de Resultado</th>
                  <th className="py-2.5 text-right font-sans">Referência Normativa</th>
                  <th className="py-2.5 text-right font-sans">Valor Contábil (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr className="font-bold text-slate-900 bg-slate-50/70">
                  <td className="py-2.5 pl-2">(+) RECEITA OPERACIONAL BRUTA DE VENDAS E SERVIÇOS</td>
                  <td className="py-2.5 text-right text-[11px] text-slate-500 font-sans">CPC 47 / NBC TG 47</td>
                  <td className="py-2.5 text-right">{effectiveGrossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>

                <tr className="text-slate-600">
                  <td className="py-2 pl-6">(-) Deduções da Receita Bruta, Devoluções e Tributos sobre Vendas</td>
                  <td className="py-2 text-right text-[11px] text-slate-500 font-sans">PIS / COFINS / ICMS / ISS</td>
                  <td className="py-2 text-right text-rose-600">({effectiveDeductions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})</td>
                </tr>

                <tr className="font-bold text-slate-900 bg-blue-50/40">
                  <td className="py-2.5 pl-2">(=) RECEITA OPERACIONAL LÍQUIDA</td>
                  <td className="py-2.5 text-right text-[11px] text-blue-700 font-sans">Subtotal 1</td>
                  <td className="py-2.5 text-right text-blue-900">{effectiveNetRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>

                <tr className="text-slate-600">
                  <td className="py-2 pl-6">(-) Custos dos Produtos Vendidos e Serviços Prestados (CPV/CSP)</td>
                  <td className="py-2 text-right text-[11px] text-slate-500 font-sans">CPC 16 (Estoques)</td>
                  <td className="py-2 text-right text-rose-600">({effectiveCosts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})</td>
                </tr>

                <tr className="font-bold text-slate-900 bg-slate-50/70">
                  <td className="py-2.5 pl-2">(=) RESULTADO OPERACIONAL BRUTO (LUCRO BRUTO)</td>
                  <td className="py-2.5 text-right text-[11px] text-slate-500 font-sans">Margem Bruta {( ( (effectiveNetRevenue - effectiveCosts) / effectiveNetRevenue) * 100).toFixed(1)}%</td>
                  <td className="py-2.5 text-right">{(effectiveNetRevenue - effectiveCosts).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>

                <tr className="text-slate-600">
                  <td className="py-2 pl-6">(-) Provisão para Tributos sobre o Lucro (IRPJ, CSLL ou DAS)</td>
                  <td className="py-2 text-right text-[11px] text-slate-500 font-sans">CPC 32 / NBC TG 32</td>
                  <td className="py-2 text-right text-rose-600">({adjustedTax.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})</td>
                </tr>

                <tr className="font-black text-sm bg-emerald-50 text-emerald-950 border-t-2 border-b-2 border-emerald-600">
                  <td className="py-3 pl-2">(=) RESULTADO LÍQUIDO DO EXERCÍCIO (LUCRO LÍQUIDO)</td>
                  <td className="py-3 text-right text-xs font-sans text-emerald-800">Margem Líq: {netMarginPercent.toFixed(1)}%</td>
                  <td className="py-3 text-right text-emerald-900">R$ {effectiveNetIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Auditor Opinion & Normative References */}
        <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Pronunciamentos Técnicos CPC Vinculados:</span>
            </h4>
            <ul className="space-y-1 text-slate-600 pl-4 list-disc">
              {activeReport.cpcReferences.map((ref, idx) => (
                <li key={idx}><strong>{ref}</strong></li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-slate-700">
              Parecer Técnico do Responsável Contábil:
            </h4>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              "{activeReport.notes} Declaramos para os devidos fins legais e societários que as contas acima refletem fidedignamente a posição patrimonial e financeira da entidade."
            </p>
            <div className="pt-3 text-[11px] text-slate-500 flex justify-between items-center">
              <span>Auditoria: <strong>WorldContábil Certificadora</strong></span>
              <span className="font-mono">CRC-BR 000001/O-ADM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
