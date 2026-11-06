import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Plus,
  Clock,
  BookOpen,
  WifiOff,
  Flame,
  Award,
  Download,
  Sparkles,
  Share2,
} from 'lucide-react';
import { StudyGoal, UserProfile } from '../types';
import { STUDY_GOALS, ESSENTIAL_OFFLINE_ARTICLES } from '../data/mockData';

interface StudyCalendarViewProps {
  currentUser: UserProfile;
  onAddXP: (xp: number) => void;
  onToggleGoal: (id: string) => void;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
}

export const StudyCalendarView: React.FC<StudyCalendarViewProps> = ({
  currentUser,
  onAddXP,
  onToggleGoal,
  isOffline,
  setIsOffline,
}) => {
  const [goals, setGoals] = useState<StudyGoal[]>(STUDY_GOALS);
  const [selectedArticle, setSelectedArticle] = useState<typeof ESSENTIAL_OFFLINE_ARTICLES[0] | null>(null);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Normas NBC');
  const [newDuration, setNewDuration] = useState('30');

  const handleToggle = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const updated = !g.completed;
          if (updated) {
            onAddXP(100);
          }
          return { ...g, completed: updated };
        }
        return g;
      })
    );
    onToggleGoal(id);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newGoal: StudyGoal = {
      id: 'goal_' + Date.now(),
      title: newTitle,
      date: new Date().toISOString().split('T')[0],
      completed: false,
      durationMinutes: parseInt(newDuration) || 30,
      category: newCategory,
      offlineReady: true,
    };

    setGoals([newGoal, ...goals]);
    setNewTitle('');
    setShowAddGoalModal(false);
  };

  const completedCount = goals.filter((g) => g.completed).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-400 text-slate-900 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <CalendarIcon className="w-3.5 h-3.5" /> Organização de Metas
            </span>
            <span className="text-xs text-blue-200">
              Rotina de Estudos & Continuidade Offline
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Calendário de Estudos Contábeis e Acesso Offline
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-2 leading-relaxed">
            Mantenha a constância com lembretes diários personalizados, calendário de prazos de entregas fiscais (ECD, ECF, DCTFWeb) e biblioteca essencial com funcionamento 100% offline.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-5 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-200 block">Ofensiva de Estudos</span>
                <span className="text-sm font-extrabold text-white">{currentUser.streakDays} Dias Consecutivos</span>
              </div>
            </div>

            <div className="h-6 w-px bg-white/20" />

            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-200 block">Metas Concluídas</span>
                <span className="text-sm font-extrabold text-emerald-300">
                  {completedCount} de {goals.length} hoje
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowAddGoalModal(true)}
              className="ml-auto bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Nova Meta Diária</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Daily Goals & Interactive Calendar (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Daily Goals Checklist */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Metas Diárias para Hábito Constante</span>
              </h3>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
                +100 XP por meta
              </span>
            </div>

            <div className="space-y-2.5">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => handleToggle(goal.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    goal.completed
                      ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400/20'
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      {goal.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </button>
                    <div>
                      <span
                        className={`text-xs font-semibold block ${
                          goal.completed ? 'line-through text-slate-400 font-normal' : 'text-slate-800'
                        }`}
                      >
                        {goal.title}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="font-medium text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">
                          {goal.category}
                        </span>
                        <span>• ~{goal.durationMinutes} min</span>
                        {goal.offlineReady && (
                          <span className="text-emerald-700 bg-emerald-50 px-1 rounded font-bold">
                            Offline OK
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-400">
                    {goal.completed ? 'Concluída' : 'Pendente'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Agenda Overview */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-emerald-600" />
              <span>Prazos & Lembretes da Semana</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100">
                <span className="text-[10px] font-bold text-blue-700">Hoje</span>
                <p className="text-xs font-bold text-slate-900 mt-1">Revisão CPC 00 (R2)</p>
                <span className="text-[10px] text-slate-500 block mt-0.5">Simulado de 10 questões</span>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                <span className="text-[10px] font-bold text-emerald-700">Amanhã</span>
                <p className="text-xs font-bold text-slate-900 mt-1">Fator R no Simples</p>
                <span className="text-[10px] text-slate-500 block mt-0.5">Exercício de folha 12m</span>
              </div>

              <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-100">
                <span className="text-[10px] font-bold text-amber-700">Sexta-feira</span>
                <p className="text-xs font-bold text-slate-900 mt-1">Prazo Transmissão DCTFWeb</p>
                <span className="text-[10px] text-slate-500 block mt-0.5">Fechamento fiscal mensal</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Essential Offline Articles Library (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  Biblioteca Essencial Offline
                </h3>
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                Salvo no Dispositivo
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Conteúdos contábeis fundamentais pré-carregados para você continuar estudando em qualquer lugar, mesmo sem internet!
            </p>

            <div className="space-y-3">
              {ESSENTIAL_OFFLINE_ARTICLES.map((article) => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      {article.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{article.readTime}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 leading-snug">{article.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{article.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ARTICLE READER MODAL (Available offline) */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 p-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                  {selectedArticle.category} • Disponível Offline
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedArticle.title}</h3>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 text-xs text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
              {selectedArticle.content}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-[11px] text-slate-400">Tempo estimado: {selectedArticle.readTime}</span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl cursor-pointer"
              >
                Concluir Leitura
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD GOAL MODAL */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Nova Meta de Aprendizado Diário</h3>
              <button
                onClick={() => setShowAddGoalModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título da Meta ou Tarefa
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Resolver 5 questões de NBC TG 1000"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white outline-none"
                  >
                    <option value="Normas NBC">Normas NBC</option>
                    <option value="Tributário">Tributário & Reforma</option>
                    <option value="Auditoria">Auditoria & Compliance</option>
                    <option value="Exame CFC">Exame de Suficiência</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duração Estimada
                  </label>
                  <select
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white outline-none"
                  >
                    <option value="15">15 minutos</option>
                    <option value="30">30 minutos</option>
                    <option value="45">45 minutos</option>
                    <option value="60">1 hora</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddGoalModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Salvar Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
