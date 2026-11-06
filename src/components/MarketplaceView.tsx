import React, { useState } from 'react';
import {
  ShoppingBag,
  Star,
  Clock,
  ShieldCheck,
  CheckCircle,
  Filter,
  Search,
  ArrowRight,
  Briefcase,
  DollarSign,
  MessageCircle,
} from 'lucide-react';
import { MarketplaceService, UserProfile } from '../types';
import { MARKETPLACE_SERVICES } from '../data/mockData';

interface MarketplaceViewProps {
  currentUser: UserProfile;
  onOpenAIChat: () => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  currentUser,
  onOpenAIChat,
}) => {
  const [services, setServices] = useState<MarketplaceService[]>(MARKETPLACE_SERVICES);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<MarketplaceService | null>(null);
  const [proposalSuccess, setProposalSuccess] = useState(false);
  const [companyDetails, setCompanyDetails] = useState('');

  const categories = [
    { id: 'ALL', label: 'Todos os Serviços' },
    { id: 'Consultoria Tributária', label: 'Consultoria Tributária' },
    { id: 'BPO Financeiro', label: 'BPO Financeiro' },
    { id: 'Auditoria', label: 'Auditoria Independente' },
    { id: 'Valuation', label: 'Valuation & M&A' },
  ];

  const handleHireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProposalSuccess(true);
    setTimeout(() => {
      setProposalSuccess(false);
      setSelectedService(null);
      setCompanyDetails('');
    }, 2500);
  };

  const filteredServices = services.filter((s) => {
    const matchesCat = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Marketplace Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-400 text-slate-900 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" /> Marketplace Consultivo
            </span>
            <span className="text-xs text-emerald-200">
              Contrate e Ofereça Serviços de Contabilidade de Alto Valor
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Serviços de Contabilidade Consultiva, BPO e Auditoria
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 leading-relaxed">
            Conecte sua empresa aos melhores contadores consultivos, peritos e auditores certificados pelo CFC do Brasil. Contratos digitais seguros, entregáveis auditáveis e garantia de conformidade fiscal.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar serviço por tipo, BPO, planejamento, valuation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none"
            />
          </div>

          <span className="text-xs text-slate-500 font-medium">
            <strong>{filteredServices.length}</strong> serviços disponíveis para contratação
          </span>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-emerald-400 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={service.providerAvatar}
                    alt={service.providerName}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{service.providerName}</h4>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                      {service.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-xl border border-amber-200 text-amber-900 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{service.rating}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({service.reviewsCount})</span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-sm text-slate-800 leading-snug">{service.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{service.description}</p>

              {/* Deliverables Checklist */}
              <div className="mt-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Entregáveis Garantidos:
                </span>
                {service.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {service.tags.map((t) => (
                  <span key={t} className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Price & Action */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Honorários a partir de:</span>
                <span className="text-lg font-black text-slate-900">
                  R$ {service.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-slate-500 block flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-slate-400" /> Prazo: ~{service.turnaroundDays} dias úteis
                </span>
              </div>

              <button
                onClick={() => setSelectedService(service)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Solicitar Proposta</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* HIRING / PROPOSAL MODAL */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Solicitar Contratação de Serviço</h3>
              <button
                onClick={() => setSelectedService(null)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {proposalSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Proposta Enviada com Sucesso!</h4>
                <p className="text-xs text-slate-500">
                  O especialista <strong>{selectedService.providerName}</strong> recebeu suas informações e entrará em contato com a minuta contratual em até 2 horas úteis.
                </p>
              </div>
            ) : (
              <form onSubmit={handleHireSubmit} className="space-y-4 mt-4">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-800">{selectedService.title}</span>
                  <div className="flex justify-between items-center text-slate-600 mt-1">
                    <span>Prestador: {selectedService.providerName}</span>
                    <strong className="text-emerald-700">R$ {selectedService.price.toFixed(2)}</strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome da Empresa / Solicitante
                  </label>
                  <input
                    type="text"
                    required
                    defaultValue={currentUser.name}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Regime Tributário da Empresa
                  </label>
                  <select className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:border-emerald-600 outline-none">
                    <option>Simples Nacional</option>
                    <option>Lucro Presumido</option>
                    <option>Lucro Real</option>
                    <option>Em Fase de Abertura / Sem CNPJ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Observações e Escopo Específico
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Descreva particularidades do seu faturamento mensal, número de funcionários ou urgência..."
                    value={companyDetails}
                    onChange={(e) => setCompanyDetails(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                  >
                    Confirmar Envio da Proposta
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
