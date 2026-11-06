import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Lock,
  Sparkles,
  KeyRound,
  RotateCcw,
  Landmark,
  Settings,
  Sliders,
  ToggleLeft,
  ToggleRight,
  BookOpen,
  Upload,
  Globe2,
  Save,
  CheckCircle2,
  ExternalLink,
  Clock,
  Eye,
  X,
  FileCheck,
} from 'lucide-react';
import {
  UserProfile,
  SocialPost,
  ForumTopic,
  FinancialTransaction,
  SiteConfig,
  PGCPlanDocument,
  AccountingStandard,
  CurrencyCode,
  VerificationRequest,
} from '../types';
import { VerifiedBadge } from './VerifiedBadge';

interface AdminViewProps {
  currentUser: UserProfile;
  posts: SocialPost[];
  topics: ForumTopic[];
  transactions: FinancialTransaction[];
  siteConfig: SiteConfig;
  onUpdateSiteConfig: (newConfig: Partial<SiteConfig>) => void;
  onToggleTool: (toolId: string) => void;
  onDeletePost: (id: string) => void;
  onApproveTopic: (id: string) => void;
  onAuditReview: (id: string) => void;
  onUploadPGCPlan: (plan: PGCPlanDocument) => void;
  verificationRequests?: VerificationRequest[];
  onApproveVerification?: (requestId: string) => void;
  onRejectVerification?: (requestId: string, reason?: string) => void;
  onRevokeVerification?: (userId: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  currentUser,
  posts,
  topics,
  transactions,
  siteConfig,
  onUpdateSiteConfig,
  onToggleTool,
  onDeletePost,
  onApproveTopic,
  onAuditReview,
  onUploadPGCPlan,
  verificationRequests = [],
  onApproveVerification,
  onRejectVerification,
  onRevokeVerification,
}) => {
  const [activeTab, setActiveTab] = useState<
    'verifications' | 'site-editor' | 'overview' | 'moderation' | 'audit' | 'pgc-admin'
  >('verifications');

  // Form states for site configuration editing
  const [titleInput, setTitleInput] = useState(siteConfig.siteTitle);
  const [subtitleInput, setSubtitleInput] = useState(siteConfig.siteSubtitle);
  const [announcementInput, setAnnouncementInput] = useState(siteConfig.announcementBanner);
  const [showAnnouncementInput, setShowAnnouncementInput] = useState(siteConfig.showAnnouncement);
  const [defaultCurrencyInput, setDefaultCurrencyInput] = useState<CurrencyCode>(siteConfig.defaultCurrency);
  const [defaultStandardInput, setDefaultStandardInput] = useState<AccountingStandard>(siteConfig.defaultStandard);
  const [footerNoteInput, setFooterNoteInput] = useState(siteConfig.customFooterNote);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Quick PGC upload form for Admin
  const [adminPgcTitle, setAdminPgcTitle] = useState('Plano Geral de Contabilidade de Angola 2026 (Homologado)');
  const [adminPgcDesc, setAdminPgcDesc] = useState('Publicado oficialmente pelo Administrador Neidilson Neves.');

  // Verification review states
  const [verifFilter, setVerifFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('Comprovante ilegível ou registro não localizado na base oficial.');
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);
  const [adminActionSuccess, setAdminActionSuccess] = useState<string | null>(null);

  // Verify that the user is really the admin
  const isSuperAdmin = currentUser.isAdmin && currentUser.email === 'neidilsonneves65@gmail.com';

  if (!isSuperAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Acesso Restrito ao Administrador</h2>
        <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
          Esta área é restrita para <strong>neidilsonneves65@gmail.com</strong> com PIN autenticado (123456). Por favor, autentique-se no menu superior.
        </p>
      </div>
    );
  }

  const suspiciousTxns = transactions.filter((t) => t.isSuspicious);

  // Verification request statistics
  const pendingRequests = verificationRequests.filter((r) => r.status === 'PENDING');
  const approvedRequests = verificationRequests.filter((r) => r.status === 'APPROVED');
  const rejectedRequests = verificationRequests.filter((r) => r.status === 'REJECTED');

  const filteredVerifications =
    verifFilter === 'ALL'
      ? verificationRequests
      : verificationRequests.filter((r) => r.status === verifFilter);

  const handleSaveSiteConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteConfig({
      siteTitle: titleInput,
      siteSubtitle: subtitleInput,
      announcementBanner: announcementInput,
      showAnnouncement: showAnnouncementInput,
      defaultCurrency: defaultCurrencyInput,
      defaultStandard: defaultStandardInput,
      customFooterNote: footerNoteInput,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleApprove = (requestId: string) => {
    if (onApproveVerification) {
      onApproveVerification(requestId);
      setAdminActionSuccess('Selo de Verificado Oficial (Instagram / FB) concedido com sucesso ao usuário!');
      setTimeout(() => setAdminActionSuccess(null), 3000);
    }
  };

  const handleConfirmReject = () => {
    if (rejectModalId && onRejectVerification) {
      onRejectVerification(rejectModalId, rejectReasonInput);
      setRejectModalId(null);
      setRejectReasonInput('Comprovante ilegível ou registro não localizado na base oficial.');
      setAdminActionSuccess('Solicitação recusada e usuário notificado com o motivo.');
      setTimeout(() => setAdminActionSuccess(null), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-amber-500/30">
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-400 text-slate-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <KeyRound className="w-3.5 h-3.5" /> Administrador Master Neidilson Neves
            </span>
            <VerifiedBadge size="sm" tooltip="Selo de Verificação Oficial do Administrador" />
            <span className="text-xs text-emerald-400 font-semibold">• Acesso Master Ativo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Painel de Controle, Governança & Auditoria
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Área exclusiva do Administrador <strong>neidilsonneves65@gmail.com</strong>.
            Aprove solicitações de <strong>Selo de Verificado Oficial (Instagram/Facebook)</strong>,
            configure títulos, banners, ative ou desative ferramentas e audite transações.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-mono">
            <span className="bg-white/10 px-2.5 py-1 rounded-lg text-emerald-300">
              ● E-mail: neidilsonneves65@gmail.com
            </span>
            <span className="bg-white/10 px-2.5 py-1 rounded-lg text-blue-300">
              ● Modo: Super Administrador Autorizado
            </span>
            <span className="bg-white/10 px-2.5 py-1 rounded-lg text-amber-300">
              ● PIN de Segurança: Verificado (123456)
            </span>
          </div>
        </div>
      </div>

      {adminActionSuccess && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{adminActionSuccess}</span>
        </div>
      )}

      {/* Admin Navigation Pills */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          {
            id: 'verifications',
            label: 'Solicitações de Selo de Verificado (Instagram/FB)',
            icon: ShieldCheck,
            badge: pendingRequests.length,
          },
          { id: 'site-editor', label: 'Editar & Alterar o Site e Ferramentas', icon: Settings },
          { id: 'overview', label: 'Visão Geral & Métricas', icon: Activity },
          { id: 'moderation', label: 'Fila de Moderação do Fórum & Posts', icon: ShieldAlert },
          { id: 'audit', label: 'Alertas de Compliance COAF & Transações', icon: Landmark },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white text-amber-800' : 'bg-rose-500 text-white'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 0: SOLICITAÇÕES DE SELO DE VERIFICADO OFICIAL */}
      {activeTab === 'verifications' && (
        <div className="space-y-6">
          {/* Header Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Total de Solicitações
              </span>
              <span className="text-2xl font-black text-slate-800 mt-1 block">
                {verificationRequests.length}
              </span>
            </div>

            <div className="bg-amber-50 p-5 rounded-3xl border border-amber-200 shadow-xs">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                Pendentes de Análise
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-black text-amber-900">{pendingRequests.length}</span>
                {pendingRequests.length > 0 && (
                  <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                    Ação necessária
                  </span>
                )}
              </div>
            </div>

            <div className="bg-sky-50 p-5 rounded-3xl border border-sky-200 shadow-xs">
              <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block flex items-center gap-1">
                <span>Aprovadas com Selo Azul</span>
                <VerifiedBadge size="xs" />
              </span>
              <span className="text-2xl font-black text-sky-900 mt-1 block">
                {approvedRequests.length}
              </span>
            </div>

            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Recusadas
              </span>
              <span className="text-2xl font-black text-slate-700 mt-1 block">
                {rejectedRequests.length}
              </span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Filtrar Solicitações:</span>
              {(['PENDING', 'ALL', 'APPROVED', 'REJECTED'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setVerifFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    verifFilter === filter
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter === 'PENDING'
                    ? `Pendentes (${pendingRequests.length})`
                    : filter === 'APPROVED'
                    ? `Aprovadas (${approvedRequests.length})`
                    : filter === 'REJECTED'
                    ? `Recusadas (${rejectedRequests.length})`
                    : `Todas (${verificationRequests.length})`}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500">
              Auditoria de Autenticidade Profissional • WorldContábil
            </span>
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {filteredVerifications.length === 0 ? (
              <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center">
                <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h4 className="font-bold text-slate-700 text-sm">Nenhuma solicitação encontrada</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Não há pedidos de verificação com o filtro selecionado.
                </p>
              </div>
            ) : (
              filteredVerifications.map((req) => (
                <div
                  key={req.id}
                  className={`bg-white rounded-3xl p-6 border shadow-xs transition-all space-y-4 ${
                    req.status === 'PENDING'
                      ? 'border-amber-300 ring-2 ring-amber-400/10'
                      : req.status === 'APPROVED'
                      ? 'border-sky-300 bg-sky-50/10'
                      : 'border-slate-200 opacity-80'
                  }`}
                >
                  {/* Top user row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={req.userAvatar}
                        alt={req.userName}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{req.userName}</h4>
                          {req.status === 'APPROVED' && (
                            <VerifiedBadge size="sm" tooltip="Perfil Verificado Oficialmente" />
                          )}
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              req.userRole === 'contador'
                                ? 'bg-emerald-100 text-emerald-800'
                                : req.userRole === 'estudante'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {req.userRole.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{req.userEmail}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1 ${
                          req.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : req.status === 'APPROVED'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {req.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                        {req.status === 'APPROVED' && <CheckCircle className="w-3.5 h-3.5" />}
                        {req.status === 'REJECTED' && <XCircle className="w-3.5 h-3.5" />}
                        <span>
                          {req.status === 'PENDING'
                            ? 'Pendente de Análise'
                            : req.status === 'APPROVED'
                            ? 'Selo Concedido ✓'
                            : 'Recusado'}
                        </span>
                      </span>

                      <span className="text-[11px] text-slate-400">Enviado: {req.requestedAt}</span>
                    </div>
                  </div>

                  {/* Document & Proof Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                    <div>
                      <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                        Tipo de Comprovante:
                      </span>
                      <span className="font-semibold text-slate-800 mt-0.5 block">
                        {req.documentType === 'CRC_CARTEIRA'
                          ? 'Carteira CRC (Brasil)'
                          : req.documentType === 'OCAM_ANGOLA'
                          ? 'Carteira OCAM (Angola)'
                          : req.documentType === 'DIPLOMA_ACADEMICO'
                          ? 'Diploma / Matrícula Universitária'
                          : req.documentType === 'LINKEDIN_PROFISSIONAL'
                          ? 'Perfil Profissional LinkedIn'
                          : 'Documento Oficial de Identificação'}
                      </span>
                      {req.crcOrOrderNumber && (
                        <span className="text-[11px] font-mono text-blue-700 block mt-0.5">
                          Nº: {req.crcOrOrderNumber}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                        LinkedIn Fornecido:
                      </span>
                      {req.linkedinUrl ? (
                        <a
                          href={req.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-600 hover:text-sky-800 underline flex items-center gap-1 mt-0.5 font-medium truncate"
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{req.linkedinUrl}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">Não informado</span>
                      )}
                    </div>

                    <div>
                      <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                        Anexo / Documento Comprobatório:
                      </span>
                      {req.documentUrl || req.documentName ? (
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() => setPreviewDocUrl(req.documentUrl || 'demo')}
                            className="text-xs font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Visualizar Anexo ({req.documentName || 'comprovante'})</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Nenhum arquivo anexado</span>
                      )}
                    </div>
                  </div>

                  {/* Justificativa informada */}
                  <div className="text-xs">
                    <span className="font-bold text-slate-700 block mb-0.5">
                      Justificativa do Solicitante:
                    </span>
                    <p className="text-slate-600 italic bg-white p-3 rounded-xl border border-slate-200">
                      "{req.requestReason}"
                    </p>
                  </div>

                  {req.adminNotes && (
                    <div className="text-xs p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800">
                      <strong>Nota do Administrador:</strong> {req.adminNotes}
                    </div>
                  )}

                  {/* Action Buttons for Administrator */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    {req.status === 'PENDING' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setRejectModalId(req.id);
                          }}
                          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Recusar com Justificativa</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApprove(req.id)}
                          className="px-5 py-2 bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <VerifiedBadge size="xs" />
                          <span>Aprovar & Conceder Selo Azul Oficial</span>
                        </button>
                      </>
                    ) : req.status === 'APPROVED' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>Selo Azul Ativo no Perfil</span>
                        </span>
                        {onRevokeVerification && (
                          <button
                            type="button"
                            onClick={() => onRevokeVerification(req.userId)}
                            className="text-xs text-rose-600 hover:underline cursor-pointer"
                          >
                            Revogar Selo
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleApprove(req.id)}
                        className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Reavaliar e Aprovar
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Recusar Solicitação de Verificação</span>
              </h4>
              <button
                onClick={() => setRejectModalId(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Informe ao solicitante o motivo da recusa (ex: comprovante ilegível, registro não localizado ou documentação incompleta).
            </p>

            <textarea
              rows={3}
              value={rejectReasonInput}
              onChange={(e) => setRejectReasonInput(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white outline-none resize-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Confirmar Recusa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDocUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white max-w-2xl w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>Comprovante de Registro Profissional</span>
              </h4>
              <button
                onClick={() => setPreviewDocUrl(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {previewDocUrl.startsWith('data:image') || previewDocUrl.startsWith('http') ? (
                <img
                  src={previewDocUrl}
                  alt="Comprovante"
                  className="max-h-96 object-contain rounded-xl shadow-sm"
                />
              ) : (
                <div className="text-center p-8">
                  <FileText className="w-16 h-16 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-700 font-bold">
                    Documento Oficial em Formato PDF / Texto
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Cédula profissional e certidão de regularidade arquivada com sucesso.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setPreviewDocUrl(null)}
                className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Fechar Visualizador
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: EDITAR E ALTERAR O SITE E AS FERRAMENTAS */}
      {activeTab === 'site-editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Site Settings Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  <span>Personalização Geral do Website</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Altere textos institucionais, faixas de comunicados, moedas e normas
                </p>
              </div>

              {saveSuccess && (
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Salvo com Sucesso!
                </span>
              )}
            </div>

            <form onSubmit={handleSaveSiteConfig} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome da Plataforma
                  </label>
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-amber-600 outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Slogan / Subtítulo
                  </label>
                  <input
                    type="text"
                    value={subtitleInput}
                    onChange={(e) => setSubtitleInput(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-amber-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Moeda Padrão do Sistema
                  </label>
                  <select
                    value={defaultCurrencyInput}
                    onChange={(e) => setDefaultCurrencyInput(e.target.value as CurrencyCode)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-semibold outline-none"
                  >
                    <option value="AOA">Kwanza Angolano (Kz - AOA)</option>
                    <option value="BRL">Real Brasileiro (R$ - BRL)</option>
                    <option value="USD">Dólar Comercial ($ - USD)</option>
                    <option value="EUR">Euro (€ - EUR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Norma Contabilística Padrão
                  </label>
                  <select
                    value={defaultStandardInput}
                    onChange={(e) => setDefaultStandardInput(e.target.value as AccountingStandard)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-semibold outline-none"
                  >
                    <option value="PGC_ANGOLA">Plano Geral de Contabilidade de Angola (PGC)</option>
                    <option value="NBC_BRASIL">Normas Brasileiras de Contabilidade (NBC TG / CFC)</option>
                    <option value="IFRS">Normas Internacionais de Contabilidade (IFRS / IASB)</option>
                  </select>
                </div>
              </div>

              {/* Announcement banner setting */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    Faixa de Comunicados Superior (Topo do Site)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAnnouncementInput(!showAnnouncementInput)}
                    className="text-xs font-bold text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    {showAnnouncementInput ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <ToggleRight className="w-5 h-5" /> Ativa
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1">
                        <ToggleLeft className="w-5 h-5" /> Desativada
                      </span>
                    )}
                  </button>
                </div>

                <textarea
                  rows={2}
                  value={announcementInput}
                  onChange={(e) => setAnnouncementInput(e.target.value)}
                  placeholder="Ex: 📢 ATENÇÃO: Novas diretrizes do PGC Angola e simulações do diário já disponíveis..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nota de Rodapé / Assinatura
                </label>
                <input
                  type="text"
                  value={footerNoteInput}
                  onChange={(e) => setFooterNoteInput(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações Globais do Site</span>
                </button>
              </div>
            </form>
          </div>

          {/* Manage modules & tools switchers (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>Módulos & Ferramentas</span>
                </h3>
                <p className="text-xs text-slate-500">Ative ou pause ferramentas para os usuários</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {siteConfig.enabledTools.map((tool) => (
                <div key={tool.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-800">{tool.name}</span>
                      {tool.badge && (
                        <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 rounded-full">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{tool.description}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleTool(tool.id)}
                    className="cursor-pointer shrink-0"
                    title={tool.enabled ? 'Clique para desativar' : 'Clique para ativar'}
                  >
                    {tool.enabled ? (
                      <ToggleRight className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate-300" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OVERVIEW & STATS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Comunidade Ativa
            </span>
            <span className="text-2xl font-black text-slate-800 mt-1 block">16.480</span>
            <span className="text-xs text-emerald-600 font-semibold mt-1 block">
              +124 novos usuários hoje
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Simulações de Balanço & DRE
            </span>
            <span className="text-2xl font-black text-slate-800 mt-1 block">2.840</span>
            <span className="text-xs text-blue-600 font-semibold mt-1 block">
              Angola (PGC) e Brasil (NBC)
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Fórum Técnico de Normas
            </span>
            <span className="text-2xl font-black text-slate-800 mt-1 block">{topics.length}</span>
            <span className="text-xs text-emerald-600 font-semibold mt-1 block">
              {topics.reduce((acc, t) => acc + t.answers.length, 0)} respostas moderadas
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Auditoria de Riscos Fiscais
            </span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">
              {suspiciousTxns.length}
            </span>
            <span className="text-xs text-amber-700 font-semibold mt-1 block">
              Alertas ativos para revisão
            </span>
          </div>
        </div>
      )}

      {/* TAB 3: MODERAÇÃO DE POSTS E FÓRUM */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <span>Controle de Publicações do Feed Social</span>
            </h3>
            <div className="divide-y divide-slate-100">
              {posts.map((post) => (
                <div key={post.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{post.authorName}</span>
                        {post.authorIsVerified && <VerifiedBadge size="xs" />}
                        <span className="text-[10px] text-slate-400">{post.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1 line-clamp-2">{post.content}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeletePost(post.id)}
                    className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
                  >
                    Excluir Post
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDITORIA COAF E RISCOS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900">
            Auditoria Central de Movimentações Financeiras Suspeitas
          </h3>
          <p className="text-xs text-slate-500">
            Operações bancárias que acionaram gatilhos de conformidade tributária e prevenção a lavagem de dinheiro (COAF).
          </p>

          <div className="space-y-3">
            {suspiciousTxns.map((st) => (
              <div
                key={st.id}
                className="p-4 rounded-2xl border border-amber-300 bg-amber-50/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-xs text-slate-900">{st.description}</span>
                    <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                      Risco Alto
                    </span>
                  </div>
                  <p className="text-xs text-amber-900 mt-1 font-medium">{st.flagReason}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                    <span>Instituição: {st.bankName}</span>
                    <span>Valor: <strong>R$ {st.amount.toFixed(2)}</strong></span>
                    <span>Data: {st.date}</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {st.auditReviewed ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                      Justificado com Parecer ✓
                    </span>
                  ) : (
                    <button
                      onClick={() => onAuditReview(st.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Aprovar & Justificar Fiscalmente
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
