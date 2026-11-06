import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  BookOpen,
  HelpCircle,
  RefreshCw,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { askAccountingAI } from '../services/api';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeContext?: string;
}

interface MessageItem {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
  activeContext,
}) => {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'm_1',
      role: 'model',
      text: 'Olá! Sou o Consultor Especialista de IA do WorldContábil, disponível 24 horas por dia.\n\nPosso esclarecer dúvidas sobre as Normas Brasileiras de Contabilidade (NBC TG / CPC), apuração do Simples Nacional vs Lucro Real, conciliação bancária ou a Reforma Tributária. Como posso ajudar seu escritório ou estudos hoje?',
      timestamp: 'Agora',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMsg: MessageItem = {
      id: 'msg_' + Date.now(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const history = messages.slice(-5).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const reply = await askAccountingAI({
        message: text,
        context: activeContext || 'Plataforma WorldContábil',
        history,
      });

      const aiMsg: MessageItem = {
        id: 'msg_ai_' + Date.now(),
        role: 'model',
        text: reply,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg_err_' + Date.now(),
          role: 'model',
          text: 'Ocorreu uma instabilidade na consulta. Verifique sua conexão e tente novamente.',
          timestamp: 'Agora',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Como calcular o Fator R no Simples Nacional?',
    'Quais as características qualitativas fundamentais do CPC 00 (R2)?',
    'Como funciona a transição do IBS e CBS na Reforma Tributária?',
    'Como conciliar movimentações atípicas e evitar alerta COAF?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-emerald-700 p-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm">Suporte IA Contábil 24h</h3>
                <span className="bg-emerald-400 text-slate-900 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                  ONLINE
                </span>
              </div>
              <p className="text-[10px] text-blue-100">
                Especialista em CPC, IFRS, NBC e Legislação Tributária
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 overflow-x-auto scrollbar-none flex gap-1.5">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 font-medium px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 text-xs ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed whitespace-pre-line ${
                    isUser
                      ? 'bg-blue-700 text-white rounded-tr-xs shadow-xs'
                      : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200/80 shadow-2xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      isUser ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100 w-fit">
              <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
              <span>Consultando normas contábeis e artigos jurídicos...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 border-t border-slate-200 flex gap-2 bg-white"
        >
          <input
            type="text"
            placeholder="Pergunte sobre normas CPC, IRPJ, Simples, Reforma..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className={`p-2.5 rounded-xl text-white font-bold cursor-pointer transition-all ${
              inputText.trim() && !loading
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-xs'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
