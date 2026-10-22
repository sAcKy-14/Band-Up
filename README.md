# 🚀 BandUp

> Level up your vocabulary. Boost your IELTS Band Score.

BandUp is a gamified IELTS vocabulary learning platform designed to make vocabulary acquisition engaging, effective, and consistent.

Instead of memorizing word lists, learners discover new IELTS-focused words through interactive challenges, contextual examples, quizzes, and weekly revision sessions. BandUp combines modern learning techniques such as active recall, spaced repetition, and gamification to improve vocabulary retention and IELTS performance.

---

## 🎯 Vision

Help IELTS aspirants improve their vocabulary consistently and naturally, ultimately increasing their IELTS Band Score through structured daily learning and revision.

---

## ✨ Features

### 📚 Daily Vocabulary Learning

- Curated IELTS vocabulary sets
- Word meanings and pronunciations
- Synonyms and antonyms
- Contextual example sentences
- Difficulty-based progression

### 🎮 Gamified Experience

- XP and levels
- Daily streaks
- Achievement badges
- Learning milestones
- Progress rewards

### 🧠 Interactive Practice

- Flashcards
- Match-the-word challenges
- Fill-in-the-blanks
- Sentence completion exercises
- Meaning recall games

### 🔄 Smart Weekly Revision

- Automatic weekly review sessions
- Previously learned word collections
- Performance-based repetition
- Long-term retention focus

### 📈 Progress Dashboard

- Words learned
- Vocabulary mastery score
- Weekly progress reports
- Streak tracking
- Learning analytics

### 🎯 IELTS-Oriented Categories

- Academic Vocabulary
- Writing Task 1
- Writing Task 2
- Speaking Vocabulary
- Reading Vocabulary
- Listening Vocabulary

---

## 🏗️ Tech Stack

### Frontend

- Next.js
- React 19
- TypeScript
- Hand-written responsive CSS
- lucide-react icons

### Backend

- FastAPI and Python 3.11+
- SQLAlchemy async ORM and Alembic migrations

### Database

- PostgreSQL

### Authentication

- Clerk; Next.js sign-in is planned, and backend session-token verification is wired

### Deployment

- Frontend: Vercel
- Backend: Railway / Render
- Database: Neon PostgreSQL

---

## 🎓 Learning Methodology

BandUp uses proven learning principles:

- Active Recall
- Spaced Repetition
- Context-Based Learning
- Incremental Difficulty
- Consistent Revision

---

## 🚀 MVP Goals

- User Authentication
- Daily Vocabulary Feed
- Flashcard Learning
- XP System
- Streak Tracking
- Weekly Revision Module
- Progress Dashboard

## 🧱 Project Structure

```text
Band-Up/
├── frontend/             # Next.js product showcase
│   └── app/              # Dashboard page and visual system
├── backend/
│   ├── app/
│   │   ├── api/          # Versioned HTTP routes
│   │   ├── core/         # Settings and shared application config
│   │   ├── db/            # Database client lifecycle
│   │   ├── models/        # Persistence models
│   │   ├── repositories/  # Data access
│   │   ├── schemas/       # API request and response schemas
│   │   └── services/      # Feature business logic
│   ├── migrations/        # Alembic schema history
│   └── requirements.txt
├── docs/
│   ├── features.md        # Product scope and acceptance criteria
│   └── tech-stack.md      # Full stack and technology choices
├── .gitignore
└── README.md
```

The frontend is a responsive dashboard prototype. The backend now supports a database-backed vocabulary feed, daily learning queue, recall submissions, spaced review scheduling, and learner progress. See [`docs/features.md`](docs/features.md) for the feature plan, [`docs/tech-stack.md`](docs/tech-stack.md) for the complete stack, and the frontend/backend READMEs for setup.

---

## 🛣️ Future Roadmap

### Phase 1

- Vocabulary Learning Engine
- Revision System
- Progress Tracking

### Phase 2

- AI Generated Examples
- Personalized Learning Paths
- Achievement System

### Phase 3

- IELTS Mock Vocabulary Tests
- Speaking Practice
- Community Challenges
- Mobile Application

---

## 🌟 Why BandUp?

Every new word learned is one step closer to a higher IELTS Band Score.

BandUp transforms vocabulary learning from a memorization task into a daily habit powered by progress, consistency, and engagement.

**Learn Daily. Revise Weekly. Band Up.**

