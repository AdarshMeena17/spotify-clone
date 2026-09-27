import axios from 'axios';

// Central axios instance. The backend authenticates via an HTTP-only
// cookie named "token", so every request must carry credentials — never
// read or store the token in JS.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
});

// Normalizes backend error responses into a plain, human-readable message.
// The backend's controllers return { message } (and sometimes { error })
// on failure, so prefer that over a generic fallback.
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error?.response) {
    const { status, data } = error.response;
    if (data?.message) return data.message;
    if (status === 401) return 'Please login first.';
    if (status === 403) return "You don't have permission to perform this action.";
    if (status === 404) return 'Not found.';
    if (status >= 500) return 'Something went wrong. Please try again.';
  }
  if (error?.request) return 'Network error. Check your connection and try again.';
  return fallback;
}

/* ---------------------------- Auth endpoints ---------------------------- */
// POST /api/auth/register  { username, email, password }
export const registerUser = (payload) => api.post('/api/auth/register', payload).then((r) => r.data);

// POST /api/auth/login  { email, password }
export const loginUser = (payload) => api.post('/api/auth/login', payload).then((r) => r.data);

// POST /api/auth/logout
export const logoutUser = () => api.post('/api/auth/logout').then((r) => r.data);

// GET /api/auth/me  (requires auth cookie)
export const getCurrentUser = () => api.get('/api/auth/me').then((r) => r.data);

/* --------------------------- Music endpoints ---------------------------- */
// GET /api/music -> { music: [...] }
export const getMusic = () => api.get('/api/music').then((r) => r.data);

// GET /api/music/:id -> { music }
export const getMusicById = (id) => api.get(`/api/music/${id}`).then((r) => r.data);

// POST /api/music/upload (multipart/form-data) - artist only
// Required field names, exactly as the backend expects them: title, audio, coverImage
export const uploadMusic = ({ title, audioFile, coverImageFile }, onUploadProgress) => {
  const formData = new FormData();
  formData.append('title', title);
  if (audioFile) formData.append('audio', audioFile);
  if (coverImageFile) formData.append('coverImage', coverImageFile);
  return api
    .post('/api/music/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    })
    .then((r) => r.data);
};

// DELETE /api/music/:id - artist owner only
export const deleteMusic = (id) => api.delete(`/api/music/${id}`).then((r) => r.data);

/* --------------------------- Album endpoints ----------------------------- */
// GET /api/albums -> { albums: [...] } (songs populated)
export const getAlbums = () => api.get('/api/albums').then((r) => r.data);

// POST /api/albums (multipart/form-data) - artist only. Fields: title, coverImage
export const createAlbum = ({ title, coverImageFile }, onUploadProgress) => {
  const formData = new FormData();
  formData.append('title', title);
  if (coverImageFile) formData.append('coverImage', coverImageFile);
  return api
    .post('/api/albums', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    })
    .then((r) => r.data);
};

// POST /api/albums/:albumId/songs/:songId - artist owner only
export const addSongToAlbum = (albumId, songId) =>
  api.post(`/api/albums/${albumId}/songs/${songId}`).then((r) => r.data);

export default api;
