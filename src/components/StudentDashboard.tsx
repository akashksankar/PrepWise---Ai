import React from 'react';
import { TargetExam, UserProfile, SubjectModule, MLWeaknessReport } from '../types';
import { EXAMS_DATA, CURRENT_AFFAIRS_ITEMS } from '../data/mockData';
import { 
  Sparkles, 
  CheckSquare, 
  Headphones, 
  Flame, 
  Target, 
  AlertTriangle, 
  ArrowRight, 
  Calendar, 
  Clock, 
  BarChart2, 
  BookOpen,
  Award,
  ChevronRight,
  Compass,
  Scale,
  Calculator,
  Sigma,
  Atom,
  Cpu
} from 'lucide-react';

interface StudentDashboardProps {
  currentUser: UserProfile;
  targetExam: TargetExam;
  subjects: SubjectModule[];
  mlReport: MLWeaknessReport;
  onNavigate: (tab: string) => void;
  onOpenAITutorWithQuery?: (query: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  targetExam,
  subjects,
  mlReport,
  onNavigate,
  onOpenAITutorWithQuery,
}) => {
  const currentExamInfo = EXAMS_DATA.find((e) => e.id === targetExam) || EXAMS_DATA[0];
  const filteredSubjects = subjects.filter((s) => s.exam === targetExam);

  // Icon mapper
  const renderSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Landmark':
      case 'Scale':
        return <Scale className="w-5 h-5 text-orange-600" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-orange-600" />;
      case 'Calculator':
        return <Calculator className="w-5 h-5 text-orange-600" />;
      case 'Sigma':
        return <Sigma className="w-5 h-5 text-orange-600" />;
      case 'Atom':
        return <Atom className="w-5 h-5 text-orange-600" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-orange-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-orange-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Exam Focus Banner */}
      <div className="rounded-3xl bg-neutral-950 text-white p-6 sm:p-8 relative overflow-hidden border border-neutral-800 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-orange-600/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-500 text-white shadow-xs">
                {currentExamInfo.badge}
              </span>
              <span className="text-xs text-neutral-400 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                Target Exam Date: <strong className="text-white">{currentExamInfo.nextDate}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {currentExamInfo.fullName}
            </h1>
            
            <p className="text-sm text-neutral-300 leading-relaxed">
              {currentExamInfo.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-neutral-400 font-semibold">Key Focus Areas:</span>
              {currentExamInfo.focusAreas.slice(0, 3).map((area, idx) => (
                <span key={idx} className="text-xs bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-lg text-neutral-200">
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex flex-row md:flex-col gap-3 min-w-[200px] border-t md:border-t-0 md:border-l border-neutral-800 pt-4 md:pt-0 md:pl-6 justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-white">{currentUser.streakDays} Days</div>
                <div className="text-[11px] text-neutral-400">Study Streak</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-emerald-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-white">{currentUser.overallAccuracy}%</div>
                <div className="text-[11px] text-neutral-400">Overall Accuracy</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-blue-400">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-white">{currentUser.quizzesTaken}</div>
                <div className="text-[11px] text-neutral-400">CBT Quizzes Taken</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action shortcuts row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigate('quiz')}
          className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-orange-500 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-900 group-hover:text-orange-600 transition-colors">Launch CBT Quiz</div>
              <div className="text-xs text-neutral-500">PYQ & Topic-wise Sprint</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all" />
        </div>

        <div 
          onClick={() => onOpenAITutorWithQuery?.(`Explain the high-yield topics and syllabus weightage for ${targetExam}`)}
          className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-900 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-900">Ask AI Tutor</div>
              <div className="text-xs text-neutral-500">Local RAG + Gemini 2.5</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-all" />
        </div>

        <div 
          onClick={() => onNavigate('audio')}
          className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-900 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-900">Audio Bulletins</div>
              <div className="text-xs text-neutral-500">Daily State & PIB Briefs</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-all" />
        </div>

        <div 
          onClick={() => onNavigate('analytics')}
          className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-900 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-900">ML Weakness Report</div>
              <div className="text-xs text-neutral-500">Scikit-Learn Diagnostics</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>

      {/* Main Grid: Subjects & ML Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Subject Modules */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-950">Active Subject Modules</h2>
              <p className="text-xs text-neutral-500">Curated syllabus mapped directly to official examination blueprints.</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('subjects')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              View Full Syllabus <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((subject) => {
                const percent = Math.round((subject.completedTopics / subject.totalTopics) * 100);
                return (
                  <div 
                    key={subject.id}
                    onClick={() => onNavigate('subjects')}
                    className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                          {renderSubjectIcon(subject.iconName)}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 justify-end">
                          {subject.highYield && (
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                              High Yield
                            </span>
                          )}
                          {subject.stateSpecific && (
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-neutral-900 text-white">
                              Kerala Focus
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-neutral-900 leading-tight mb-1">
                        {subject.name}
                      </h3>
                      <p className="text-xs text-neutral-500 mb-4">
                        {subject.completedTopics} of {subject.totalTopics} high-yield topics revised
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 mb-1.5">
                        <span>Mastery Progress</span>
                        <span className="text-neutral-950 font-bold">{percent}%</span>
                      </div>
                      <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-neutral-900 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 rounded-2xl bg-neutral-50 border border-neutral-200 text-center col-span-2">
                <BookOpen className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-neutral-700">No subject modules explicitly loaded for this exam.</p>
                <p className="text-xs text-neutral-500 mt-1">Switch to UPSC CSE or Kerala PSC to explore detailed syllabus modules.</p>
              </div>
            )}
          </div>

          {/* Today's Adaptive Schedule */}
          <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <h3 className="text-sm font-bold text-neutral-900">Today's Adaptive ML Study Schedule</h3>
              </div>
              <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-lg">
                Personalized Algorithm
              </span>
            </div>

            <div className="space-y-2.5">
              {mlReport.dailySchedule.map((slot, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-2xl border border-neutral-100 hover:border-neutral-200 bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-xs font-bold text-neutral-900 min-w-[130px]">
                      {slot.timeSlot}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-neutral-900">{slot.activity}</div>
                      <div className="text-[11px] text-neutral-500">{slot.focusTopic}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-neutral-700">
                      {slot.durationMinutes} min
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                      slot.type === 'Quiz' ? 'bg-orange-100 text-orange-800' : (slot.type === 'Podcast' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800')
                    }`}>
                      {slot.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: ML Weakness Spotlight & Current Affairs */}
        <div className="space-y-6">
          {/* ML Weakness Spotlight */}
          <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <h3 className="text-sm font-bold text-neutral-900">ML Weakness Spotlight</h3>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                Action Required
              </span>
            </div>

            <p className="text-xs text-neutral-500 mb-4">
              Scikit-Learn clustering has identified {mlReport.weakTopics.length} high-urgency syllabus areas based on recent quiz response times and accuracy drop-offs.
            </p>

            <div className="space-y-3">
              {mlReport.weakTopics.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-2xl border border-red-100 bg-red-50/30 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">{item.topic}</span>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-red-600 text-white">
                      {item.urgency}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-neutral-600">
                    <span>Accuracy: <strong className="text-red-700">{item.accuracy}%</strong></span>
                    <span>•</span>
                    <span>Avg Time: <strong>{item.avgTimePerQuestionSec}s</strong></span>
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-snug pt-1 border-t border-red-100">
                    {item.recommendedAction}
                  </p>
                  <button
                    type="button"
                    onClick={() => onOpenAITutorWithQuery?.(`Provide a step-by-step revision guide and practice formulas for: ${item.topic}`)}
                    className="mt-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    Solve with AI Tutor <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Current Affairs Ticker */}
          <div className="p-6 rounded-3xl bg-neutral-950 text-white border border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <h3 className="text-sm font-bold text-white">Latest High-Yield News</h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('current-affairs')}
                className="text-xs font-semibold text-neutral-400 hover:text-white"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {CURRENT_AFFAIRS_ITEMS.slice(0, 2).map((ca) => (
                <div 
                  key={ca.id}
                  className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-orange-400">{ca.category}</span>
                    <span className="text-[10px] text-neutral-400">{ca.date}</span>
                  </div>
                  <div className="text-xs font-bold text-white line-clamp-2 leading-tight">
                    {ca.title}
                  </div>
                  <div className="text-[11px] text-neutral-400 line-clamp-2">
                    {ca.summary}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-medium text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Vector DB Indexed
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenAITutorWithQuery?.(`Summarize exam relevance for: ${ca.title}`)}
                      className="text-[11px] text-neutral-300 hover:text-white font-semibold flex items-center gap-1"
                    >
                      AI Summary <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
