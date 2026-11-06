import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Image,
  Video,
  FileText,
  Send,
  Sparkles,
  Pin,
  TrendingUp,
  Hash,
  Filter,
  CheckCircle,
  Users,
  Flame,
  Award,
  Bookmark,
} from 'lucide-react';
import { SocialPost, UserProfile, PostComment } from '../types';
import { VerifiedBadge } from './VerifiedBadge';

interface FeedViewProps {
  currentUser: UserProfile;
  posts: SocialPost[];
  onAddPost: (post: Omit<SocialPost, 'id' | 'likes' | 'likedByMe' | 'comments' | 'shares' | 'timestamp'>) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onOpenShareModal: (post: SocialPost) => void;
  onOpenAIChat: () => void;
  onOpenProfileModal?: () => void;
  liveChatMessages: Array<{ id: string; senderName: string; text: string; time: string; isAI?: boolean }>;
  onSendLiveChatMessage: (text: string) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  currentUser,
  posts,
  onAddPost,
  onLikePost,
  onAddComment,
  onOpenShareModal,
  onOpenAIChat,
  onOpenProfileModal,
  liveChatMessages,
  onSendLiveChatMessage,
}) => {
  // New post form state
  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState<'none' | 'image' | 'video'>('none');
  const [mediaUrl, setMediaUrl] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['ReformaTributária', 'NBC_TG']);
  const [showMediaInput, setShowMediaInput] = useState(false);

  // Filter state
  const [filterTag, setFilterTag] = useState<string>('ALL');

  // Comment input per post
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  // Mini live chat input
  const [chatMessageText, setChatMessageText] = useState('');

  const availableTags = [
    'ReformaTributária',
    'NBC_TG',
    'CPC00',
    'LucroReal',
    'SimplesNacional',
    'AuditoriaFiscal',
    'DRE',
    'IFRS',
    'Valuation',
  ];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onAddPost({
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      authorCrc: currentUser.crc,
      content,
      mediaType: mediaUrl.trim() ? mediaType : 'none',
      mediaUrl: mediaUrl.trim() || undefined,
      tags: selectedTags.length > 0 ? selectedTags : ['ContabilidadeGeral'],
      pinned: currentUser.isAdmin,
      authorIsVerified: currentUser.isVerified,
    });

    setContent('');
    setMediaUrl('');
    setMediaType('none');
    setShowMediaInput(false);
  };

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    onAddComment(postId, text);
    setCommentInputs({ ...commentInputs, [postId]: '' });
    setExpandedComments({ ...expandedComments, [postId]: true });
  };

  const filteredPosts =
    filterTag === 'ALL'
      ? posts
      : posts.filter((p) => p.tags.some((t) => t.toLowerCase() === filterTag.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Profile summary & trending topics (3 cols) */}
        <div className="lg:col-span-3 space-y-5">
          {/* User Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
            <div className="h-16 bg-gradient-to-r from-blue-700 via-blue-600 to-emerald-600 -mx-5 -mt-5 rounded-t-3xl relative">
              {currentUser.isAdmin && (
                <span className="absolute top-2 right-2 bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Admin Master
                </span>
              )}
            </div>
            <div className="relative -mt-8 flex flex-col items-center text-center">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-md"
              />
              <h3 className="font-bold text-slate-800 text-sm mt-2 flex items-center justify-center gap-1.5">
                <span>{currentUser.name}</span>
                {currentUser.isVerified && <VerifiedBadge size="sm" />}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {currentUser.role === 'admin'
                  ? 'Administrador Chefe'
                  : currentUser.role === 'contador'
                  ? `Contador (${currentUser.crc || 'CRC Ativo'})`
                  : currentUser.role === 'estudante'
                  ? currentUser.university || 'Estudante Acadêmico'
                  : 'Empresário / Investidor'}
              </p>

              {/* Level & XP Progress bar */}
              <div className="w-full mt-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-bold text-blue-900 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-500" /> Nível {currentUser.level}
                  </span>
                  <span className="text-emerald-600 font-bold">{currentUser.xp} XP</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((currentUser.xp % 1000) / 10, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Ofensiva: {currentUser.streakDays} dias 🔥</span>
                  <span>Próximo: {((currentUser.level || 1) * 1000)} XP</span>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-2 w-full mt-3 pt-3 border-t border-slate-100 text-center">
                <div>
                  <span className="block text-xs font-bold text-slate-800">{currentUser.followersCount}</span>
                  <span className="text-[10px] text-slate-400">Seguidores</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-800">{currentUser.followingCount}</span>
                  <span className="text-[10px] text-slate-400">Conexões</span>
                </div>
              </div>

              {/* Bio Excerpt */}
              {currentUser.bio && (
                <div className="w-full mt-3 pt-2 border-t border-slate-100 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Biografia:
                  </span>
                  <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                    "{currentUser.bio}"
                  </p>
                </div>
              )}

              {/* Edit Bio, Photo & CV Button */}
              {onOpenProfileModal && (
                <button
                  type="button"
                  onClick={onOpenProfileModal}
                  className="w-full mt-3 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-blue-200 shadow-2xs"
                >
                  <span>✏️ Editar Biografia, Foto & CV</span>
                </button>
              )}
            </div>
          </div>

          {/* Trending Topics & Tax Hashtags */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Tópicos em Alta</h4>
            </div>
            <div className="space-y-2">
              {[
                { tag: 'ReformaTributária', posts: '1.4k posts', trending: true },
                { tag: 'IBS_CBS_2026', posts: '890 posts', trending: true },
                { tag: 'CPC00_R2', posts: '530 posts' },
                { tag: 'SimplesNacional_FatorR', posts: '410 posts' },
                { tag: 'DRE_Gerencial', posts: '320 posts' },
                { tag: 'Auditoria_NBC_TA', posts: '280 posts' },
              ].map((item) => (
                <button
                  key={item.tag}
                  onClick={() => setFilterTag(item.tag)}
                  className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    filterTag === item.tag
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-blue-500" />
                    <span>#{item.tag}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{item.posts}</span>
                </button>
              ))}
            </div>

            {filterTag !== 'ALL' && (
              <button
                onClick={() => setFilterTag('ALL')}
                className="w-full mt-3 text-center text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                Limpar filtro (Ver todos)
              </button>
            )}
          </div>
        </div>

        {/* MIDDLE COLUMN: Social Feed & Create Post (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Create Post Card (Facebook / Insta style) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20 shrink-0"
              />
              <div className="flex-1">
                <textarea
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`Compartilhe um artigo, parecer, insight fiscal ou trabalho com a comunidade, ${currentUser.name.split(' ')[0]}...`}
                  className="w-full text-xs text-slate-800 placeholder-slate-400 bg-slate-50 rounded-2xl p-3 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none transition-all"
                />

                {/* Media URL Input if active */}
                {showMediaInput && (
                  <div className="mt-2.5 p-3 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2">
                    <div className="flex items-center gap-2">
                      <select
                        value={mediaType}
                        onChange={(e) => setMediaType(e.target.value as any)}
                        className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white outline-none"
                      >
                        <option value="image">Foto / Infográfico (URL)</option>
                        <option value="video">Vídeo (URL MP4 ou Web)</option>
                      </select>
                      <input
                        type="url"
                        placeholder="Cole o link da imagem ou vídeo demonstrativo..."
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                        className="flex-1 text-xs p-1.5 rounded-lg border border-slate-300 bg-white outline-none"
                      />
                    </div>
                    {/* Quick preset images for fast sharing */}
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span>Exemplos rápidos:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setMediaType('image');
                          setMediaUrl('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&auto=format&fit=crop&q=80');
                        }}
                        className="underline text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        DRE Fiscal
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMediaType('image');
                          setMediaUrl('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=80');
                        }}
                        className="underline text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        Métricas de Balanço
                      </button>
                    </div>
                  </div>
                )}

                {/* Tags selector */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {availableTags.slice(0, 5).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => handleToggleTag(t)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                        selectedTags.includes(t)
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      #{t}
                    </button>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMediaInput(!showMediaInput);
                        if (!mediaType || mediaType === 'none') setMediaType('image');
                      }}
                      className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer font-medium"
                    >
                      <Image className="w-4 h-4 text-emerald-600" />
                      <span>Foto / Gráfico</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMediaInput(!showMediaInput);
                        setMediaType('video');
                      }}
                      className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer font-medium"
                    >
                      <Video className="w-4 h-4 text-blue-600" />
                      <span>Vídeo Aula</span>
                    </button>
                  </div>

                  <button
                    onClick={handleCreatePost}
                    disabled={!content.trim()}
                    className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
                      content.trim()
                        ? 'bg-blue-700 hover:bg-blue-800 text-white shadow-sm shadow-blue-500/20'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span>Publicar</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Feed Stream */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className={`bg-white rounded-3xl p-5 border shadow-xs transition-all ${
                  post.pinned
                    ? 'border-blue-300 ring-2 ring-blue-500/10 bg-gradient-to-b from-blue-50/20 to-white'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800">{post.authorName}</span>
                        {post.authorIsVerified && <VerifiedBadge size="xs" />}
                        {post.authorRole === 'admin' ? (
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                            ADMIN
                          </span>
                        ) : post.authorRole === 'contador' ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                            CRC
                          </span>
                        ) : (
                          <span className="bg-blue-100 text-blue-800 text-[9px] font-medium px-1.5 py-0.2 rounded-full">
                            Estudante
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        {post.authorCrc && <span>{post.authorCrc} • </span>}
                        <span>{post.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {post.pinned && (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-full">
                      <Pin className="w-3 h-3 text-blue-600 rotate-45" />
                      <span>Fixado pelo Admin</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line mb-3 font-normal">
                  {post.content}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        onClick={() => setFilterTag(tag)}
                        className="text-[10px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-full cursor-pointer transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Media (Image or Video) */}
                {post.mediaUrl && (
                  <div className="rounded-2xl overflow-hidden mb-3 border border-slate-200/80 bg-slate-900 max-h-96 flex items-center justify-center">
                    {post.mediaType === 'video' ? (
                      <video
                        src={post.mediaUrl}
                        controls
                        className="w-full max-h-96 object-cover"
                      />
                    ) : (
                      <img
                        src={post.mediaUrl}
                        alt="Conteúdo Contábil"
                        className="w-full max-h-96 object-cover hover:scale-[1.01] transition-transform"
                      />
                    )}
                  </div>
                )}

                {/* Engagement Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-4">
                    {/* Like button */}
                    <button
                      onClick={() => onLikePost(post.id)}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                        post.likedByMe
                          ? 'text-rose-600 font-bold bg-rose-50'
                          : 'text-slate-600 hover:text-rose-600 hover:bg-slate-50'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.likedByMe ? 'fill-rose-600 text-rose-600' : ''}`} />
                      <span>{post.likes}</span>
                    </button>

                    {/* Comment button */}
                    <button
                      onClick={() =>
                        setExpandedComments({
                          ...expandedComments,
                          [post.id]: !expandedComments[post.id],
                        })
                      }
                      className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments.length}</span>
                    </button>

                    {/* Share button */}
                    <button
                      onClick={() => onOpenShareModal(post)}
                      className="flex items-center gap-1.5 text-slate-600 hover:text-emerald-600 px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>{post.shares}</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400">Verificado</span>
                </div>

                {/* Comments Section */}
                {expandedComments[post.id] && (
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-3 animate-in fade-in">
                    {/* Existing comments */}
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-2.5 text-xs">
                        <img
                          src={comment.authorAvatar}
                          alt={comment.authorName}
                          className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                        />
                        <div className="flex-1 bg-slate-50 rounded-2xl p-2.5 border border-slate-100">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                              <span>{comment.authorName}</span>
                              {comment.authorIsVerified && <VerifiedBadge size="xs" />}
                            </span>
                            <span className="text-[10px] text-slate-400">{comment.timestamp}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-0.5">{comment.text}</p>
                        </div>
                      </div>
                    ))}

                    {/* Add comment input */}
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Escreva um comentário profissional ou dúvida técnica..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleCommentSubmit(post.id);
                          }
                        }}
                        className="flex-1 text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 outline-none"
                      />
                      <button
                        onClick={() => handleCommentSubmit(post.id)}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Live Chat em Tempo Real & Accounting News (3 cols) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Live Community Chat (Chat em tempo real) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col h-[520px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  Chat Contábil ao Vivo
                </h4>
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                142 Online
              </span>
            </div>

            <p className="text-[11px] text-slate-500 py-2">
              Canal aberto para networking rápido, dúvidas de balanço e plantão de normas.
            </p>

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
              {liveChatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2.5 rounded-2xl text-xs ${
                    msg.isAI
                      ? 'bg-blue-50 border border-blue-200 text-blue-900'
                      : 'bg-slate-50 border border-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-[11px] text-slate-900 flex items-center gap-1">
                      {msg.senderName}
                      {msg.isAI && (
                        <span className="bg-blue-600 text-white text-[8px] font-black px-1 rounded-sm">
                          IA 24H
                        </span>
                      )}
                    </span>
                    <span className="text-[9px] text-slate-400">{msg.time}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (chatMessageText.trim()) {
                  onSendLiveChatMessage(chatMessageText);
                  setChatMessageText('');
                }
              }}
              className="pt-3 border-t border-slate-100 flex gap-2"
            >
              <input
                type="text"
                placeholder="Mande sua mensagem..."
                value={chatMessageText}
                onChange={(e) => setChatMessageText(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 outline-none"
              />
              <button
                type="submit"
                className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Quick AI Consultant Card */}
          <div className="bg-gradient-to-br from-blue-900 to-emerald-900 rounded-3xl p-5 text-white shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Plantão Técnico 24h
              </span>
            </div>
            <h4 className="font-bold text-sm">Dúvida em CPC ou Reforma Fiscal?</h4>
            <p className="text-[11px] text-blue-100 mt-1 leading-relaxed">
              Consulte a IA especialista do WorldContábil treinada em normas do CFC, CPC e Simples Nacional.
            </p>
            <button
              onClick={onOpenAIChat}
              className="mt-3 w-full py-2 bg-white hover:bg-blue-50 text-blue-900 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Consultar Assistente Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
