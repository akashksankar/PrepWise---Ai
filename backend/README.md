# PrepWise AI — Python FastAPI Backend

An AI & ML Powered Competitive Exam Preparation Platform Backend.
Supports **UPSC CSE**, **Kerala PSC (KAS/Degree Level)**, **SSC CGL/CHSL**, **Indian Railways (RRB)**, and **GATE & CAT**.

## Architecture & Features
- **Local RAG Vector Store**: LangChain + ChromaDB / FAISS semantic similarity search with `all-MiniLM-L6-v2` embeddings.
- **LLM Engine**: Google Gemini 2.5 Flash via the official `google-genai` SDK (`gemini-2.5-flash`).
- **Student Performance ML**: Scikit-Learn (KMeans clustering, penalty weighting, weak-topic detection) + Pandas.
- **Admin Ingestion**: Drag-and-drop PDF chunking and metadata indexing for Kerala PSC, UPSC, etc.
- **Current Affairs Crawler**: BeautifulSoup4 + Requests pipeline to scrape and auto-embed educational updates.

## Quick Start on Localhost

### 1. Set Up Virtual Environment & Dependencies
```bash
cd backend
python -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment Variable
```bash
export GEMINI_API_KEY="your-gemini-api-key-here"
```

### 3. Run FastAPI Server
```bash
uvicorn main:app --reload --port 8000
```

The interactive Swagger documentation will be accessible at:
👉 **http://localhost:8000/docs**
