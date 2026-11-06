import React, { useState } from 'react';
import {
  Globe,
  Bell,
  Sparkles,
  ShieldCheck,
  Search,
  BookOpen,
  TrendingUp,
  Landmark,
  FileSpreadsheet,
  GraduationCap,
  ShoppingBag,
  Award,
  Calendar,
  LogOut,
  UserCheck,
  Menu,
  X,
  Wifi,
  WifiOff,
  AlertTriangle,
  Calculator,
  Globe2,
} from 'lucide-react';
import { UserProfile, AppNotification, SiteConfig } from '../types';
import { VerifiedBadge } from './VerifiedBadge';

interface NavbarProps {
  currentUser: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  openAuthModal: () => void;
  openProfileModal: () => void;
  openAIChat: () => void;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  siteConfig?: SiteConfig;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  notifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  openAuthModal,
  openProfileModal,
  openAIChat,
  isOffline,
  setIsOffline,
  siteConfig,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const criticalCount = notifications.filter((n) => !n.read && n.severity === 'critical').length;

  const baseNavItems = [
    { id: 'feed', label: 'Feed Social', icon: Globe },
    { id: 'simulator', label: 'Simulador Contábil', icon: Calculator, badge: 'NOVO' },
    { id: 'pgc', label: 'PGC Angola & Planos', icon: Globe2, badge: 'NOVO' },
    { id: 'forum', label: 'Fórum Técnico', icon: BookOpen },
    { id: 'gamification', label: 'Desafios & Jogos', icon: Award },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'banking', label: 'Bancos & Open Finance', icon: Landmark },
    { id: 'reports', label: 'Relatórios Fiscais', icon: FileSpreadsheet },
    { id: 'calendar', label: 'Metas & Estudos', icon: Calendar },
    { id: 'universities', label: 'Universidades', icon: GraduationCap },
  ];

  // Filter items if administrator disabled any tool
  const navItems = baseNavItems.filter((item) => {
    if (!siteConfig?.enabledTools) return true;
    const toolConf = siteConfig.enabledTools.find((t) => t.id === item.id);
    return toolConf ? toolConf.enabled : true;
  });

  if (currentUser.isAdmin) {
    navItems.push({ id: 'admin', label: 'Painel Admin & Site', icon: ShieldCheck });
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner configured by Admin */}
      {siteConfig?.showAnnouncement && siteConfig.announcementBanner && (
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white text-[11px] font-medium py-1.5 px-4 flex items-center justify-between border-b border-blue-800">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-center text-center gap-2">
            <span>{siteConfig.announcementBanner}</span>
          </div>
        </div>
      )}

      {/* Top Banner for System Status / Suspicious Movement Alert */}
      {criticalCount > 0 && (
        <div className="bg-amber-600 text-white text-xs font-medium py-1.5 px-4 flex items-center justify-between transition-all">
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            <AlertTriangle className="w-4 h-4 text-amber-200 shrink-0 animate-bounce" />
            <span>
              <strong>Alerta de Auditoria:</strong> {criticalCount} movimentação bancária atípica requer verificação imediata para conformidade fiscal.
            </span>
            <button
              onClick={() => {
                setActiveTab('banking');
              }}
              className="ml-auto underline text-white hover:text-amber-100 font-semibold cursor-pointer shrink-0"
            >
              Verificar Agora
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('feed')}
              className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-emerald-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-blue-900">
                    {siteConfig?.siteTitle ? siteConfig.siteTitle.slice(0, 5) : 'World'}
                  </span>
                  <span className="text-xl font-extrabold tracking-tight text-emerald-600">
                    {siteConfig?.siteTitle ? siteConfig.siteTitle.slice(5) || 'Contábil' : 'Contábil'}
                  </span>
                </div>
                <p className="text-[10px] font-semibold text-slate-600 -mt-0.5 tracking-wider uppercase">
                  {siteConfig?.siteSubtitle || 'Mundo Contábil • Angola & Brasil'}
                </p>
              </div>
            </button>
          </div>

          {/* Quick Search */}
          <div className="hidden md:flex flex-1 max-w-xs items-center relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar CPC, normas, serviços, posts..."
              className="w-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-xs pl-9 pr-3 py-2 rounded-full border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-slate-700 placeholder-slate-500"
            />
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Offline indicator toggle */}
            <button
              onClick={() => setIsOffline(!isOffline)}
              title={isOffline ? 'Modo Offline Ativo (Lendo cache)' : 'Conectado à Rede em Tempo Real'}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border cursor-pointer transition-all ${
                isOffline
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5 text-emerald-600" />}
              <span className="hidden lg:inline font-medium">{isOffline ? 'Modo Offline' : 'Online'}</span>
            </button>

            {/* AI Assistant 24/7 Button */}
            <button
              onClick={openAIChat}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-700 to-emerald-600 hover:from-blue-800 hover:to-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-emerald-200 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">IA Contábil 24h</span>
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full text-slate-600 hover:text-blue-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Notificações"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-800">Notificações</span>
                      {unreadCount > 0 && (
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                          {unreadCount} novas
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                      >
                        Marcar todas como lidas
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        Nenhuma notificação no momento.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            if (notif.linkToTab) setActiveTab(notif.linkToTab);
                            setShowNotifications(false);
                          }}
                          className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${
                            !notif.read ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="shrink-0 mt-0.5">
                            {notif.type === 'suspicious_movement' ? (
                              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4" />
                              </div>
                            ) : notif.type === 'study_reminder' ? (
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Calendar className="w-4 h-4" />
                              </div>
                            ) : notif.type === 'gamification' ? (
                              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <Award className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                                <Bell className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">{notif.title}</p>
                            <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{notif.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">{notif.timestamp}</span>
                          </div>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-blue-600 self-center shrink-0" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Switch Account button */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <button
                onClick={openProfileModal}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer text-left"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
                  />
                  {currentUser.isAdmin && (
                    <span
                      title="Super Administrador"
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 text-white rounded-full flex items-center justify-center text-[9px] font-black border border-white"
                    >
                      ★
                    </span>
                  )}
                </div>
                <div className="hidden xl:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 leading-none">{currentUser.name}</span>
                    {currentUser.isVerified && <VerifiedBadge size="xs" tooltip="Conta Oficialmente Verificada" />}
                    {currentUser.isAdmin && (
                      <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                    {currentUser.role === 'admin'
                      ? 'Administrador Chefe'
                      : currentUser.role === 'contador'
                      ? 'Contador(a) CRC'
                      : currentUser.role === 'estudante'
                      ? 'Estudante Acadêmico'
                      : 'Empresário / Investidor'}
                  </span>
                </div>
              </button>

              <button
                onClick={openAuthModal}
                title="Trocar de Conta / Login Social"
                className="p-2 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              >
                <UserCheck className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Tab Navigation Bar */}
        <nav className="hidden md:flex items-center space-x-1 py-1.5 overflow-x-auto border-t border-slate-100 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/60'
                } ${item.id === 'admin' ? 'border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100' : ''}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.id === 'admin' ? 'text-amber-600' : 'text-slate-400 group-hover:text-blue-600'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 animate-in fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setShowMobileMenu(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
