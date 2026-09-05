import React, { useState } from 'react';
import { TargetExam, UserProfile, SubjectModule, QuizAttemptResult, MLWeaknessReport } from './types';
import { 
  DEFAULT_STUDENT_USER, 
  SUBJECT_MODULES, 
  INITIAL_ML_REPORT 
} from './data/mockData';

import { Navbar } from './components/Navbar';
import { StudentDashboard } from './components/StudentDashboard';
import { SubjectExplorer } from './components/SubjectExplorer';
import { QuizRunner } from './components/QuizRunner';
import { AudioPodcastLibrary } from './components/AudioPodcastLibrary';
import { CurrentAffairsFeed } from './components/CurrentAffairsFeed';
import { MLPerformanceView } from './components/MLPerformanceView';
import { MentorPortal } from './components/MentorPortal';
import { AdminPortal } from './components/AdminPortal';
import { AITutorDrawer } from './components/AITutorDrawer';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { BackendCodeModal } from './components/BackendCodeModal';
import { AuthLandingPage } from './components/AuthLandingPage';

import { 
  BookOpen, 
  GraduationCap, 
  CheckSquare, 
  Headphones, 
  BarChart3, 
  Clock, 
  Users, 
  Database 
} from 'lucide-react';

export default function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('prepwise_jwt_token');
  });

  // Current user session
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_STUDENT_USER);
  const [targetExam, setTargetExam] = useState<TargetExam>(currentUser.targetExam);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Verify JWT on initial load
  React.useEffect(() => {
    const token = localStorage.getItem('prepwise_jwt_token');
    if (token) {
      fetch('/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'success' && data.user) {
            setCurrentUser(data.user);
            if (data.user.targetExam) {
              setTargetExam(data.user.targetExam);
            }
          }
        })
        .catch(() => {
          // Keep current fallback user
        });
    }
  }, []);

  // Login handler
  const handleLoginSuccess = (user: UserProfile, token: string) => {
    setCurrentUser(user);
    if (user.targetExam) setTargetExam(user.targetExam);
    setIsAuthenticated(true);
    setActiveTab(user.role === 'mentor' ? 'mentor-portal' : user.role === 'admin' ? 'admin-portal' : 'dashboard');
  };

  // Demo explore handler
  const handleExploreDemo = (demoUser: UserProfile) => {
    setCurrentUser(demoUser);
    setTargetExam(demoUser.targetExam);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('prepwise_jwt_token');
    setIsAuthenticated(false);
  };

  // Interactive state
  const [subjects, setSubjects] = useState<SubjectModule[]>(SUBJECT_MODULES);
  const [mlReport, setMlReport] = useState<MLWeaknessReport>(INITIAL_ML_REPORT);
  const [quizResultsHistory, setQuizResultsHistory] = useState<QuizAttemptResult[]>([]);

  // Modals & Drawers
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [aiTutorInitialQuery, setAiTutorInitialQuery] = useState<string | undefined>(undefined);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);

  // Sync user profile selection
  const handleSelectProfile = (profile: UserProfile) => {
    setCurrentUser(profile);
    setTargetExam(profile.targetExam);

    // Switch default tab based on role
    if (profile.role === 'mentor') {
      setActiveTab('mentor-portal');
    } else if (profile.role === 'admin') {
      setActiveTab('admin-portal');
    } else {
      setActiveTab('dashboard');
    }
  };

  // Syllabus topic completed toggle
  const handleToggleTopic = (subjectId: string, topicId: string) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        const updatedTopics = sub.topics.map((t) => {
          if (t.id !== topicId) return t;
          return { ...t, completed: !t.completed };
        });
        const completedCount = updatedTopics.filter((t) => t.completed).length;
        return {
          ...sub,
          topics: updatedTopics,
          completedTopics: completedCount,
        };
      })
    );
  };

  // Open AI Tutor with custom prompt
  const handleOpenAITutorWithQuery = (query: string) => {
    setAiTutorInitialQuery(query);
    setIsAITutorOpen(true);
  };

  // CBT Quiz completed handler -> update ML engine & user stats
  const handleQuizComplete = async (result: QuizAttemptResult) => {
    setQuizResultsHistory((prev) => [result, ...prev]);

    // Update user stats
    setCurrentUser((prev) => ({
      ...prev,
      quizzesTaken: prev.quizzesTaken + 1,
      overallAccuracy: Math.round((prev.overallAccuracy * 0.7) + (result.scorePercentage * 0.3)),
    }));

    // Send attempt to server ML engine
    try {
      const attemptsPayload = result.topicBreakdown.map((t) => ({
        subject: result.subject,
        topic: t.topic,
        is_correct: t.status === 'Strong',
        time_taken_seconds: Math.round(result.timeTakenSeconds / (result.totalQuestions || 1)),
      }));

      const res = await fetch('/api/v1/ml/analyze-performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: currentUser.id,
          student_name: currentUser.name,
          attempts: attemptsPayload,
        }),
      });

      const data = await res.json();
      if (data.status === 'success' && data.report) {
        setMlReport(data.report);
      }
    } catch (e) {
      console.warn('Backend ML update skipped; local state active');
    }
  };

  // Recalibrate ML model manually
  const handleRefreshML = async () => {
    try {
      const res = await fetch('/api/v1/ml/analyze-performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: currentUser.id,
          student_name: currentUser.name,
          attempts: [
            { subject: 'Indian Polity', topic: 'Doctrine of Basic Structure', is_correct: true, time_taken_seconds: 52 },
            { subject: 'CSAT Aptitude', topic: 'CSAT Number Systems & Cyclicity', is_correct: false, time_taken_seconds: 98 },
            { subject: 'Kerala Renaissance', topic: 'Aruvippuram Movement & Sree Narayana Guru', is_correct: true, time_taken_seconds: 40 },
          ],
        }),
      });
      const data = await res.json();
      if (data.status === 'success' && data.report) {
        setMlReport(data.report);
      }
    } catch (e) {
      console.error('Error refreshing ML:', e);
    }
  };

  if (!isAuthenticated) {
    return (
      <AuthLandingPage
        onLoginSuccess={handleLoginSuccess}
        onExploreDemo={handleExploreDemo}
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        targetExam={targetExam}
        setTargetExam={setTargetExam}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        onOpenBackendModal={() => setIsBackendModalOpen(true)}
        onOpenAITutor={() => {
          setAiTutorInitialQuery(undefined);
          setIsAITutorOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Student Views */}
        {currentUser.role === 'student' && (
          <>
            {activeTab === 'dashboard' && (
              <StudentDashboard
                currentUser={currentUser}
                targetExam={targetExam}
                subjects={subjects}
                mlReport={mlReport}
                onNavigate={setActiveTab}
                onOpenAITutorWithQuery={handleOpenAITutorWithQuery}
              />
            )}

            {activeTab === 'subjects' && (
              <SubjectExplorer
                targetExam={targetExam}
                subjects={subjects}
                onToggleTopic={handleToggleTopic}
                onOpenAITutorWithQuery={handleOpenAITutorWithQuery}
              />
            )}

            {activeTab === 'quiz' && (
              <QuizRunner
                targetExam={targetExam}
                onQuizComplete={handleQuizComplete}
                onOpenAITutorWithQuery={handleOpenAITutorWithQuery}
              />
            )}

            {activeTab === 'audio' && (
              <AudioPodcastLibrary
                targetExam={targetExam}
              />
            )}

            {activeTab === 'current-affairs' && (
              <CurrentAffairsFeed
                targetExam={targetExam}
                onOpenAITutorWithQuery={handleOpenAITutorWithQuery}
              />
            )}

            {activeTab === 'analytics' && (
              <MLPerformanceView
                currentUser={currentUser}
                targetExam={targetExam}
                mlReport={mlReport}
                onRefreshML={handleRefreshML}
                onOpenAITutorWithQuery={handleOpenAITutorWithQuery}
              />
            )}
          </>
        )}

        {/* Mentor Views */}
        {currentUser.role === 'mentor' && (
          <MentorPortal
            currentUser={currentUser}
            activeSubTab={activeTab === 'mentor-heatmap' ? 'heatmap' : 'cohort'}
            onOpenAITutorWithQuery={handleOpenAITutorWithQuery}
          />
        )}

        {/* Admin Views */}
        {currentUser.role === 'admin' && (
          <AdminPortal
            currentUser={currentUser}
            activeSubTab={activeTab === 'admin-crawler' ? 'crawler' : 'ingestion'}
            onOpenBackendModal={() => setIsBackendModalOpen(true)}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Visible on smaller screens) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 px-2 py-2 flex items-center justify-around shadow-lg">
        {currentUser.role === 'student' ? (
          <>
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
                activeTab === 'dashboard' ? 'text-orange-600' : 'text-neutral-500'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
                activeTab === 'quiz' ? 'text-orange-600' : 'text-neutral-500'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>CBT Quiz</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAiTutorInitialQuery(undefined);
                setIsAITutorOpen(true);
              }}
              className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-orange-600"
            >
              <div className="w-8 h-8 -mt-4 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-md">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span>AI Tutor</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('audio')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
                activeTab === 'audio' ? 'text-orange-600' : 'text-neutral-500'
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>Podcasts</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
                activeTab === 'analytics' ? 'text-orange-600' : 'text-neutral-500'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>ML Score</span>
            </button>
          </>
        ) : currentUser.role === 'mentor' ? (
          <>
            <button
              type="button"
              onClick={() => setActiveTab('mentor-portal')}
              className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-orange-600"
            >
              <Users className="w-4 h-4" />
              <span>Cohorts</span>
            </button>
            <button
              type="button"
              onClick={() => setIsRoleModalOpen(true)}
              className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-neutral-500"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Role Switch</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setActiveTab('admin-portal')}
              className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-orange-600"
            >
              <Database className="w-4 h-4" />
              <span>Admin Console</span>
            </button>
            <button
              type="button"
              onClick={() => setIsRoleModalOpen(true)}
              className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-neutral-500"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Role Switch</span>
            </button>
          </>
        )}
      </div>

      {/* AI Tutor RAG Drawer */}
      <AITutorDrawer
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
        targetExam={targetExam}
        initialQuery={aiTutorInitialQuery}
        mlReport={mlReport}
        currentUser={currentUser}
      />

      {/* Role & Persona Switcher Modal */}
      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        currentUser={currentUser}
        onSelectProfile={handleSelectProfile}
      />

      {/* Python FastAPI Backend Code Inspector Modal */}
      <BackendCodeModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
      />
    </div>
  );
}
