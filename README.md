# Spotify Clone

A full-stack music streaming application with a React frontend and an Express/MongoDB API. Users can register as listeners or artists, browse music and albums, and artists can upload and organize tracks.

## Tech Stack

- Frontend: React, Vite, React Router, Tailwind CSS, Axios
- Backend: Node.js, Express, MongoDB with Mongoose
- Media uploads: ImageKit
- Authentication: JWT stored in an HTTP-only cookie

## Requirements

- Node.js 20.19 or newer and npm
- MongoDB, either local or hosted
- ImageKit account credentials for media uploads

## Setup

Open two terminals from the project root. Install and start the backend first:

```sh
cd complete-backend
npm install
```

Copy `complete-backend/.env.example` to `complete-backend/.env`, fill in the required values, then run:

```sh
npm run dev
```

In the other terminal, install and start the frontend:

```sh
cd frontend
npm install
```

Copy `frontend/.env.example` to `frontend/.env` if you need to change the API URL. Then run:

```sh
npm run dev
```

Open <http://localhost:5173>. The API listens on <http://localhost:3000> by default.

## Environment Variables

Backend (`complete-backend/.env`):

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | API port; defaults to `3000`. |
| `MONGO_URI` | Yes | MongoDB connection string. |
| `JWT_SECRET` | Yes | Long, random secret used to sign login tokens. |
| `IMAGEKIT_PUBLIC_KEY` | For uploads | ImageKit public key. |
| `IMAGEKIT_PRIVATE_KEY` | For uploads | ImageKit private key. Keep this secret. |
| `IMAGEKIT_URL_ENDPOINT` | For uploads | ImageKit URL endpoint. |

Frontend (`frontend/.env`):

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_URL` | No | Backend base URL; defaults to `http://localhost:3000`. |

Never commit `.env` files or real credentials. The `.env.example` files contain placeholders only.

## Available Scripts

In `complete-backend/`:

- `npm run dev` starts the API with nodemon.
- `npm start` starts the API with Node.js.

In `frontend/`:

- `npm run dev` starts the Vite development server.
- `npm run build` creates the production frontend build in `dist/`.
- `npm run preview` serves the production build locally.
- `npm run lint` runs ESLint.

## API Overview

- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `GET /api/music`, `GET /api/music/:id`, `POST /api/music/upload`, `DELETE /api/music/:id`
- `GET /api/albums`, `POST /api/albums`, `POST /api/albums/:albumId/songs/:songId`

Authentication uses an HTTP-only cookie. Upload and artist-management endpoints require authentication and artist permissions where applicable.