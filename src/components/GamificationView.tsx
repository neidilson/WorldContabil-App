import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Trophy,
  Star,
  CheckCircle2,
  XCircle,
  Sparkles,
  Share2,
  ArrowRight,
  TrendingUp,
  Brain,
  Shield,
  Zap,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { UserProfile, QuizQuestion, AchievementBadge } from '../types';
import { BADGES_LIST, QUIZ_QUESTIONS, SAMPLE_USERS } from '../data/mockData';

interface GamificationViewProps {
  currentUser: UserProfile;
  onAddXP: (xp: number) => void;
  onUnlockBadge: (badgeId: string) => void;
  onOpenShareModal: (achievementData: any) => void;
}

export const GamificationView: React.FC<GamificationViewProps> = ({
  currentUser,
  onAddXP,
  onUnlockBadge,
  onOpenShareModal,
}) => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [activeTab, setActiveTab] = useState<'quiz' | 'badges' | 'ranking' | 'metrics'>('quiz');

  const currentQuestion = QUIZ_QUESTIONS[currentQuizIndex];

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);

    const isCorrect = idx === currentQuestion.correctIndex;
    if (isCorrect) {
      setQuizScore((prev) => prev + currentQuestion.xpReward);
      onAddXP(currentQuestion.xpReward);

      // Trigger celebratory confetti!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#10b981', '#fbbf24'],
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      // Finished all questions
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
      });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setQuizScore(0);
  };

  // Mock performance data for interactive SVG chart
  const academicEvolution = [
    { area: 'Normas Contábeis (NBC/CPC)', score: 92, color: '#2563eb' },
    { area: 'Legislação Tributária & Fator R', score: 85, color: '#10b981' },
    { area: 'Auditoria & Prevenção a Fraudes', score: 78, color: '#f59e0b' },
    { area: 'Demonstrações Financeiras (DRE)', score: 95, color: '#8b5cf6' },
    { area: 'Estratégias de Valuation & M&A', score: 70, color: '#06b6d4' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Gamification Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-400 text-slate-900 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-current" /> Academia WorldContábil
            </span>
            <span className="text-xs text-blue-200">
              Gamificação e Desafios para Contadores e Estudantes
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Aprenda Normas, Conquiste Emblemas e Suba no Ranking
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-2 leading-relaxed">
            Resolva desafios diários de NBC TG, CPC e tributação do Simples Nacional ao Lucro Real. Ganhe medalhas de marco acadêmico e compartilhe suas conquistas com sua rede!
          </p>

          {/* Quick status bar */}
          <div className="flex flex-wrap items-center gap-4 mt-5 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-200 block">Nível Atual</span>
                <span className="text-sm font-extrabold text-white">Nível {currentUser.level}</span>
              </div>
            </div>

            <div className="h-6 w-px bg-white/20" />

            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-300 fill-current" />
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-200 block">Experiência Total</span>
                <span className="text-sm font-extrabold text-emerald-300">{currentUser.xp} XP</span>
              </div>
            </div>

            <div className="h-6 w-px bg-white/20" />

            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-300" />
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-200 block">Medalhas Desbloqueadas</span>
                <span className="text-sm font-extrabold text-white">
                  {currentUser.badges.length} de {BADGES_LIST.length}
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                onOpenShareModal({
                  title: `Alcancei o Nível ${currentUser.level} no WorldContábil!`,
                  description: `Acumulei ${currentUser.xp} XP e ${currentUser.badges.length} medalhas em normas contábeis e auditoria fiscal.`,
                  badge: 'Mestre do Balanço',
                })
              }
              className="ml-auto bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Compartilhar Conquista</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'quiz', label: 'Desafio de Perguntas (Quiz)', icon: Brain },
          { id: 'badges', label: 'Galeria de Emblemas & Medalhas', icon: Award },
          { id: 'ranking', label: 'Ranking de Desempenho', icon: Trophy },
          { id: 'metrics', label: 'Relatório de Evolução Acadêmica', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: QUIZ GAME (Jogabilidade e Desafios de Perguntas e Respostas) */}
      {activeTab === 'quiz' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            {currentQuizIndex < QUIZ_QUESTIONS.length ? (
              <div className="space-y-6">
                {/* Quiz Meta */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                      Questão {currentQuizIndex + 1} de {QUIZ_QUESTIONS.length}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      • {currentQuestion.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+{currentQuestion.xpReward} XP</span>
                  </div>
                </div>

                {/* Question */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Dificuldade: {currentQuestion.difficulty}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 leading-snug">
                    {currentQuestion.question}
                  </h3>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQuestion.correctIndex;

                    let optionStyle = 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/40';
                    if (hasAnswered) {
                      if (isCorrect) {
                        optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-2 ring-emerald-500/20';
                      } else if (isSelected) {
                        optionStyle = 'border-rose-400 bg-rose-50 text-rose-900 line-through';
                      } else {
                        optionStyle = 'border-slate-200 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={hasAnswered}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full p-4 rounded-2xl border text-left text-xs transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
                      >
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1 leading-relaxed">{option}</span>

                        {hasAnswered && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                        {hasAnswered && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation feedback */}
                {hasAnswered && (
                  <div
                    className={`p-4 rounded-2xl border animate-in fade-in space-y-2 ${
                      selectedOption === currentQuestion.correctIndex
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                        : 'bg-amber-50/70 border-amber-300 text-amber-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      {selectedOption === currentQuestion.correctIndex ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Resposta Exata! Parabéns pelo domínio técnico.</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-amber-700" />
                          <span>Atenção à fundamentação teórica:</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed">{currentQuestion.explanation}</p>
                    <div className="pt-1 text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>Referência Normativa: <strong>{currentQuestion.normReference}</strong></span>
                    </div>
                  </div>
                )}

                {/* Next button */}
                {hasAnswered && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>
                        {currentQuizIndex < QUIZ_QUESTIONS.length - 1
                          ? 'Próxima Pergunta'
                          : 'Ver Resultado Final'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Quiz Finished Summary */
              <div className="text-center py-8 space-y-4">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <Trophy className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-800">
                  Parabéns! Desafio Concluído!
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Você completou as questões técnicas de normas NBC/CPC e acumulou{' '}
                  <strong className="text-emerald-600 font-bold">+{quizScore} XP</strong> para sua carreira acadêmica e profissional!
                </p>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={handleRestartQuiz}
                    className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Jogar Novamente</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('ranking')}
                    className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                  >
                    Ver Meu Lugar no Ranking
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR: Gamification Rules & Daily Challenge */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-amber-500" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  Desafio Relâmpago do Dia
                </h4>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-emerald-50 p-4 rounded-2xl border border-blue-100">
                <span className="text-[10px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded-full border border-blue-200">
                  Bônus de 200 XP
                </span>
                <p className="text-xs font-bold text-slate-800 mt-2">
                  "Partidas Dobradas: Toda causa tem um efeito proporcional!"
                </p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Responda a 3 perguntas consecutivas sem errar para desbloquear o emblema de bronze{' '}
                  <em>Ás do Simples Nacional</em>.
                </p>
              </div>
            </div>

            {/* Level Tier explanation */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Hierarquia de Níveis
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                  <span className="font-medium text-slate-700">Nível 1 - 3: Aprendiz do Balanço</span>
                  <span className="text-slate-400 text-[10px]">Até 3.000 XP</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                  <span className="font-medium text-slate-700">Nível 4 - 6: Analista Fiscal Sênior</span>
                  <span className="text-slate-400 text-[10px]">3.000 - 6.000 XP</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                  <span className="font-medium text-slate-700">Nível 7 - 9: Mestre em Auditoria</span>
                  <span className="text-slate-400 text-[10px]">6.000 - 10.000 XP</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-bold">
                  <span>Nível 10+: Grão-Mestre Contábil (Admin)</span>
                  <span className="text-amber-700 text-[10px]">10.000+ XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BADGES GALLERY */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {BADGES_LIST.map((badge) => {
            const isUnlocked = currentUser.badges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`rounded-3xl p-6 border transition-all relative overflow-hidden ${
                  isUnlocked
                    ? 'bg-white border-blue-200 shadow-md ring-1 ring-blue-500/20'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-emerald-50 border border-slate-200 flex items-center justify-center text-3xl shadow-xs">
                    {badge.icon}
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      badge.tier === 'Diamante'
                        ? 'bg-purple-100 text-purple-800'
                        : badge.tier === 'Ouro'
                        ? 'bg-amber-100 text-amber-800'
                        : badge.tier === 'Prata'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    Tier {badge.tier}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-800 mt-3">{badge.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{badge.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Categoria: {badge.category}
                  </span>
                  {isUnlocked ? (
                    <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Conquistado
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs">Bloqueado</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: LEADERBOARD / RANKING */}
      {activeTab === 'ranking' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-800">
                Quadro de Honra & Ranking da Comunidade
              </h3>
              <p className="text-xs text-slate-500">
                Classificação baseada em resolução de desafios, contribuições no fórum técnico e pontualidade fiscal.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Atualizado em Tempo Real
            </span>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {SAMPLE_USERS.sort((a, b) => b.xp - a.xp).map((user, idx) => {
              const isCurrentUser = user.id === currentUser.id;
              return (
                <div
                  key={user.id}
                  className={`py-3.5 px-3 flex items-center justify-between transition-colors rounded-2xl ${
                    isCurrentUser ? 'bg-blue-50/70 border border-blue-200' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs ${
                        idx === 0
                          ? 'bg-amber-400 text-slate-900 shadow-xs'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-800'
                          : idx === 2
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </span>

                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                    />

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">{user.name}</span>
                        {user.isAdmin && (
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 rounded-full">
                            ADMIN
                          </span>
                        )}
                        {isCurrentUser && (
                          <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 rounded-full">
                            Você
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 block">
                        {user.role === 'admin'
                          ? 'Super Administrador'
                          : user.role === 'contador'
                          ? user.crc || 'Contador CRC'
                          : user.role === 'estudante'
                          ? user.university
                          : 'Empresário'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-blue-900 block">
                      {user.xp.toLocaleString('pt-BR')} XP
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Nível {user.level} • {user.streakDays} dias seguidos
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: ACADEMIC PROGRESS & CHARTS */}
      {activeTab === 'metrics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h3 className="font-bold text-base text-slate-800">
                Relatório de Evolução Acadêmica & Domínio por Competência
              </h3>
              <p className="text-xs text-slate-500">
                Gráfico interativo com métricas de desempenho nas áreas fundamentais da contabilidade brasileira.
              </p>
            </div>

            {/* Interactive Progress Bars */}
            <div className="space-y-4">
              {academicEvolution.map((item) => (
                <div key={item.area} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800">{item.area}</span>
                    <span className="font-bold text-slate-900">{item.score}% de Domínio</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${item.score}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-950 space-y-1">
              <span className="font-bold text-blue-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Diagnóstico de Aprendizado Personalizado
              </span>
              <p className="text-[11px] leading-relaxed">
                Você apresenta excelente desempenho em <strong>Demonstrações Financeiras (DRE)</strong> e <strong>Normas NBC/CPC</strong>. Para atingir o nível 10, recomendamos intensificar simulações de <strong>Valuation & M&A</strong> e participar das discussões no Fórum de Mercado.
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              Certificação de Horas Complementares
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto font-bold text-sm">
                40h
              </div>
              <h5 className="font-bold text-xs text-slate-800">Horas Acadêmicas Acumuladas</h5>
              <p className="text-[11px] text-slate-500">
                Válidas para comprovação de atividades complementares de graduação universitária de Ciências Contábeis.
              </p>
              <button
                onClick={() => window.print()}
                className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Imprimir Certificado (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
