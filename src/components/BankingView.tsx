import React, { useState } from 'react';
import {
  Landmark,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Download,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Search,
  CheckCircle,
  ExternalLink,
  PlusCircle,
  FileText,
  Printer,
  Sparkles,
} from 'lucide-react';
import { BankAccount, FinancialTransaction, UserProfile } from '../types';
import { CONNECTED_BANKS } from '../data/mockData';
import { exportTransactionsToCSV, triggerPrintReport } from '../utils/exportUtils';
import { simulateBankingWebhook } from '../services/api';

interface BankingViewProps {
  currentUser: UserProfile;
  transactions: FinancialTransaction[];
  onAddTransaction: (txn: FinancialTransaction) => void;
  onAuditReview: (txnId: string) => void;
  onPushSuspiciousAlert: (txn: FinancialTransaction) => void;
}

export const BankingView: React.FC<BankingViewProps> = ({
  currentUser,
  transactions,
  onAddTransaction,
  onAuditReview,
  onPushSuspiciousAlert,
}) => {
  const [banks, setBanks] = useState<BankAccount[]>(CONNECTED_BANKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterSuspiciousOnly, setFilterSuspiciousOnly] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showSimModal, setShowSimModal] = useState(false);

  // New simulation form state
  const [simBankId, setSimBankId] = useState('bank_itau');
  const [simAmount, setSimAmount] = useState('85000');
  const [simDesc, setSimDesc] = useState('TRANSFERENCIA PIX ATIPICA EM LOTE NOTURNO');
  const [simType, setSimType] = useState<'DEBIT' | 'CREDIT'>('DEBIT');
  const [simCategory, setSimCategory] = useState<FinancialTransaction['category']>('Transferência PIX');

  const totalAggregatedBalance = banks.reduce((acc, b) => acc + b.balance, 0);
  const suspiciousCount = transactions.filter((t) => t.isSuspicious && !t.auditReviewed).length;

  const handleSimulateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulating(true);

    const amountNum = parseFloat(simAmount) || 50000;
    const selectedBank = banks.find((b) => b.id === simBankId) || banks[0];

    const result = await simulateBankingWebhook({
      bankId: simBankId,
      amount: amountNum,
      type: 'PIX_NOTURNO_ATIPICO',
      counterparty: 'Destinatário Externo',
    });

    const newTxn: FinancialTransaction = {
      id: result.transactionId || 'TXN-' + Math.floor(Math.random() * 900000 + 100000),
      bankId: selectedBank.id,
      bankName: selectedBank.bankName,
      description: simDesc,
      amount: amountNum,
      type: simType,
      category: simCategory,
      date: 'Agora, às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isSuspicious: result.isSuspicious,
      status: result.isSuspicious ? 'ALERTA_AUDITORIA' : 'CONCILIADO',
      flagReason: result.auditMessage,
    };

    onAddTransaction(newTxn);

    if (result.isSuspicious) {
      onPushSuspiciousAlert(newTxn);
    }

    setIsSimulating(false);
    setShowSimModal(false);
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === 'ALL' ||
      (filterType === 'CREDIT' && t.type === 'CREDIT') ||
      (filterType === 'DEBIT' && t.type === 'DEBIT');
    const matchesSuspicious = !filterSuspiciousOnly || (t.isSuspicious && !t.auditReviewed);

    return matchesSearch && matchesType && matchesSuspicious;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Landmark className="w-3.5 h-3.5" /> Open Finance Integrado
            </span>
            <span className="text-xs text-emerald-300">
              Conexão Direta com os Principais Bancos do Mercado
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Gestão Bancária, Conciliação e Detecção de Fraudes
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-2 leading-relaxed">
            Sincronização contínua com Itaú, Bradesco, Santander, Nubank e Banco do Brasil. Rastreio automatizado de conformidade fiscal e alertas push para movimentações suspeitas (COAF / Receita Federal).
          </p>

          {/* Aggregated Balance KPI */}
          <div className="flex flex-wrap items-center gap-6 mt-5 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-200 block">
                Saldo Global Conciliado (Open Finance)
              </span>
              <span className="text-2xl font-black text-white">
                R$ {totalAggregatedBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="h-8 w-px bg-white/20 hidden sm:block" />

            <div>
              <span className="text-[10px] uppercase font-bold text-amber-200 block">
                Alertas de Auditoria Pendentes
              </span>
              <span className="text-2xl font-black text-amber-300 flex items-center gap-1.5">
                {suspiciousCount > 0 && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {suspiciousCount}
              </span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setShowSimModal(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Simular Webhook Bancário</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Banks List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-blue-600" />
            <span>Instituições Bancárias Integradas ({banks.length})</span>
          </h3>
          <span className="text-xs text-slate-500">API BACEN Open Finance v3.2</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {banks.map((bank) => (
            <div
              key={bank.id}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:border-blue-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400">Cód. {bank.bankCode}</span>
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                      bank.status === 'CONNECTED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {bank.status === 'CONNECTED' ? 'CONECTADO' : 'SINCRONIZANDO'}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 leading-tight">{bank.bankName}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Ag: {bank.agency} • CC: {bank.accountNumber}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 block">Saldo Disponível:</span>
                <span className="text-sm font-extrabold text-slate-900">
                  R$ {bank.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Sinc: {bank.lastSync}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions & Suspicious Movement Alerts Ledger */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Extrato Financeiro & Histórico de Operações
            </h3>
            <p className="text-xs text-slate-500">
              Trilha auditável de todas as entradas, saídas e conciliações fiscais.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportTransactionsToCSV(filteredTransactions)}
              className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Exportar CSV</span>
            </button>
            <button
              onClick={triggerPrintReport}
              className="px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </button>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="w-full md:max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Pesquisar por descrição, favorecido, banco..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterType('ALL')}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold cursor-pointer ${
                filterType === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('CREDIT')}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold cursor-pointer ${
                filterType === 'CREDIT' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Créditos (+)
            </button>
            <button
              onClick={() => setFilterType('DEBIT')}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold cursor-pointer ${
                filterType === 'DEBIT' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Débitos (-)
            </button>

            <button
              onClick={() => setFilterSuspiciousOnly(!filterSuspiciousOnly)}
              className={`text-xs px-3 py-1.5 rounded-full font-bold cursor-pointer flex items-center gap-1 ${
                filterSuspiciousOnly
                  ? 'bg-amber-600 text-white ring-2 ring-amber-300'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Apenas Alertas Suspeitos</span>
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Data & Banco</th>
                <th className="p-3">Descrição da Operação</th>
                <th className="p-3">Categoria Contábil</th>
                <th className="p-3 text-right">Valor (R$)</th>
                <th className="p-3">Status de Auditoria</th>
                <th className="p-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((t) => {
                const isDebit = t.type === 'DEBIT';
                return (
                  <tr
                    key={t.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      t.isSuspicious && !t.auditReviewed ? 'bg-amber-50/60' : ''
                    }`}
                  >
                    <td className="p-3 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 block">{t.date}</span>
                      <span className="text-[10px] text-slate-400">{t.bankName}</span>
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-slate-900">{t.description}</div>
                      {t.isSuspicious && (
                        <div className="text-[11px] text-amber-800 mt-0.5 flex items-start gap-1 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{t.flagReason || 'Padrão de movimentação incompatível com o faturamento.'}</span>
                        </div>
                      )}
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {t.category}
                      </span>
                    </td>

                    <td className="p-3 text-right whitespace-nowrap font-mono font-bold">
                      <span
                        className={`flex items-center justify-end gap-1 ${
                          isDebit ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        {isDebit ? (
                          <ArrowDownLeft className="w-3.5 h-3.5 text-rose-500" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                        )}
                        {isDebit ? '-' : '+'} R${' '}
                        {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      {t.auditReviewed ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Auditado & Justificado
                        </span>
                      ) : t.isSuspicious ? (
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit animate-pulse">
                          <AlertTriangle className="w-3 h-3 text-amber-700" />
                          Alerta COAF Pendente
                        </span>
                      ) : (
                        <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          Conciliado
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-right whitespace-nowrap">
                      {t.isSuspicious && !t.auditReviewed ? (
                        <button
                          onClick={() => onAuditReview(t.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                        >
                          Justificar / Aprovar
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400">Regular</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SIMULATE WEBHOOK MODAL */}
      {showSimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Simulador de Webhook Bancário (Open Finance)
                </h3>
              </div>
              <button
                onClick={() => setShowSimModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-2">
              Teste o disparo de notificações push e alertas de conformidade gerando uma transação comum ou suspeita:
            </p>

            <form onSubmit={handleSimulateWebhook} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Instituição Bancária
                </label>
                <select
                  value={simBankId}
                  onChange={(e) => setSimBankId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white outline-none"
                >
                  {banks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.bankName} (Cód {b.bankCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tipo de Operação
                  </label>
                  <select
                    value={simType}
                    onChange={(e) => setSimType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white outline-none"
                  >
                    <option value="DEBIT">Débito (-)</option>
                    <option value="CREDIT">Crédito (+)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    required
                    value={simAmount}
                    onChange={(e) => setSimAmount(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descrição do Lançamento
                </label>
                <input
                  type="text"
                  required
                  value={simDesc}
                  onChange={(e) => setSimDesc(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 outline-none"
                />
              </div>

              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs text-amber-900">
                <span className="font-bold block mb-1">Regra de Compliance:</span>
                Valores acima de R$ 50.000,00 ou identificados como atípicos acionam imediatamente a notificação push de suspeita de fraude fiscal.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSimModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSimulating}
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-2"
                >
                  {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Disparar Webhook</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
