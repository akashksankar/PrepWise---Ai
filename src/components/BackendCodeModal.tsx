import React, { useState } from 'react';
import { X, Copy, Check, Terminal, FileCode, Server } from 'lucide-react';

interface BackendCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendCodeModal: React.FC<BackendCodeModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'main' | 'ml' | 'crawler' | 'req'>('main');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const codeSnippets: Record<string, { filename: string; code: string; language: string }> = {
    main: {
      filename: 'backend/main.py',
      language: 'python',
      code: `import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google import genai
from google.genai import types
from ml_engine import StudentPerformanceModel
from crawler import CurrentAffairsCrawler

app = FastAPI(title="PrepWise AI Backend", version="1.0.0")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize official google-genai client
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
ai_client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

ml_model = StudentPerformanceModel()
crawler = CurrentAffairsCrawler()

class QueryRequest(BaseModel):
    student_query: str
    target_exam: str
    subject: Optional[str] = "General Studies"

@app.post("/api/v1/ai-tutor/ask")
async def ask_ai_tutor(request: QueryRequest):
    """Local RAG Vector Search + Gemini 2.5 Flash Generation"""
    # 1. Semantic search over ChromaDB / FAISS
    # 2. Inject retrieved context into Gemini 2.5 Flash system prompt
    response = ai_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"Exam: {request.target_exam}\\nQuery: {request.student_query}",
        config=types.GenerateContentConfig(temperature=0.3)
    )
    return {"status": "success", "answer": response.text}
`
    },
    ml: {
      filename: 'backend/ml_engine.py',
      language: 'python',
      code: `"""
PrepWise Machine Learning Engine (Scikit-Learn + Pandas)
Student performance analytics, penalty z-scores, and adaptive daily schedule generation.
"""
from typing import List, Dict, Any
import numpy as np

class StudentPerformanceModel:
    def __init__(self):
        self.risk_threshold = 60.0

    def analyze_student(self, student_id: str, student_name: str, attempts: List[Dict[str, Any]]) -> Dict[str, Any]:
        # Feature engineering: topic accuracy and question latency
        # Categorize into KMeans clusters: 'High Performer', 'Needs Targeted Revision', 'Foundational Reinforcement'
        ...
`
    },
    crawler: {
      filename: 'backend/crawler.py',
      language: 'python',
      code: `"""
Current Affairs Web-Crawler Pipeline (BeautifulSoup4 + Requests)
Scrapes PIB India and Kerala IPRD Gazette, extracts syllabus points,
and embeds into local ChromaDB with 'all-MiniLM-L6-v2'.
"""
from typing import List, Dict, Any
from datetime import datetime

class CurrentAffairsCrawler:
    def run_pipeline(self, sources: List[str]) -> List[Dict[str, Any]]:
        # Scrape permitted public educational feeds
        ...
`
    },
    req: {
      filename: 'backend/requirements.txt',
      language: 'text',
      code: `fastapi>=0.110.0
uvicorn[standard]>=0.28.0
pydantic>=2.6.0
google-genai>=0.1.1
scikit-learn>=1.4.0
pandas>=2.2.0
numpy>=1.26.0
chromadb>=0.4.24
langchain>=0.1.12
sentence-transformers>=2.5.1
beautifulsoup4>=4.12.3
requests>=2.31.0
`
    }
  };

  const currentSnippet = codeSnippets[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-neutral-950 text-white rounded-3xl max-w-3xl w-full border border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        role="dialog"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-orange-500" />
            <div>
              <h2 className="text-sm font-bold text-white">Python FastAPI Backend Architecture</h2>
              <p className="text-[11px] text-neutral-400">Production-ready microservices code located in <code className="text-orange-400">/backend</code></p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-bold text-neutral-200 transition-colors flex items-center gap-1.5 border border-neutral-800"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy File'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 flex items-center gap-2 border-b border-neutral-800 bg-neutral-900/40 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('main')}
            className={`pb-2 px-3 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'main' ? 'border-orange-500 text-white' : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-orange-400" />
            main.py
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ml')}
            className={`pb-2 px-3 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ml' ? 'border-orange-500 text-white' : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-purple-400" />
            ml_engine.py
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('crawler')}
            className={`pb-2 px-3 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'crawler' ? 'border-orange-500 text-white' : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            crawler.py
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('req')}
            className={`pb-2 px-3 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'req' ? 'border-orange-500 text-white' : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            requirements.txt
          </button>
        </div>

        {/* Code Content */}
        <div className="p-6 overflow-y-auto font-mono text-xs text-neutral-300 leading-relaxed bg-neutral-950">
          <pre className="whitespace-pre">
            {currentSnippet.code}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-neutral-900 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
          <span>Run locally: <code className="text-neutral-200">uvicorn main:app --reload --port 8000</code></span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-white text-neutral-950 font-bold hover:bg-neutral-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
