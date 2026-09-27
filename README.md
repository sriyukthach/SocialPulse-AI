# SocialPulse AI ⚡
> **AI-Powered Social Media Engagement Agent with Persistent Memory**  
> *Built for HackwithHyderabad 3.0* | Powered by **Hindsight by Vectorize** & **Google Gemini**

SocialPulse AI solves a fundamental problem in AI social media marketing: **context loss across sessions**. Traditional AI assistants generate generic ideas because they do not remember which formats worked, which failed, or what audiences asked for in previous campaigns.

By integrating **Hindsight by Vectorize**, SocialPulse AI learns from a brand's historical post metrics and audience comments across sessions, recalling proven patterns to generate hyper-personalized content recommendations with complete transparency.

---

## 🌟 Key Features

1. **Brand Analytics Dashboard**:
   - Real-time KPIs (Average Engagement Rate Index, Top Performing Format, Post Counts).
   - Live Hindsight Memory Bank status and indexed fact count.
   - Recent post performance cards with engagement metrics.

2. **Persistent Memory with Hindsight**:
   - Uses the official `hindsight-client` Python SDK.
   - Retains post performance, format effectiveness, and raw audience feedback into isolated memory banks (`bank_id="glownest"`).
   - Recalls multi-strategy ranked insights (semantic, graph, temporal) whenever new content ideas are generated.
   - Built-in **Memory Center** to inspect recalled memory units, trigger Hindsight reflection, and manually retain customer observations.

3. **Memory-Informed Content Studio**:
   - Generates high-converting social media ideas tailored to custom campaign objectives.
   - Every recommendation provides:
     - **Topic & Format** (e.g. *Carousel Breakdown*, *Video Reel*)
     - **Creative Concept & Hook**
     - **Hindsight Memory Citations** (exact remembered feedback/data points that inspired the idea)
     - **Strategic Confidence Rationale**

4. **Iterative Learning Workflow**:
   - Add new posts and comments anytime via the UI modal.
   - The agent retains the new information into Hindsight instantly, directly altering subsequent recommendations.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Frontend (React + TS + Vite)                │
│  - Dark Navy & Accent SaaS Interface (Tailwind CSS)         │
│  - Dashboard, Post History, Recommendations, Memory Center  │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST API (Axios)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (FastAPI + Python)                │
│  - SQLAlchemy SQLite DB: Stores structured posts & metrics  │
│  - Hindsight Bridge: Executes retain(), recall(), reflect() │
│  - Google GenAI Agent: Combines context + memory citations  │
└──────────────┬──────────────────────┬───────────────────────┘
               │                      │                      │
               ▼                      ▼                      ▼
      ┌────────────────┐    ┌──────────────────┐    ┌─────────────────┐
      │   SQLite DB    │    │ Hindsight Memory │    │  Google Gemini  │
      │ (App Records & │    │ Bank (Cross-     │    │   (Reasoning &  │
      │ Metrics)       │    │ session memory)  │    │ Recommendation) │
      └────────────────┘    └──────────────────┘    └─────────────────┘
```

---

## 🚀 Quickstart Guide for Team Members

### 1. Prerequisites
- **Python 3.11+**
- **Node.js v18+ & npm**
- **uv** (recommended for instant Python dependency management)

### 2. Configure Environment
Create `backend/.env`:
```env
# Google Gemini API Key (from https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here

# Hindsight Memory Configuration (from https://ui.hindsight.vectorize.io/)
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
HINDSIGHT_API_KEY=your_hindsight_api_key_here

# Database & Server
DATABASE_URL=sqlite:///./socialpulse.db
PORT=8000
```

### 3. Run Backend (FastAPI)
```bash
# Setup virtual environment and install packages
uv venv backend/.venv
uv pip install -r backend/requirements.txt --python backend/.venv/bin/python

# Start server on http://localhost:8000
export PYTHONPATH=backend
backend/.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Run Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Open **http://localhost:5173** in your browser!

---

## 🎬 Hackathon Live Demo Walkthrough (GlowNest Scenario)

Follow this 4-step script for your presentation to the judges:

1. **Show the Dashboard**:
   - Highlight the **GlowNest Skincare** brand profile (Target audience: young adults with oily skin; Goal: educational engagement).
   - Point out the 3 historical posts in SQLite:
     - **Morning Routine Carousel**: High engagement (620 likes, 105 comments).
     - **Flash Sale Static Image**: Low engagement (95 likes, 12 comments). Audience comment: *"Feels like a generic promo ad, we prefer routines"*.
     - **Cleanser Reel**: Viral engagement (840 likes, 142 comments).
2. **Open the Memory Center**:
   - Show how Hindsight extracted 17 distinct memory units and entity relations from the posts without any manual tagging.
   - Run a live semantic recall query for *"budget oily skin"*.
3. **Generate Content Recommendations**:
   - Click **Generate Content Ideas** in the Recommendations Studio.
   - Show how the agent **recommends educational carousels and reels** rather than static discount sales, citing the exact Hindsight memories.
4. **Demonstrate Cross-Session Learning**:
   - Click **Add Post & Feedback** to submit a new observation (e.g., *"Audience asking for sunscreen recommendations that don't sting eyes"*).
   - Click **Generate Content Ideas** again and watch the agent immediately adapt its strategy to sunscreen education!

---

## 🛠️ Project Structure

```
SocialPulse-AI/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI entry point & CORS
│   │   ├── config.py                # Environment & SSL configuration
│   │   ├── database.py              # SQLite database engine & session
│   │   ├── models/                  # SQLAlchemy models (Brand, Post, Log)
│   │   ├── schemas/                 # Pydantic schemas (Validation & Response)
│   │   ├── services/
│   │   │   ├── hindsight_service.py # Hindsight retain, recall, reflect wrapper
│   │   │   ├── gemini_service.py    # Memory-augmented recommendation engine
│   │   │   └── analytics_service.py # Engagement rate & performance metrics
│   │   └── routers/                 # Modular API endpoints
│   ├── tests/
│   │   └── test_hindsight.py        # Independent Hindsight persistence test
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/client.ts            # Typed Axios REST client
│   │   ├── components/              # Navbar, StatCard, PostCard, Forms, Cards
│   │   ├── pages/                   # Dashboard, PostHistory, Recommendations, MemoryCenter
│   │   ├── types/index.ts           # Shared TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
└── README.md
```
