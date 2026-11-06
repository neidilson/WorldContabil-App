import React, { useState } from 'react';
import {
  BookOpen,
  MessageSquare,
  ThumbsUp,
  CheckCircle,
  Plus,
  Search,
  Filter,
  ShieldAlert,
  ShieldCheck,
  Tag,
  Clock,
  Award,
  Sparkles,
} from 'lucide-react';
import { ForumTopic, UserProfile, ForumAnswer } from '../types';
import { VerifiedBadge } from './VerifiedBadge';

interface ForumViewProps {
  currentUser: UserProfile;
  topics: ForumTopic[];
  onAddTopic: (topic: Omit<ForumTopic, 'id' | 'upvotes' | 'answers' | 'createdAt' | 'isSolved' | 'isModerated'>) => void;
  onAddAnswer: (topicId: string, answerText: string) => void;
  onUpvoteTopic: (topicId: string) => void;
  onUpvoteAnswer: (topicId: string, answerId: string) => void;
  onToggleBestAnswer: (topicId: string, answerId: string) => void;
  onToggleModerated: (topicId: string) => void;
  onOpenAIChat: () => void;
}

export const ForumView: React.FC<ForumViewProps> = ({
  currentUser,
  topics,
  onAddTopic,
  onAddAnswer,
  onUpvoteTopic,
  onUpvoteAnswer,
  onToggleBestAnswer,
  onToggleModerated,
  onOpenAIChat,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);

  // New topic state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<ForumTopic['category']>('NBC_IFRS');
  const [newTags, setNewTags] = useState('NBC_TG, CPC');

  // Answer input state
  const [answerText, setAnswerText] = useState('');

  const categories = [
    { id: 'ALL', label: 'Todos os Tópicos' },
    { id: 'NBC_IFRS', label: 'Normas NBC & CPC (IFRS)' },
    { id: 'TRIBUTARIO', label: 'Legislação Tributária & Reforma' },
    { id: 'PERICIA', label: 'Perícia & Auditoria Forense' },
    { id: 'ESTRATEGIAS_MERCADO', label: 'Estratégias Financeiras & M&A' },
    { id: 'CARREIRA', label: 'Exame de Suficiência & Carreira' },
  ];

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    onAddTopic({
      title: newTitle,
      content: newContent,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      authorIsVerified: currentUser.isVerified,
      category: newCategory,
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setNewTitle('');
    setNewContent('');
    setShowNewTopicModal(false);
  };

  const handleSendAnswer = (topicId: string) => {
    if (!answerText.trim()) return;
    onAddAnswer(topicId, answerText);
    setAnswerText('');

    // Update active modal topic if open
    if (selectedTopic && selectedTopic.id === topicId) {
      const updated = topics.find((t) => t.id === topicId);
      if (updated) setSelectedTopic(updated);
    }
  };

  const filteredTopics = topics.filter((t) => {
    const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Forum Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-6 relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Fórum Técnico Moderado
            </span>
            <span className="text-xs text-blue-200">
              Ambiente auditado para intercâmbio de normas contábeis
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Debates Técnicos, Normas NBC / CPC e Estratégias Financeiras
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-2 leading-relaxed">
            Tire dúvidas sobre pronunciamentos técnicos contábeis, IFRS, enquadramento fiscal e decisões de investimentos com profissionais certificados e auditores seniores.
          </p>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={() => setShowNewTopicModal(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Abrir Novo Tópico Técnico</span>
            </button>
            <button
              onClick={onOpenAIChat}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Consultar Parecer com IA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Categories & Search Filter Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Pesquisar por CPC, número de norma, imposto, dúvida..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
            />
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Exibindo <strong>{filteredTopics.length}</strong> discussões técnicas
          </span>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Topics List */}
      <div className="space-y-4">
        {filteredTopics.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">Nenhum tópico encontrado</h3>
            <p className="text-xs text-slate-400 mt-1">
              Tente buscar outros termos ou seja o primeiro a abrir uma discussão sobre este tema!
            </p>
          </div>
        ) : (
          filteredTopics.map((topic) => {
            const hasBestAnswer = topic.answers.some((a) => a.isBestAnswer);
            return (
              <div
                key={topic.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-blue-300 hover:shadow-xs transition-all flex flex-col md:flex-row gap-4 items-start"
              >
                {/* Upvotes Counter Column */}
                <div className="flex md:flex-col items-center gap-1 shrink-0 bg-slate-50 border border-slate-100 p-2.5 rounded-2xl w-full md:w-16 justify-center">
                  <button
                    onClick={() => onUpvoteTopic(topic.id)}
                    className="p-1 text-slate-500 hover:text-blue-600 cursor-pointer transition-colors"
                    title="Voto útil"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-extrabold text-blue-900">{topic.upvotes}</span>
                  <span className="text-[10px] text-slate-400 font-medium">votos</span>
                </div>

                {/* Main Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {topic.category.replace('_', ' ')}
                    </span>
                    {hasBestAnswer && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Parecer Resolvido
                      </span>
                    )}
                    {topic.isModerated && (
                      <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Moderado pelo Conselho
                      </span>
                    )}
                  </div>

                  <h3
                    onClick={() => setSelectedTopic(topic)}
                    className="text-sm font-bold text-slate-800 hover:text-blue-600 cursor-pointer transition-colors leading-snug"
                  >
                    {topic.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {topic.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {topic.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <img
                        src={topic.authorAvatar}
                        alt={topic.authorName}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <span>{topic.authorName}</span>
                        {topic.authorIsVerified && <VerifiedBadge size="xs" />}
                      </span>
                      <span>• {topic.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedTopic(topic)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{topic.answers.length} Respostas</span>
                      </button>

                      {currentUser.isAdmin && (
                        <button
                          onClick={() => onToggleModerated(topic.id)}
                          className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 cursor-pointer"
                        >
                          {topic.isModerated ? 'Remover Moderação' : 'Aprovar Moderação'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DETAIL MODAL FOR TOPIC & ANSWERS */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase">
                  {selectedTopic.category.replace('_', ' ')}
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                  {selectedTopic.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span>Iniciado por <strong>{selectedTopic.authorName}</strong></span>
                  <span>• {selectedTopic.createdAt}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTopic(null)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content & Answers */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Question description */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                {selectedTopic.content}
              </div>

              {/* Answers list */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>Respostas e Pareceres Técnicos ({selectedTopic.answers.length})</span>
                </h4>

                <div className="space-y-3">
                  {selectedTopic.answers.map((ans) => (
                    <div
                      key={ans.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        ans.isBestAnswer
                          ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={ans.authorAvatar}
                            alt={ans.authorName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-slate-800">
                              {ans.authorName}
                            </span>
                            {ans.authorIsVerified && <VerifiedBadge size="xs" />}
                            {ans.authorCrc && (
                              <span className="text-[10px] text-slate-500 ml-1">
                                ({ans.authorCrc})
                              </span>
                            )}
                          </div>
                        </div>

                        {ans.isBestAnswer && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Melhor Parecer Certificado
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                        {ans.text}
                      </p>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-xs">
                        <span className="text-[10px] text-slate-400">{ans.timestamp}</span>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => onUpvoteAnswer(selectedTopic.id, ans.id)}
                            className="flex items-center gap-1 text-slate-600 hover:text-blue-600 cursor-pointer"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span className="font-bold text-[11px]">{ans.upvotes}</span>
                          </button>

                          {(currentUser.isAdmin || currentUser.name === selectedTopic.authorName) && (
                            <button
                              onClick={() => onToggleBestAnswer(selectedTopic.id, ans.id)}
                              className="text-[10px] font-semibold text-emerald-700 hover:underline cursor-pointer"
                            >
                              {ans.isBestAnswer ? 'Desmarcar Melhor' : 'Eleger Melhor Resposta'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Answer Box */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Sua Contribuição ou Parecer Técnico Fundamentado
                </label>
                <textarea
                  rows={3}
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Escreva sua resposta citando as normas NBC TG, CPC ou artigos da legislação pertinente..."
                  className="w-full text-xs p-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => handleSendAnswer(selectedTopic.id)}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all"
                  >
                    Publicar Parecer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW TOPIC MODAL */}
      {showNewTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Novo Tópico no Fórum Técnico</h3>
              <button
                onClick={() => setShowNewTopicModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título da Discussão
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Tratamento contábil de subvenções fiscais (CPC 07) no Lucro Real"
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
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:border-blue-600 outline-none"
                  >
                    <option value="NBC_IFRS">Normas NBC & CPC</option>
                    <option value="TRIBUTARIO">Legislação Tributária</option>
                    <option value="PERICIA">Perícia & Auditoria</option>
                    <option value="ESTRATEGIAS_MERCADO">Estratégias de Mercado</option>
                    <option value="CARREIRA">Exame CFC & Carreira</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tags (separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    placeholder="CPC07, LucroReal, IFRS"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detalhamento da Dúvida / Cenário Contábil
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Descreva o caso com fatos, artigos e lançamentos para embasar a resposta dos colegas..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTopicModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Publicar Tópico
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
