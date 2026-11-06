import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  Upload,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Plus,
  Printer,
  Sparkles,
  Globe2,
  Trash2,
  FileCheck,
} from 'lucide-react';
import { PGCAccount, PGCPlanDocument, UserProfile } from '../types';
import { DEFAULT_PGC_PLANS, PGC_ANGOLA_ACCOUNTS } from '../data/mockData';

interface PGCManagerViewProps {
  currentUser: UserProfile;
  plans: PGCPlanDocument[];
  onAddPlan: (plan: PGCPlanDocument) => void;
  onOpenAIChat: () => void;
}

export const PGCManagerView: React.FC<PGCManagerViewProps> = ({
  currentUser,
  plans,
  onAddPlan,
  onOpenAIChat,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || 'pgc_angola_oficial');
  const [selectedClasse, setSelectedClasse] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);

  // Import form state
  const [importTitle, setImportTitle] = useState('Plano de Contas Específico Comercial 2026');
  const [importCountry, setImportCountry] = useState<'Angola' | 'Brasil' | 'Internacional'>('Angola');
  const [importDescription, setImportDescription] = useState('Plano importado pelo Administrador para disponibilização geral no WorldContábil.');
  const [importRawText, setImportRawText] = useState(
    '11.6;Equipamento de Informática e Redes;1;Meios Fixos;DEVEDORA\n21.2;Compras de Mercadorias no Estrangeiro;2;Existências;DEVEDORA\n31.3;Clientes Estrangeiros (Divisas);3;Terceiros;DEVEDORA\n42.2;Depósitos à Ordem em Moeda Estrangeira (USD);4;Meios Monetários;DEVEDORA'
  );
  const [importSuccess, setImportSuccess] = useState(false);

  // New account form state
  const [newAccCode, setNewAccCode] = useState('');
  const [newAccName, setNewAccName] = useState('');
  const [newAccClasse, setNewAccClasse] = useState(1);
  const [newAccNature, setNewAccNature] = useState<'DEVEDORA' | 'CREDORA' | 'MISTA'>('DEVEDORA');

  const activePlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  const filteredAccounts = activePlan.accounts.filter((acc) => {
    const matchesClasse = selectedClasse === 'ALL' || acc.classe === selectedClasse;
    const matchesSearch =
      acc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.classeName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClasse && matchesSearch;
  });

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse raw text or file
    const newAccounts: PGCAccount[] = [];
    const lines = importRawText.split('\n');

    lines.forEach((line) => {
      const parts = line.split(';');
      if (parts.length >= 2) {
        newAccounts.push({
          code: parts[0].trim(),
          name: parts[1].trim(),
          classe: parts[2] ? parseInt(parts[2].trim()) : 1,
          classeName: parts[3] ? parts[3].trim() : 'Contas Gerais',
          nature: (parts[4]?.trim() as any) || 'DEVEDORA',
          statementType: 'BALANCO',
        });
      }
    });

    const createdPlan: PGCPlanDocument = {
      id: 'plan_' + Date.now(),
      title: importTitle,
      description: importDescription,
      country: importCountry,
      standard: importCountry === 'Angola' ? 'PGC_ANGOLA' : 'NBC_BRASIL',
      version: '1.0',
      uploadedBy: `${currentUser.name} (${currentUser.isAdmin ? 'Super Admin' : 'Utilizador'})`,
      uploadDate: new Date().toLocaleDateString('pt-PT'),
      isOfficial: currentUser.isAdmin || false,
      accountsCount: (activePlan.accounts.length || 0) + newAccounts.length,
      fileFormat: 'PDF',
      downloadFilename: `${importTitle.replace(/\s+/g, '_')}.pdf`,
      accounts: [...activePlan.accounts, ...newAccounts],
    };

    onAddPlan(createdPlan);
    setSelectedPlanId(createdPlan.id);
    setImportSuccess(true);

    setTimeout(() => {
      setImportSuccess(false);
      setShowImportModal(false);
    }, 2000);
  };

  const handlePrintOrExportPDF = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="no-print bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-amber-500/20">
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-400 text-slate-900 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5" /> Contabilidade Angolana & CPLP
            </span>
            <span className="text-xs text-amber-200">
              Plano Geral de Contabilidade de Angola (PGC) & Repositório
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Plano Geral de Contabilidade (PGC Angola) & Planos de Contas
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Consulte a nomenclatura oficial das 8 Classes do PGC Angolano (Decreto Presidencial nº 82/01). Exporte o PGC completo em formato PDF ou importe novos planos e contas para ficarem disponíveis a todos os utilizadores no website.
          </p>

          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => setShowImportModal(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Importar Plano de Contas para o Site</span>
            </button>

            <button
              onClick={handlePrintOrExportPDF}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Exportar PGC em PDF (Oficial)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Available Plans Selector & Actions Bar (no-print) */}
      <div className="no-print bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>Planos de Contas Disponíveis no Website ({plans.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Selecione o plano desejado para consulta de classes, lançamentos e regras
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 outline-none"
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.country})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Plan Info Badge */}
        <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div>
            <span className="font-bold text-amber-950 block">{activePlan.title}</span>
            <span className="text-[11px] text-amber-900">{activePlan.description}</span>
          </div>
          <div className="text-[10px] text-slate-500 sm:text-right shrink-0">
            <span>Enviado por: <strong>{activePlan.uploadedBy}</strong></span>
            <span className="block">{activePlan.accounts.length} contas cadastradas</span>
          </div>
        </div>

        {/* Classes Filter Bar (PGC Angola Classes 1 to 8) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedClasse('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedClasse === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todas as Classes
          </button>

          {[
            { id: 1, label: 'Cl. 1 Meios Fixos' },
            { id: 2, label: 'Cl. 2 Existências' },
            { id: 3, label: 'Cl. 3 Terceiros' },
            { id: 4, label: 'Cl. 4 Meios Monetários' },
            { id: 5, label: 'Cl. 5 Capital e Reservas' },
            { id: 6, label: 'Cl. 6 Proveitos (Receitas)' },
            { id: 7, label: 'Cl. 7 Custos (Despesas)' },
            { id: 8, label: 'Cl. 8 Resultados' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedClasse(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedClasse === c.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Pesquisar conta por código (ex: 41, 61, 71, 11) ou nome..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-amber-600 outline-none"
          />
        </div>
      </div>

      {/* Main Accounts Table & Printable Document */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs printable-card space-y-4">
        {/* Printable Header */}
        <div className="pb-4 border-b-2 border-slate-900 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-amber-800">World</span>
              <span className="text-xl font-black text-slate-900">Contábil</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono font-bold">
                PGC ANGOLA • REPOSITÓRIO OFICIAL
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 mt-1 uppercase">
              {activePlan.title}
            </h2>
            <p className="text-xs text-slate-600">
              Quadro de Contas Homologado para a República de Angola e Operações Internacionais
            </p>
          </div>

          <div className="text-right text-xs text-slate-500 font-mono">
            <div>Data: {new Date().toLocaleDateString('pt-PT')}</div>
            <div>Versão: {activePlan.version}</div>
          </div>
        </div>

        {/* Accounts Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-xs text-left font-mono">
            <thead className="bg-slate-900 text-white font-bold">
              <tr>
                <th className="p-3 w-28">Código</th>
                <th className="p-3 font-sans">Designação da Conta</th>
                <th className="p-3 font-sans">Classe do PGC</th>
                <th className="p-3 font-sans">Natureza Contabilística</th>
                <th className="p-3 font-sans">Demonstração</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredAccounts.map((acc) => (
                <tr key={acc.code} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-amber-800 whitespace-nowrap bg-amber-50/20">
                    {acc.code}
                  </td>
                  <td className="p-3 font-sans font-medium text-slate-900">
                    <div>{acc.name}</div>
                    {acc.description && (
                      <div className="text-[10px] text-slate-500 font-normal mt-0.5 font-sans">
                        {acc.description}
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-sans whitespace-nowrap text-slate-600">
                    Classe {acc.classe} ({acc.classeName})
                  </td>
                  <td className="p-3 whitespace-nowrap font-sans">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        acc.nature === 'DEVEDORA'
                          ? 'bg-blue-100 text-blue-800'
                          : acc.nature === 'CREDORA'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {acc.nature}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap text-[10px] text-slate-500 font-sans">
                    {acc.statementType === 'BALANCO' ? 'Balanço Geral' : 'Demonstração de Resultados'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* IMPORT MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Importar Plano de Contas para Disponibilização Geral
                </h3>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {importSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Plano Importado e Publicado!</h4>
                <p className="text-xs text-slate-500">
                  O plano de contas agora está arquivado e disponível para todos os utilizadores da plataforma consultarem e usarem nas simulações.
                </p>
              </div>
            ) : (
              <form onSubmit={handleImportSubmit} className="space-y-3.5 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome / Título do Plano de Contas
                  </label>
                  <input
                    type="text"
                    required
                    value={importTitle}
                    onChange={(e) => setImportTitle(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      País / Jurisdição
                    </label>
                    <select
                      value={importCountry}
                      onChange={(e) => setImportCountry(e.target.value as any)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white outline-none"
                    >
                      <option value="Angola">Angola (PGC)</option>
                      <option value="Brasil">Brasil (NBC TG)</option>
                      <option value="Internacional">Internacional (IFRS)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Formato de Origem
                    </label>
                    <input
                      type="text"
                      disabled
                      value="PDF / CSV / Texto Estruturado"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Descrição do Plano
                  </label>
                  <input
                    type="text"
                    value={importDescription}
                    onChange={(e) => setImportDescription(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contas a Importar (Código;Nome;Classe;NomeClasse;Natureza)
                  </label>
                  <textarea
                    rows={4}
                    value={importRawText}
                    onChange={(e) => setImportRawText(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowImportModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                  >
                    Publicar Plano no Site
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
