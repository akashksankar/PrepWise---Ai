import React, { useState } from 'react';
import { TargetExam, CurrentAffairItem } from '../types';
import { CURRENT_AFFAIRS_ITEMS } from '../data/mockData';
import { 
  Clock, 
  Search, 
  Sparkles, 
  Database, 
  CheckCircle2, 
  Bookmark, 
  Share2, 
  Filter,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface CurrentAffairsFeedProps {
  targetExam: TargetExam;
  onOpenAITutorWithQuery: (query: string) => void;
}

export const CurrentAffairsFeed: React.FC<CurrentAffairsFeedProps> = ({
  targetExam,
  onOpenAITutorWithQuery,
}) => {
  const [items] = useState<CurrentAffairItem[]>(CURRENT_AFFAIRS_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Kerala State', 'National', 'Economy', 'Science & Tech', 'Polity & Schemes'];

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.keyPoints.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
            Curated Current Affairs & Gazette Digest
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Verified updates from PIB, Kerala IPRD Gazette, and National Dailies auto-indexed into RAG.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search news or key takeaways..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 w-48 sm:w-64"
          />
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-neutral-950 text-white shadow-xs'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <div 
            key={item.id}
            className="p-6 rounded-3xl bg-white border border-neutral-200 hover:border-neutral-300 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                    {item.category}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.date}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <Database className="w-3 h-3 text-emerald-600" />
                  <span>RAG Vector Indexed</span>
                </div>
              </div>

              <h2 className="text-base font-bold text-neutral-900 leading-snug">
                {item.title}
              </h2>

              <p className="text-xs text-neutral-600 leading-relaxed">
                {item.summary}
              </p>

              {/* Key takeaways bullet points */}
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Direct Exam Relevance & Key Takeaways:
                </div>
                {item.keyPoints.map((takeaway, tIdx) => (
                  <div key={tIdx} className="text-xs text-neutral-700 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-1.5">
                {item.applicableExams.map((ex, exIdx) => (
                  <span key={exIdx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700">
                    {ex}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onOpenAITutorWithQuery(`Provide a high-yield exam analysis of this recent development: "${item.title}". List 3 probable prelims statement questions and 1 mains analytical question.`)}
                className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Tutor Analysis</span>
              </button>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-2 text-center py-16 bg-white rounded-3xl border border-neutral-200">
            <Clock className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-neutral-900">No current affairs articles found</p>
            <p className="text-xs text-neutral-500 mt-1">Try selecting 'All' or clearing your search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};
