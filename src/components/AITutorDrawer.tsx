import React, { useState, useRef, useEffect } from 'react';
import { TargetExam, AITutorMessage, MLWeaknessReport, UserProfile, SevenDayRoadmap, StudyRoadmapDay } from '../types';
import { 
  Sparkles, 
  X, 
  Send, 
  Database, 
  Bot, 
  User, 
  ExternalLink, 
  Copy, 
  Check, 
  ChevronRight, 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Target, 
  BrainCircuit, 
  RotateCcw, 
  Layers, 
  ChevronDown
} from 'lucide-react';

interface AITutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  targetExam: TargetExam;
  initialQuery?: string;
  mlReport?: MLWeaknessReport;
  currentUser?: UserProfile;
}

export const AITutorDrawer: React.FC<AITutorDrawerProps> = ({
  isOpen,
  onClose,
  targetExam,
  initialQuery,
  mlReport,
  currentUser,
}) => {
  // Drawer Active View Mode: 'chat' | 'roadmap'
  const [drawerMode, setDrawerMode] = useState<'chat' | 'roadmap'>('chat');

  // Chat State
  const [messages, setMessages] = useState<AITutorMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Hello! I am **PrepWise AI**, your dedicated tutor powered by **Gemini 2.5 Flash** and our **Local Vector Database (ChromaDB / FAISS)**.
I specialize in **${targetExam}**, state-specific topics (Kerala Renaissance, Geography), CSAT quantitative tricks, and core constitutional articles.

You can ask syllabus questions or click **"7-Day Roadmap"** to generate an adaptive weekly study plan based on your ML weakness profile!`,
      timestamp: 'Just now',
      examContext: targetExam
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 7-Day Roadmap State
  const [roadmap, setRoadmap] = useState<SevenDayRoadmap | null>(null);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);
  const [completedSlots, setCompletedSlots] = useState<Record<string, boolean>>({});

  // Auto scroll to bottom in chat
  useEffect(() => {
    if (drawerMode === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, drawerMode]);

  // Handle initial query if passed
  useEffect(() => {
    if (initialQuery && isOpen) {
      setDrawerMode('chat');
      handleSendMessage(initialQuery);
    }
  }, [initialQuery, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMessage: AITutorMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      examContext: targetExam
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/ai-tutor/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_query: query,
          target_exam: targetExam,
          subject: 'General Studies'
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        const assistantMessage: AITutorMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: data.sources || [],
          examContext: targetExam
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.detail || 'Failed to fetch AI tutor response');
      }
    } catch (err: any) {
      const errorMessage: AITutorMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ **Notice:** ${err.message || 'Error communicating with AI tutor service.'}\n\nPlease verify that your server is running.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Generate 7-Day Roadmap from ML Weakness Analysis
  const handleGenerateRoadmap = async () => {
    setIsGeneratingRoadmap(true);
    try {
      const payload = {
        target_exam: targetExam,
        student_name: currentUser?.name || 'Aspirant',
        overall_accuracy: currentUser?.overallAccuracy || mlReport?.overallHealthScore || 65,
        cluster_group: mlReport?.clusterGroup || 'Needs Targeted Revision',
        weak_topics: mlReport?.weakTopics || [
          { topic: 'CSAT Number Systems', subject: 'CSAT Aptitude', accuracy: 42, urgency: 'Critical' },
          { topic: 'Kerala Renaissance Chronology', subject: 'Kerala PSC', accuracy: 55, urgency: 'Moderate' }
        ],
        strong_subjects: currentUser?.strongSubjects || ['Indian Polity', 'Modern History'],
        weak_subjects: currentUser?.weakSubjects || ['CSAT Aptitude', 'Economy'],
        daily_hours: currentUser?.dailyStudyHours || 6
      };

      const res = await fetch('/api/v1/study-roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.status === 'success' && data.roadmap) {
        setRoadmap(data.roadmap);
        setSelectedDayNum(1);
      }
    } catch (err) {
      console.error('Error generating roadmap:', err);
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const toggleSlotCompletion = (slotId: string) => {
    setCompletedSlots((prev) => ({
      ...prev,
      [slotId]: !prev[slotId]
    }));
  };

  // State-specific and exam-specific prompt shortcut chips
  const getPromptChips = () => {
    if (targetExam === 'Kerala PSC') {
      return [
        'Aruvippuram Movement & Sree Narayana Guru Timeline',
        'List 44 Rivers of Kerala: East vs West Flowing',
        'Vaikom Satyagraha (1924) High-Yield Facts',
        'Ayyankali & Villuvandi Samaram Significance'
      ];
    }
    if (targetExam === 'UPSC CSE') {
      return [
        'Basic Structure Doctrine (Kesavananda 1973)',
        'CSAT: Modular Arithmetic Remainder Tricks',
        'Article 280 Finance Commission Terms',
        'Key Environmental Ramsar Sites in India'
      ];
    }
    if (targetExam === 'SSC CGL / CHSL') {
      return [
        'Algebra: Fast Formulas for x + 1/x',
        'Circle Geometry: Alternate Segment Theorem',
        'Important Articles on Fundamental Rights'
      ];
    }
    if (targetExam === 'Indian Railways (RRB)') {
      return [
        'Kavach SIL-4 Automatic Train Protection Tech',
        '18 Railway Zones & Headquarters List',
        'Physics: Work, Energy and Power Formulae'
      ];
    }
    return [
      'Eigenvalues & Cayley-Hamilton Theorem',
      'Linear Algebra Rank & Diagonalization',
      'CAT LRDI 4-Set Venn Diagram Shortcuts'
    ];
  };

  if (!isOpen) return null;

  const selectedDay: StudyRoadmapDay | undefined = roadmap?.days.find((d) => d.day === selectedDayNum) || roadmap?.days[0];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl h-full bg-white border-l border-neutral-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        role="dialog"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-950 text-white flex items-center justify-center border border-neutral-800 shadow-xs relative">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-neutral-900">PrepWise AI Tutor</h3>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">
                  Gemini 2.5 Flash
                </span>
              </div>
              <p className="text-xs text-neutral-500 flex items-center gap-1">
                <Database className="w-3 h-3 text-orange-600" />
                Target Exam: <strong className="text-neutral-700">{targetExam}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode Switcher: Chat vs 7-Day ML Roadmap */}
        <div className="px-4 py-2 border-b border-neutral-200 bg-white flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDrawerMode('chat')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              drawerMode === 'chat'
                ? 'bg-neutral-950 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-orange-400" />
            <span>AI Syllabus Chat</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setDrawerMode('roadmap');
              if (!roadmap) {
                handleGenerateRoadmap();
              }
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              drawerMode === 'roadmap'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:text-orange-600'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>7-Day ML Roadmap</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-black/20 uppercase font-black">AI & ML</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* VIEW 1: CHAT / RAG VECTOR SEARCH MODE                     */}
        {/* ========================================================= */}
        {drawerMode === 'chat' && (
          <>
            {/* Prompt shortcuts row */}
            <div className="px-4 py-2.5 bg-white border-b border-neutral-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex-shrink-0">
                Quick Prompts:
              </span>
              {getPromptChips().map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(chip)}
                  className="text-xs font-semibold px-3 py-1 rounded-full border border-neutral-200 hover:border-orange-500 bg-neutral-50 hover:bg-orange-50 text-neutral-700 hover:text-orange-800 transition-colors whitespace-nowrap flex-shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-neutral-50/50">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-xl bg-neutral-950 text-white flex items-center justify-center flex-shrink-0 mt-0.5 border border-neutral-800">
                        <Bot className="w-4 h-4 text-orange-500" />
                      </div>
                    )}

                    <div className={`space-y-2 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                          isUser
                            ? 'bg-neutral-950 text-white rounded-tr-xs'
                            : 'bg-white border border-neutral-200 text-neutral-800 rounded-tl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>

                      {/* RAG Retrieved Sources Citation Footer */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-orange-50/60 border border-orange-200/80 text-[11px] text-neutral-700 space-y-1">
                          <div className="font-bold text-orange-950 flex items-center gap-1">
                            <Database className="w-3 h-3 text-orange-600" />
                            <span>Retrieved from PrepWise Knowledge Base ({msg.sources.length} matches):</span>
                          </div>
                          <ul className="list-disc pl-4 space-y-0.5 text-neutral-600">
                            {msg.sources.map((src, sIdx) => (
                              <li key={sIdx}>
                                <strong>{src.title}</strong> — <span className="text-neutral-500 italic">{src.source}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Message Actions */}
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400 px-1">
                        <span>{msg.timestamp}</span>
                        {!isUser && (
                          <button
                            type="button"
                            onClick={() => handleCopyText(msg.text, msg.id)}
                            className="hover:text-neutral-700 flex items-center gap-1 transition-colors"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-600">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {isUser && (
                      <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-xl bg-neutral-950 text-white flex items-center justify-center border border-neutral-800">
                    <Bot className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-neutral-200 text-xs text-neutral-500 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-spin" />
                    <span>Searching vector database & synthesizing answer with Gemini 2.5 Flash...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white border-t border-neutral-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder={`Ask about ${targetExam} syllabus, PYQs, formulas...`}
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputQuery.trim()}
                  className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all disabled:opacity-40 shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ask</span>
                </button>
              </form>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: 7-DAY ML-POWERED STUDY ROADMAP                    */}
        {/* ========================================================= */}
        {drawerMode === 'roadmap' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-neutral-50">
            {/* Top ML Diagnostic Summary Card */}
            <div className="p-4 bg-white border-b border-neutral-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-bold text-neutral-900">ML Diagnostics Active</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                    {mlReport?.clusterGroup || 'Needs Targeted Revision'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateRoadmap}
                  disabled={isGeneratingRoadmap}
                  className="px-3 py-1 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RotateCcw className={`w-3 h-3 ${isGeneratingRoadmap ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingRoadmap ? 'Generating...' : 'Regenerate'}</span>
                </button>
              </div>

              {roadmap ? (
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-neutral-800 leading-snug">
                    {roadmap.headlineSummary}
                  </p>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    {roadmap.mlInsight}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-neutral-500">
                  Synthesizing your quiz accuracy, question latency, and target exam syllabus with Gemini 2.5 Flash...
                </p>
              )}
            </div>

            {/* Loading state indicator */}
            {isGeneratingRoadmap && (
              <div className="p-8 text-center space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto animate-bounce">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-neutral-800">Computing 7-Day Precision Recovery Matrix...</div>
                <p className="text-[11px] text-neutral-400 max-w-xs mx-auto">
                  Sequencing high-cognitive morning slots for weak topics, speed drills for afternoons, and error logs for nights.
                </p>
              </div>
            )}

            {/* Roadmap Content */}
            {!isGeneratingRoadmap && roadmap && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* 7 Days Tabs */}
                <div className="p-2 bg-white border-b border-neutral-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {roadmap.days.map((day) => {
                    const isSelected = day.day === selectedDayNum;
                    const daySlots = day.slots.map((s) => s.id);
                    const completedInDay = daySlots.filter((id) => completedSlots[id]).length;
                    const isFullyCompleted = daySlots.length > 0 && completedInDay === daySlots.length;

                    return (
                      <button
                        key={day.day}
                        type="button"
                        onClick={() => setSelectedDayNum(day.day)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                          isSelected
                            ? 'bg-orange-600 text-white shadow-xs'
                            : 'bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700'
                        }`}
                      >
                        <span>Day {day.day}</span>
                        {isFullyCompleted ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                        ) : (
                          <span className={`text-[10px] px-1 rounded-sm ${isSelected ? 'bg-orange-700 text-white' : 'bg-neutral-200 text-neutral-600'}`}>
                            {completedInDay}/{day.slots.length}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Day Details */}
                {selectedDay && (
                  <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                    {/* Day Header Banner */}
                    <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                          {selectedDay.theme}
                        </span>
                        <span className="text-xs font-semibold text-neutral-400">Day {selectedDay.day} of 7</span>
                      </div>

                      <h4 className="text-sm font-black text-neutral-900">
                        {selectedDay.title}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase block">Daily Goal:</span>
                          <span className="text-neutral-800 font-semibold">{selectedDay.dailyGoal}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase block">Drill Target:</span>
                          <span className="text-orange-700 font-semibold">{selectedDay.drillTarget}</span>
                        </div>
                      </div>

                      {/* Focus area tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedDay.focusAreas.map((area, aIdx) => (
                          <span key={aIdx} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Time Slots List */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                          Scheduled Focus Blocks ({selectedDay.slots.length} Slots):
                        </h5>
                        <span className="text-[11px] text-neutral-400">Check off as completed</span>
                      </div>

                      {selectedDay.slots.map((slot) => {
                        const isDone = !!completedSlots[slot.id];
                        return (
                          <div
                            key={slot.id}
                            onClick={() => toggleSlotCompletion(slot.id)}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                              isDone
                                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900 opacity-90'
                                : 'bg-white border-neutral-200 hover:border-orange-300 shadow-xs'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                                  slot.type === 'Concept' ? 'bg-blue-100 text-blue-800' :
                                  slot.type === 'PYQ Drill' ? 'bg-orange-100 text-orange-800' :
                                  slot.type === 'Audio Digest' ? 'bg-purple-100 text-purple-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {slot.type}
                                </span>
                                <span className="text-xs font-mono font-bold text-neutral-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {slot.timeSlot}
                                </span>
                                <span className="text-[10px] text-neutral-400">({slot.duration})</span>
                              </div>

                              <div className={`text-xs font-bold ${isDone ? 'line-through text-emerald-800' : 'text-neutral-900'}`}>
                                {slot.task}
                              </div>

                              <div className="text-[11px] text-neutral-500">
                                Subject: <strong className="text-neutral-700">{slot.subject}</strong>
                              </div>
                            </div>

                            <button
                              type="button"
                              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors flex-shrink-0 mt-0.5 ${
                                isDone
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'border-neutral-300 bg-white hover:border-orange-500'
                              }`}
                            >
                              {isDone && <Check className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Ask AI Tutor about this day shortcut */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDrawerMode('chat');
                          handleSendMessage(`I am following Day ${selectedDay.day} of my 7-Day Roadmap ("${selectedDay.title}"). Please give me 3 high-yield memory frameworks and 2 tricky trap question concepts for "${selectedDay.dailyGoal}".`);
                        }}
                        className="w-full py-2.5 rounded-xl bg-neutral-950 hover:bg-black text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                        <span>Ask AI Tutor to Guide Day {selectedDay.day} Drills</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
