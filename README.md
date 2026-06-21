# Voter App

Simple full-stack voter app with a FastAPI backend and a Vue 3 frontend using Tailwind CSS v4 and PrimeVue v4.

See [DOCS.md](DOCS.md) for comprehensive documentation.

## Project Structure

```text
backend/   FastAPI API for polls and voting
frontend/  Vue 3 + Vite + Tailwind CSS v4 + PrimeVue v4
```

## Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

To point the frontend at a different API URL, create `frontend/.env`:

```text
VITE_API_URL=http://localhost:8000
```
