export type UserRole = 'student' | 'mentor' | 'admin';

export type TargetExam = 
  | 'UPSC CSE'
  | 'Kerala PSC'
  | 'SSC CGL / CHSL'
  | 'Indian Railways (RRB)'
  | 'GATE & CAT';

export interface ExamInfo {
  id: TargetExam;
  name: string;
  fullName: string;
  badge: string;
  conductingBody: string;
  nextDate: string;
  focusAreas: string[];
  subjects: string[];
  description: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  targetExam: TargetExam;
  avatarUrl?: string;
  streakDays: number;
  totalStudyHours: number;
  quizzesTaken: number;
  overallAccuracy: number;
  mentorName?: string;
  // Onboarding profile data
  prepStage?: 'Beginner (0-6 months)' | 'Intermediate (6-18 months)' | 'Final Sprint & Revision';
  strongSubjects?: string[];
  weakSubjects?: string[];
  dailyStudyHours?: number;
  targetYear?: string;
  previousAttempts?: number;
  joinedDate?: string;
}

export interface StudyRoadmapSlot {
  id: string;
  timeSlot: string;
  task: string;
  subject: string;
  duration: string;
  type: 'Concept' | 'PYQ Drill' | 'Error Analysis' | 'Audio Digest';
  completed?: boolean;
}

export interface StudyRoadmapDay {
  day: number;
  title: string;
  theme: string;
  dailyGoal: string;
  drillTarget: string;
  focusAreas: string[];
  slots: StudyRoadmapSlot[];
}

export interface SevenDayRoadmap {
  id: string;
  targetExam: TargetExam;
  generatedFor: string;
  generatedAt: string;
  headlineSummary: string;
  mlInsight: string;
  days: StudyRoadmapDay[];
}

export interface SubjectModule {
  id: string;
  exam: TargetExam;
  name: string;
  iconName: string;
  totalTopics: number;
  completedTopics: number;
  highYield: boolean;
  stateSpecific?: boolean;
  topics: {
    id: string;
    title: string;
    completed: boolean;
    importance: 'High' | 'Medium' | 'Low';
    pyqCount: number;
    summary: string;
  }[];
}

export interface Question {
  id: string;
  exam: TargetExam;
  subject: string;
  topic: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  pyqYear?: string;
  sourceDoc?: string;
}

export interface QuizAttemptResult {
  attemptId: string;
  studentId: string;
  exam: TargetExam;
  subject: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  timeTakenSeconds: number;
  topicBreakdown: {
    topic: string;
    correct: number;
    total: number;
    status: 'Strong' | 'Moderate' | 'Weak';
  }[];
  date: string;
}

export interface VectorDocChunk {
  id: string;
  exam: TargetExam;
  subject: string;
  title: string;
  source: string;
  chunkText: string;
  similarity?: number;
  dateAdded: string;
}

export interface AITutorMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: {
    id: string;
    title: string;
    exam: string;
    subject: string;
    snippet: string;
  }[];
  examContext?: TargetExam;
}

export interface MLWeaknessReport {
  studentId: string;
  studentName: string;
  overallHealthScore: number;
  clusterGroup: 'High Performer' | 'Needs Targeted Revision' | 'Foundational Reinforcement';
  weakTopics: {
    topic: string;
    subject: string;
    accuracy: number;
    avgTimePerQuestionSec: number;
    urgency: 'Critical' | 'Moderate' | 'Low';
    recommendedAction: string;
  }[];
  masteryLevels: {
    subject: string;
    masteryScore: number; // 0 - 100
    status: 'Mastered' | 'In Progress' | 'Attention Needed';
  }[];
  dailySchedule: {
    timeSlot: string;
    activity: string;
    focusTopic: string;
    durationMinutes: number;
    type: 'Study' | 'Quiz' | 'Revision' | 'Podcast';
  }[];
}

export interface PodcastItem {
  id: string;
  title: string;
  exam: TargetExam;
  category: string;
  duration: string;
  publishDate: string;
  summary: string;
  bulletPoints: string[];
  audioScript: string;
  voiceName: string;
}

export interface CurrentAffairItem {
  id: string;
  title: string;
  category: 'National' | 'Kerala State' | 'Economy' | 'Science & Tech' | 'Polity & Schemes';
  applicableExams: TargetExam[];
  date: string;
  summary: string;
  keyPoints: string[];
  source: string;
  sourceUrl?: string;
  vectorIndexed: boolean;
}

export interface StudentCohortMember {
  id: string;
  name: string;
  targetExam: TargetExam;
  quizzesCompleted: number;
  accuracy: number;
  lastActive: string;
  riskStatus: 'Safe' | 'Watchlist' | 'Critical';
  weakSubjects: string[];
  recentScore: number;
}

export interface CrawlerLogItem {
  id: string;
  timestamp: string;
  sourceUrl: string;
  itemsFound: number;
  chunksIndexed: number;
  status: 'Completed' | 'Crawling' | 'Failed';
}
