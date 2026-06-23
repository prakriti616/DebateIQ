# DebateIQ

> Practice debating with an AI opponent and receive real-time feedback on argument quality, reasoning, and persuasion.

DebateIQ is an AI-powered debate training platform that allows users to engage in structured debates against an AI opponent. The platform analyzes arguments, evaluates reasoning quality, tracks performance over time, and helps users improve critical thinking and communication skills.

---

## Development Status

**Currently in Active Development**

The project is being built in multiple phases.

### Phase 1 (Current MVP)

* User Authentication
* Topic Selection
* AI Debate Opponent
* Debate Chat Interface
* Basic Scoring System
* Debate History

### Phase 2

* Logical Fallacy Detection
* AI Debate Judge
* Personalized Feedback Reports
* Performance Dashboard

### Phase 3

* Voice-Based Debates
* Multiplayer Debate Rooms
* Leaderboards
* Tournament Mode

---

## Problem Statement

Debating is one of the most effective ways to improve communication, critical thinking, and persuasion skills.

However, most people lack access to debate partners, coaches, or structured feedback.

DebateIQ aims to provide an always-available AI debate partner that challenges users, evaluates their arguments, and helps them improve over time.

---

## Core Features

### AI Debate Arena

Users can:

* Select a debate topic
* Choose a position
* Set debate difficulty
* Debate against an AI opponent

Example topics:

* Should AI replace teachers?
* Is social media beneficial to society?
* Should governments regulate AI?

---

### Debate Chat Interface

Real-time conversational debate experience featuring:

* User arguments
* AI rebuttals
* Debate timeline
* Round tracking

---

### Argument Analysis

Each response is evaluated for:

* Clarity
* Relevance
* Logical reasoning
* Evidence usage
* Persuasiveness

---

### Debate Scoring

Generate performance scores based on debate quality.

Metrics include:

* Argument strength
* Consistency
* Evidence quality
* Response relevance

---

### AI Feedback System (Planned)

After each debate, users receive:

* Strengths
* Weaknesses
* Improvement suggestions
* Personalized recommendations

---

## Tech Stack

### Frontend

* React
* Tailwind CSS
* Vite

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### AI Layer

* Google Gemini API
* OpenAI API (optional)

### Real-Time Features (Planned)

* Socket.io

---

## Planned API Endpoints

```http
POST /api/debate/start
POST /api/debate/respond
GET  /api/debate/history
GET  /api/debate/:id

POST /api/analysis/evaluate
POST /api/analysis/feedback

POST /api/auth/register
POST /api/auth/login
```

---

## Environment Variables

```env
PORT=
MONGODB_URI=
JWT_SECRET=
GEMINI_API_KEY=
OPENAI_API_KEY=
```

---

## Roadmap

* Project setup
* Authentication system
* Debate session management
* AI response generation
* Scoring engine
* Debate history
* Argument analysis
* Logical fallacy detection
* Performance dashboard
* Voice debates
* Deployment

---

## Future Enhancements

* AI Judge System
* Debate Leaderboards
* Tournament Mode
* Debate Replay
* PDF Performance Reports
* Team Debates
* Voice-Based Debates

