# SocialPulse AI

> **YouTube Channel Intelligence & Audience Insights Platform**  
> Built for HackWithHyderabad 3.0 | Powered by YouTube Data API v3, Google Gemini & Hindsight by Vectorize

SocialPulse AI is a **YouTube-first intelligence platform** that analyzes a public YouTube channel's content history, video performance, audience comments, and engagement patterns.

Instead of using predefined demo brands or manually entered social-media posts, users simply paste a **YouTube channel URL or handle**. SocialPulse retrieves publicly available channel and video data, analyzes historical performance, identifies content and audience patterns, and generates data-grounded insights and recommendations.

The platform also uses **Hindsight by Vectorize** as persistent memory so useful channel insights can be retained and recalled across analysis sessions.

---

## 1. Problem

YouTube creators have access to large amounts of historical content and engagement data, but raw metrics do not always reveal the patterns behind that performance.

Creators may want to understand:

- Which videos receive the most views?
- Which content formats perform consistently?
- Which topics generate stronger engagement?
- What does the audience repeatedly ask about?
- Which videos receive the most comments?
- What patterns appear across previous uploads?
- What content opportunities can be explored next?

SocialPulse transforms this historical information into an easy-to-understand intelligence dashboard.

There are **no predefined demo brands or fake social-media posts**. The analysis starts from the public YouTube channel provided by the user.

---

## 2. How It Works

The user provides a public YouTube channel URL or handle:

```text
https://www.youtube.com/@channelname
```

The platform then follows this pipeline:

```text
User
 │
 │ Paste YouTube Channel URL / Handle
 ▼
SocialPulse
 │
 ▼
YouTube Data API v3
 │
 ├── Channel information
 ├── Video history
 ├── Views
 ├── Likes
 ├── Comments
 └── Public audience comments
 │
 ▼
Analytics Engine
 │
 ├── Engagement rate
 ├── Average views
 ├── Content formats
 ├── Performance patterns
 └── Audience patterns
 │
 ├───────────────┐
 ▼               ▼
SQLite        Hindsight
Database      Memory
 │               │
 │               └── Persistent channel insights
 │
 └───────────────┐
                 ▼
            Google Gemini
                 │
                 ├── Analysis
                 ├── Pattern detection
                 └── Recommendations
                 │
                 ▼
          SocialPulse Dashboard
                 │
                 ├── Channel Overview
                 ├── Content History
                 ├── Performance Insights
                 └── Channel Memory
```

---

## 3. Core Features

### Channel Overview

After analyzing a channel, SocialPulse provides a high-level overview including:

- Channel name
- Channel description
- Subscriber information when publicly available
- Total public video information
- Recent video performance
- Average views
- Average engagement
- Recent content activity

The overview provides a quick understanding of the channel before deeper analysis.

---

### Content History

Content History provides a searchable and sortable view of analyzed videos.

For each video, SocialPulse can display publicly available metrics such as:

- Video title
- Published date
- Views
- Likes
- Comments
- Engagement rate
- Audience feedback

Users can explore historical uploads instead of relying only on the latest video.

---

### Performance Insights

Performance Insights turns raw channel metrics into higher-level observations.

It can surface:

- Executive summary
- Performance patterns
- Content format performance
- Audience patterns
- Recurring viewer questions
- Content opportunities
- Data-grounded recommendations

Google Gemini is used to generate natural-language analysis from the collected channel data.

When AI analysis is unavailable, deterministic analytics can still provide useful metric-based insights rather than leaving the dashboard empty.

---

### Channel Memory

SocialPulse uses Hindsight by Vectorize for persistent channel-specific memory.

Memory can retain useful observations such as:

- Recurring audience interests
- Important content patterns
- Previous analysis observations
- Creator notes
- Audience questions
- Synthesized channel insights

This allows future analysis sessions to build on previously retained knowledge rather than treating every analysis as completely isolated.

---

## 4. Engagement Rate

SocialPulse calculates a simple public engagement rate using available video metrics:

```text
Engagement Rate (%) =
((Likes + Comments) / Views) × 100
```

This metric is used alongside raw views, likes, and comments rather than replacing them.

Because the platform works with public YouTube data, the available metrics depend on what YouTube exposes through the API.

---

## 5. Data Transparency

SocialPulse uses **publicly available YouTube information**.

It does not require access to private YouTube Studio analytics.

The platform does not claim access to private creator-only metrics such as:

- Private revenue information
- Private watch-time analytics
- Private audience demographics
- Private YouTube Studio data

The analysis is based on the public information returned by the YouTube Data API and the application's own derived analytics.

---

## 6. Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Modern dashboard UI

### Backend

- Python
- FastAPI
- REST API
- Analytics services

### Data & AI

- YouTube Data API v3
- Google Gemini
- Hindsight by Vectorize
- SQLite

---

## 7. Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                    SOCIALPULSE FRONTEND                      │
│                  React + TypeScript + Vite                   │
│                                                              │
│  Channel Overview | Content History | Insights | Memory      │
└───────────────────────────────┬──────────────────────────────┘
                                │
                                │ REST API
                                ▼
┌──────────────────────────────────────────────────────────────┐
│                    FASTAPI BACKEND                           │
│                                                              │
│  Channel Analysis | Analytics | Memory | AI Analysis         │
└───────────────┬────────────────┬─────────────────┬───────────┘
                │                │                 │
                ▼                ▼                 ▼
       ┌────────────────┐ ┌───────────────┐ ┌────────────────┐
       │ YouTube Data   │ │ SQLite        │ │ Hindsight      │
       │ API v3         │ │ Database      │ │ Memory         │
       │                │ │               │ │                │
       │ Channel data   │ │ Channels      │ │ Channel        │
       │ Videos         │ │ Videos        │ │ insights       │
       │ Comments       │ │ Metrics       │ │ observations   │
       └────────────────┘ └───────────────┘ └────────────────┘
                                                  │
                                                  ▼
                                         ┌────────────────┐
                                         │ Google Gemini  │
                                         │                │
                                         │ Analysis       │
                                         │ Patterns       │
                                         │ Recommendations│
                                         └────────────────┘
```

---

## 8. Project Structure

A typical project structure is:

```text
SocialPulse/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   └── ...
│   │
│   ├── .venv/
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── .env
├── README.md
└── ...
```

---

## 9. API

The primary channel-analysis endpoint is:

```text
POST /api/brands/analyze_channel
```

The endpoint accepts a public YouTube channel URL or handle, retrieves the relevant public channel information, performs analysis, stores applicable data, and returns the information required by the frontend dashboard.

The frontend communicates with the FastAPI backend through REST APIs.

---

## 10. Environment Variables

Create the required environment configuration for the backend.

Example:

```env
YOUTUBE_API_KEY=your_youtube_data_api_key
GEMINI_API_KEY=your_gemini_api_key
HINDSIGHT_API_KEY=your_hindsight_api_key
```

Use the exact environment variable names expected by the backend configuration.

### YouTube Data API

Create a Google Cloud project and enable:

```text
YouTube Data API v3
```

Then create an API key and provide it to the backend.

### Google Gemini

Configure a Gemini API key for AI-powered analysis and recommendations.

### Hindsight

Configure the Hindsight by Vectorize credentials required by the backend for persistent channel memory.

Never commit real API keys or secrets to Git.

---

## 11. Running Locally

### Prerequisites

Install:

- Python 3.11+
- Node.js 18+
- npm
- A YouTube Data API v3 key
- A Google Gemini API key
- Hindsight credentials

---

### Start the Backend

From the project root on Windows PowerShell:

```powershell
.\backend\.venv\Scripts\python.exe -m uvicorn app.main:app --app-dir backend --reload --host 127.0.0.1 --port 8000
```

The backend will run at:

```text
http://127.0.0.1:8000
```

If you prefer to run from inside the backend directory:

```powershell
cd backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

---

### Start the Frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Vite will display the local frontend URL in the terminal.

Open that URL in your browser.

---

## 12. Typical User Flow

```text
1. Open SocialPulse
        │
        ▼
2. Paste a public YouTube channel URL
        │
        ▼
3. Click "Analyze Channel"
        │
        ▼
4. SocialPulse retrieves public YouTube data
        │
        ▼
5. Metrics and historical content are analyzed
        │
        ▼
6. Audience comments are analyzed
        │
        ▼
7. Useful observations are retained in Hindsight
        │
        ▼
8. Gemini generates grounded insights
        │
        ▼
9. Dashboard displays the results
        │
        ├── Channel Overview
        ├── Content History
        ├── Performance Insights
        └── Channel Memory
```

Users can then select **Analyze Another** to analyze another public YouTube channel.

---

## 13. Why Hindsight Memory?

Traditional analytics systems often treat every analysis as an isolated operation.

SocialPulse adds a persistent memory layer so that useful channel-specific observations can survive beyond a single analysis request.

For example:

```text
Channel analyzed
      │
      ▼
Observation discovered
      │
      ▼
Stored in Hindsight
      │
      ▼
Channel analyzed again later
      │
      ▼
Previous observations recalled
      │
      ▼
New analysis can build on existing context
```

This makes the system more useful for repeated channel analysis and long-term audience understanding.

---

## 14. AI Analysis

Google Gemini is used to transform structured channel information into human-readable insights.

The AI layer can help identify:

- Repeated topics
- Audience interests
- Content patterns
- Format patterns
- Recurring questions
- Potential content opportunities
- Strategic observations based on historical data

The generated insights are grounded in the channel information collected by SocialPulse rather than relying on a predefined demo dataset.

---

## 15. Fallback Analytics

AI services may occasionally be unavailable, rate-limited, or temporarily unable to respond.

SocialPulse therefore keeps deterministic analytics separate from the AI layer.

This means the application can still calculate and display metrics such as:

- Average views
- Engagement rate
- Comment counts
- Like counts
- Video performance
- Historical trends

AI-generated recommendations may be unavailable during an AI service outage, but the underlying channel data and deterministic analytics can still be used.

---

## 16. Privacy & Data Scope

SocialPulse is designed around publicly available YouTube channel information.

Important limitations:

- Only publicly accessible YouTube information is analyzed.
- Private YouTube Studio information is not required.
- API access is subject to YouTube API availability and quotas.
- Available metrics depend on the data exposed by YouTube.
- Third-party AI and memory services are used according to their respective APIs and configurations.

API keys should always be stored securely and never committed to source control.

---

## 17. Troubleshooting

### Backend: `ModuleNotFoundError: No module named 'app'`

This usually means Uvicorn is being started from the wrong working directory.

From the project root, use:

```powershell
.\backend\.venv\Scripts\python.exe -m uvicorn app.main:app --app-dir backend --reload --host 127.0.0.1 --port 8000
```

Or:

```powershell
cd backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

---

### Frontend shows `ECONNREFUSED 127.0.0.1:8000`

The frontend is attempting to contact the backend, but the FastAPI server is not running.

Start the backend first:

```powershell
.\backend\.venv\Scripts\python.exe -m uvicorn app.main:app --app-dir backend --reload --host 127.0.0.1 --port 8000
```

Then refresh the frontend.

---

### YouTube API errors

Check that:

1. The API key is present.
2. YouTube Data API v3 is enabled in Google Cloud.
3. The API key restrictions allow the required API.
4. The requested channel is public.
5. The project has available YouTube API quota.

---

### Gemini analysis is unavailable

Check that:

1. The Gemini API key is configured.
2. The key is valid.
3. The configured Gemini service/model is available.
4. The backend logs do not show authentication, quota, or capacity errors.

The application can still use deterministic analytics when AI analysis is unavailable.

---

### Hindsight memory is unavailable

Check that the required Hindsight credentials are configured and that the backend can reach the Hindsight service.

The core public YouTube analysis should remain conceptually separate from persistent memory.

---

## 18. Important Limitations

SocialPulse depends on external APIs and therefore inherits their limitations.

These include:

- YouTube API quota limits
- Public-data availability
- API rate limits
- AI service availability
- Hindsight service availability
- Changes to third-party APIs
- Differences between channels and their available public data

The platform should therefore treat generated recommendations as **data-grounded analytical suggestions**, not guaranteed predictions of future performance.

---

## 19. Development Philosophy

SocialPulse follows a simple principle:

```text
Public Data
    +
Deterministic Analytics
    +
Persistent Memory
    +
AI Analysis
    =
Actionable Channel Intelligence
```

The system is designed so that AI enhances the analytics rather than replacing the underlying data.

---

## 20. Hackathon Demo

For a demonstration:

1. Start the FastAPI backend.
2. Start the React frontend.
3. Open the SocialPulse dashboard.
4. Paste a public YouTube channel URL.
5. Click **Analyze Channel**.
6. Review the Channel Overview.
7. Explore Content History.
8. Review Performance Insights.
9. Open Channel Memory to see retained observations.
10. Analyze another channel if desired.

The demo does not require selecting a predefined brand.

---

## 21. Summary

SocialPulse AI is a YouTube-first channel intelligence platform that combines:

- **YouTube Data API v3** for public channel and video data
- **Deterministic analytics** for measurable performance insights
- **Google Gemini** for natural-language analysis and recommendations
- **Hindsight by Vectorize** for persistent channel memory
- **SQLite** for application data
- **FastAPI** for the backend
- **React + TypeScript + Vite** for the frontend

The result is a system where a user can paste a YouTube channel URL and move from raw public channel data to:

```text
Channel Data
     ↓
Historical Performance
     ↓
Audience Patterns
     ↓
AI-Assisted Insights
     ↓
Persistent Channel Memory
     ↓
Future Content Intelligence
```

**SocialPulse AI — Turn YouTube history into channel intelligence.**
