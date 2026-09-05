import React, { useState } from 'react';
import { TargetExam, UserProfile, UserRole } from '../types';
import { EXAMS_DATA } from '../data/mockData';
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Zap,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Clock,
  Target,
  BrainCircuit,
  ChevronRight,
  AlertCircle,
  BarChart3,
  Calendar
} from 'lucide-react';

interface AuthLandingPageProps {
  onLoginSuccess: (user: UserProfile, token: string) => void;
  onExploreDemo: (demoUser: UserProfile) => void;
}

export const AuthLandingPage: React.FC<AuthLandingPageProps> = ({
  onLoginSuccess,
  onExploreDemo,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sign Up Multi-Step State
  const [signUpStep, setSignUpStep] = useState<1 | 2 | 3>(1);
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState<UserRole>('student');
  const [signUpExam, setSignUpExam] = useState<TargetExam>('UPSC CSE');
  const [signUpPrepStage, setSignUpPrepStage] = useState<'Beginner (0-6 months)' | 'Intermediate (6-18 months)' | 'Final Sprint & Revision'>('Intermediate (6-18 months)');
  const [signUpDailyHours, setSignUpDailyHours] = useState<number>(6);
  const [signUpTargetYear, setSignUpTargetYear] = useState<string>('2026');
  const [signUpAttempts, setSignUpAttempts] = useState<number>(0);
  const [selectedStrong, setSelectedStrong] = useState<string[]>([]);
  const [selectedWeak, setSelectedWeak] = useState<string[]>([]);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);

  // Available subjects based on selected exam
  const currentExamInfo = EXAMS_DATA.find((e) => e.id === signUpExam) || EXAMS_DATA[0];

  const handleToggleStrongSubject = (subject: string) => {
    if (selectedStrong.includes(subject)) {
      setSelectedStrong(selectedStrong.filter((s) => s !== subject));
    } else {
      setSelectedStrong([...selectedStrong, subject]);
      // Remove from weak if selected as strong
      setSelectedWeak(selectedWeak.filter((s) => s !== subject));
    }
  };

  const handleToggleWeakSubject = (subject: string) => {
    if (selectedWeak.includes(subject)) {
      setSelectedWeak(selectedWeak.filter((s) => s !== subject));
    } else {
      setSelectedWeak([...selectedWeak, subject]);
      // Remove from strong if selected as weak
      setSelectedStrong(selectedStrong.filter((s) => s !== subject));
    }
  };

  // Perform Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.status !== 'success') {
        throw new Error(data.detail || 'Authentication failed. Please check credentials.');
      }

      localStorage.setItem('prepwise_jwt_token', data.token);
      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      setLoginError(err.message || 'Login error occurred.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Perform Multi-step Sign Up
  const handleSignUpSubmit = async () => {
    setSignUpError(null);
    setSignUpLoading(true);

    try {
      const payload = {
        name: signUpName,
        email: signUpEmail,
        password: signUpPassword,
        role: signUpRole,
        targetExam: signUpExam,
        prepStage: signUpPrepStage,
        strongSubjects: selectedStrong,
        weakSubjects: selectedWeak,
        dailyStudyHours: signUpDailyHours,
        targetYear: signUpTargetYear,
        previousAttempts: signUpAttempts,
      };

      const res = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.status !== 'success') {
        throw new Error(data.detail || 'Sign up registration failed.');
      }

      localStorage.setItem('prepwise_jwt_token', data.token);
      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      setSignUpError(err.message || 'Registration error occurred.');
    } finally {
      setSignUpLoading(false);
    }
  };

  // Demo user quick login
  const handleQuickDemoLogin = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    // Call direct endpoint
    fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          localStorage.setItem('prepwise_jwt_token', data.token);
          onLoginSuccess(data.user, data.token);
        }
      })
      .catch(() => {
        // Fallback demo
        onExploreDemo({
          id: 'std-101',
          name: 'Rahul Sharma',
          email: 'rahul@prepwise.ai',
          role: 'student',
          targetExam: 'UPSC CSE',
          streakDays: 14,
          totalStudyHours: 182,
          quizzesTaken: 28,
          overallAccuracy: 66,
          mentorName: 'Dr. S. Nambiar',
        });
      });
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      {/* Top Banner & Header */}
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/30">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white">PrepWise</span>
              <span className="text-[10px] ml-1.5 font-bold px-1.5 py-0.5 rounded-sm bg-orange-500/20 text-orange-400 border border-orange-500/30">
                AI & ML
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                authMode === 'login' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setSignUpStep(1);
              }}
              className="px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-md shadow-orange-600/20"
            >
              Create Account
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Col: Value Proposition & Exam Grid (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Competitive Exam Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Master Competitive Exams with <span className="text-orange-500">Predictive ML</span> & Adaptive AI.
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 max-w-xl leading-relaxed">
            Personalized syllabus roadmaps, diagnostic weakness detection, and state-specific RAG vector retrieval tailored for top Indian civil service and aptitude exams.
          </p>

          {/* Supported Exams Chips */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-400">Supported Examinations:</span>
            <div className="flex flex-wrap gap-2">
              {EXAMS_DATA.map((exam) => (
                <div
                  key={exam.id}
                  className="px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-2 text-xs font-semibold text-neutral-200 shadow-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  <span>{exam.name}</span>
                  <span className="text-[10px] text-neutral-400">({exam.badge})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-1.5">
              <BrainCircuit className="w-5 h-5 text-orange-400" />
              <div className="text-xs font-bold text-white">Scikit-Learn ML Diagnostics</div>
              <div className="text-[11px] text-neutral-400 leading-snug">Calculates question latency z-scores and error clusters.</div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-1.5">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <div className="text-xs font-bold text-white">7-Day Study Roadmap</div>
              <div className="text-[11px] text-neutral-400 leading-snug">AI Tutor structures weekly schedules targeting identified weak spots.</div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-1.5">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <div className="text-xs font-bold text-white">Verified Gazette RAG</div>
              <div className="text-[11px] text-neutral-400 leading-snug">Continuous scraping of PIB, Kerala IPRD, and exam notifications.</div>
            </div>
          </div>
        </div>

        {/* Right Col: Auth Card (5 Cols) */}
        <div className="lg:col-span-5 bg-neutral-950 rounded-3xl border border-neutral-800 p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Form Switcher Tabs */}
          <div className="flex rounded-2xl bg-neutral-900 p-1 border border-neutral-800">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setLoginError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                authMode === 'login' ? 'bg-orange-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setSignUpStep(1);
                setSignUpError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                authMode === 'signup' ? 'bg-orange-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign Up (Aspirant Profile)
            </button>
          </div>

          {/* ======================= LOGIN VIEW ======================= */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">Welcome Back</h2>
                <p className="text-xs text-neutral-400">Access your personalized preparation dashboard & ML analytics.</p>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@prepwise.ai"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-md shadow-orange-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loginLoading ? 'Verifying Credentials...' : 'Sign In with JWT'}
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Demo Logins */}
              <div className="pt-3 border-t border-neutral-800 space-y-2">
                <span className="text-[11px] font-semibold text-neutral-400 block">Instant 1-Click Demo Personas:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('rahul@prepwise.ai', 'prepwise123')}
                    className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-left transition-colors"
                  >
                    <div className="font-bold text-white">Rahul (UPSC)</div>
                    <div className="text-[10px] text-orange-400">Student Aspirant</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('ananya@prepwise.ai', 'prepwise123')}
                    className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-left transition-colors"
                  >
                    <div className="font-bold text-white">Ananya (KPSC)</div>
                    <div className="text-[10px] text-emerald-400">Kerala PSC High Rank</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('mentor@prepwise.ai', 'prepwise123')}
                    className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-left transition-colors"
                  >
                    <div className="font-bold text-white">Dr. S. Nambiar</div>
                    <div className="text-[10px] text-amber-400">Senior Faculty Mentor</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('admin@prepwise.ai', 'prepwise123')}
                    className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-left transition-colors"
                  >
                    <div className="font-bold text-white">Officer Varma</div>
                    <div className="text-[10px] text-purple-400">Platform Administrator</div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ======================= SIGN UP MULTI-STEP VIEW ======================= */}
          {authMode === 'signup' && (
            <div className="space-y-4">
              {/* Step indicator */}
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div>
                  <h2 className="text-base font-bold text-white">Aspirant Onboarding</h2>
                  <p className="text-[11px] text-neutral-400">
                    {signUpStep === 1 && 'Step 1 of 3: Account Credentials'}
                    {signUpStep === 2 && 'Step 2 of 3: Target Exam & Timeline'}
                    {signUpStep === 3 && 'Step 3 of 3: Diagnostic Subject Profiling'}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((stepNum) => (
                    <div
                      key={stepNum}
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        signUpStep === stepNum
                          ? 'bg-orange-600 text-white'
                          : signUpStep > stepNum
                          ? 'bg-emerald-600 text-white'
                          : 'bg-neutral-800 text-neutral-500'
                      }`}
                    >
                      {signUpStep > stepNum ? '✓' : stepNum}
                    </div>
                  ))}
                </div>
              </div>

              {signUpError && (
                <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{signUpError}</span>
                </div>
              )}

              {/* STEP 1: Basic Info */}
              {signUpStep === 1 && (
                <div className="space-y-3 animate-in fade-in">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Arun Govind"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="arun@example.com"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">Set Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        placeholder="At least 6 characters"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">Primary Role</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['student', 'mentor', 'admin'] as UserRole[]).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setSignUpRole(r)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                            signUpRole === r
                              ? 'bg-orange-600 border-orange-500 text-white'
                              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!signUpName || !signUpEmail || !signUpPassword}
                    onClick={() => setSignUpStep(2)}
                    className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
                  >
                    <span>Proceed to Exam Selection</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: Exam & Preparation Schedule */}
              {signUpStep === 2 && (
                <div className="space-y-3 animate-in fade-in">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">Which Exam Are You Preparing For?</label>
                    <div className="space-y-1.5">
                      {EXAMS_DATA.map((ex) => (
                        <div
                          key={ex.id}
                          onClick={() => {
                            setSignUpExam(ex.id);
                            // Reset selections for new exam
                            setSelectedStrong([]);
                            setSelectedWeak([]);
                          }}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                            signUpExam === ex.id
                              ? 'bg-orange-950/40 border-orange-500 text-white ring-1 ring-orange-500'
                              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <div>
                            <div className="font-bold">{ex.name}</div>
                            <div className="text-[10px] text-neutral-500">{ex.fullName}</div>
                          </div>
                          {signUpExam === ex.id && <CheckCircle2 className="w-4 h-4 text-orange-400" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-300 block mb-1">Target Attempt</label>
                      <select
                        value={signUpTargetYear}
                        onChange={(e) => setSignUpTargetYear(e.target.value)}
                        className="w-full p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-hidden"
                      >
                        <option value="2026">2026 Exam Cycle</option>
                        <option value="2027">2027 Exam Cycle</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-neutral-300 block mb-1">Daily Study Hours</label>
                      <select
                        value={signUpDailyHours}
                        onChange={(e) => setSignUpDailyHours(Number(e.target.value))}
                        className="w-full p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-hidden"
                      >
                        <option value={2}>2 - 3 Hours / day</option>
                        <option value={4}>4 - 5 Hours / day</option>
                        <option value={6}>6 - 8 Hours / day</option>
                        <option value={10}>10+ Hours (Full-Time)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-300 block mb-1">Preparation Stage</label>
                    <select
                      value={signUpPrepStage}
                      onChange={(e: any) => setSignUpPrepStage(e.target.value)}
                      className="w-full p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-hidden"
                    >
                      <option value="Beginner (0-6 months)">Beginner (Building Foundations)</option>
                      <option value="Intermediate (6-18 months)">Intermediate (Syllabus Coverage)</option>
                      <option value="Final Sprint & Revision">Final Sprint & Mock Exam Phase</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSignUpStep(1)}
                      className="px-4 py-2 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white text-xs font-bold border border-neutral-800"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignUpStep(3)}
                      className="flex-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Next: Strong & Weak Subjects</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Strong & Weak Diagnostic Subjects Selection */}
              {signUpStep === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-orange-500" />
                      Self-Reported Strengths & Weaknesses ({signUpExam})
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Click to designate subjects as Strong (Green) or Weak (Red). The ML engine will tune your initial diagnostic baseline.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {currentExamInfo.subjects.map((subj) => {
                      const isStrong = selectedStrong.includes(subj);
                      const isWeak = selectedWeak.includes(subj);

                      return (
                        <div
                          key={subj}
                          className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs"
                        >
                          <span className="font-semibold text-neutral-200">{subj}</span>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleToggleStrongSubject(subj)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                                isStrong
                                  ? 'bg-emerald-600 border-emerald-500 text-white'
                                  : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-emerald-300'
                              }`}
                            >
                              {isStrong ? '✓ Strong' : '+ Strong'}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleWeakSubject(subj)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                                isWeak
                                  ? 'bg-red-600 border-red-500 text-white'
                                  : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-red-300'
                              }`}
                            >
                              {isWeak ? '⚠ Weak' : '+ Weak'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400 flex items-start gap-2">
                    <BrainCircuit className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                    <span>
                      Data collected will initialize your <strong>KMeans cluster profile</strong> and generate your customized 7-Day Precision Roadmap.
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSignUpStep(2)}
                      className="px-4 py-2 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white text-xs font-bold border border-neutral-800"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={signUpLoading}
                      onClick={handleSignUpSubmit}
                      className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-orange-600/30 disabled:opacity-50"
                    >
                      {signUpLoading ? 'Registering & Generating JWT...' : 'Complete Profile & Launch Platform'}
                      <Zap className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-4 text-center text-xs text-neutral-400">
        PrepWise AI & ML Platform • JWT Authenticated • State & National Competitive Exam Coverage
      </footer>
    </div>
  );
};
