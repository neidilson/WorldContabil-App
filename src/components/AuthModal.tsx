import React, { useState } from 'react';
import {
  X,
  Shield,
  KeyRound,
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
  Facebook,
  Instagram,
  Sparkles,
  ArrowRight,
  UserCheck,
  Building,
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { ADMIN_USER, SAMPLE_USERS } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
}) => {
  const [activeTab, setActiveTab] = useState<'social' | 'admin' | 'switch'>('admin');
  const [adminEmail, setAdminEmail] = useState('neidilsonneves65@gmail.com');
  const [adminPin, setAdminPin] = useState('123456');
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState(false);

  // New account form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('contador');
  const [newUserCrc, setNewUserCrc] = useState('');

  if (!isOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    if (adminEmail.trim().toLowerCase() === 'neidilsonneves65@gmail.com' && adminPin.trim() === '123456') {
      setAdminSuccess(true);
      setTimeout(() => {
        onSelectUser(ADMIN_USER);
        setAdminSuccess(false);
        onClose();
      }, 500);
    } else {
      setAdminError('Credenciais inválidas. E-mail de administrador ou PIN incorreto.');
    }
  };

  const handleSocialMockLogin = (provider: 'facebook' | 'instagram' | 'google' | 'linkedin') => {
    // Generates a mock logged-in social profile
    const socialUser: UserProfile = {
      id: `user_${provider}_${Date.now()}`,
      name: provider === 'facebook' ? 'Alexandre Santos (Facebook)' : provider === 'instagram' ? 'Mariana Costa (Instagram)' : 'Dr. Leonardo Braga',
      email: `membro.${provider}@worldcontabil.com`,
      avatar: provider === 'instagram' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      role: 'contador',
      crc: 'CRC-RJ 148902/O-1',
      bio: `Membro verificado via autenticação social ${provider.toUpperCase()}. Apaixonado por tecnologia contábil.`,
      xp: 2400,
      level: 3,
      badges: ['badge_1'],
      streakDays: 5,
      followersCount: 320,
      followingCount: 190,
      isVerified: true,
      company: 'Braga Assessoria Contábil',
    };

    onSelectUser(socialUser);
    onClose();
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const createdUser: UserProfile = {
      id: `user_new_${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newUserName)}`,
      role: newUserRole,
      crc: newUserCrc || (newUserRole === 'contador' ? 'CRC-BR 000123/O' : undefined),
      bio: `Novo membro do WorldContábil. Categoria: ${newUserRole}.`,
      xp: 500,
      level: 1,
      badges: ['badge_1'],
      streakDays: 1,
      followersCount: 15,
      followingCount: 40,
      isVerified: false,
    };

    onSelectUser(createdUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Header modal */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-emerald-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Acesso Seguro WorldContábil
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Portal de Acesso & Identidade</h2>
          <p className="text-xs text-blue-100/90 mt-1">
            Conecte sua conta estilo Facebook/Insta ou acerte suas credenciais de Administrador.
          </p>

          {/* Sub Navigation Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('admin')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span>Conta Administrador</span>
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'social'
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Login Social & Novo Cadastro</span>
            </button>
            <button
              onClick={() => setActiveTab('switch')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'switch'
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Alternar Perfis</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* TAB 1: ADMIN LOGIN */}
          {activeTab === 'admin' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <Shield className="w-4 h-4 text-amber-700" />
                  <span>Acesso Restrito ao Super Administrador</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Conta exclusiva do administrador do sistema:
                  <br />
                  <strong>E-mail:</strong> <code className="bg-white px-1.5 py-0.5 rounded text-amber-800">neidilsonneves65@gmail.com</code>
                  <br />
                  <strong>PIN:</strong> <code className="bg-white px-1.5 py-0.5 rounded text-amber-800">123456</code>
                </p>
              </div>

              {adminSuccess ? (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold">Administrador Autenticado com Sucesso!</p>
                    <p className="text-[11px] text-emerald-700">Carregando painel de controle e governança...</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAdminLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail do Administrador</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                        placeholder="neidilsonneves65@gmail.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">PIN Secreto (6 Dígitos)</label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        type="password"
                        required
                        maxLength={6}
                        value={adminPin}
                        onChange={(e) => setAdminPin(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 tracking-widest font-mono text-base focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                        placeholder="••••••"
                      />
                    </div>
                  </div>

                  {adminError && (
                    <div className="flex items-center gap-2 text-rose-600 text-xs bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{adminError}</span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAdminEmail('neidilsonneves65@gmail.com');
                        setAdminPin('123456');
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      Preencher PIN Padrão
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <span>Entrar como Admin</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: SOCIAL LOGIN (Facebook, Insta, etc.) */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Acesse instantaneamente utilizando suas redes sociais profissionais ou cadastre um novo perfil:
              </p>

              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSocialMockLogin('instagram')}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-pink-200 bg-pink-50/50 hover:bg-pink-100/70 text-pink-700 text-xs font-semibold cursor-pointer transition-colors"
                >
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <span>Entrar com Instagram</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialMockLogin('facebook')}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 text-blue-800 text-xs font-semibold cursor-pointer transition-colors"
                >
                  <Facebook className="w-4 h-4 text-blue-700" />
                  <span>Entrar com Facebook</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialMockLogin('google')}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                >
                  <span className="font-bold text-red-500">G</span>
                  <span>Google Contábil</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialMockLogin('linkedin')}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold cursor-pointer transition-colors"
                >
                  <span className="font-bold text-sky-700">in</span>
                  <span>LinkedIn CRC</span>
                </button>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="shrink-0 mx-3 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  Ou Cadastre um Novo Perfil
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Quick Registration Form */}
              <form onSubmit={handleCreateAccount} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nome Completo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Dra. Mariana Lima"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 focus:border-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">E-mail Profissional</label>
                    <input
                      type="email"
                      required
                      placeholder="mariana@contabilidade.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Categoria de Usuário</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 focus:border-blue-600 outline-none bg-white"
                    >
                      <option value="contador">Contador(a) / Auditor</option>
                      <option value="estudante">Estudante Universitário</option>
                      <option value="empresario">Empresário / Investidor</option>
                      <option value="consultor">Consultor de BPO</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      {newUserRole === 'contador' ? 'Registro CRC (Opcional)' : 'Instituição / Empresa'}
                    </label>
                    <input
                      type="text"
                      placeholder={newUserRole === 'contador' ? 'CRC-SP 123456/O' : 'Ex: FEA-USP / Startup'}
                      value={newUserCrc}
                      onChange={(e) => setNewUserCrc(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer mt-1"
                >
                  Criar Perfil e Acessar Plataforma
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: SWITCH PROFILES */}
          {activeTab === 'switch' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Selecione um dos perfis pré-configurados para testar a experiência com diferentes permissões e categorias:
              </p>

              <div className="space-y-2">
                {SAMPLE_USERS.map((user) => {
                  const isCurrent = currentUser.id === user.id;
                  return (
                    <div
                      key={user.id}
                      onClick={() => {
                        onSelectUser(user);
                        onClose();
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-800">{user.name}</span>
                            {user.isAdmin && (
                              <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 block">
                            {user.role === 'admin'
                              ? 'Administrador Chefe'
                              : user.role === 'contador'
                              ? `Contador (${user.crc})`
                              : user.role === 'estudante'
                              ? user.university
                              : 'Empresário & Investidor'}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold">
                            Nível {user.level} • {user.xp} XP
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        {isCurrent ? (
                          <span className="text-xs text-blue-700 font-bold bg-white px-2 py-1 rounded-full border border-blue-200 shadow-2xs">
                            Ativo
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium hover:text-blue-600">
                            Selecionar →
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
