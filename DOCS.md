# Voter App Documentation

A full-stack voting application with a FastAPI backend and Vue 3 frontend using Tailwind CSS v4 and PrimeVue v4.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Frontend](#frontend)
- [Backend](#backend)
- [API Endpoints](#api-endpoints)
- [Database Migrations](#database-migrations)
- [Database Schema](#database-schema)
- [Security Notes](#security-notes)
- [Development Setup](#development-setup)

---

## Architecture Overview

```
voter-app/
├── backend/          # FastAPI API server
│   ├── app/
│   │   ├── main.py    # API routes and business logic
│   │   ├── models.py  # SQLAlchemy database models
│   │   ├── schemas.py # Pydantic request/response schemas
│   │   └── database.py # Database configuration
│   └── requirements.txt
└── frontend/         # Vue 3 SPA (modular architecture)
    ├── src/
    │   ├── main.js           # App entry point
    │   ├── App.vue           # Root layout with component orchestration
    │   ├── api.js            # API client functions
    │   ├── appContent.js     # Static content (features, FAQs, nav items)
    │   ├── router/
    │   │   └── index.js      # Vue Router with auth guard
    │   ├── components/       # Reusable UI components
    │   │   ├── AuthDialog.vue
    │   │   ├── NavBar.vue
    │   │   ├── PollCard.vue
    │   │   ├── CandidateCard.vue
    │   │   ├── CandidateForm.vue
    │   │   └── CandidateResult.vue
    │   ├── composables/      # Focused state management modules
    │   │   ├── useAuth.js    # Authentication logic
    │   │   ├── usePolls.js   # Poll/voting logic
    │   │   └── useVoterApp.js # Combined entry point
    │   └── views/            # Page components
    │       ├── HomeView.vue
    │       ├── EventsView.vue
    │       ├── CreateView.vue
    │       ├── VoteView.vue
    │       └── UnauthorizedView.vue
    └── package.json
```

---

## Frontend

### Tech Stack

- **Vue 3** (Composition API with `<script setup>`)
- **Vite** (Build tool and dev server)
- **Vue Router 4** (Routing)
- **PrimeVue 4** (UI components)
- **Tailwind CSS 4** (Styling)

### Refactored Architecture

The frontend has been modularized using a composable-based architecture:

```
frontend/src/
├── main.js                 # App entry point
├── App.vue                 # Root layout with view routing
├── api.js                  # API client functions
├── appContent.js           # Static content (nav items, features, FAQs)
├── router/
│   └── index.js           # Vue Router with auth guard
├── components/             # Reusable UI components
│   ├── AuthDialog.vue     # Login/register modal
│   ├── NavBar.vue         # Navigation header
│   ├── PollCard.vue       # Poll listing card
│   ├── CandidateCard.vue  # Candidate preview card
│   ├── CandidateForm.vue  # Form for poll choices
│   └── CandidateResult.vue  # Vote result display
└── views/                  # Page components
    ├── HomeView.vue
    ├── EventsView.vue
    ├── CreateView.vue
    ├── VoteView.vue
    └── UnauthorizedView.vue
```

### State Management (Composables)

State is split into focused composables following separation of concerns:

| Composable | Purpose |
|------------|---------|
| `useAuth.js` | Authentication state (user, login/register forms, session) |
| `usePolls.js` | Poll state (polls, voting, creating) |
| `useVoterApp.js` | Combined entry point for backward compatibility |

**useAuth.js:**
```javascript
const authState = reactive({
  user: null,
  loginForm: { username, password },
  registerForm: { username, password, name },
  showLoginDialog: false,
  authMode: "login",
})

// Actions: handleLogin, handleRegister, handleLogout, openLogin
```

**usePolls.js:**
```javascript
const pollState = reactive({
  polls: [],
  poll: null,
  selectedPollId: "",
  createForm: { title, description, candidates },
  loading: false,
  voting: false,
  creating: false,
})

// Actions: loadPolls, submitVote, submitCreatePoll, selectPoll
// Computed: canCreatePoll, totalVotes, leadingCandidateId
```

### Component Structure

| File | Purpose |
|------|---------|
| `App.vue` | Root layout, orchestrates NavBar + AuthDialog + views |
| `components/NavBar.vue` | Navigation bar with user menu |
| `components/AuthDialog.vue` | Authentication modal (login/register) |
| `components/PollCard.vue` | Poll preview card in events list |
| `components/CandidateCard.vue` | Candidate preview in poll card |
| `components/CandidateForm.vue` | Form fields for poll choices |
| `components/CandidateResult.vue` | Vote result bar display |
| `views/HomeView.vue` | Landing page |
| `views/EventsView.vue` | Poll listing |
| `views/CreateView.vue` | Create poll form |
| `views/VoteView.vue` | Voting interface |
| `views/UnauthorizedView.vue` | Auth required page |

### Routing

```javascript
// src/router/index.js
{ path: '/', component: HomeView }
{ path: '/events', component: EventsView }
{ path: '/create', component: CreateView, requiresAuth: true }
{ path: '/vote/:id', component: VoteView }
{ path: '/unauthorized', component: UnauthorizedView }
```

Protected route `/create` redirects unauthenticated users to `/unauthorized`.

### API Client

Located in `src/api.js`, provides functions for all backend interactions:

```javascript
// GET /api/polls
getPolls()

// POST /api/polls
createPoll(payload, user)

// POST /api/polls/{pollId}/vote
castVote(pollId, candidateId, user)

// POST /api/login
login(payload)

// POST /api/register
register(payload)
```

---

## Backend

### Tech Stack

- **FastAPI** (Async web framework)
- **SQLAlchemy 2.0** (ORM with async support)
- **PostgreSQL** (Database)
- **Alembic** (Migrations)
- **Passlib/Bcrypt** (Password hashing)

### Application Structure

```python
# main.py - API entry point
app = FastAPI(title="Voter App API")

# Routes registered with decorators
@app.get("/polls")
@app.post("/polls")
@app.post("/polls/{poll_id}/vote")
@app.post("/register")
@app.post("/login")

# Database dependency
async def get_db() -> AsyncSession:
    async with async_session() as session:
        yield session
```

### Authentication

- Uses Bearer token authentication (`Authorization: Bearer <user_id>`)
- No JWT - user ID is used directly as the token
- `get_current_user` dependency validates and returns user

### Business Logic

**Poll Creation Flow:**
1. Validate user authentication
2. Create poll with candidates
3. Commit to database
4. Return created poll with candidates loaded

**Voting Flow:**
1. Verify user hasn't already voted (UniqueConstraint check)
2. Increment candidate vote count
3. Record vote in votes table
4. Return updated poll with results

---

## API Endpoints

| Method | Endpoint | Auth | Request Body | Response |
|--------|----------|------|--------------|----------|
| GET | `/polls` | No | - | `PollSchema[]` |
| GET | `/polls/{id}` | No | - | `PollSchema` |
| POST | `/polls` | Yes | `CreatePollRequest` | `PollSchema` |
| POST | `/polls/{id}/vote` | Yes | `VoteRequest` | `PollSchema` |
| POST | `/login` | No | `LoginRequest` | `UserResponse` |
| POST | `/register` | No | `RegisterRequest` | `UserResponse` |
| GET | `/health` | No | - | `{"status": "ok"}` |

### Schemas

```typescript
// Poll
interface PollSchema {
  id: UUID
  title: string (1-120 chars)
  description: string (1-240 chars)
  candidates: CandidateSchema[]
}

// Candidate
interface CandidateSchema {
  id: UUID
  name: string (1-80 chars)
  party: string (1-80 chars)
  slogan: string (1-160 chars)
  votes: number
}

// Request/Response bodies
interface CreatePollRequest {
  title: string
  description: string
  candidates: CreateCandidateRequest[] (min 2)
}

interface CreateCandidateRequest {
  name: string
  party: string
  slogan: string
}

interface VoteRequest {
  candidate_id: UUID
}

interface LoginRequest {
  username: string
  password: string
}

interface RegisterRequest extends LoginRequest {
  name: string
}

interface UserResponse {
  id: string (UUID)
  username: string
  name: string
  role: string
}
```

### Request/Response Examples

**Login Request:**
```json
POST /login
{ "username": "admin", "password": "any" }
```

**Login Response:**
```json
{ "id": "uuid-string", "username": "admin", "name": "Admin", "role": "voter" }
```

**Create Poll Request:**
```json
POST /polls (with Bearer token)
{
  "title": "Project Vote",
  "description": "Choose Q3 project",
  "candidates": [
    { "name": "Garden", "party": "Team A", "slogan": "Green spaces" },
    { "name": "Library", "party": "Team B", "slogan": "Knowledge first" }
  ]
}
```

**Vote Request:**
```json
POST /polls/{pollId}/vote (with Bearer token)
{ "candidate_id": "candidate-uuid" }
```

---

## Database Migrations

Migrations are in `backend/alembic/versions/` and root directory:

| File | Description |
|------|-------------|
| `000000000000_initial_migration.py` | Creates `users` and `polls` tables |
| `000000000001_add_votes_table.py` | Creates `votes` table |
| `alembic/versions/e3b55b29d53f_initial_migration.py` | Complete initial schema with all tables |

---

## Database Schema

```sql
-- Users table
users
├── id (UUID, PK)
├── username (unique, required)
├── name (required)
├── hashed_password (required)
└── role (default: "voter")

-- Polls table
polls
├── id (UUID, PK)
├── title (required)
├── description (required)
└── created_at (timestamp)

-- Candidates table
candidates
├── id (UUID, PK)
├── name (required)
├── party (required)
├── slogan (required)
├── votes (default: 0)
└── poll_id (FK to polls)

-- Votes table (many-to-many with constraint)
votes
├── id (UUID, PK)
├── user_id (FK to users)
├── poll_id (FK to polls)
├── candidate_id (FK to candidates)
└── created_at (timestamp)
-- Unique: (user_id, poll_id)
```

---

## Security Notes

- Passwords are hashed with bcrypt via Passlib
- Bearer token authentication uses user UUID directly (not JWT)
- CORS restricted to localhost:5173
- Each user can vote only once per poll (enforced at DB level)

---

## Development Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL database

### Backend Setup

```bash
cd backend
python -m venv .venv
./.venv/Scripts/activate  # Windows
# or: source .venv/bin/activate  # Unix
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Set environment variable:
```bash
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost/voterapp
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend proxies `/api` to the backend at `http://localhost:8000` (configured in `vite.config.js`).

Create `.env` for custom API URL (optional):
```bash
VITE_API_URL=http://localhost:8000
```

### Database Migration

```bash
cd backend
alembic upgrade head
```

Initial migration creates tables: `polls`, `users`, `candidates`, `votes`.

### Default Credentials

Register a new account or use existing credentials. Each user receives a UUID used as the Bearer token for authenticated requests.