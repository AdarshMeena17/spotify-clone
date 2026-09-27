# Spotify Clone - Frontend

A React + Vite + Tailwind frontend for the Spotify Clone backend in `complete-backend/`. For full project setup, see the [root README](../README.md).

## Stack

- React 18 + Vite
- React Router 6
- Tailwind CSS
- Axios (cookie-based auth via `withCredentials: true`)
- lucide-react icons

## Setup

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` (the backend's CORS config only allows this origin).

Make sure the backend is running first:

```bash
cd complete-backend
npm install
npm run dev
```

The backend needs `MONGO_URI` and `JWT_SECRET` to start and authenticate users. ImageKit credentials are required for media uploads. See `complete-backend/.env.example` for the full list.

## Environment variables

`frontend/.env`:

```
VITE_API_URL=http://localhost:3000
```

This is the only value the frontend needs. No secrets, keys, or backend credentials belong here.

## Notes on the backend contract

- Auth is a JWT stored in an **HTTP-only cookie** named `token`. The frontend never reads or stores it directly — the browser handles it automatically because every request sets `withCredentials: true`.
- Registration offers listener and artist account types.
- Music upload (`POST /api/music/upload`) and album creation (`POST /api/albums`) use `multipart/form-data` with the exact field names the backend expects: `title`, `audio`, `coverImage`.
- There is no `GET /api/albums/:id` endpoint. The Album Details page fetches the full album list (`GET /api/albums`, which already includes populated songs) and finds the matching album client-side.
- There are no backend APIs for likes, playlists, following, comments, listening history, or search. Search is implemented entirely client-side by filtering the already-fetched songs and albums. Recently played is kept in memory only (React state), not persisted.

## Project structure

```
frontend/src/
├── components/
│   ├── common/      Loader, EmptyState, ErrorState, ConfirmModal, CoverImage
│   ├── layout/       Sidebar, TopBar, MobileNav, AppLayout, AuthLayout
│   ├── music/        SongCard, SongRow, SongGrid, SearchBar
│   ├── albums/       AlbumCard, AlbumGrid
│   ├── player/       MusicPlayer, PlayerControls, ProgressBar
│   ├── artist/       UploadMusicForm, CreateAlbumForm, AddSongToAlbumForm
│   └── auth/         Route guards (ProtectedRoute, ArtistRoute, GuestOnlyRoute)
├── context/          AuthContext, PlayerContext, ToastContext
├── pages/            Home, Login, Register, Search, Albums, AlbumDetails,
│                     Profile, ArtistDashboard, UploadMusic, CreateAlbum, NotFound
├── routes/           AppRoutes.jsx
└── services/         api.js — the only file that talks to the backend
```

## Testing checklist

- [ ] Register a new account, then log in
- [ ] `GET /api/auth/me` hydrates the session on refresh
- [ ] Log out clears the session
- [ ] Home/Search/Albums load real data and show empty states when the database is empty
- [ ] As an artist account (set `role: "artist"` directly in MongoDB): upload a song, create an album, add the song to the album, delete a song
- [ ] As a normal user: confirm artist-only routes (`/dashboard`, `/upload`, `/create-album`) redirect away
- [ ] Player: play, pause, next, previous, seek, volume, and auto-advance on track end
