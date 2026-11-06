export type UserRole = 'admin' | 'contador' | 'estudante' | 'consultor' | 'empresario';

export interface UserCV {
  headline?: string;
  summary?: string;
  education?: string;
  experience?: string;
  skills?: string[];
  certifications?: string[];
  languages?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  crc?: string;
  university?: string;
  company?: string;
  bio: string;
  xp: number;
  level: number;
  badges: string[];
  streakDays: number;
  followersCount: number;
  followingCount: number;
  isVerified: boolean;
  isAdmin?: boolean;
  pin?: string;
  linkedinUrl?: string;
  linkedinConnected?: boolean;
  phone?: string;
  country?: 'Angola' | 'Brasil' | 'Portugal' | 'Outro';
  cvData?: UserCV;
  verificationStatus?: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
  verificationReason?: string;
  verificationRequestedAt?: string;
}

export type VerificationDocumentType =
  | 'CRC_CARTEIRA'
  | 'OCAM_ANGOLA'
  | 'DIPLOMA_ACADEMICO'
  | 'LINKEDIN_PROFISSIONAL'
  | 'DOC_IDENTIFICACAO';

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  userAvatar: string;
  crcOrOrderNumber?: string;
  documentType: VerificationDocumentType;
  documentName?: string;
  documentUrl?: string;
  linkedinUrl?: string;
  requestReason: string;
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNotes?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface PostComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  authorIsVerified?: boolean;
  text: string;
  timestamp: string;
}

export interface SocialPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  authorCrc?: string;
  authorIsVerified?: boolean;
  content: string;
  mediaType: 'image' | 'video' | 'document' | 'none';
  mediaUrl?: string;
  tags: string[];
  likes: number;
  likedByMe: boolean;
  comments: PostComment[];
  shares: number;
  timestamp: string;
  pinned?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole?: UserRole;
  senderIsVerified?: boolean;
  text: string;
  timestamp: string;
  isAI?: boolean;
  channelId?: string;
}

export type NotificationType = 'suspicious_movement' | 'study_reminder' | 'gamification' | 'social' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  linkToTab?: string;
}

export interface ForumAnswer {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  authorCrc?: string;
  authorIsVerified?: boolean;
  text: string;
  upvotes: number;
  timestamp: string;
  isBestAnswer?: boolean;
}

export interface ForumTopic {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  authorIsVerified?: boolean;
  category: 'NBC_IFRS' | 'TRIBUTARIO' | 'PERICIA' | 'ESTRATEGIAS_MERCADO' | 'CARREIRA';
  tags: string[];
  upvotes: number;
  answers: ForumAnswer[];
  createdAt: string;
  isSolved: boolean;
  isModerated: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  options: string[];
  correctIndex: number;
  explanation: string;
  normReference: string;
  xpReward: number;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: 'Bronze' | 'Prata' | 'Ouro' | 'Diamante';
  unlockedAt?: string;
  category: 'Normas' | 'Auditoria' | 'Tributário' | 'Comunidade' | 'Investimentos';
}

export interface MarketplaceService {
  id: string;
  title: string;
  providerName: string;
  providerRole: UserRole;
  providerAvatar: string;
  rating: number;
  reviewsCount: number;
  price: number;
  turnaroundDays: number;
  description: string;
  deliverables: string[];
  tags: string[];
  category: 'Consultoria Tributária' | 'BPO Financeiro' | 'Auditoria' | 'Valuation' | 'Abertura & Regularização';
}

export interface BankAccount {
  id: string;
  bankName: string;
  bankCode: string;
  logo: string;
  status: 'CONNECTED' | 'SYNCING' | 'ACTION_REQUIRED';
  balance: number;
  lastSync: string;
  agency: string;
  accountNumber: string;
}

export interface FinancialTransaction {
  id: string;
  bankId: string;
  bankName: string;
  description: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  category: 'Receita' | 'Folha de Pagamento' | 'Fornecedores' | 'Impostos (DARF/DAS)' | 'Transferência PIX' | 'Outros';
  date: string;
  isSuspicious: boolean;
  status: 'CONCILIADO' | 'PENDENTE' | 'ALERTA_AUDITORIA';
  flagReason?: string;
  auditReviewed?: boolean;
}

export interface FiscalComplianceReport {
  id: string;
  title: string;
  type: 'DRE_GERENCIAL' | 'BALANCO_PATRIMONIAL' | 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'SPED_FISCAL';
  companyName: string;
  cnpj: string;
  period: string;
  grossRevenue: number;
  deductions: number;
  netRevenue: number;
  operationalCosts: number;
  taxPayable: number;
  netIncome: number;
  status: 'EM_CONFORMIDADE' | 'PENDENCIA_IDENTIFICADA' | 'REQUER_ATENCAO';
  generatedAt: string;
  cpcReferences: string[];
  notes: string;
}

export interface UniversityHub {
  id: string;
  name: string;
  acronym: string;
  state: string;
  studentsCount: number;
  rating: number;
  featuredTopic: string;
  courses: string[];
  coordinator: string;
}

export interface StudyGoal {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  durationMinutes: number;
  category: string;
  offlineReady?: boolean;
}

export type AccountingStandard = 'PGC_ANGOLA' | 'NBC_BRASIL' | 'IFRS_GLOBAL';
export type CurrencyCode = 'AOA' | 'BRL' | 'USD' | 'EUR';

export interface AccountingEntry {
  id: string;
  date: string;
  description: string;
  debitAccount: string;
  debitCode: string;
  creditAccount: string;
  creditCode: string;
  amount: number;
  documentRef?: string;
  standard: AccountingStandard;
}

export interface LedgerTAccount {
  accountCode: string;
  accountName: string;
  debitEntries: { id: string; desc: string; amount: number }[];
  creditEntries: { id: string; desc: string; amount: number }[];
  totalDebit: number;
  totalCredit: number;
  balance: number;
  balanceType: 'DEVEDOR' | 'CREDOR' | 'NULO';
}

export interface TrialBalanceItem {
  accountCode: string;
  accountName: string;
  totalDebit: number;
  totalCredit: number;
  debitBalance: number;
  creditBalance: number;
}

export interface AccountingExercise {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  standard: AccountingStandard;
  currency: CurrencyCode;
  createdAt: string;
  entries: AccountingEntry[];
  sharedToFeed?: boolean;
  notes?: string;
}

export interface PGCAccount {
  code: string;
  name: string;
  classe: number; // 1 to 8 in PGC Angola
  classeName: string;
  nature: 'DEVEDORA' | 'CREDORA' | 'MISTA';
  statementType: 'BALANCO' | 'RESULTADOS';
  description?: string;
}

export interface PGCPlanDocument {
  id: string;
  title: string;
  description: string;
  country: 'Angola' | 'Brasil' | 'Internacional';
  standard: AccountingStandard;
  version: string;
  uploadedBy: string;
  uploadDate: string;
  isOfficial: boolean;
  accountsCount: number;
  fileFormat: 'PDF' | 'JSON' | 'CSV';
  pdfDataUrl?: string;
  downloadFilename: string;
  accounts: PGCAccount[];
}

export interface SiteToolModule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  badge?: string;
}

export interface SiteConfig {
  siteTitle: string;
  siteSubtitle: string;
  announcementBanner: string;
  showAnnouncement: boolean;
  defaultStandard: AccountingStandard;
  defaultCurrency: CurrencyCode;
  primaryColor: string;
  enabledTools: SiteToolModule[];
  customFooterNote: string;
  allowPublicPostExercises: boolean;
}

