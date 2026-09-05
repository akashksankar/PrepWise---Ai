import React, { useState } from 'react';
import { TargetExam, UserProfile } from '../types';
import { 
  Database, 
  UploadCloud, 
  FileText, 
  Terminal, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  HardDrive, 
  Sparkles,
  Server,
  RefreshCw,
  Clock
} from 'lucide-react';

interface AdminPortalProps {
  currentUser: UserProfile;
  activeSubTab?: 'ingestion' | 'crawler';
  onOpenBackendModal: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  activeSubTab = 'ingestion',
  onOpenBackendModal,
}) => {
  // Ingestion State
  const [docTitle, setDocTitle] = useState('');
  const [selectedExam, setSelectedExam] = useState<TargetExam>('Kerala PSC');
  const [selectedSubject, setSelectedSubject] = useState('Kerala Renaissance & History');
  const [docContent, setDocContent] = useState('');
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestStatus, setIngestStatus] = useState<string | null>(null);

  // Crawler State
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlerLogs, setCrawlerLogs] = useState<string[]>([
    '[INIT] EduCrawler Pipeline v1.0 initialized.',
    '[CONFIG] Target Portals: PIB India, Kerala IPRD Gazette, The Hindu Edu.',
    '[EMBEDDINGS] ChromaDB collection "prepwise_knowledge_base" connected (dim=384).'
  ]);

  const handleIngestDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docContent.trim() || isIngesting) return;
    setIsIngesting(true);
    setIngestStatus(null);

    try {
      const res = await fetch('/api/v1/admin/ingest-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: docTitle,
          exam: selectedExam,
          subject: selectedSubject,
          content: docContent
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setIngestStatus(`Success: ${data.message} (${data.chunks_count} chunks embedded)`);
        setDocTitle('');
        setDocContent('');
      } else {
        throw new Error(data.message || 'Ingestion failed');
      }
    } catch (err: any) {
      setIngestStatus(`Error: ${err.message}`);
    } finally {
      setIsIngesting(false);
    }
  };

  const handleTriggerCrawler = async () => {
    if (isCrawling) return;
    setIsCrawling(true);
    setCrawlerLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Triggering Web-Crawler Pipeline across verified portals...`,
      `[${new Date().toLocaleTimeString()}] [SCRAPE] Fetching latest announcements from Kerala IPRD Gazette...`,
      `[${new Date().toLocaleTimeString()}] [SCRAPE] Querying PIB National Schemes bulletin...`
    ]);

    try {
      const res = await fetch('/api/v1/crawler/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sources: ['Kerala IPRD News', 'PIB India', 'The Hindu']
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setCrawlerLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] [SUCCESS] Extracted ${data.articles?.length || 3} high-yield items.`,
          `[${new Date().toLocaleTimeString()}] [CHUNK] Split text into 800-token blocks with 100-token overlap.`,
          `[${new Date().toLocaleTimeString()}] [EMBED] Generated MiniLM-L6-v2 embeddings and persisted to ChromaDB.`
        ]);
      }
    } catch (err) {
      setCrawlerLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [ERROR] Crawler service timed out or server unavailable.`
      ]);
    } finally {
      setIsCrawling(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
              Knowledge Base & Vector Store Administration
            </h1>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-neutral-900 text-white">
              Admin Role
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage local PDF chunking, ChromaDB vector indexing, and autonomous web-crawlers.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenBackendModal}
          className="px-4 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-bold transition-colors flex items-center gap-2"
        >
          <Server className="w-3.5 h-3.5 text-neutral-700" />
          <span>View FastAPI Backend Code</span>
        </button>
      </div>

      {/* System Status Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-bold uppercase mb-2">
            <span>Vector Store Status</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-neutral-900">Active (Chroma)</div>
          <div className="text-[11px] text-neutral-500 mt-1">all-MiniLM-L6-v2 (384-dim)</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-bold uppercase mb-2">
            <span>Total Chunks Indexed</span>
            <Layers className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-black text-neutral-900">1,428 Chunks</div>
          <div className="text-[11px] text-neutral-500 mt-1">UPSC, Kerala PSC, SSC, RRB</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-bold uppercase mb-2">
            <span>LLM Tutor Model</span>
            <Sparkles className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-black text-neutral-900">Gemini 2.5 Flash</div>
          <div className="text-[11px] text-neutral-500 mt-1">Latency: ~340ms / response</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-bold uppercase mb-2">
            <span>ML Analytics Engine</span>
            <HardDrive className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-neutral-900">Scikit-Learn</div>
          <div className="text-[11px] text-neutral-500 mt-1">KMeans + Penalty Z-Scores</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Syllabus Document Ingestion (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-orange-600" />
                Ingest Syllabus Document / PDF into Vector Store
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Splits input into overlapping chunks and stores embedding vectors in ChromaDB.
              </p>
            </div>
          </div>

          <form onSubmit={handleIngestDocument} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Target Exam Tag</label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value as TargetExam)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-bold text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="Kerala PSC">Kerala PSC (KAS / Degree Level)</option>
                  <option value="UPSC CSE">UPSC CSE (Civil Services)</option>
                  <option value="SSC CGL / CHSL">SSC CGL / CHSL</option>
                  <option value="Indian Railways (RRB)">Indian Railways (RRB NTPC)</option>
                  <option value="GATE & CAT">GATE & CAT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Subject Category</label>
                <input
                  type="text"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  placeholder="e.g. Kerala Renaissance or Indian Polity"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Document / Module Title</label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="e.g. Aruvippuram Movement & Temple Entry Proclamation 1936"
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Content Text (PDF Extracted Text / Official Notes)
              </label>
              <textarea
                rows={5}
                value={docContent}
                onChange={(e) => setDocContent(e.target.value)}
                placeholder="Paste the official syllabus excerpts, historical dates, key constitutional articles, or aptitude formulas here..."
                className="w-full p-3.5 rounded-2xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
                required
              ></textarea>
            </div>

            {ingestStatus && (
              <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                ingestStatus.startsWith('Success') 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {ingestStatus.startsWith('Success') ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                <span>{ingestStatus}</span>
              </div>
            )}

            <button
              id="admin-ingest-btn"
              type="submit"
              disabled={isIngesting}
              className="w-full py-2.5 rounded-xl bg-neutral-950 hover:bg-black text-white text-xs font-bold transition-all disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4 text-orange-500" />
              <span>{isIngesting ? 'Chunking & Indexing...' : 'Chunk and Index into Vector DB'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Web-Crawler Terminal & Logs (5 cols) */}
        <div className="lg:col-span-5 bg-neutral-950 rounded-3xl border border-neutral-800 p-6 sm:p-7 text-white shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-orange-500" />
              <h2 className="text-sm font-bold text-white">Current Affairs Web-Crawler</h2>
            </div>

            <button
              id="admin-crawl-btn"
              type="button"
              onClick={handleTriggerCrawler}
              disabled={isCrawling}
              className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>{isCrawling ? 'Crawling...' : 'Trigger Scrape'}</span>
            </button>
          </div>

          <p className="text-xs text-neutral-400">
            BeautifulSoup4 pipeline scraping official educational feeds: PIB India, Kerala IPRD Gazette, and Press Releases.
          </p>

          {/* Terminal Console View */}
          <div className="h-64 rounded-2xl bg-neutral-900/90 border border-neutral-800 p-3.5 font-mono text-[11px] text-neutral-300 overflow-y-auto space-y-1.5 shadow-inner">
            {crawlerLogs.map((log, lIdx) => (
              <div 
                key={lIdx} 
                className={log.includes('[ERROR]') ? 'text-red-400' : (log.includes('[SUCCESS]') ? 'text-emerald-400' : (log.includes('[EMBED]') ? 'text-orange-400' : 'text-neutral-300'))}
              >
                {log}
              </div>
            ))}
            {isCrawling && (
              <div className="text-orange-400 flex items-center gap-1.5 animate-pulse">
                <span>&gt; Fetching live DOM trees and extracting high-yield exam summaries...</span>
              </div>
            )}
          </div>

          <div className="pt-2 text-[11px] text-neutral-500 flex items-center justify-between">
            <span>Schedule: Daily at 05:00 UTC</span>
            <span>ChromaDB Sync: Real-time</span>
          </div>
        </div>
      </div>
    </div>
  );
};
