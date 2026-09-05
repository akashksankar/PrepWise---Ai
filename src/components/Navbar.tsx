import React from 'react';
import { TargetExam, UserProfile } from '../types';
import { EXAMS_DATA } from '../data/mockData';
import { 
  Sparkles, 
  BookOpen, 
  CheckSquare, 
  Headphones, 
  BarChart3, 
  Users, 
  Database, 
  Terminal, 
  ChevronDown, 
  Flame, 
  Clock,
  LogOut,
  GraduationCap
} from 'lucide-react';

interface NavbarProps {
  currentUser: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  targetExam: TargetExam;
  setTargetExam: (exam: TargetExam) => void;
  onOpenRoleModal: () => void;
  onOpenBackendModal: () => void;
  onOpenAITutor: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  targetExam,
  setTargetExam,
  onOpenRoleModal,
  onOpenBackendModal,
  onOpenAITutor,
  onLogout,
}) => {
  const [examDropdownOpen, setExamDropdownOpen] = React.useState(false);

  const getRoleBadgeStyle = () => {
    switch (currentUser.role) {
      case 'admin':
        return 'bg-neutral-900 text-white border-neutral-700';
      case 'mentor':
        return 'bg-amber-50 text-amber-900 border-amber-200';
      default:
        return 'bg-orange-50 text-orange-700 border-orange-200';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Target Exam Selector */}
          <div className="flex items-center gap-4">
            <div 
              onClick={() => setActiveTab(currentUser.role === 'student' ? 'dashboard' : (currentUser.role === 'mentor' ? 'mentor-portal' : 'admin-portal'))}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white font-bold text-xl shadow-md border border-neutral-800 relative">
                <span className="text-orange-500 font-extrabold">P</span>
                <span className="text-white">W</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse border-2 border-white"></div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-neutral-950">PrepWise</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">AI & ML</span>
                </div>
                <p className="text-[11px] text-neutral-500 font-medium hidden sm:block">Competitive Exam Intelligence Platform</p>
              </div>
            </div>

            {/* Target Exam Switcher Dropdown */}
            <div className="relative ml-2">
              <button
                id="exam-selector-btn"
                type="button"
                onClick={() => setExamDropdownOpen(!examDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-xs font-semibold text-neutral-900 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                <span className="truncate max-w-[130px] sm:max-w-[180px] font-bold">{targetExam}</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
              </button>

              {examDropdownOpen && (
                <div 
                  className="absolute left-0 mt-1.5 w-72 rounded-2xl bg-white border border-neutral-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setExamDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-neutral-100 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    Select Target Exam
                  </div>
                  {EXAMS_DATA.map((exam) => (
                    <button
                      key={exam.id}
                      type="button"
                      onClick={() => {
                        setTargetExam(exam.id);
                        setExamDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 flex items-start gap-2.5 transition-colors hover:bg-neutral-50 ${
                        targetExam === exam.id ? 'bg-orange-50/70 border-l-4 border-orange-500' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        <GraduationCap className={`w-4 h-4 ${targetExam === exam.id ? 'text-orange-600' : 'text-neutral-400'}`} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900">{exam.name}</div>
                        <div className="text-[11px] text-neutral-500 line-clamp-1">{exam.badge}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Primary Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            {currentUser.role === 'student' && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'dashboard'
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Dashboard
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('subjects')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'subjects'
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  Syllabus
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('quiz')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'quiz'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  CBT Quiz
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('audio')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'audio'
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                  }`}
                >
                  <Headphones className="w-3.5 h-3.5" />
                  Podcast Library
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('current-affairs')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'current-affairs'
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  Current Affairs
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'analytics'
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  ML Analytics
                </button>
              </>
            )}

            {currentUser.role === 'mentor' && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('mentor-portal')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'mentor-portal'
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  Student Cohorts
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('mentor-heatmap')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'mentor-heatmap'
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Weakness Heatmap
                </button>
              </>
            )}

            {currentUser.role === 'admin' && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('admin-portal')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'admin-portal'
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  Vector Store Ingestion
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('admin-crawler')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'admin-crawler'
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  Web-Crawler Pipeline
                </button>
              </>
            )}
          </nav>

          {/* Right Action Tools: AI Tutor CTA, FastApi Code, Persona Switcher */}
          <div className="flex items-center gap-2.5">
            {/* AI Tutor RAG Drawer Button */}
            <button
              id="ai-tutor-trigger-btn"
              type="button"
              onClick={onOpenAITutor}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask AI Tutor</span>
              <span className="text-[10px] bg-white/20 px-1 py-0.2 rounded">RAG</span>
            </button>

            {/* FastAPI Backend Code Modal */}
            <button
              id="fastapi-code-btn"
              type="button"
              onClick={onOpenBackendModal}
              title="Inspect Python FastAPI Backend Code"
              className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors"
            >
              <Terminal className="w-4 h-4 text-neutral-800" />
            </button>

            {/* Role & Persona Switcher */}
            <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
              <button
                id="role-switcher-btn"
                type="button"
                onClick={onOpenRoleModal}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:ring-2 hover:ring-orange-500/20 ${getRoleBadgeStyle()}`}
              >
                <div className="w-5 h-5 rounded-full bg-neutral-800 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-[11px] font-bold leading-tight text-neutral-900">{currentUser.name}</div>
                  <div className="text-[10px] font-medium text-neutral-500 capitalize">{currentUser.role}</div>
                </div>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {onLogout && (
                <button
                  id="signout-btn"
                  type="button"
                  onClick={onLogout}
                  title="Sign Out (Return to Landing Page)"
                  className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
