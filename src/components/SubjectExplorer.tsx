import React, { useState } from 'react';
import { TargetExam, SubjectModule } from '../types';
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Search, 
  Flame, 
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';

interface SubjectExplorerProps {
  targetExam: TargetExam;
  subjects: SubjectModule[];
  onToggleTopic: (subjectId: string, topicId: string) => void;
  onOpenAITutorWithQuery: (query: string) => void;
}

export const SubjectExplorer: React.FC<SubjectExplorerProps> = ({
  targetExam,
  subjects,
  onToggleTopic,
  onOpenAITutorWithQuery,
}) => {
  const filteredSubjects = subjects.filter((s) => s.exam === targetExam);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    filteredSubjects[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filterHighYield, setFilterHighYield] = useState(false);

  // Sync if exam changes
  React.useEffect(() => {
    if (filteredSubjects.length > 0 && !filteredSubjects.some(s => s.id === selectedSubjectId)) {
      setSelectedSubjectId(filteredSubjects[0].id);
    }
  }, [targetExam, filteredSubjects, selectedSubjectId]);

  const activeSubject = filteredSubjects.find((s) => s.id === selectedSubjectId) || filteredSubjects[0];

  const displayedTopics = (activeSubject?.topics || []).filter((topic) => {
    const matchesQuery = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         topic.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterHighYield || topic.importance === 'High';
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
            Curriculum & Syllabus Explorer
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Exhaustive topic blueprints for <strong className="text-neutral-800">{targetExam}</strong> with PYQ trends and direct RAG integration.
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search topics or PYQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 w-48 sm:w-64"
            />
          </div>

          <button
            type="button"
            onClick={() => setFilterHighYield(!filterHighYield)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              filterHighYield 
                ? 'bg-orange-50 border-orange-300 text-orange-800' 
                : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>High Yield Only</span>
          </button>
        </div>
      </div>

      {filteredSubjects.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-neutral-200">
          <BookOpen className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-neutral-900">No Syllabus Modules Loaded for {targetExam}</h3>
          <p className="text-xs text-neutral-500 mt-1">Please select UPSC CSE or Kerala PSC from the top menu to view detailed syllabus units.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Subjects selector list (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-1">
              Select Subject Paper
            </div>
            {filteredSubjects.map((sub) => {
              const isSelected = sub.id === activeSubject?.id;
              const completedCount = sub.topics.filter(t => t.completed).length;
              const progress = Math.round((completedCount / (sub.topics.length || 1)) * 100);

              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-neutral-950 text-white border-neutral-900 shadow-md' 
                      : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold leading-snug">{sub.name}</span>
                    {sub.stateSpecific && (
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-800'
                      }`}>
                        State Focus
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] mb-1.5 opacity-80">
                    <span>Progress ({completedCount}/{sub.topics.length})</span>
                    <span className="font-bold">{progress}%</span>
                  </div>

                  <div className="w-full h-1.5 bg-neutral-200/40 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${isSelected ? 'bg-orange-500' : 'bg-neutral-900'}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Topics in Active Subject (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-neutral-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-100 pb-4 gap-2">
              <div>
                <h2 className="text-base font-bold text-neutral-900">{activeSubject?.name}</h2>
                <p className="text-xs text-neutral-500">Check off completed topics or consult the AI Tutor for step-by-step notes.</p>
              </div>
              <div className="text-xs text-neutral-500 font-semibold bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-100">
                {displayedTopics.length} Topics Shown
              </div>
            </div>

            <div className="space-y-3">
              {displayedTopics.map((topic) => (
                <div
                  key={topic.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    topic.completed 
                      ? 'border-emerald-200 bg-emerald-50/20' 
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => onToggleTopic(activeSubject.id, topic.id)}
                        className={`mt-0.5 flex-shrink-0 transition-colors ${
                          topic.completed ? 'text-emerald-600' : 'text-neutral-300 hover:text-neutral-500'
                        }`}
                      >
                        {topic.completed ? (
                          <CheckCircle2 className="w-5 h-5 fill-emerald-100 text-emerald-600" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className={`text-sm font-bold ${topic.completed ? 'line-through text-neutral-500' : 'text-neutral-900'}`}>
                            {topic.title}
                          </h4>
                          {topic.importance === 'High' && (
                            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">
                              High Yield
                            </span>
                          )}
                          <span className="text-[11px] text-neutral-400 font-medium">
                            {topic.pyqCount} PYQs
                          </span>
                        </div>

                        <p className="text-xs text-neutral-600 leading-relaxed">
                          {topic.summary}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenAITutorWithQuery(`Provide an in-depth, structured master revision note on "${topic.title}" for ${targetExam} with 5 landmark PYQs, formulas, and high-yield traps.`)}
                      title="Ask AI Tutor about this topic"
                      className="flex-shrink-0 px-2.5 py-1.5 rounded-xl border border-neutral-200 hover:border-orange-500 hover:bg-orange-50 text-[11px] font-bold text-neutral-700 hover:text-orange-700 transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                      <span className="hidden sm:inline">Ask AI</span>
                    </button>
                  </div>
                </div>
              ))}

              {displayedTopics.length === 0 && (
                <div className="text-center py-8 text-xs text-neutral-400">
                  No topics matching current search or filters.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
