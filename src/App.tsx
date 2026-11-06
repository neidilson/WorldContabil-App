import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ADMIN_USER,
  INITIAL_POSTS,
  FORUM_TOPICS,
  FINANCIAL_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
  CONNECTED_BANKS,
  DEFAULT_SITE_CONFIG,
  DEFAULT_PGC_PLANS,
  INITIAL_VERIFICATION_REQUESTS,
} from './data/mockData';
import {
  UserProfile,
  SocialPost,
  ForumTopic,
  FinancialTransaction,
  AppNotification,
  QuizQuestion,
  SiteConfig,
  PGCPlanDocument,
  VerificationRequest,
  VerificationDocumentType,
} from './types';
import { Navbar } from './components/Navbar';
import { FeedView } from './components/FeedView';
import { ForumView } from './components/ForumView';
import { GamificationView } from './components/GamificationView';
import { MarketplaceView } from './components/MarketplaceView';
import { BankingView } from './components/BankingView';
import { FiscalReportsView } from './components/FiscalReportsView';
import { StudyCalendarView } from './components/StudyCalendarView';
import { UniversitiesView } from './components/UniversitiesView';
import { AccountingSimulatorView } from './components/AccountingSimulatorView';
import { PGCManagerView } from './components/PGCManagerView';
import { AdminView } from './components/AdminView';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { AIChatDrawer } from './components/AIChatDrawer';
import { ShareAchievementModal } from './components/ShareAchievementModal';

export default function App() {
  // App state
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('worldcontabil_user');
    return saved ? JSON.parse(saved) : ADMIN_USER;
  });

  const [activeTab, setActiveTab] = useState<string>('feed');
  const [posts, setPosts] = useState<SocialPost[]>(() => {
    const saved = localStorage.getItem('worldcontabil_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [topics, setTopics] = useState<ForumTopic[]>(() => {
    const saved = localStorage.getItem('worldcontabil_topics');
    return saved ? JSON.parse(saved) : FORUM_TOPICS;
  });

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem('worldcontabil_txns');
    return saved ? JSON.parse(saved) : FINANCIAL_TRANSACTIONS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('worldcontabil_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('worldcontabil_site_config');
    return saved ? JSON.parse(saved) : DEFAULT_SITE_CONFIG;
  });

  const [pgcPlans, setPgcPlans] = useState<PGCPlanDocument[]>(() => {
    const saved = localStorage.getItem('worldcontabil_pgc_plans');
    return saved ? JSON.parse(saved) : DEFAULT_PGC_PLANS;
  });

  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>(() => {
    const saved = localStorage.getItem('worldcontabil_verifications');
    return saved ? JSON.parse(saved) : INITIAL_VERIFICATION_REQUESTS;
  });

  const [isOffline, setIsOffline] = useState<boolean>(false);

  // Live community chat messages in the Feed side panel
  const [liveChatMessages, setLiveChatMessages] = useState<
    Array<{ id: string; senderName: string; text: string; time: string; isAI?: boolean }>
  >([
    {
      id: 'c1',
      senderName: 'Prof. Nelson Carvalho',
      text: 'Colegas, a transição para a CBS e IBS exigirá parametrização contábil antecipada nos sistemas ERP.',
      time: '08:42',
    },
    {
      id: 'c2',
      senderName: 'Dra. Camila Duarte',
      text: 'Exato, professor! Já estamos fazendo o saneamento da base fiscal de ICMS/ISS dos clientes.',
      time: '08:45',
    },
    {
      id: 'c3',
      senderName: 'Lucas Mendes',
      text: 'Alguém tem o modelo de conciliação do Fator R atualizado para compartilhar?',
      time: '08:48',
    },
    {
      id: 'c4',
      senderName: 'WorldContábil IA',
      text: 'Olá Lucas! Você pode acessar a fórmula e o simulador na aba de Relatórios Fiscais ou Metas.',
      time: '08:49',
      isAI: true,
    },
  ]);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [shareData, setShareData] = useState<{
    title?: string;
    description?: string;
    badge?: string;
  } | null>(null);

  // Save changes to localStorage for offline access resilience
  useEffect(() => {
    localStorage.setItem('worldcontabil_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('worldcontabil_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('worldcontabil_topics', JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem('worldcontabil_txns', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('worldcontabil_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('worldcontabil_site_config', JSON.stringify(siteConfig));
  }, [siteConfig]);

  useEffect(() => {
    localStorage.setItem('worldcontabil_pgc_plans', JSON.stringify(pgcPlans));
  }, [pgcPlans]);

  useEffect(() => {
    localStorage.setItem('worldcontabil_verifications', JSON.stringify(verificationRequests));
  }, [verificationRequests]);

  // Gamification helpers
  const handleAddXP = (xpPoints: number) => {
    setCurrentUser((prev) => {
      const newXP = prev.xp + xpPoints;
      const newLevel = Math.floor(newXP / 1000) + 1;
      const leveledUp = newLevel > prev.level;

      if (leveledUp) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });

        // Add level up notification
        setNotifications((notifs) => [
          {
            id: 'notif_lvl_' + Date.now(),
            type: 'gamification',
            title: `🏆 Subiu para o Nível ${newLevel}!`,
            message: `Parabéns, ${prev.name}! Seu progresso contábil alcançou um novo marco na plataforma.`,
            timestamp: 'Agora',
            read: false,
            severity: 'low',
            linkToTab: 'gamification',
          },
          ...notifs,
        ]);
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
      };
    });
  };

  const handleUnlockBadge = (badgeId: string) => {
    if (!currentUser.badges.includes(badgeId)) {
      setCurrentUser((prev) => ({
        ...prev,
        badges: [...prev.badges, badgeId],
      }));
    }
  };

  // Posts helpers
  const handleAddPost = (newPostData: any) => {
    const post: SocialPost = {
      id: 'post_' + Date.now(),
      ...newPostData,
      likes: 0,
      likedByMe: false,
      comments: [],
      shares: 0,
      timestamp: 'Agora',
    };
    setPosts([post, ...posts]);
    handleAddXP(50); // XP reward for technical sharing
  };

  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const liked = !p.likedByMe;
          return {
            ...p,
            likedByMe: liked,
            likes: liked ? p.likes + 1 : Math.max(0, p.likes - 1),
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: 'c_' + Date.now(),
            authorName: currentUser.name,
            authorAvatar: currentUser.avatar,
            authorRole: currentUser.role,
            text,
            timestamp: 'Agora',
          };
          return {
            ...p,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );
    handleAddXP(25);
  };

  // Forum helpers
  const handleAddTopic = (newTopicData: any) => {
    const topic: ForumTopic = {
      id: 'topic_' + Date.now(),
      ...newTopicData,
      upvotes: 1,
      answers: [],
      createdAt: 'Agora',
      isSolved: false,
      isModerated: currentUser.isAdmin,
    };
    setTopics([topic, ...topics]);
    handleAddXP(80);
  };

  const handleAddAnswer = (topicId: string, answerText: string) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          const newAns = {
            id: 'ans_' + Date.now(),
            authorName: currentUser.name,
            authorAvatar: currentUser.avatar,
            authorRole: currentUser.role,
            authorCrc: currentUser.crc,
            text: answerText,
            upvotes: 0,
            timestamp: 'Agora',
          };
          return {
            ...t,
            answers: [...t.answers, newAns],
          };
        }
        return t;
      })
    );
    handleAddXP(60);
  };

  const handleUpvoteTopic = (topicId: string) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, upvotes: t.upvotes + 1 } : t))
    );
  };

  const handleUpvoteAnswer = (topicId: string, answerId: string) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          return {
            ...t,
            answers: t.answers.map((a) =>
              a.id === answerId ? { ...a, upvotes: a.upvotes + 1 } : a
            ),
          };
        }
        return t;
      })
    );
  };

  const handleToggleBestAnswer = (topicId: string, answerId: string) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          return {
            ...t,
            isSolved: true,
            answers: t.answers.map((a) => ({
              ...a,
              isBestAnswer: a.id === answerId ? !a.isBestAnswer : false,
            })),
          };
        }
        return t;
      })
    );
  };

  const handleToggleModerated = (topicId: string) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, isModerated: !t.isModerated } : t))
    );
  };

  // Banking & Suspicious Transactions
  const handleAddTransaction = (txn: FinancialTransaction) => {
    setTransactions((prev) => [txn, ...prev]);
  };

  const handleAuditReview = (txnId: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === txnId ? { ...t, auditReviewed: true, status: 'CONCILIADO' } : t))
    );
  };

  const handlePushSuspiciousAlert = (txn: FinancialTransaction) => {
    const newNotif: AppNotification = {
      id: 'notif_susp_' + Date.now(),
      type: 'suspicious_movement',
      title: '🚨 Alerta de Movimentação Suspeita (COAF)',
      message: `Transação de R$ ${txn.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} no ${txn.bankName} gerou alerta de conformidade. Motivo: ${txn.flagReason || 'Atipicidade contábil'}.`,
      timestamp: 'Agora',
      read: false,
      severity: 'critical',
      linkToTab: 'banking',
    };

    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Live community chat send handler
  const handleSendLiveChatMessage = (text: string) => {
    const userMsg = {
      id: 'c_' + Date.now(),
      senderName: currentUser.name,
      text,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setLiveChatMessages((prev) => [...prev, userMsg]);

    // Simulate instant intelligent response after 2.5 seconds
    setTimeout(() => {
      const replies = [
        'Excelente colocação! A conformidade com a NBC TG é indispensável nesse ponto.',
        'Concordo plenamente. Inclusive emitimos uma nota técnica recente sobre esse assunto.',
        'Importante atentar também para as obrigações acessórias vinculadas na DCTFWeb.',
      ];
      const botReply = {
        id: 'reply_' + Date.now(),
        senderName: 'Dra. Camila Duarte',
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setLiveChatMessages((prev) => [...prev, botReply]);
    }, 2500);
  };

  const handlePostExerciseToFeed = (postContent: string) => {
    handleAddPost({
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      authorCrc: currentUser.crc,
      content: postContent,
      mediaType: 'none',
      tags: ['SimulaçãoContábil', 'PGC_Angola', 'ExercícioPrático', 'Diário_Razão_DRE'],
      pinned: currentUser.isAdmin,
    });
    setActiveTab('feed');
  };

  const handleUpdateSiteConfig = (newConfig: Partial<SiteConfig>) => {
    setSiteConfig((prev) => ({
      ...prev,
      ...newConfig,
    }));
  };

  const handleToggleTool = (toolId: string) => {
    setSiteConfig((prev) => ({
      ...prev,
      enabledTools: prev.enabledTools.map((t) =>
        t.id === toolId ? { ...t, enabled: !t.enabled } : t
      ),
    }));
  };

  const handleAddPGCPlan = (newPlan: PGCPlanDocument) => {
    setPgcPlans((prev) => [newPlan, ...prev]);
  };

  const handleRequestVerification = (data: {
    documentType: VerificationDocumentType;
    crcOrOrderNumber?: string;
    documentName?: string;
    documentUrl?: string;
    linkedinUrl?: string;
    requestReason: string;
  }) => {
    const newReq: VerificationRequest = {
      id: `req_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      userAvatar: currentUser.avatar,
      documentType: data.documentType,
      crcOrOrderNumber: data.crcOrOrderNumber,
      documentName: data.documentName,
      documentUrl: data.documentUrl,
      linkedinUrl: data.linkedinUrl,
      requestReason: data.requestReason,
      requestedAt:
        new Date().toLocaleDateString('pt-BR') +
        ' ' +
        new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'PENDING',
    };

    setVerificationRequests((prev) => [newReq, ...prev]);

    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      type: 'system',
      title: 'Solicitação de Verificação Enviada',
      message:
        'Sua solicitação de Selo de Verificado Oficial foi enviada para o Administrador Neidilson Neves e está em análise prioritária.',
      timestamp: 'Agora',
      read: false,
      severity: 'medium',
      linkToTab: 'feed',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleApproveVerification = (requestId: string) => {
    const targetReq = verificationRequests.find((r) => r.id === requestId);
    if (!targetReq) return;

    setVerificationRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'APPROVED',
              reviewedAt: new Date().toLocaleDateString('pt-BR'),
              reviewedBy: 'Neidilson Neves',
            }
          : r
      )
    );

    // If current user is the one approved
    if (currentUser.id === targetReq.userId) {
      setCurrentUser((prev) => ({
        ...prev,
        isVerified: true,
        verificationStatus: 'APPROVED',
      }));
    }

    // Update all posts made by this user to display verified badge
    setPosts((prev) =>
      prev.map((p) =>
        p.authorId === targetReq.userId
          ? { ...p, authorIsVerified: true }
          : p
      )
    );

    // Update comments by this author
    setPosts((prev) =>
      prev.map((p) => ({
        ...p,
        comments: p.comments.map((c) =>
          c.authorName === targetReq.userName
            ? { ...c, authorIsVerified: true }
            : c
        ),
      }))
    );

    // Update topics and answers in forum
    setTopics((prev) =>
      prev.map((t) => ({
        ...t,
        authorIsVerified: t.authorName === targetReq.userName ? true : t.authorIsVerified,
        answers: t.answers.map((a) =>
          a.authorName === targetReq.userName
            ? { ...a, authorIsVerified: true }
            : a
        ),
      }))
    );

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const approveNotif: AppNotification = {
      id: `notif_appr_${Date.now()}`,
      type: 'gamification',
      title: '🎉 Selo de Verificado Oficial Homologado!',
      message: `O Administrador Neidilson Neves aprovou a solicitação de ${targetReq.userName}. O selo azul oficial (estilo Instagram/Facebook) foi ativado com sucesso!`,
      timestamp: 'Agora',
      read: false,
      severity: 'high',
      linkToTab: 'feed',
    };
    setNotifications((prev) => [approveNotif, ...prev]);
  };

  const handleRejectVerification = (requestId: string, reason?: string) => {
    const targetReq = verificationRequests.find((r) => r.id === requestId);
    if (!targetReq) return;

    setVerificationRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'REJECTED',
              adminNotes: reason,
              reviewedAt: new Date().toLocaleDateString('pt-BR'),
            }
          : r
      )
    );

    if (currentUser.id === targetReq.userId) {
      setCurrentUser((prev) => ({
        ...prev,
        verificationStatus: 'REJECTED',
      }));
    }

    const rejectNotif: AppNotification = {
      id: `notif_rej_${Date.now()}`,
      type: 'system',
      title: 'Solicitação de Verificação Não Aprovada',
      message: `A solicitação de ${targetReq.userName} não foi homologada pelo Administrador. Motivo: ${
        reason || 'Documentação incompleta.'
      }`,
      timestamp: 'Agora',
      read: false,
      severity: 'medium',
      linkToTab: 'admin',
    };
    setNotifications((prev) => [rejectNotif, ...prev]);
  };

  const handleRevokeVerification = (userId: string) => {
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({
        ...prev,
        isVerified: false,
        verificationStatus: 'NONE',
      }));
    }

    setPosts((prev) =>
      prev.map((p) =>
        p.authorId === userId
          ? { ...p, authorIsVerified: false }
          : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Global Navbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        markNotificationAsRead={(id) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          );
        }}
        markAllNotificationsAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        openAuthModal={() => setIsAuthModalOpen(true)}
        openProfileModal={() => setIsProfileModalOpen(true)}
        openAIChat={() => setIsAIChatOpen(true)}
        isOffline={isOffline}
        setIsOffline={setIsOffline}
        siteConfig={siteConfig}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'feed' && (
          <FeedView
            currentUser={currentUser}
            posts={posts}
            onAddPost={handleAddPost}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
            onOpenShareModal={(post) =>
              setShareData({
                title: `Post técnico de ${post.authorName}`,
                description: post.content.slice(0, 140) + '...',
              })
            }
            onOpenAIChat={() => setIsAIChatOpen(true)}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            liveChatMessages={liveChatMessages}
            onSendLiveChatMessage={handleSendLiveChatMessage}
          />
        )}

        {activeTab === 'simulator' && (
          <AccountingSimulatorView
            currentUser={currentUser}
            onPostExerciseToFeed={handlePostExerciseToFeed}
            onOpenAIChat={() => setIsAIChatOpen(true)}
            defaultCurrency={siteConfig.defaultCurrency}
          />
        )}

        {activeTab === 'pgc' && (
          <PGCManagerView
            currentUser={currentUser}
            plans={pgcPlans}
            onAddPlan={handleAddPGCPlan}
            onOpenAIChat={() => setIsAIChatOpen(true)}
          />
        )}

        {activeTab === 'forum' && (
          <ForumView
            currentUser={currentUser}
            topics={topics}
            onAddTopic={handleAddTopic}
            onAddAnswer={handleAddAnswer}
            onUpvoteTopic={handleUpvoteTopic}
            onUpvoteAnswer={handleUpvoteAnswer}
            onToggleBestAnswer={handleToggleBestAnswer}
            onToggleModerated={handleToggleModerated}
            onOpenAIChat={() => setIsAIChatOpen(true)}
          />
        )}

        {activeTab === 'gamification' && (
          <GamificationView
            currentUser={currentUser}
            onAddXP={handleAddXP}
            onUnlockBadge={handleUnlockBadge}
            onOpenShareModal={(data) => setShareData(data)}
          />
        )}

        {activeTab === 'marketplace' && (
          <MarketplaceView
            currentUser={currentUser}
            onOpenAIChat={() => setIsAIChatOpen(true)}
          />
        )}

        {activeTab === 'banking' && (
          <BankingView
            currentUser={currentUser}
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onAuditReview={handleAuditReview}
            onPushSuspiciousAlert={handlePushSuspiciousAlert}
          />
        )}

        {activeTab === 'reports' && (
          <FiscalReportsView
            currentUser={currentUser}
            onOpenAIChat={() => setIsAIChatOpen(true)}
          />
        )}

        {activeTab === 'calendar' && (
          <StudyCalendarView
            currentUser={currentUser}
            onAddXP={handleAddXP}
            onToggleGoal={(id) => {}}
            isOffline={isOffline}
            setIsOffline={setIsOffline}
          />
        )}

        {activeTab === 'universities' && (
          <UniversitiesView
            currentUser={currentUser}
            onOpenAIChat={() => setIsAIChatOpen(true)}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView
            currentUser={currentUser}
            posts={posts}
            topics={topics}
            transactions={transactions}
            siteConfig={siteConfig}
            onUpdateSiteConfig={handleUpdateSiteConfig}
            onToggleTool={handleToggleTool}
            onDeletePost={(id) => setPosts((prev) => prev.filter((p) => p.id !== id))}
            onApproveTopic={handleToggleModerated}
            onAuditReview={handleAuditReview}
            onUploadPGCPlan={handleAddPGCPlan}
            verificationRequests={verificationRequests}
            onApproveVerification={handleApproveVerification}
            onRejectVerification={handleRejectVerification}
            onRevokeVerification={handleRevokeVerification}
          />
        )}
      </main>

      {/* Floating 24h AI Help Badge (Always accessible) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAIChatOpen(true)}
          className="bg-gradient-to-r from-blue-700 via-blue-800 to-emerald-600 hover:scale-105 text-white font-bold p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-xl flex items-center gap-2 cursor-pointer transition-all border border-white/20 group"
          title="Abrir Suporte Técnico IA Contábil 24h"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span className="hidden sm:inline text-xs">Suporte IA 24h</span>
        </button>
      </div>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={(u) => setCurrentUser(u)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        transactions={transactions}
        onRequestVerification={handleRequestVerification}
        onOpenShareModal={(data) => {
          setIsProfileModalOpen(false);
          setShareData(data);
        }}
        onUpdateUser={(updated) => {
          setCurrentUser(updated);
          // Also update author info on existing posts created by this user
          setPosts((prev) =>
            prev.map((p) =>
              p.authorId === updated.id
                ? {
                    ...p,
                    authorName: updated.name,
                    authorAvatar: updated.avatar,
                    authorRole: updated.role,
                    authorCrc: updated.crc,
                    authorIsVerified: updated.isVerified,
                  }
                : p
            )
          );
        }}
      />

      <AIChatDrawer
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        activeContext={`Aba atual: ${activeTab}. Usuário ativo: ${currentUser.name} (${currentUser.role}).`}
      />

      <ShareAchievementModal
        isOpen={!!shareData}
        onClose={() => setShareData(null)}
        currentUser={currentUser}
        shareData={shareData}
      />
    </div>
  );
}
