# 🧠 LectureMind v2 — Python + React AI Study System

A full-stack study platform powered by **Python FastAPI** + **Claude Opus AI** + **React**.

## ✨ What's New in v2

| Feature | Description |
|---|---|
| 🐍 Python Backend | FastAPI server handles PDF extraction + Claude API |
| 📄 PyMuPDF | Robust page-by-page PDF text extraction |
| 🃏 Flashcards | Flip-animation cards with mastery tracking + AI-generate more |
| 🗺 Mind Map | Interactive SVG mind map with clickable branches |
| 🎨 Wallpaper Generator | 1920×1080 SVG wallpapers — 5 palette themes, downloadable |
| 📜 AI Poem | Rhyming mnemonic poem + regenerate button |
| 🍅 Pomodoro Timer | Circular timer with session/break tracking |
| 🔄 All tabs powered by Python | Zero browser CORS issues |

---

## 🚀 Quick Start

### Step 1 — Clone / extract the project
```
lecturemind/
├── backend/    ← Python FastAPI server
├── frontend/   ← React + Vite
├── start.sh    ← Starts both servers at once
└── README.md
```

### Step 2 — Add your Anthropic API key
```bash
cd backend
cp .env.example .env
# Open .env and paste your key from https://console.anthropic.com/
```

### Step 3 — Install backend (Python 3.9+)
```bash
cd backend
pip install -r requirements.txt
```

### Step 4 — Install frontend (Node 18+)
```bash
cd frontend
npm install
```

### Step 5 — Start both servers
```bash
# From the project root:
bash start.sh

# OR manually in two terminals:
# Terminal 1:
cd backend && python main.py
# Terminal 2:
cd frontend && npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔧 Without an API Key

Click **"✨ Try Demo Lecture"** on the landing page — all 10 tabs work with pre-loaded Machine Learning lecture data. No key needed.

---

## 📁 Architecture

```
Browser (React)
    │
    ▼ /api/* (proxied by Vite dev server)
    │
Python FastAPI (localhost:8000)
    ├── POST /api/analyze     — PyMuPDF extracts text → Claude analysis
    ├── POST /api/wallpaper   — Generates SVG wallpaper
    ├── POST /api/flashcards  — Generates more flashcards
    ├── POST /api/poem        — Generates mnemonic poem
    └── POST /api/mindmap     — Generates mind-map data
```

## 🎨 Tabs

| Tab | Description |
|---|---|
| 📋 Summary | AI overview + 5 key points + takeaway |
| 🎯 Quiz | 5 MCQs with instant feedback + confetti |
| 🃏 Flashcards | Flip cards with mastery tracking |
| 🗺 Mind Map | Interactive SVG branch diagram |
| 🎨 Wallpaper | 1920×1080 SVG desktop wallpaper |
| 📜 Poem | Rhyming mnemonic poem |
| 🍅 Pomodoro | 25/5/15 focus timer |
| 🔥 Hard Topics | AI-detected difficulty + confidence meters |
| 📅 Study Plan | 7-day plan with Google Calendar export |
| 🎥 Videos | 3 curated YouTube recommendations |
