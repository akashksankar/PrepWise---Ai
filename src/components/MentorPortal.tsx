import React, { useState } from 'react';
import { TargetExam, UserProfile, StudentCohortMember } from '../types';
import { MENTOR_STUDENTS } from '../data/mockData';
import { 
  Users, 
  BarChart3, 
  Sparkles, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Search, 
  BookOpen,
  Award,
  ChevronRight,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

interface MentorPortalProps {
  currentUser: UserProfile;
  activeSubTab?: 'cohort' | 'heatmap';
  onOpenAITutorWithQuery: (query: string) => void;
}

export const MentorPortal: React.FC<MentorPortalProps> = ({
  currentUser,
  activeSubTab = 'cohort',
  onOpenAITutorWithQuery,
}) => {
  const [students, setStudents] = useState<StudentCohortMember[]>(MENTOR_STUDENTS);
  const [selectedStudent, setSelectedStudent] = useState<StudentCohortMember>(MENTOR_STUDENTS[0]);
  const [mentorNote, setMentorNote] = useState('');
  const [aiInterventionPlan, setAiInterventionPlan] = useState<string | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [noteSentSuccess, setNoteSentSuccess] = useState(false);

  const subjectsList = ['Polity', 'CSAT', 'History & Renaissance', 'Economy', 'Geography'];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Safe':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Watchlist':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  const getHeatmapCellColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-100 text-emerald-950 font-bold border-emerald-200';
    if (score >= 60) return 'bg-amber-100 text-amber-950 font-bold border-amber-200';
    return 'bg-red-100 text-red-950 font-bold border-red-200';
  };

  const handleGenerateAIPlan = async (student: StudentCohortMember) => {
    setIsGeneratingPlan(true);
    setAiInterventionPlan(null);

    const weakTopic = student.weakSubjects[0] || 'General Studies';

    try {
      const prompt = `Act as Senior Faculty Mentor for ${student.targetExam}. The student ${student.name} is currently in '${student.riskStatus}' risk category with accuracy of ${student.accuracy}%. Their weakest topic is "${weakTopic}" with slow average latency. Generate a structured 3-day recovery sprint for this student including: 1) Essential reading list 2) High-yield MCQ drill targets 3) Psychological coaching advice.`;

      const res = await fetch('/api/v1/ai-tutor/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_query: prompt,
          target_exam: student.targetExam,
          subject: 'Mentor Guidance'
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setAiInterventionPlan(data.answer);
      } else {
        setAiInterventionPlan(`### 3-Day Action Plan for ${student.name} (${student.targetExam})\n\n1. **Immediate Focus:** Target ${weakTopic} with 20 solved PYQs.\n2. **Time Management:** Set a hard 75-second ceiling per question.\n3. **Scheduled Check-in:** Review progress on Friday.`);
      }
    } catch (e) {
      setAiInterventionPlan(`### 3-Day Recovery Sprint for ${student.name}\n\n1. **Focus Area:** ${weakTopic}\n2. **Drill:** Complete 25 targeted PYQs before next mock test.\n3. **Schedule:** Morning revision slot (08:00 AM - 09:30 AM).`);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleSendNote = () => {
    if (!mentorNote.trim()) return;
    setNoteSentSuccess(true);
    setTimeout(() => {
      setMentorNote('');
      setNoteSentSuccess(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
              Faculty & Mentor Command Center
            </h1>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
              Mentor Role
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Supervising {students.length} aspirants across UPSC CSE, Kerala PSC, and SSC cohorts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-500">Logged in as:</span>
          <strong className="text-xs text-neutral-900">{currentUser.name}</strong>
        </div>
      </div>

      {/* Weakness Heatmap Matrix Card */}
      <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              Cohort Weakness Heatmap (Subject vs Aspirant Matrix)
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Live normalized accuracy scores. Red cells indicate high attrition and need faculty intervention.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-400"></span> Mastered (&gt;80%)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-400"></span> Moderate (60-79%)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-400"></span> Critical (&lt;60%)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider">
                <th className="py-2.5 pr-4 font-bold">Aspirant</th>
                <th className="py-2.5 pr-4 font-bold">Target Exam</th>
                {subjectsList.map((s, idx) => (
                  <th key={idx} className="py-2.5 px-3 font-bold text-center">{s}</th>
                ))}
                <th className="py-2.5 pl-4 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-3 pr-4 font-bold text-neutral-900">
                    <div>{student.name}</div>
                    <div className="text-[10px] text-neutral-400 font-normal">Rank Goal: Top 100</div>
                  </td>
                  <td className="py-3 pr-4 font-semibold text-neutral-600">
                    {student.targetExam}
                  </td>
                  {subjectsList.map((_, idx) => {
                    const score = Math.max(38, Math.min(95, student.accuracy - (idx * 6) + (idx % 2 === 0 ? 8 : -4)));
                    return (
                      <td key={idx} className="py-3 px-3 text-center">
                        <span className={`inline-block w-12 py-1 rounded-lg border text-center font-mono ${getHeatmapCellColor(score)}`}>
                          {score}%
                        </span>
                      </td>
                    );
                  })}
                  <td className="py-3 pl-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getStatusBadge(student.riskStatus)}`}>
                      {student.riskStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cohort Student Management & AI Intervention */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Student Cohort List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-neutral-200 p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-orange-600" />
              Assigned Aspirants
            </h3>
            <span className="text-xs text-neutral-400 font-semibold">{students.length} Students</span>
          </div>

          <div className="space-y-2.5">
            {students.map((std) => {
              const isSelected = std.id === selectedStudent.id;
              const weakTopic = std.weakSubjects[0] || 'General Studies';
              return (
                <div
                  key={std.id}
                  onClick={() => {
                    setSelectedStudent(std);
                    setAiInterventionPlan(null);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-neutral-900">{std.name}</span>
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${getStatusBadge(std.riskStatus)}`}>
                      {std.riskStatus}
                    </span>
                  </div>

                  <div className="text-[11px] text-neutral-500 flex items-center gap-2 mb-2">
                    <span>{std.targetExam}</span>
                    <span>•</span>
                    <span>Accuracy: <strong>{std.accuracy}%</strong></span>
                    <span>•</span>
                    <span>{std.quizzesCompleted} Tests</span>
                  </div>

                  <div className="text-xs text-red-700 bg-red-50 p-2 rounded-xl border border-red-100 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>Weak Area: <strong>{weakTopic}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Student Intervention Workspace (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-100 pb-4 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-neutral-900">{selectedStudent.name}</h3>
                <span className="text-xs text-neutral-500 font-semibold">• {selectedStudent.targetExam}</span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">Last mock active {selectedStudent.lastActive}</p>
            </div>

            <button
              type="button"
              onClick={() => handleGenerateAIPlan(selectedStudent)}
              disabled={isGeneratingPlan}
              className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGeneratingPlan ? 'Generating Plan...' : '1-Click AI Intervention Plan'}</span>
            </button>
          </div>

          {/* AI Generated Plan display */}
          {aiInterventionPlan && (
            <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-200 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  Gemini 2.5 Flash Personalized Intervention Plan
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-orange-200 text-orange-900">
                  Ready to Dispatch
                </span>
              </div>
              <div className="text-xs text-neutral-800 leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto pr-1">
                {aiInterventionPlan}
              </div>
            </div>
          )}

          {/* Direct Mentor Note Dispatch */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-800">
              Send Direct Faculty Guidance Note to {selectedStudent.name}:
            </label>
            <textarea
              rows={3}
              placeholder={`e.g. "Focus on revision of ${selectedStudent.weakSubjects[0] || 'core topics'} this weekend. Let's schedule a 15-minute 1-on-1 viva on Monday."`}
              value={mentorNote}
              onChange={(e) => setMentorNote(e.target.value)}
              className="w-full p-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
            ></textarea>

            <div className="flex items-center justify-between pt-1">
              {noteSentSuccess ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Guidance note dispatched to student portal!
                </span>
              ) : (
                <span className="text-[11px] text-neutral-400">Notes appear instantly on student's dashboard.</span>
              )}

              <button
                type="button"
                onClick={handleSendNote}
                disabled={!mentorNote.trim()}
                className="px-4 py-2 rounded-xl bg-neutral-950 hover:bg-black text-white text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Note</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
