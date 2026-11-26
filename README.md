# movie-crud AI

A Day 1 MERN implementation: MongoDB persistence, Express REST API, React dashboard, movie CRUD, search, genre filter, rating filter, and Top Pick highlighting.

## Requirements
- Node.js 18+
- MongoDB local instance or MongoDB Atlas connection string

## 1. Configure the backend

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and set `MONGODB_URI`. Keep secrets in this file; never commit it.

## 2. Install and run the backend

```bash
cd server
npm install
npm run dev
```

API runs at `http://localhost:5000`. Health check: `http://localhost:5000/api/health`.

## 3. Install and run the frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## API routes
| Method | Route | Purpose |
|---|---|---|
| GET | `/api/health` | API health check |
| GET | `/api/movies` | List movies; supports `q`, `genre`, `rating`, `sort` query parameters |
| GET | `/api/movies/:id` | Get one movie |
| POST | `/api/movies` | Create movie |
| PUT | `/api/movies/:id` | Update movie |
| DELETE | `/api/movies/:id` | Delete movie |

Example movie body:

```json
{
  "title": "Interstellar",
  "genre": "Sci-Fi",
  "rating": 5
}
```

## Notes
- MongoDB generates the unique `_id` automatically.
- Title and genre are required. Rating must be a number from 1 to 5.
- Movies rated 5 are marked as **TOP PICK** in the interface.
- If the API cannot connect, check that MongoDB is running and `MONGODB_URI` is correct.
