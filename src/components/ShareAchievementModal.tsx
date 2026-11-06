import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  Award,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../types';

interface ShareAchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  shareData: {
    title?: string;
    description?: string;
    badge?: string;
  } | null;
}

export const ShareAchievementModal: React.FC<ShareAchievementModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  shareData,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !shareData) return null;

  const shareText = `${shareData.title || 'Meu progresso no WorldContábil'}! ${shareData.description || ''} Venha participar da maior comunidade contábil do Brasil.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-900 to-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-sm">Compartilhar Conquista Acadêmica</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Preview Card */}
          <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-emerald-950 p-5 rounded-2xl text-white text-center space-y-2 shadow-md">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto text-2xl border border-white/20">
              🏆
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">
              WorldContábil Certificado de Excelência
            </span>
            <h4 className="font-extrabold text-sm text-white">{shareData.title}</h4>
            <p className="text-xs text-blue-100 max-w-xs mx-auto leading-relaxed">
              {shareData.description}
            </p>
            <div className="pt-2 text-[10px] text-slate-300">
              Membro: <strong>{currentUser.name}</strong> • Nível {currentUser.level}
            </div>
          </div>

          {/* Social Network Share Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
              }}
              className="p-2.5 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Linkedin className="w-4 h-4 text-sky-700" />
              <span>LinkedIn</span>
            </button>

            <button
              onClick={() => {
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
              }}
              className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={() => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
              }}
              className="p-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Facebook className="w-4 h-4 text-blue-700" />
              <span>Facebook</span>
            </button>

            <button
              onClick={handleCopy}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
