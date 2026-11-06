import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Star,
  MapPin,
  BookOpen,
  Search,
  ExternalLink,
  MessageCircle,
  Building2,
  Award,
} from 'lucide-react';
import { UniversityHub, UserProfile } from '../types';
import { ACCOUNTING_UNIVERSITIES } from '../data/mockData';

interface UniversitiesViewProps {
  currentUser: UserProfile;
  onOpenAIChat: () => void;
}

export const UniversitiesView: React.FC<UniversitiesViewProps> = ({
  currentUser,
  onOpenAIChat,
}) => {
  const [universities, setUniversities] = useState<UniversityHub[]>(ACCOUNTING_UNIVERSITIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedGroups, setJoinedGroups] = useState<Record<string, boolean>>({ uni_usp: true });

  const handleToggleJoin = (uniId: string) => {
    setJoinedGroups((prev) => ({
      ...prev,
      [uniId]: !prev[uniId],
    }));
  };

  const filtered = universities.filter((u) => {
    return (
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.acronym.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.featuredTopic.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-400 text-slate-900 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" /> Polo Acadêmico Nacional
            </span>
            <span className="text-xs text-blue-200">
              Faculdades e Cursos de Ciências Contábeis
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Universidades do Curso de Contabilidade & Redes de Pesquisa
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-2 leading-relaxed">
            Conecte-se com alunos, professores e pesquisadores das principais faculdades de Ciências Contábeis do país. Acesse grupos de estudo, projetos de extensão, artigos científicos e estágios.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Pesquisar por USP, UFRJ, estado, linha de pesquisa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-blue-600 outline-none"
          />
        </div>

        <span className="text-xs text-slate-500 font-medium">
          <strong>{filtered.length}</strong> instituições conveniadas no ecossistema
        </span>
      </div>

      {/* Universities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((uni) => {
          const isJoined = !!joinedGroups[uni.id];
          return (
            <div
              key={uni.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
                    {uni.acronym.slice(0, 4)}
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-xl border border-amber-200 text-amber-900 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{uni.rating.toFixed(1)} MEC</span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug">{uni.name}</h3>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{uni.state}</span>
                </div>

                {/* Focus topic */}
                <div className="mt-3.5 p-3 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block mb-0.5">
                    Linha de Pesquisa & Destaque:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">{uni.featuredTopic}</p>
                </div>

                {/* Courses */}
                <div className="mt-3 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Cursos & Programas:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {uni.courses.map((c, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-semibold text-slate-700">{uni.studentsCount}</span>
                  <span className="text-[11px] text-slate-400">membros</span>
                </div>

                <button
                  onClick={() => handleToggleJoin(uni.id)}
                  className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                    isJoined
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-blue-700 hover:bg-blue-800 text-white shadow-xs'
                  }`}
                >
                  {isJoined ? 'Comunidade Conectada ✓' : 'Entrar na Comunidade'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
