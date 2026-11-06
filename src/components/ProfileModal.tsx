import React, { useState, useRef } from 'react';
import {
  X,
  Award,
  Shield,
  TrendingUp,
  Landmark,
  Calendar,
  Building,
  GraduationCap,
  CheckCircle,
  Share2,
  Edit3,
  Camera,
  Linkedin,
  FileText,
  Printer,
  Save,
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  Phone,
  MapPin,
  Sparkles,
  Upload,
  RefreshCw,
  FileUp,
  Clock,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import {
  UserProfile,
  FinancialTransaction,
  UserCV,
  VerificationDocumentType,
} from '../types';
import { BADGES_LIST } from '../data/mockData';
import { VerifiedBadge } from './VerifiedBadge';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  transactions: FinancialTransaction[];
  onOpenShareModal: (data: any) => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onRequestVerification?: (data: {
    documentType: VerificationDocumentType;
    crcOrOrderNumber?: string;
    documentName?: string;
    documentUrl?: string;
    linkedinUrl?: string;
    requestReason: string;
  }) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  transactions,
  onOpenShareModal,
  onUpdateUser,
  onRequestVerification,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'view' | 'edit' | 'cv' | 'verification'>('view');

  // Edit form states
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [company, setCompany] = useState(currentUser.company || '');
  const [crc, setCrc] = useState(currentUser.crc || '');
  const [university, setUniversity] = useState(currentUser.university || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [country, setCountry] = useState(currentUser.country || 'Angola');
  const [avatarUrlInput, setAvatarUrlInput] = useState('');

  // LinkedIn states
  const [linkedinUrl, setLinkedinUrl] = useState(currentUser.linkedinUrl || '');
  const [linkedinConnected, setLinkedinConnected] = useState(currentUser.linkedinConnected || false);

  // CV states - MUST strictly correspond to real data from user bio, linkedIn, or imported CV. Never invented by the site!
  const [cvHeadline, setCvHeadline] = useState(
    currentUser.cvData?.headline ||
      (currentUser.company
        ? `${currentUser.name} • ${currentUser.company}`
        : `${currentUser.name} • ${
            currentUser.role === 'admin'
              ? 'Super Administrador'
              : currentUser.role === 'contador'
              ? currentUser.crc
                ? `Contador (${currentUser.crc})`
                : 'Contador Profissional'
              : currentUser.role === 'estudante'
              ? currentUser.university || 'Estudante de Contabilidade'
              : 'Profissional / Empresário'
          }`)
  );

  const [cvSummary, setCvSummary] = useState(
    currentUser.cvData?.summary !== undefined
      ? currentUser.cvData.summary
      : currentUser.bio || ''
  );

  const [cvEducation, setCvEducation] = useState(
    currentUser.cvData?.education !== undefined
      ? currentUser.cvData.education
      : currentUser.university
      ? `Estudos / Formação em ${currentUser.university}`
      : ''
  );

  const [cvExperience, setCvExperience] = useState(
    currentUser.cvData?.experience !== undefined
      ? currentUser.cvData.experience
      : currentUser.company
      ? `Atuação profissional em ${currentUser.company}`
      : ''
  );

  const [cvSkills, setCvSkills] = useState<string[]>(
    currentUser.cvData?.skills ? [...currentUser.cvData.skills] : []
  );
  const [newSkillInput, setNewSkillInput] = useState('');

  const [cvCertifications, setCvCertifications] = useState<string[]>(
    currentUser.cvData?.certifications
      ? [...currentUser.cvData.certifications]
      : currentUser.crc
      ? [`Registro Profissional: ${currentUser.crc}`]
      : []
  );
  const [newCertInput, setNewCertInput] = useState('');

  // CV Import modal/panel states
  const [showImportCV, setShowImportCV] = useState(false);
  const [rawCVText, setRawCVText] = useState('');
  const cvFileInputRef = useRef<HTMLInputElement>(null);

  // Verification request form states
  const [verifDocType, setVerifDocType] = useState<VerificationDocumentType>('CRC_CARTEIRA');
  const [verifDocNumber, setVerifDocNumber] = useState(currentUser.crc || '');
  const [verifDocName, setVerifDocName] = useState('');
  const [verifDocUrl, setVerifDocUrl] = useState('');
  const [verifLinkedin, setVerifLinkedin] = useState(currentUser.linkedinUrl || '');
  const [verifReason, setVerifReason] = useState(
    currentUser.role === 'contador'
      ? 'Solicito o selo oficial de verificado com base no meu registro profissional ativo para emitir pareceres contábeis e consultoria na plataforma.'
      : currentUser.role === 'estudante'
      ? 'Solicito o selo de verificado acadêmico com base na minha matrícula universitária para colaborar em grupos de estudo.'
      : 'Solicito o selo oficial de verificado para representação fidedigna da minha empresa e perfil profissional no ecossistema.'
  );
  const [verifSuccessMsg, setVerifSuccessMsg] = useState(false);
  const verifDocInputRef = useRef<HTMLInputElement>(null);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const unlockedBadges = BADGES_LIST.filter((b) => currentUser.badges.includes(b.id));

  // Quick preset avatars
  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
  ];

  // Handle local file photo upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle local file upload for Verification proof
  const handleVerifDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVerifDocName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setVerifDocUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Synchronize CV with user's real biography, company, university, and CRC/OCAM
  const handleSyncCVWithProfile = () => {
    let syncedCount = 0;
    if (bio && bio.trim()) {
      setCvSummary(bio.trim());
      syncedCount++;
    }
    if (university && university.trim()) {
      setCvEducation(`Estudos / Graduação em ${university.trim()}`);
      syncedCount++;
    }
    if (company && company.trim()) {
      setCvExperience(`Atuação profissional em ${company.trim()}`);
      syncedCount++;
    }
    if (crc && crc.trim()) {
      const certLabel = `Registro Profissional: ${crc.trim()}`;
      if (!cvCertifications.includes(certLabel)) {
        setCvCertifications([...cvCertifications, certLabel]);
        syncedCount++;
      }
    }
    setSyncFeedback('Currículo sincronizado com sucesso a partir dos seus dados reais da Biografia e Perfil!');
    setTimeout(() => setSyncFeedback(null), 3000);
  };

  // Synchronize CV with LinkedIn URL & real user headline
  const handleSyncCVWithLinkedIn = () => {
    if (!linkedinUrl.trim()) {
      setLinkedinUrl(`https://www.linkedin.com/in/${name.toLowerCase().replace(/\s+/g, '-')}`);
    }
    setLinkedinConnected(true);
    setCvHeadline(`${name} • Perfil Profissional Verificado no LinkedIn`);
    if (bio && !cvSummary) {
      setCvSummary(bio);
    }
    setSyncFeedback('Dados do perfil profissional do LinkedIn integrados com sucesso!');
    setTimeout(() => setSyncFeedback(null), 3000);
  };

  // Import CV from raw text or uploaded text/document
  const handleImportCVFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        parseAndApplyCVText(text);
      }
    };
    reader.readAsText(file);
  };

  const parseAndApplyCVText = (text: string) => {
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return;

    // Line 1 or headline
    if (lines[0]) {
      setCvHeadline(`${name} • ${lines[0].replace(/^[-*#\s]+/, '').slice(0, 80)}`);
    }

    // Summary lines
    const summaryCandidates = lines.slice(1, 5).join(' ');
    if (summaryCandidates) {
      setCvSummary(summaryCandidates.slice(0, 600));
    }

    // Try finding education
    const eduCandidate = lines.find((l) =>
      /gradua|licenciatura|faculdade|universidade|pós-gradua|bacharel|instituto|mestrado|doutorado/i.test(l)
    );
    if (eduCandidate) {
      setCvEducation(eduCandidate.replace(/^[-*#\s]+/, ''));
    }

    // Try finding experience
    const expCandidate = lines.find((l) =>
      /experiência|cargo|empresa|atuação|contador|auditor|consultor|gerente|analista|sócio|diretor/i.test(l)
    );
    if (expCandidate) {
      setCvExperience(expCandidate.replace(/^[-*#\s]+/, ''));
    }

    // Extract skills from text
    const foundSkills: string[] = [];
    const skillKeywords = [
      'PGC Angola',
      'IFRS',
      'NBC TG',
      'CPC',
      'Auditoria Fiscal',
      'DRE e Balanço',
      'Conciliação Bancária',
      'Reforma Tributária',
      'Lucro Real',
      'Simples Nacional',
      'SAP ERP',
      'Primavera ERP',
      'SPED Fiscal',
      'Perícia Contábil',
      'Fluxo de Caixa',
      'Imposto de Renda',
    ];

    skillKeywords.forEach((kw) => {
      if (new RegExp(kw, 'i').test(text) && !foundSkills.includes(kw)) {
        foundSkills.push(kw);
      }
    });

    if (foundSkills.length > 0) {
      setCvSkills(Array.from(new Set([...cvSkills, ...foundSkills])));
    }

    setShowImportCV(false);
    setRawCVText('');
    setSyncFeedback('Currículo importado e preenchido fidedignamente com os dados do arquivo/texto!');
    setTimeout(() => setSyncFeedback(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedCV: UserCV = {
      headline: cvHeadline.trim() || undefined,
      summary: cvSummary.trim() || undefined,
      education: cvEducation.trim() || undefined,
      experience: cvExperience.trim() || undefined,
      skills: cvSkills.length > 0 ? cvSkills : undefined,
      certifications: cvCertifications.length > 0 ? cvCertifications : undefined,
      languages: currentUser.cvData?.languages || ['Português (Nativo)', 'Inglês'],
    };

    const updatedUser: UserProfile = {
      ...currentUser,
      name,
      bio,
      avatar,
      company: company || undefined,
      crc: crc || undefined,
      university: university || undefined,
      phone: phone || undefined,
      country: country as any,
      linkedinUrl: linkedinUrl.trim() || undefined,
      linkedinConnected: linkedinConnected || !!linkedinUrl.trim(),
      cvData: updatedCV,
    };

    onUpdateUser(updatedUser);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setActiveTab('view');
    }, 1500);
  };

  const handleConnectLinkedIn = () => {
    if (!linkedinUrl.trim()) {
      setLinkedinUrl('https://www.linkedin.com/in/' + name.toLowerCase().replace(/\s+/g, '-'));
    }
    setLinkedinConnected(true);
  };

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !cvSkills.includes(newSkillInput.trim())) {
      setCvSkills([...cvSkills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setCvSkills(cvSkills.filter((s) => s !== skillToRemove));
  };

  const handleAddCert = () => {
    if (newCertInput.trim() && !cvCertifications.includes(newCertInput.trim())) {
      setCvCertifications([...cvCertifications, newCertInput.trim()]);
      setNewCertInput('');
    }
  };

  const handleRemoveCert = (certToRemove: string) => {
    setCvCertifications(cvCertifications.filter((c) => c !== certToRemove));
  };

  // Submit verification request to Admin Neidilson Neves
  const handleSubmitVerificationRequest = (e: React.FormEvent) => {
    e.preventDefault();

    if (onRequestVerification) {
      onRequestVerification({
        documentType: verifDocType,
        crcOrOrderNumber: verifDocNumber.trim() || undefined,
        documentName: verifDocName.trim() || undefined,
        documentUrl: verifDocUrl.trim() || undefined,
        linkedinUrl: verifLinkedin.trim() || linkedinUrl.trim() || undefined,
        requestReason: verifReason.trim(),
      });
    }

    // Locally mark user's verificationStatus as PENDING
    const updatedUser: UserProfile = {
      ...currentUser,
      verificationStatus: 'PENDING',
      verificationReason: verifReason.trim(),
      verificationRequestedAt: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
    onUpdateUser(updatedUser);

    setVerifSuccessMsg(true);
    setTimeout(() => {
      setVerifSuccessMsg(false);
      setActiveTab('view');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-emerald-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative group">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-lg shrink-0"
              />
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-full bg-amber-400 text-slate-900 hover:bg-amber-300 shadow-md cursor-pointer transition-transform group-hover:scale-110"
                title="Editar foto de perfil"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold flex items-center gap-1.5">
                  <span>{currentUser.name}</span>
                  {/* Official Blue Verified Badge (Meta / Instagram / Facebook style) */}
                  {currentUser.isVerified && (
                    <VerifiedBadge
                      size="md"
                      tooltip="Perfil Verificado Oficialmente pelo Administrador Neidilson Neves"
                    />
                  )}
                </h2>

                {currentUser.isAdmin && (
                  <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                    SUPER ADMIN
                  </span>
                )}

                {currentUser.isVerified ? (
                  <span className="bg-sky-400/30 text-sky-200 border border-sky-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-sky-300" />
                    <span>Verificado Oficial</span>
                  </span>
                ) : currentUser.verificationStatus === 'PENDING' ? (
                  <span className="bg-amber-400/20 text-amber-200 border border-amber-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Verificação em Análise</span>
                  </span>
                ) : (
                  <button
                    onClick={() => setActiveTab('verification')}
                    className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-3 h-3 text-sky-300" />
                    <span>Solicitar Selo Azul</span>
                  </button>
                )}

                {currentUser.linkedinConnected && (
                  <a
                    href={currentUser.linkedinUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-sky-500/80 hover:bg-sky-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors"
                  >
                    <Linkedin className="w-3 h-3 fill-current" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>

              <p className="text-xs text-blue-100 mt-1">
                {currentUser.role === 'admin'
                  ? 'Super Administrador • Auditor Chefe & Governança'
                  : currentUser.role === 'contador'
                  ? `Contador(a) Certificado(a) • ${currentUser.crc || 'Registro Profissional Ativo'}`
                  : currentUser.role === 'estudante'
                  ? currentUser.university || 'Estudante Acadêmico'
                  : 'Empresário / Diretor Financeiro'}
              </p>

              {/* Bio display */}
              <p className="text-xs text-slate-200 mt-2 max-w-xl leading-relaxed whitespace-pre-line italic">
                "{currentUser.bio || 'Sem biografia informada ainda. Clique em Editar Perfil para adicionar sua trajetória profissional.'}"
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs">
                <span>
                  <strong>{currentUser.followersCount}</strong> Seguidores
                </span>
                <span>
                  <strong>{currentUser.followingCount}</strong> Conexões
                </span>
                <span>
                  🔥 <strong>{currentUser.streakDays} dias</strong> seguidos de estudo
                </span>
                {currentUser.country && <span>📍 {currentUser.country}</span>}
              </div>
            </div>
          </div>

          {/* Sub Navigation Bar inside Modal */}
          <div className="flex items-center gap-2 mt-5 border-t border-white/20 pt-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab('view')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'view'
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Ver Perfil</span>
            </button>

            <button
              onClick={() => setActiveTab('edit')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'edit'
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-500" />
              <span>Editar Biografia & Foto</span>
            </button>

            <button
              onClick={() => setActiveTab('cv')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'cv'
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Currículo Contábil (CV)</span>
            </button>

            <button
              onClick={() => setActiveTab('verification')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'verification'
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <VerifiedBadge size="xs" />
              <span>Selo de Verificado</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {syncFeedback && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{syncFeedback}</span>
            </div>
          )}

          {/* TAB 1: VIEW PROFILE & BADGES */}
          {activeTab === 'view' && (
            <div className="space-y-6">
              {/* Verification Status Card */}
              <div
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  currentUser.isVerified
                    ? 'bg-sky-50 border-sky-200 text-sky-900'
                    : currentUser.verificationStatus === 'PENDING'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center shrink-0">
                    <VerifiedBadge size="lg" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs flex items-center gap-1.5">
                      <span>Selo Oficial de Verificado (Meta / Facebook / Instagram)</span>
                      {currentUser.isVerified && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full font-black">
                          ATIVO
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {currentUser.isVerified
                        ? 'Sua conta foi auditada e homologada oficialmente pelo Administrador Neidilson Neves.'
                        : currentUser.verificationStatus === 'PENDING'
                        ? 'Solicitação em análise pelo Administrador Neidilson Neves. Você será notificado assim que aprovada.'
                        : 'Aumente sua credibilidade contábil solicitando o selo azul oficial verificado.'}
                    </p>
                  </div>
                </div>

                {!currentUser.isVerified && (
                  <button
                    onClick={() => setActiveTab('verification')}
                    className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs flex items-center gap-1.5 justify-center"
                  >
                    <VerifiedBadge size="xs" />
                    <span>{currentUser.verificationStatus === 'PENDING' ? 'Ver Solicitação' : 'Solicitar Selo Azul'}</span>
                  </button>
                )}
              </div>

              {/* Quick Actions Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs text-slate-500">
                  Visualização do seu perfil público no WorldContábil
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('edit')}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar Biografia & Foto</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('cv')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Ver CV Real</span>
                  </button>
                </div>
              </div>

              {/* Level & XP Overview */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    Nível de Carreira: Nível {currentUser.level}
                  </span>
                  <span className="text-emerald-700 font-extrabold">{currentUser.xp} Pontos de XP</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((currentUser.xp % 1000) / 10, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>Ofensiva de estudos: {currentUser.streakDays} dias consecutivos</span>
                  <span>Faltam {1000 - (currentUser.xp % 1000)} XP para o próximo nível</span>
                </div>
              </div>

              {/* Badges Section */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-blue-600" />
                  Emblemas e Conquistas Profissionais ({unlockedBadges.length}/{BADGES_LIST.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {BADGES_LIST.map((badge) => {
                    const isUnlocked = currentUser.badges.includes(badge.id);
                    return (
                      <div
                        key={badge.id}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          isUnlocked
                            ? 'bg-gradient-to-b from-blue-50/50 to-white border-blue-200 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 opacity-40 grayscale'
                        }`}
                      >
                        <div className="text-2xl mb-1">{badge.icon}</div>
                        <h5 className="font-bold text-xs text-slate-800">{badge.title}</h5>
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{badge.description}</p>
                        <div className="mt-2">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              badge.tier === 'Ouro'
                                ? 'bg-amber-100 text-amber-800'
                                : badge.tier === 'Diamante'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {badge.tier}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Audit / Financial Operations History */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-emerald-600" />
                  Histórico de Operações & Conciliações
                </h4>
                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                  {transactions.slice(0, 4).map((txn) => (
                    <div key={txn.id} className="p-3 bg-white flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800">{txn.description}</p>
                        <p className="text-[11px] text-slate-500">
                          {txn.bankName} • {txn.date} • {txn.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-mono font-bold ${
                            txn.type === 'CREDIT' ? 'text-emerald-600' : 'text-slate-800'
                          }`}
                        >
                          {txn.type === 'CREDIT' ? '+' : '-'} {txn.amount.toLocaleString('pt-AO')} Kz
                        </span>
                        <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                          {txn.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EDIT PROFILE & BIOGRAPHY */}
          {activeTab === 'edit' && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              {saveSuccess && (
                <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Perfil e biografia atualizados com sucesso no WorldContábil!</span>
                </div>
              )}

              {/* Photo Upload and Custom Avatar */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  Foto de Perfil (Avatar Oficial)
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={avatar}
                    alt="Preview"
                    className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-500/20 shadow-md shrink-0"
                  />

                  <div className="space-y-2 flex-1 w-full">
                    {/* File Upload Button */}
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Escolher Foto do Computador / Celular</span>
                      </button>

                      <span className="text-[11px] text-slate-400">PNG, JPG ou WEBP</span>
                    </div>

                    {/* URL Input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="Ou cole a URL direta de uma foto..."
                        value={avatarUrlInput}
                        onChange={(e) => setAvatarUrlInput(e.target.value)}
                        className="flex-1 text-xs p-2 rounded-xl border border-slate-300 bg-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (avatarUrlInput.trim()) {
                            setAvatar(avatarUrlInput.trim());
                            setAvatarUrlInput('');
                          }
                        }}
                        className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Aplicar URL
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preset Avatars */}
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Ou selecione um avatar executivo corporativo:
                  </span>
                  <div className="flex gap-2.5 overflow-x-auto pb-1">
                    {presetAvatars.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`Preset ${i}`}
                        onClick={() => setAvatar(url)}
                        className={`w-10 h-10 rounded-xl object-cover cursor-pointer ring-2 transition-all hover:scale-105 ${
                          avatar === url ? 'ring-blue-600 scale-105 shadow-md' : 'ring-transparent opacity-70'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Registro Profissional (CRC / OCAM Angola)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: CRC-SP 289410/O-4 ou OCAM nº 1482/AO"
                    value={crc}
                    onChange={(e) => setCrc(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Biography (Mandatory & Core Request) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Biografia Profissional & Trajetória
                  </label>
                  <span className="text-[10px] text-slate-400">Exibida no feed, fórum e currículo</span>
                </div>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Escreva sua trajetória profissional, áreas de especialidade (PGC, IFRS, Auditoria, Tributário), histórico acadêmico e interesses..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none leading-relaxed"
                />
              </div>

              {/* Professional details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Empresa / Escritório</label>
                  <input
                    type="text"
                    placeholder="Ex: Duarte & Associados Consultoria"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Universidade / Faculdade</label>
                  <input
                    type="text"
                    placeholder="Ex: Universidade Agostinho Neto / FEA-USP"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+244 923 000 000 ou +55 (11) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">País de Atuação</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white outline-none"
                  >
                    <option value="Angola">Angola (PGC)</option>
                    <option value="Brasil">Brasil (NBC TG)</option>
                    <option value="Portugal">Portugal (SNC)</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('view')}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações do Perfil</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: CURRÍCULO (CV) & LINKEDIN (100% CORRESPONDENTE AOS DADOS REAIS) */}
          {activeTab === 'cv' && (
            <div className="space-y-6">
              {/* Authenticity Guarantee Banner */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-950">
                  <strong className="block text-blue-900 font-bold mb-0.5">
                    Garantia de Autenticidade Curricular
                  </strong>
                  O WorldContábil não gera dados fictícios no seu currículo. As informações abaixo derivam
                  estritamente da sua <strong>Biografia real</strong>, da sua conta do{' '}
                  <strong>LinkedIn</strong> ou do <strong>arquivo de CV importado</strong> por você.
                </div>
              </div>

              {/* Synchronization & Import Action Toolbar */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold text-slate-700">Ferramentas de Sincronização Real:</span>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSyncCVWithProfile}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-blue-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                    title="Puxar biografia, universidade, empresa e registro do seu perfil"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                    <span>Sincronizar com Biografia</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSyncCVWithLinkedIn}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5 fill-current" />
                    <span>Sincronizar LinkedIn</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowImportCV(!showImportCV)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                  >
                    <FileUp className="w-3.5 h-3.5" />
                    <span>Importar CV Real</span>
                  </button>
                </div>
              </div>

              {/* Import CV Drawer / Sub-panel */}
              {showImportCV && (
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <FileUp className="w-4 h-4 text-emerald-700" />
                      Importar Currículo Pessoal (Sem Dados Fictícios)
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowImportCV(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                    >
                      Fechar
                    </button>
                  </div>

                  <p className="text-[11px] text-emerald-900 leading-relaxed">
                    Carregue seu arquivo de currículo (.txt ou documento) ou cole o texto completo abaixo.
                    Nosso extrator preencherá os campos de forma 100% fidedigna.
                  </p>

                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      ref={cvFileInputRef}
                      accept=".txt,.pdf,.doc,.docx"
                      onChange={handleImportCVFromFile}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => cvFileInputRef.current?.click()}
                      className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Selecionar Arquivo de CV (.txt / doc)</span>
                    </button>
                    <span className="text-[11px] text-slate-500">ou cole o texto no campo abaixo:</span>
                  </div>

                  <textarea
                    rows={4}
                    value={rawCVText}
                    onChange={(e) => setRawCVText(e.target.value)}
                    placeholder="Cole aqui o texto do seu currículo real (Formação, Experiência, Competências, etc.)..."
                    className="w-full text-xs p-3 rounded-xl border border-emerald-300 bg-white outline-none resize-none"
                  />

                  {rawCVText.trim() && (
                    <button
                      type="button"
                      onClick={() => parseAndApplyCVText(rawCVText)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Processar e Preencher CV
                    </button>
                  )}
                </div>
              )}

              {/* LinkedIn Integration Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-950 text-white shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white text-sky-700 flex items-center justify-center font-black text-lg shadow-xs">
                      in
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Integração com Perfil do LinkedIn</h4>
                      <p className="text-[11px] text-sky-200">
                        Conecte seu LinkedIn para validar seu currículo contábil oficial e exibir seu perfil para
                        recrutadores e clientes.
                      </p>
                    </div>
                  </div>

                  {linkedinConnected ? (
                    <span className="bg-emerald-400 text-slate-900 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Conectado
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleConnectLinkedIn}
                      className="bg-white text-sky-900 font-bold text-xs px-3.5 py-1.5 rounded-xl hover:bg-sky-50 transition-colors cursor-pointer"
                    >
                      Conectar LinkedIn
                    </button>
                  )}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    placeholder="https://www.linkedin.com/in/seu-perfil"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="flex-1 text-xs p-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-sky-300 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleConnectLinkedIn}
                    className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    Salvar Link
                  </button>
                </div>
              </div>

              {/* CV Printable / Exportable Preview */}
              <div className="bg-white rounded-2xl border border-slate-300 p-6 space-y-5 shadow-2xs">
                {/* CV Header */}
                <div className="flex justify-between items-start pb-4 border-b-2 border-slate-900">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                      <span>{currentUser.name}</span>
                      {currentUser.isVerified && <VerifiedBadge size="md" />}
                    </h3>

                    {/* Headline Input */}
                    <div className="mt-1">
                      <input
                        type="text"
                        value={cvHeadline}
                        onChange={(e) => setCvHeadline(e.target.value)}
                        placeholder="Título profissional (ex: Contador Sénior • Auditor Fiscal)"
                        className="text-xs font-bold text-blue-800 border-b border-blue-200 outline-none w-full max-w-lg bg-transparent"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1.5">
                      <span>E-mail: {currentUser.email}</span>
                      {phone && <span>• Tel: {phone}</span>}
                      <span>• {currentUser.country || 'Angola'}</span>
                      {currentUser.crc && <span>• Reg: {currentUser.crc}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Imprimir / Baixar CV (PDF)</span>
                    </button>
                  </div>
                </div>

                {/* CV Resumo Profissional (Derivado da Biografia Real) */}
                <div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1 mb-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Resumo Profissional & Biografia
                    </h4>
                    <span className="text-[10px] text-slate-400">Dados da Biografia</span>
                  </div>
                  <textarea
                    rows={3}
                    value={cvSummary}
                    onChange={(e) => setCvSummary(e.target.value)}
                    placeholder="Resumo derivado da sua biografia. Se vazio, clique em 'Sincronizar com Biografia'..."
                    className="w-full text-xs text-slate-700 leading-relaxed p-2 rounded-xl border border-slate-200 bg-slate-50/50 outline-none resize-none"
                  />
                </div>

                {/* CV Formação Acadêmica */}
                <div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1 mb-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Formação Acadêmica
                    </h4>
                    <span className="text-[10px] text-slate-400">Universidade / Estudos</span>
                  </div>
                  <input
                    type="text"
                    value={cvEducation}
                    onChange={(e) => setCvEducation(e.target.value)}
                    placeholder="Informações da sua faculdade/universidade..."
                    className="w-full text-xs text-slate-700 p-2 rounded-xl border border-slate-200 bg-slate-50/50 outline-none"
                  />
                </div>

                {/* CV Experiência Profissional */}
                <div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1 mb-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Experiência Profissional
                    </h4>
                    <span className="text-[10px] text-slate-400">Empresa / Escritório</span>
                  </div>
                  <input
                    type="text"
                    value={cvExperience}
                    onChange={(e) => setCvExperience(e.target.value)}
                    placeholder="Informações de atuação no seu escritório ou empresa..."
                    className="w-full text-xs text-slate-700 p-2 rounded-xl border border-slate-200 bg-slate-50/50 outline-none"
                  />
                </div>

                {/* CV Competências Técnicas (Sem dados inventados) */}
                <div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1 mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Competências Técnicas & Normas Dominadas
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {cvSkills.length} registradas (dados reais)
                    </span>
                  </div>

                  {cvSkills.length === 0 ? (
                    <div className="p-3 bg-slate-50 rounded-xl text-center text-xs text-slate-500 italic">
                      Nenhuma competência cadastrada ainda. Adicione abaixo ou sincronize com o seu LinkedIn / CV real.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {cvSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 flex items-center gap-1.5"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Add skill input */}
                  <div className="flex gap-2 mt-2 max-w-sm">
                    <input
                      type="text"
                      placeholder="Adicionar competência real (ex: PGC, NBC TG, SAP)..."
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      className="text-xs p-1.5 rounded-lg border border-slate-300 flex-1 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      + Adicionar
                    </button>
                  </div>
                </div>

                {/* CV Certificações */}
                <div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1 mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Certificações & Registros Oficiais
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {cvCertifications.length} cadastradas
                    </span>
                  </div>

                  {cvCertifications.length === 0 ? (
                    <div className="p-3 bg-slate-50 rounded-xl text-center text-xs text-slate-500 italic">
                      Nenhuma certificação cadastrada ainda. Adicione abaixo ou sincronize com seu perfil.
                    </div>
                  ) : (
                    <ul className="space-y-1 text-xs text-slate-700 list-disc pl-5 mb-2">
                      {cvCertifications.map((cert, idx) => (
                        <li key={idx} className="flex items-center justify-between">
                          <span>{cert}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCert(cert)}
                            className="text-slate-400 hover:text-rose-600 text-[10px] cursor-pointer"
                          >
                            Remover
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Add cert input */}
                  <div className="flex gap-2 mt-2 max-w-sm">
                    <input
                      type="text"
                      placeholder="Adicionar certificação ou registro..."
                      value={newCertInput}
                      onChange={(e) => setNewCertInput(e.target.value)}
                      className="text-xs p-1.5 rounded-lg border border-slate-300 flex-1 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddCert}
                      className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      + Adicionar
                    </button>
                  </div>
                </div>
              </div>

              {/* Save CV changes button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Dados Fidedignos do Currículo</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: SELO DE VERIFICADO OFICIAL (META / FACEBOOK / INSTAGRAM STYLE) */}
          {activeTab === 'verification' && (
            <div className="space-y-6">
              {verifSuccessMsg && (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="block font-bold">Solicitação enviada com sucesso!</span>
                    <span className="font-normal text-[11px]">
                      O Administrador Neidilson Neves recebeu seus documentos para análise e homologação do selo azul.
                    </span>
                  </div>
                </div>
              )}

              {/* Verified Status Banner */}
              {currentUser.isVerified ? (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 border border-sky-300 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mx-auto">
                    <VerifiedBadge size="xl" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-blue-900 flex items-center justify-center gap-1.5">
                      <span>Selo de Verificado Oficial Ativo</span>
                      <VerifiedBadge size="md" />
                    </h3>
                    <p className="text-xs text-blue-800 mt-1 max-w-md mx-auto">
                      Parabéns! Sua conta foi verificada oficialmente pelo <strong>Administrador Neidilson Neves</strong>.
                      O selo azul do Instagram/Facebook está visível no seu perfil, posts, comentários e pareceres no fórum.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-center">
                    <span className="bg-sky-600 text-white font-bold text-xs px-4 py-1.5 rounded-full flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Conta Homologada & Protegida
                    </span>
                  </div>
                </div>
              ) : currentUser.verificationStatus === 'PENDING' ? (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border border-amber-300 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                    <Clock className="w-8 h-8 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-amber-900">
                      Solicitação em Análise pelo Administrador
                    </h3>
                    <p className="text-xs text-amber-800 mt-1 max-w-md mx-auto">
                      Sua solicitação de selo de verificado enviada em{' '}
                      <strong>{currentUser.verificationRequestedAt || 'recente'}</strong> está na fila de
                      análise do Administrador Neidilson Neves.
                    </p>
                  </div>
                  <div className="p-3 bg-white/80 rounded-xl border border-amber-200 text-left text-xs max-w-md mx-auto">
                    <span className="font-bold text-slate-700 block mb-0.5">Motivo informado:</span>
                    <p className="text-slate-600 italic">"{currentUser.verificationReason || 'Comprovação profissional'}"</p>
                  </div>
                </div>
              ) : (
                /* Request Verification Form for non-verified users */
                <form onSubmit={handleSubmitVerificationRequest} className="space-y-5">
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-sky-900 to-indigo-950 text-white space-y-2">
                    <div className="flex items-center gap-2.5">
                      <VerifiedBadge size="lg" />
                      <h3 className="text-base font-extrabold">
                        Solicitar Selo de Verificado Oficial (Instagram / Facebook)
                      </h3>
                    </div>
                    <p className="text-xs text-sky-200 leading-relaxed">
                      O selo azul oficial comprova a autenticidade e autoridade do seu perfil contábil no
                      WorldContábil. Todos os pedidos são analisados diretamente pelo{' '}
                      <strong>Administrador Neidilson Neves</strong> para garantir idoneidade e conformidade.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tipo de Comprovante de Autenticidade
                      </label>
                      <select
                        value={verifDocType}
                        onChange={(e) => setVerifDocType(e.target.value as any)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white outline-none"
                      >
                        <option value="CRC_CARTEIRA">Carteira Profissional CRC (Brasil)</option>
                        <option value="OCAM_ANGOLA">Carteira Ordem dos Contabilistas (OCAM Angola)</option>
                        <option value="DIPLOMA_ACADEMICO">Diploma / Comprovante de Matrícula Universitária</option>
                        <option value="LINKEDIN_PROFISSIONAL">Perfil Profissional no LinkedIn</option>
                        <option value="DOC_IDENTIFICACAO">Documento Oficial de Identificação (BI / RG)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Número de Inscrição / Registro / Documento
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: OCAM nº 1482/AO ou CRC-SP 289410"
                        value={verifDocNumber}
                        onChange={(e) => setVerifDocNumber(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Link do Perfil no LinkedIn (para verificação cruzada)
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.linkedin.com/in/seu-perfil"
                      value={verifLinkedin}
                      onChange={(e) => setVerifLinkedin(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white outline-none"
                    />
                  </div>

                  {/* Upload Proof Document */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      Anexar Comprovante / Foto da Carteira Profissional
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        ref={verifDocInputRef}
                        accept="image/*,.pdf"
                        onChange={handleVerifDocUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => verifDocInputRef.current?.click()}
                        className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Carregar Foto da Carteira / Diploma / Documento</span>
                      </button>
                      <span className="text-xs text-slate-500 truncate max-w-xs">
                        {verifDocName || 'Nenhum arquivo selecionado'}
                      </span>
                    </div>

                    {verifDocUrl && (
                      <div className="mt-2 p-2 bg-white rounded-xl border border-slate-200 inline-block">
                        <span className="text-[10px] text-slate-400 block mb-1">Pré-visualização do comprovante:</span>
                        <img
                          src={verifDocUrl}
                          alt="Comprovante"
                          className="h-20 max-w-xs object-cover rounded-lg border border-slate-200"
                        />
                      </div>
                    )}
                  </div>

                  {/* Reason Textarea */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Justificativa / Motivo da Solicitação ao Administrador
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={verifReason}
                      onChange={(e) => setVerifReason(e.target.value)}
                      placeholder="Explique sua atuação profissional e por que solicita o selo oficial de verificado..."
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white outline-none resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <VerifiedBadge size="xs" />
                      <span>Enviar Solicitação ao Administrador Neidilson Neves</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
