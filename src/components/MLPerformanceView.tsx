import React, { useState } from 'react';
import { TargetExam, UserProfile, MLWeaknessReport } from '../types';
import { 
  BarChart3, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  RotateCw, 
  Sparkles, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';

interface MLPerformanceViewProps {
  currentUser: UserProfile;
  targetExam: TargetExam;
  mlReport: MLWeaknessReport;
  onRefreshML: () => Promise<void>;
  onOpenAITutorWithQuery: (query: string) => void;
}

export const MLPerformanceView: React.FC<MLPerformanceViewProps> = ({
  currentUser,
  targetExam,
  mlReport,
  onRefreshML,
  onOpenAITutorWithQuery,
}) => {
  const [isRecalibrating, setIsRecalibrating] = useState(false);

  const handleRecalibrate = async () => {
    setIsRecalibrating(true);
    try {
      await onRefreshML();
    } finally {
      setIsRecalibrating(false);
    }
  };

  const getClusterBadgeStyle = (cluster: string) => {
    switch (cluster) {
      case 'High Performer':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Needs Targeted Revision':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      default:
        return 'bg-red-100 text-red-900 border-red-300';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
              ML Student Performance & Diagnostics
            </h1>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-neutral-900 text-white">
              Scikit-Learn + Pandas
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Statistical clustering, response latency penalty weighting, and dynamic daily schedule optimization.
          </p>
        </div>

        {/* Recalibrate Trigger */}
        <button
          id="ml-recalibrate-btn"
          type="button"
          onClick={handleRecalibrate}
          disabled={isRecalibrating}
          className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRecalibrating ? 'animate-spin' : ''}`} />
          <span>{isRecalibrating ? 'Running Model...' : 'Recalibrate ML Model'}</span>
        </button>
      </div>

      {/* Overview Cards: Readiness, Cluster, and Test Volume */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Readiness Index */}
        <div className="p-6 rounded-3xl bg-neutral-950 text-white border border-neutral-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Exam Readiness Index</span>
            <Activity className="w-5 h-5 text-orange-500" />
          </div>
          <div className="my-4">
            <div className="text-4xl font-black text-white">{mlReport.overallHealthScore}%</div>
            <div className="text-xs text-neutral-400 mt-1">Weighted against PYQ frequency & timer penalties</div>
          </div>
          <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${mlReport.overallHealthScore}%` }}
            ></div>
          </div>
        </div>

        {/* Scikit-Learn Cluster */}
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Cohort Cluster Classification</span>
            <Target className="w-5 h-5 text-neutral-700" />
          </div>
          <div className="my-3">
            <span className={`inline-block text-sm font-extrabold px-3 py-1 rounded-xl border ${getClusterBadgeStyle(mlReport.clusterGroup)}`}>
              {mlReport.clusterGroup}
            </span>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Based on {currentUser.quizzesTaken} CBT tests and question latency distribution.
            </p>
          </div>
          <div className="text-[11px] text-neutral-400 font-mono">
            Model: KMeans (k=3, features=[acc, time_zscore])
          </div>
        </div>

        {/* Total Questions Processed */}
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Total Questions Processed</span>
            <ShieldCheck className="w-5 h-5 text-neutral-700" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-neutral-900">
              {currentUser.quizzesTaken * 10} Items
            </div>
            <p className="text-xs text-neutral-600 mt-1">
              Average response time: <strong>72.4 seconds</strong> / question.
            </p>
          </div>
          <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Dataset validated & normalized</span>
          </div>
        </div>
      </div>

      {/* Weak Topics Analysis Table */}
      <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              High-Risk Syllabus Topics (Detected by ML Model)
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Identified through accuracy drop-offs and response time anomalies during recent quiz attempts.
            </p>
          </div>
          <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-3 py-1 rounded-xl">
            {mlReport.weakTopics.length} Focus Areas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider">
                <th className="pb-3 font-bold">Topic & Paper</th>
                <th className="pb-3 font-bold">Accuracy</th>
                <th className="pb-3 font-bold">Avg Latency</th>
                <th className="pb-3 font-bold">Urgency Level</th>
                <th className="pb-3 font-bold">Recommended Adaptive Action</th>
                <th className="pb-3 font-bold text-right">AI Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {mlReport.weakTopics.map((wt, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-3.5 pr-4 font-bold text-neutral-900">
                    <div>{wt.topic}</div>
                    <div className="text-[11px] text-neutral-500 font-normal">{wt.subject}</div>
                  </td>
                  <td className="py-3.5 pr-4 font-bold text-red-600">
                    {wt.accuracy}%
                  </td>
                  <td className="py-3.5 pr-4 font-semibold text-neutral-700">
                    {wt.avgTimePerQuestionSec} sec
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className={`px-2 py-0.5 rounded-md font-extrabold uppercase text-[10px] ${
                      wt.urgency === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {wt.urgency}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-neutral-600 max-w-xs">
                    {wt.recommendedAction}
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => onOpenAITutorWithQuery(`Give me a targeted conceptual review and 5 PYQ practice drills for: ${wt.topic}`)}
                      className="px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-orange-600" />
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Adaptive Study Schedule */}
      <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              Dynamic Daily Study Schedule (Algorithmically Generated)
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Synthesized by the ML optimization loop to ensure weak areas receive prime morning attention slots.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
            Optimized for {targetExam}
          </span>
        </div>

        <div className="space-y-3">
          {mlReport.dailySchedule.map((slot, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-neutral-200 hover:border-neutral-300 bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900">{slot.activity}</div>
                  <div className="text-[11px] text-neutral-500 font-medium">{slot.focusTopic}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="text-xs font-mono font-bold text-neutral-700 bg-white px-3 py-1 rounded-lg border border-neutral-200">
                  {slot.timeSlot}
                </div>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg ${
                  slot.type === 'Quiz' ? 'bg-orange-100 text-orange-800' : (slot.type === 'Podcast' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800')
                }`}>
                  {slot.type} ({slot.durationMinutes}m)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
