import React, { useState, useEffect } from 'react';
import { TargetExam, Question, QuizAttemptResult, MLWeaknessReport } from '../types';
import { INITIAL_QUESTIONS } from '../data/mockData';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Bookmark,
  Award,
  BarChart3
} from 'lucide-react';

interface QuizRunnerProps {
  targetExam: TargetExam;
  onQuizComplete: (result: QuizAttemptResult) => void;
  onOpenAITutorWithQuery: (query: string) => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  targetExam,
  onQuizComplete,
  onOpenAITutorWithQuery,
}) => {
  // Filter questions by current exam or fallback
  const examQuestions = INITIAL_QUESTIONS.filter((q) => q.exam === targetExam);
  const questions = examQuestions.length > 0 ? examQuestions : INITIAL_QUESTIONS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [timeRemainingSec, setTimeRemainingSec] = useState(15 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizStartTime] = useState(Date.now());
  const [showRationale, setShowRationale] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeRemainingSec((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIndex,
    }));
  };

  const handleToggleReview = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex],
    }));
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    const timeTaken = Math.round((Date.now() - quizStartTime) / 1000);

    let correctCount = 0;
    const topicBreakdownMap: Record<string, { correct: number; total: number }> = {};

    questions.forEach((q, idx) => {
      const isCorrect = selectedAnswers[idx] === q.correctIndex;
      if (isCorrect) correctCount += 1;

      if (!topicBreakdownMap[q.topic]) {
        topicBreakdownMap[q.topic] = { correct: 0, total: 0 };
      }
      topicBreakdownMap[q.topic].total += 1;
      if (isCorrect) topicBreakdownMap[q.topic].correct += 1;
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);

    const result: QuizAttemptResult = {
      attemptId: `cbt-attempt-${Date.now()}`,
      studentId: 'std-current',
      exam: targetExam,
      subject: currentQ?.subject || 'Competitive Exam General Paper',
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      scorePercentage,
      timeTakenSeconds: timeTaken,
      topicBreakdown: Object.entries(topicBreakdownMap).map(([topic, data]) => ({
        topic,
        correct: data.correct,
        total: data.total,
        status: (data.correct / data.total >= 0.7) ? 'Strong' : ((data.correct / data.total >= 0.4) ? 'Moderate' : 'Weak')
      })),
      date: new Date().toISOString().split('T')[0]
    };

    onQuizComplete(result);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Status Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-neutral-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
              CBT Mode
            </span>
            <span className="text-xs font-bold text-neutral-800">{targetExam} Test Paper</span>
          </div>
          <h1 className="text-lg font-extrabold text-neutral-900 mt-1">
            {currentQ?.subject} • {questions.length} High-Yield Questions
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Timer Display */}
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold border ${
            timeRemainingSec < 120 
              ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' 
              : 'bg-neutral-900 text-white border-neutral-800'
          }`}>
            <Clock className="w-4 h-4 text-orange-400" />
            <span>{formatTimer(timeRemainingSec)}</span>
          </div>

          {!isSubmitted ? (
            <button
              id="submit-quiz-btn"
              type="button"
              onClick={handleSubmitQuiz}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              Submit & Score
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setSelectedAnswers({});
                setCurrentIndex(0);
                setTimeRemainingSec(15 * 60);
              }}
              className="px-3.5 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Quiz
            </button>
          )}
        </div>
      </div>

      {/* Main Examination Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Question Workspace (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Question Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-950 text-white text-xs font-bold flex items-center justify-center">
                {currentIndex + 1}
              </span>
              <span className="text-xs text-neutral-500 font-semibold">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {currentQ?.pyqYear && (
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700 border border-neutral-200">
                  {currentQ.pyqYear}
                </span>
              )}
              <button
                type="button"
                onClick={handleToggleReview}
                className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                  markedForReview[currentIndex]
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Review Later</span>
              </button>
            </div>
          </div>

          {/* Question Statement */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Topic: {currentQ?.topic}
            </div>
            <p className="text-base sm:text-lg font-bold text-neutral-950 leading-relaxed whitespace-pre-line">
              {currentQ?.questionText}
            </p>
          </div>

          {/* Options Palette */}
          <div className="space-y-3 pt-2">
            {currentQ?.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentIndex] === optIdx;
              const isCorrect = currentQ.correctIndex === optIdx;

              let optionStyle = 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50 text-neutral-900';
              if (isSubmitted) {
                if (isCorrect) {
                  optionStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500/20';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'border-red-500 bg-red-50/80 text-red-950 ring-2 ring-red-500/20';
                }
              } else if (isSelected) {
                optionStyle = 'border-orange-500 bg-orange-50/70 text-orange-950 ring-2 ring-orange-500/20';
              }

              const letters = ['A', 'B', 'C', 'D', 'E'];

              return (
                <div
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${optionStyle}`}
                >
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                    isSelected ? 'bg-orange-600 text-white' : 'bg-neutral-100 text-neutral-700'
                  }`}>
                    {letters[optIdx]}
                  </div>
                  <div className="text-sm font-semibold leading-relaxed pt-0.5">
                    {opt}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanation / Rationale Box if submitted or toggled */}
          {isSubmitted && (
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  Official Rationale & PYQ Syllabus Link
                </span>
                <span className="text-[11px] text-neutral-500 font-mono">
                  Source: {currentQ.sourceDoc}
                </span>
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed">
                {currentQ.explanation}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onOpenAITutorWithQuery(`Can you explain in detail the reasoning behind this question: "${currentQ.questionText}" and give me 3 related high-yield practice variations?`)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Ask AI Tutor to break this down step-by-step
                </button>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous
            </button>

            <button
              type="button"
              disabled={currentIndex === questions.length - 1}
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              className="px-4 py-2 rounded-xl bg-neutral-950 text-white text-xs font-bold hover:bg-neutral-900 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5"
            >
              Next
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Question Palette & CBT Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Question Palette Card */}
          <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900">Question Palette</h3>
              <span className="text-xs text-neutral-500 font-semibold">
                {answeredCount}/{questions.length} Attempted
              </span>
            </div>

            {/* Status indicators legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-orange-600"></span>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-neutral-100 border border-neutral-300"></span>
                <span>Unattempted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-amber-400"></span>
                <span>Review</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-neutral-950"></span>
                <span>Current</span>
              </div>
            </div>

            {/* Palette grid */}
            <div className="grid grid-cols-5 gap-2 pt-2 border-t border-neutral-100">
              {questions.map((_, idx) => {
                const isAnswered = selectedAnswers[idx] !== undefined;
                const isMarked = markedForReview[idx];
                const isCurrent = currentIndex === idx;

                let btnClass = 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border-neutral-200';
                if (isCurrent) {
                  btnClass = 'bg-neutral-950 text-white ring-2 ring-neutral-950/20';
                } else if (isMarked) {
                  btnClass = 'bg-amber-400 text-amber-950 font-bold';
                } else if (isAnswered) {
                  btnClass = 'bg-orange-600 text-white font-bold';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-xl text-xs font-bold border transition-all flex items-center justify-center ${btnClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Post-Submit Result Card */}
          {isSubmitted && (
            <div className="p-6 rounded-3xl bg-neutral-950 text-white border border-neutral-800 space-y-4 animate-in zoom-in-95">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-500" />
                <h3 className="text-sm font-bold text-white">Quiz Score Summary</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <div className="text-[11px] text-neutral-400">Total Score</div>
                  <div className="text-xl font-black text-white">
                    {Math.round((Object.entries(selectedAnswers).filter(([idx, ans]) => ans === questions[Number(idx)]?.correctIndex).length / questions.length) * 100)}%
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <div className="text-[11px] text-neutral-400">Correct / Total</div>
                  <div className="text-xl font-black text-emerald-400">
                    {Object.entries(selectedAnswers).filter(([idx, ans]) => ans === questions[Number(idx)]?.correctIndex).length} / {questions.length}
                  </div>
                </div>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed">
                Your response data has been fed into the Scikit-Learn performance tracking pipeline to recalibrate your weakness heatmap.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
