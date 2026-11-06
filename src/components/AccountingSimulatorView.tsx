import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Calculator,
  Plus,
  Trash2,
  Share2,
  Printer,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  FileSpreadsheet,
  BookOpen,
  DollarSign,
  Download,
  Send,
  Globe2,
} from 'lucide-react';
import {
  AccountingEntry,
  AccountingExercise,
  AccountingStandard,
  CurrencyCode,
  LedgerTAccount,
  TrialBalanceItem,
  UserProfile,
} from '../types';
import { INITIAL_ACCOUNTING_EXERCISE, PGC_ANGOLA_ACCOUNTS } from '../data/mockData';
import { triggerPrintReport } from '../utils/exportUtils';

interface AccountingSimulatorViewProps {
  currentUser: UserProfile;
  onPostExerciseToFeed: (postContent: string, mediaData?: any) => void;
  onOpenAIChat: () => void;
  defaultCurrency?: CurrencyCode;
}

export const AccountingSimulatorView: React.FC<AccountingSimulatorViewProps> = ({
  currentUser,
  onPostExerciseToFeed,
  onOpenAIChat,
  defaultCurrency = 'AOA',
}) => {
  const [exercise, setExercise] = useState<AccountingExercise>(INITIAL_ACCOUNTING_EXERCISE);
  const [activeTab, setActiveTab] = useState<'diario' | 'razao' | 'balancete' | 'dre' | 'balanco'>('diario');
  const [standard, setStandard] = useState<AccountingStandard>(exercise.standard);
  const [currency, setCurrency] = useState<CurrencyCode>(exercise.currency || defaultCurrency);

  // New entry form state
  const [entryDate, setEntryDate] = useState('2026-11-06');
  const [entryDesc, setEntryDesc] = useState('');
  const [entryAmount, setEntryAmount] = useState('');
  const [debitCode, setDebitCode] = useState('42');
  const [creditCode, setCreditCode] = useState('61.1');
  const [docRef, setDocRef] = useState('Factura nº ');

  // Success toast when posted to feed
  const [postedSuccess, setPostedSuccess] = useState(false);

  // Currency formatting helper
  const formatCurrency = (val: number) => {
    const symbol = currency === 'AOA' ? 'Kz' : currency === 'BRL' ? 'R$' : '$';
    return `${symbol} ${val.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // 1. Calculate Razonetes (Ledger T-Accounts)
  const ledgerAccounts = useMemo<Record<string, LedgerTAccount>>(() => {
    const accounts: Record<string, LedgerTAccount> = {};

    exercise.entries.forEach((entry) => {
      // Debit side
      if (!accounts[entry.debitCode]) {
        accounts[entry.debitCode] = {
          accountCode: entry.debitCode,
          accountName: entry.debitAccount,
          debitEntries: [],
          creditEntries: [],
          totalDebit: 0,
          totalCredit: 0,
          balance: 0,
          balanceType: 'NULO',
        };
      }
      accounts[entry.debitCode].debitEntries.push({
        id: entry.id,
        desc: entry.description,
        amount: entry.amount,
      });
      accounts[entry.debitCode].totalDebit += entry.amount;

      // Credit side
      if (!accounts[entry.creditCode]) {
        accounts[entry.creditCode] = {
          accountCode: entry.creditCode,
          accountName: entry.creditAccount,
          debitEntries: [],
          creditEntries: [],
          totalDebit: 0,
          totalCredit: 0,
          balance: 0,
          balanceType: 'NULO',
        };
      }
      accounts[entry.creditCode].creditEntries.push({
        id: entry.id,
        desc: entry.description,
        amount: entry.amount,
      });
      accounts[entry.creditCode].totalCredit += entry.amount;
    });

    // Compute balances
    Object.values(accounts).forEach((acc) => {
      if (acc.totalDebit > acc.totalCredit) {
        acc.balance = acc.totalDebit - acc.totalCredit;
        acc.balanceType = 'DEVEDOR';
      } else if (acc.totalCredit > acc.totalDebit) {
        acc.balance = acc.totalCredit - acc.totalDebit;
        acc.balanceType = 'CREDOR';
      } else {
        acc.balance = 0;
        acc.balanceType = 'NULO';
      }
    });

    return accounts;
  }, [exercise.entries]);

  // 2. Calculate Balancete de Verificação (Trial Balance)
  const trialBalanceItems = useMemo<TrialBalanceItem[]>(() => {
    return Object.values(ledgerAccounts).map((acc) => ({
      accountCode: acc.accountCode,
      accountName: acc.accountName,
      totalDebit: acc.totalDebit,
      totalCredit: acc.totalCredit,
      debitBalance: acc.balanceType === 'DEVEDOR' ? acc.balance : 0,
      creditBalance: acc.balanceType === 'CREDOR' ? acc.balance : 0,
    }));
  }, [ledgerAccounts]);

  const totalDebitMovements = trialBalanceItems.reduce((acc, i) => acc + i.totalDebit, 0);
  const totalCreditMovements = trialBalanceItems.reduce((acc, i) => acc + i.totalCredit, 0);
  const totalDebitBalances = trialBalanceItems.reduce((acc, i) => acc + i.debitBalance, 0);
  const totalCreditBalances = trialBalanceItems.reduce((acc, i) => acc + i.creditBalance, 0);
  const isTrialBalanced = Math.abs(totalDebitBalances - totalCreditBalances) < 0.01;

  // 3. Compute DRE (Demonstração dos Resultados)
  const dreData = useMemo(() => {
    // Proveitos (Classe 6 ou contas de receita)
    let totalProveitos = 0;
    // Custos (Classe 7 ou contas de despesa)
    let totalCustos = 0;
    let cmvmc = 0;
    let pessoal = 0;
    let fst = 0;
    let outrosCustos = 0;

    Object.values(ledgerAccounts).forEach((acc) => {
      const isClasse6 = acc.accountCode.startsWith('6');
      const isClasse7 = acc.accountCode.startsWith('7');

      if (isClasse6) {
        totalProveitos += acc.balanceType === 'CREDOR' ? acc.balance : -acc.balance;
      }
      if (isClasse7) {
        const val = acc.balanceType === 'DEVEDOR' ? acc.balance : -acc.balance;
        totalCustos += val;
        if (acc.accountCode.startsWith('71')) cmvmc += val;
        else if (acc.accountCode.startsWith('72')) pessoal += val;
        else if (acc.accountCode.startsWith('73')) fst += val;
        else outrosCustos += val;
      }
    });

    const resultadoOperacional = totalProveitos - totalCustos;
    // Imposto Industrial estimado em Angola: 25% (ou 15% PME)
    const taxaImposto = 0.25;
    const impostoEstimado = resultadoOperacional > 0 ? resultadoOperacional * taxaImposto : 0;
    const resultadoLiquido = resultadoOperacional - impostoEstimado;

    return {
      totalProveitos,
      cmvmc,
      pessoal,
      fst,
      outrosCustos,
      totalCustos,
      resultadoOperacional,
      impostoEstimado,
      resultadoLiquido,
    };
  }, [ledgerAccounts]);

  // 4. Compute Balanço Patrimonial (Activo vs Passivo + Capital Próprio)
  const balanceSheetData = useMemo(() => {
    let activoImobilizado = 0; // Classe 1
    let existencias = 0; // Classe 2
    let clientes = 0; // Conta 31
    let meiosMonetarios = 0; // Classe 4

    let passivoFornecedores = 0; // Conta 32
    let passivoEstado = 0; // Conta 34
    let passivoEmprestimos = 0; // Conta 33
    let outrosPassivos = 0;

    let capitalSocial = 0; // Conta 51
    let reservas = 0; // Conta 55
    let resultadosTransitados = 0; // Conta 56

    Object.values(ledgerAccounts).forEach((acc) => {
      const code = acc.accountCode;
      const val = acc.balance;

      if (code.startsWith('1')) {
        if (code.startsWith('18')) activoImobilizado -= val; // Amortizações acumuladas rectificam
        else activoImobilizado += val;
      } else if (code.startsWith('2')) {
        existencias += val;
      } else if (code.startsWith('31')) {
        clientes += val;
      } else if (code.startsWith('4')) {
        meiosMonetarios += val;
      } else if (code.startsWith('32')) {
        passivoFornecedores += val;
      } else if (code.startsWith('34')) {
        passivoEstado += val;
      } else if (code.startsWith('33')) {
        passivoEmprestimos += val;
      } else if (code.startsWith('51')) {
        capitalSocial += val;
      } else if (code.startsWith('55')) {
        reservas += val;
      } else if (code.startsWith('56')) {
        resultadosTransitados += val;
      }
    });

    const totalActivo = activoImobilizado + existencias + clientes + meiosMonetarios;
    const totalPassivo = passivoFornecedores + passivoEstado + passivoEmprestimos + outrosPassivos;
    const capitalProprio = capitalSocial + reservas + resultadosTransitados + dreData.resultadoLiquido;
    const totalPassivoECapital = totalPassivo + capitalProprio;
    const equilibrado = Math.abs(totalActivo - totalPassivoECapital) < 1.0;

    return {
      activoImobilizado,
      existencias,
      clientes,
      meiosMonetarios,
      totalActivo,
      passivoFornecedores,
      passivoEstado,
      passivoEmprestimos,
      totalPassivo,
      capitalSocial,
      reservas,
      resultadosTransitados,
      resultadoExercicio: dreData.resultadoLiquido,
      capitalProprio,
      totalPassivoECapital,
      equilibrado,
    };
  }, [ledgerAccounts, dreData]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(entryAmount);
    if (!entryDesc.trim() || isNaN(amountVal) || amountVal <= 0) return;

    // Lookup names
    const debitAcc = PGC_ANGOLA_ACCOUNTS.find((a) => a.code === debitCode);
    const creditAcc = PGC_ANGOLA_ACCOUNTS.find((a) => a.code === creditCode);

    const newEntry: AccountingEntry = {
      id: 'e_' + Date.now(),
      date: entryDate,
      description: entryDesc,
      debitCode,
      debitAccount: debitAcc ? `${debitAcc.name} (${debitAcc.code})` : `Conta ${debitCode}`,
      creditCode,
      creditAccount: creditAcc ? `${creditAcc.name} (${creditAcc.code})` : `Conta ${creditCode}`,
      amount: amountVal,
      standard,
      documentRef: docRef.trim() || undefined,
    };

    setExercise((prev) => ({
      ...prev,
      entries: [...prev.entries, newEntry],
    }));

    setEntryDesc('');
    setEntryAmount('');
  };

  const handleDeleteEntry = (entryId: string) => {
    setExercise((prev) => ({
      ...prev,
      entries: prev.entries.filter((e) => e.id !== entryId),
    }));
  };

  const handlePostToFeed = () => {
    const postContent = `📊 NOVO EXERCÍCIO CONTABILÍSTICO SIMULADO: "${exercise.title}"

🏛️ Norma: ${standard === 'PGC_ANGOLA' ? 'Plano Geral de Contabilidade de Angola (PGC)' : 'NBC TG / Brasil'}
💰 Moeda: ${currency === 'AOA' ? 'Kwanzas (Kz)' : 'Reais (R$)'}
📝 Total de Lançamentos: ${exercise.entries.length}

Resultados Apurados:
• Proveitos Brutos: ${formatCurrency(dreData.totalProveitos)}
• Custos Totais: ${formatCurrency(dreData.totalCustos)}
• Resultado Líquido do Exercício: ${formatCurrency(dreData.resultadoLiquido)}
• Total do Activo: ${formatCurrency(balanceSheetData.totalActivo)}
• Quadratura do Balancete: ${isTrialBalanced ? '✅ EQUILIBRADO (Débito = Crédito)' : '⚠️ Necessita Revisão'}

O que acham dos lançamentos e da tributação aplicada? Deixem suas opiniões e dúvidas técnicas nos comentários! 👇`;

    onPostExerciseToFeed(postContent, {
      exerciseId: exercise.id,
      title: exercise.title,
      balance: balanceSheetData.totalActivo,
    });

    setPostedSuccess(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      setPostedSuccess(false);
    }, 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-400 text-slate-900 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5" /> Simulador Contabilístico Completo
            </span>
            <span className="text-xs text-blue-200">
              Angola (PGC) & Brasil (NBC) • Diário, Razão, Balancete, DRE e Balanço
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Laboratório Prático de Contabilidade & Postagem Social
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-2 leading-relaxed">
            Simule operações do início ao encerramento do exercício: faça lançamentos em partidas dobradas, visualize os razonetes em "T", feche o balancete e demonstre DRE e Balanço. Depois, publique diretamente para debater com colegas e internautas no Feed Social!
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={handlePostToFeed}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Publicar & Debater com a Comunidade</span>
            </button>

            <button
              onClick={triggerPrintReport}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Exportar PDF / Imprimir</span>
            </button>

            <div className="ml-auto flex items-center gap-2 bg-white/10 p-1.5 rounded-xl border border-white/20 text-xs">
              <span className="text-slate-300 text-[11px] px-1 font-medium">Moeda:</span>
              <button
                onClick={() => setCurrency('AOA')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  currency === 'AOA' ? 'bg-amber-400 text-slate-900' : 'text-white hover:bg-white/10'
                }`}
              >
                Kz (Angola)
              </button>
              <button
                onClick={() => setCurrency('BRL')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  currency === 'BRL' ? 'bg-emerald-500 text-white' : 'text-white hover:bg-white/10'
                }`}
              >
                R$ (Brasil)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Bar */}
      {postedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Exercício Contabilístico publicado com sucesso!</strong> Seu caso prático já está no Feed Social para debate com os membros da plataforma.
            </span>
          </div>
        </div>
      )}

      {/* Navigation Subtabs: Diário | Razão | Balancete | DRE | Balanço */}
      <div className="bg-white rounded-3xl p-2 border border-slate-200/80 shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {[
          { id: 'diario', label: `1. Livro Diário (${exercise.entries.length} Lançamentos)`, icon: FileSpreadsheet },
          { id: 'razao', label: `2. Razão / Razonetes em T (${Object.keys(ledgerAccounts).length} Contas)`, icon: Calculator },
          { id: 'balancete', label: '3. Balancete de Verificação', icon: CheckCircle2 },
          { id: 'dre', label: '4. Demonstração de Resultados (DRE)', icon: TrendingUp },
          { id: 'balanco', label: '5. Balanço Patrimonial', icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: LIVRO DIÁRIO */}
      {activeTab === 'diario' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* New Entry Form (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>Novo Lançamento Diário</span>
              </h3>
              <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-bold">
                PGC Angola Oficial
              </span>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Valor ({currency === 'AOA' ? 'Kz' : 'R$'})
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="0.00"
                    value={entryAmount}
                    onChange={(e) => setEntryAmount(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 font-mono font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Conta a Débito (Aplicação de Recursos)
                </label>
                <select
                  value={debitCode}
                  onChange={(e) => setDebitCode(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                >
                  {PGC_ANGOLA_ACCOUNTS.map((acc) => (
                    <option key={acc.code} value={acc.code}>
                      {acc.code} - {acc.name} (Cl. {acc.classe})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Conta a Crédito (Origem de Recursos)
                </label>
                <select
                  value={creditCode}
                  onChange={(e) => setCreditCode(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                >
                  {PGC_ANGOLA_ACCOUNTS.map((acc) => (
                    <option key={acc.code} value={acc.code}>
                      {acc.code} - {acc.name} (Cl. {acc.classe})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Histórico / Descrição da Operação
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ex: Aquisição de mercadorias conforme factura..."
                  value={entryDesc}
                  onChange={(e) => setEntryDesc(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Documento de Suporte (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Factura nº / Recibo / Talão"
                  value={docRef}
                  onChange={(e) => setDocRef(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar ao Diário</span>
              </button>
            </form>
          </div>

          {/* Entries Table (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">{exercise.title}</h3>
                <p className="text-xs text-slate-500">
                  Lançamentos cronológicos com aplicação do princípio das partidas dobradas
                </p>
              </div>

              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Total: {formatCurrency(exercise.entries.reduce((a, b) => a + b.amount, 0))}
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Data</th>
                    <th className="p-3">Lançamento / Histórico</th>
                    <th className="p-3">Débito (+)</th>
                    <th className="p-3">Crédito (-)</th>
                    <th className="p-3 text-right">Valor</th>
                    <th className="p-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {exercise.entries.map((entry, idx) => (
                    <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono text-[11px] whitespace-nowrap text-slate-500">
                        {entry.date}
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-900 leading-snug">{entry.description}</div>
                        {entry.documentRef && (
                          <div className="text-[10px] text-slate-400 mt-0.5">Doc: {entry.documentRef}</div>
                        )}
                      </td>
                      <td className="p-3 font-mono whitespace-nowrap">
                        <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-bold text-[11px]">
                          {entry.debitCode}
                        </span>
                        <span className="text-[11px] text-slate-600 block mt-0.5 truncate max-w-[140px]">
                          {entry.debitAccount}
                        </span>
                      </td>
                      <td className="p-3 font-mono whitespace-nowrap">
                        <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold text-[11px]">
                          {entry.creditCode}
                        </span>
                        <span className="text-[11px] text-slate-600 block mt-0.5 truncate max-w-[140px]">
                          {entry.creditAccount}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold whitespace-nowrap text-slate-900">
                        {formatCurrency(entry.amount)}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                          title="Excluir lançamento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RAZONETES EM "T" */}
      {activeTab === 'razao' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Livro Razão • Razonetes em Forma de "T"</h3>
              <p className="text-xs text-slate-500">
                Visualização clássica das movimentações a Débito (esquerda) e Crédito (direita) com cálculo de saldos.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
              {Object.keys(ledgerAccounts).length} Contas Movimentadas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Object.values(ledgerAccounts).map((acc) => (
              <div
                key={acc.accountCode}
                className="bg-white rounded-2xl border-2 border-slate-800 shadow-xs overflow-hidden flex flex-col justify-between"
              >
                {/* T-Account Header */}
                <div className="bg-slate-900 text-white p-2.5 text-center">
                  <span className="font-mono font-bold text-xs text-amber-400">[{acc.accountCode}]</span>{' '}
                  <span className="font-bold text-xs">{acc.accountName}</span>
                </div>

                {/* T-Account Body: Left (Debit) vs Right (Credit) */}
                <div className="grid grid-cols-2 divide-x-2 divide-slate-800 min-h-[160px] text-xs font-mono">
                  {/* Debit Side */}
                  <div className="p-2.5 space-y-1 bg-blue-50/20">
                    <span className="text-[10px] uppercase font-bold text-blue-700 block text-center border-b border-slate-200 pb-1">
                      Débito (+)
                    </span>
                    {acc.debitEntries.map((d, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px] py-0.5">
                        <span className="text-slate-400 text-[9px] truncate max-w-[60px]" title={d.desc}>
                          {d.desc}
                        </span>
                        <span className="font-semibold text-slate-800">{d.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Credit Side */}
                  <div className="p-2.5 space-y-1 bg-amber-50/20">
                    <span className="text-[10px] uppercase font-bold text-amber-700 block text-center border-b border-slate-200 pb-1">
                      Crédito (-)
                    </span>
                    {acc.creditEntries.map((c, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px] py-0.5">
                        <span className="text-slate-400 text-[9px] truncate max-w-[60px]" title={c.desc}>
                          {c.desc}
                        </span>
                        <span className="font-semibold text-slate-800">{c.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals & Balance Footer */}
                <div className="border-t-2 border-slate-800 p-2.5 bg-slate-50 text-xs">
                  <div className="grid grid-cols-2 divide-x divide-slate-300 pb-1.5 border-b border-slate-200 font-mono text-[11px]">
                    <span className="pr-1 text-slate-600 font-semibold">Σ Déb: {acc.totalDebit.toLocaleString()}</span>
                    <span className="pl-1 text-right text-slate-600 font-semibold">Σ Créd: {acc.totalCredit.toLocaleString()}</span>
                  </div>

                  <div className="pt-1.5 flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Saldo Apurado:</span>
                    <span
                      className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                        acc.balanceType === 'DEVEDOR'
                          ? 'bg-blue-100 text-blue-900'
                          : acc.balanceType === 'CREDOR'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {acc.balanceType}: {acc.balance.toLocaleString()} {currency === 'AOA' ? 'Kz' : 'R$'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BALANCETE DE VERIFICAÇÃO */}
      {activeTab === 'balancete' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900">Balancete de Verificação</h3>
              <p className="text-xs text-slate-500">
                Demonstrativo de controlo para comprovação do equilíbrio aritmético das contas
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
                  isTrialBalanced
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800 animate-pulse'
                }`}
              >
                {isTrialBalanced ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                <span>{isTrialBalanced ? 'Quadratura Aprovada (Equilibrado)' : 'Assimetria Contabilística'}</span>
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="bg-slate-900 text-white font-bold">
                  <th className="p-3 text-left font-sans" rowSpan={2}>Conta</th>
                  <th className="p-3 text-left font-sans" rowSpan={2}>Título da Conta</th>
                  <th className="p-2 text-center font-sans border-b border-slate-700" colSpan={2}>
                    Movimentos
                  </th>
                  <th className="p-2 text-center font-sans border-b border-slate-700" colSpan={2}>
                    Saldos Finais
                  </th>
                </tr>
                <tr className="bg-slate-800 text-slate-200 font-bold">
                  <th className="p-2 text-right">Débitos</th>
                  <th className="p-2 text-right">Créditos</th>
                  <th className="p-2 text-right">Devedor</th>
                  <th className="p-2 text-right">Credor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {trialBalanceItems.map((item) => (
                  <tr key={item.accountCode} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-blue-900">{item.accountCode}</td>
                    <td className="p-3 font-sans font-medium text-slate-900">{item.accountName}</td>
                    <td className="p-3 text-right">{item.totalDebit.toLocaleString()}</td>
                    <td className="p-3 text-right">{item.totalCredit.toLocaleString()}</td>
                    <td className="p-3 text-right font-bold text-blue-700">
                      {item.debitBalance > 0 ? item.debitBalance.toLocaleString() : '-'}
                    </td>
                    <td className="p-3 text-right font-bold text-amber-700">
                      {item.creditBalance > 0 ? item.creditBalance.toLocaleString() : '-'}
                    </td>
                  </tr>
                ))}

                {/* Totals Row */}
                <tr className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-900 text-sm">
                  <td className="p-3 font-sans" colSpan={2}>TOTAIS GERAIS:</td>
                  <td className="p-3 text-right">{totalDebitMovements.toLocaleString()}</td>
                  <td className="p-3 text-right">{totalCreditMovements.toLocaleString()}</td>
                  <td className="p-3 text-right text-blue-900">{totalDebitBalances.toLocaleString()}</td>
                  <td className="p-3 text-right text-amber-900">{totalCreditBalances.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: DRE (DEMONSTRAÇÃO DE RESULTADOS) */}
      {activeTab === 'dre' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 printable-card">
          <div className="pb-4 border-b border-slate-200">
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase">
              Demonstração dos Resultados por Natureza • {standard === 'PGC_ANGOLA' ? 'PGC Angola' : 'NBC Brasil'}
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">
              DEMONSTRAÇÃO DOS RESULTADOS DO EXERCÍCIO
            </h3>
            <p className="text-xs text-slate-500">
              Confronto de proveitos e custos por natureza para apuração do Resultado Líquido em {currency === 'AOA' ? 'Kwanzas (Kz)' : 'Reais (R$)'}.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b-2 border-slate-900 font-bold text-slate-800">
                  <th className="py-2.5 text-left font-sans">Rubricas / Contas do PGC</th>
                  <th className="py-2.5 text-right font-sans">Conta</th>
                  <th className="py-2.5 text-right font-sans">Valor ({currency === 'AOA' ? 'Kz' : 'R$'})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr className="font-bold text-slate-900 bg-emerald-50/30">
                  <td className="py-2.5 pl-2">(+) Vendas e Prestações de Serviços (Proveitos Brutos)</td>
                  <td className="py-2.5 text-right">61 / 62</td>
                  <td className="py-2.5 text-right text-emerald-800">{formatCurrency(dreData.totalProveitos)}</td>
                </tr>

                <tr className="text-slate-600">
                  <td className="py-2 pl-6">(-) Custo das Mercadorias Vendidas e Matérias Consumidas (CMVMC)</td>
                  <td className="py-2 text-right">71</td>
                  <td className="py-2 text-right text-rose-600">({formatCurrency(dreData.cmvmc)})</td>
                </tr>

                <tr className="text-slate-600">
                  <td className="py-2 pl-6">(-) Custos com o Pessoal (Remunerações e Encargos)</td>
                  <td className="py-2 text-right">72</td>
                  <td className="py-2 text-right text-rose-600">({formatCurrency(dreData.pessoal)})</td>
                </tr>

                <tr className="text-slate-600">
                  <td className="py-2 pl-6">(-) Fornecimentos e Serviços de Terceiros (FST)</td>
                  <td className="py-2 text-right">73</td>
                  <td className="py-2 text-right text-rose-600">({formatCurrency(dreData.fst)})</td>
                </tr>

                <tr className="font-bold text-slate-900 bg-blue-50/50">
                  <td className="py-2.5 pl-2">(=) RESULTADO OPERACIONAL (EBIT)</td>
                  <td className="py-2.5 text-right">81</td>
                  <td className="py-2.5 text-right text-blue-900">{formatCurrency(dreData.resultadoOperacional)}</td>
                </tr>

                <tr className="text-slate-600">
                  <td className="py-2 pl-6">(-) Imposto Industrial / Tributos sobre o Lucro Estimado (25%)</td>
                  <td className="py-2 text-right">34.2</td>
                  <td className="py-2 text-right text-rose-600">({formatCurrency(dreData.impostoEstimado)})</td>
                </tr>

                <tr className="font-black text-sm bg-emerald-50 text-emerald-950 border-t-2 border-b-2 border-emerald-600">
                  <td className="py-3 pl-2">(=) RESULTADO LÍQUIDO DO EXERCÍCIO</td>
                  <td className="py-3 text-right">88</td>
                  <td className="py-3 text-right text-emerald-900">{formatCurrency(dreData.resultadoLiquido)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: BALANÇO PATRIMONIAL */}
      {activeTab === 'balanco' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 printable-card">
          <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full uppercase">
                Balanço Geral • {standard === 'PGC_ANGOLA' ? 'PGC Angola' : 'NBC Brasil'}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                BALANÇO PATRIMONIAL SINTÉTICO
              </h3>
            </div>
            <div className="text-right">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  balanceSheetData.equilibrado
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {balanceSheetData.equilibrado ? 'Activo = Passivo + Capital Próprio ✓' : 'Balanço Desbalanceado ⚠️'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            {/* ACTIVO */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-blue-900 text-white p-3 font-sans font-bold flex justify-between">
                <span>ACTIVO</span>
                <span>{formatCurrency(balanceSheetData.totalActivo)}</span>
              </div>
              <div className="p-4 space-y-2.5 divide-y divide-slate-100">
                <div className="pt-1 flex justify-between">
                  <span className="font-sans font-medium text-slate-700">Meios Fixos e Investimentos (Classe 1)</span>
                  <span className="font-bold">{formatCurrency(balanceSheetData.activoImobilizado)}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="font-sans font-medium text-slate-700">Existências (Classe 2)</span>
                  <span className="font-bold">{formatCurrency(balanceSheetData.existencias)}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="font-sans font-medium text-slate-700">Clientes e Terceiros Devedores (31)</span>
                  <span className="font-bold">{formatCurrency(balanceSheetData.clientes)}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="font-sans font-medium text-slate-700">Meios Monetários / Bancos (Classe 4)</span>
                  <span className="font-bold">{formatCurrency(balanceSheetData.meiosMonetarios)}</span>
                </div>
                <div className="pt-3 border-t-2 border-slate-900 font-black text-sm flex justify-between text-blue-950">
                  <span>TOTAL DO ACTIVO:</span>
                  <span>{formatCurrency(balanceSheetData.totalActivo)}</span>
                </div>
              </div>
            </div>

            {/* PASSIVO E CAPITAL PRÓPRIO */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-emerald-900 text-white p-3 font-sans font-bold flex justify-between">
                <span>PASSIVO & CAPITAL PRÓPRIO</span>
                <span>{formatCurrency(balanceSheetData.totalPassivoECapital)}</span>
              </div>
              <div className="p-4 space-y-2.5 divide-y divide-slate-100">
                <div className="pt-1 flex justify-between">
                  <span className="font-sans font-medium text-slate-700">Fornecedores (Conta 32)</span>
                  <span className="font-bold">{formatCurrency(balanceSheetData.passivoFornecedores)}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="font-sans font-medium text-slate-700">Estado e Entes Públicos (34)</span>
                  <span className="font-bold">{formatCurrency(balanceSheetData.passivoEstado)}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="font-sans font-medium text-slate-700">Empréstimos Obtidos (33)</span>
                  <span className="font-bold">{formatCurrency(balanceSheetData.passivoEmprestimos)}</span>
                </div>
                <div className="pt-2 flex justify-between bg-emerald-50/50 p-1.5 rounded">
                  <span className="font-sans font-bold text-slate-800">Total do Passivo:</span>
                  <span className="font-bold">{formatCurrency(balanceSheetData.totalPassivo)}</span>
                </div>

                <div className="pt-2 flex justify-between">
                  <span className="font-sans font-medium text-slate-700">Capital Social (51)</span>
                  <span className="font-bold">{formatCurrency(balanceSheetData.capitalSocial)}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="font-sans font-medium text-slate-700">Resultado Líquido do Exercício (88)</span>
                  <span className="font-bold text-emerald-700">{formatCurrency(balanceSheetData.resultadoExercicio)}</span>
                </div>
                <div className="pt-3 border-t-2 border-slate-900 font-black text-sm flex justify-between text-emerald-950">
                  <span>TOTAL PASSIVO + CP:</span>
                  <span>{formatCurrency(balanceSheetData.totalPassivoECapital)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
