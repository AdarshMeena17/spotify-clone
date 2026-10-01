import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Central axios instance. Auth model:
//  - Access token: held ONLY in this module's memory (never localStorage /
//    sessionStorage / JS-set cookies). Sent as `Authorization: Bearer`.
//  - Refresh token: HTTP-only cookie named "refreshToken". JS can't read it;
//    the browser sends it because every request uses credentials.
const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Bare client for /refresh. It has no interceptors, so a failing refresh
// can never trigger another refresh.
const refreshClient = axios.create({ baseURL, withCredentials: true });

/* ------------------------- In-memory token state ------------------------- */
let accessToken = null;
let refreshPromise = null; // single-flight lock shared by all failed requests
let authFailureHandler = null;

export const setAccessToken = (token) => {
  accessToken = token || null;
};

// AuthContext registers a callback so it can clear `user` when the session dies.
export const setAuthFailureHandler = (fn) => {
  authFailureHandler = fn;
};

// Endpoints that must never get a Bearer header or trigger a refresh
// (a 401 from /login just means "wrong password").
const NO_REFRESH_PATHS = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/verify-otp',
  '/api/auth/refresh',
];
const isNoRefreshPath = (url = '') => NO_REFRESH_PATHS.some((p) => url.includes(p));

// Every caller awaits the same promise, so concurrent 401s cause exactly one
// POST /api/auth/refresh.
export function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post('/api/auth/refresh')
      .then(({ data }) => {
        if (!data?.accessToken) throw new Error('Refresh response did not include an access token.');
        accessToken = data.accessToken;
        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

function clearSession() {
  accessToken = null;
  if (authFailureHandler) authFailureHandler();
}

// The server rejected the refresh token itself (4xx), as opposed to a
// network blip or a 5xx. Only then do we end the session.
const isSessionInvalid = (err) => !!err?.response && err.response.status < 500;

/* ------------------------------ Interceptors ----------------------------- */
api.interceptors.request.use((config) => {
  if (accessToken && !isNoRefreshPath(config.url)) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Only handle 401s, never retry twice, never refresh for auth endpoints.
    if (error.response?.status !== 401 || !original || original._retry || isNoRefreshPath(original.url)) {
      return Promise.reject(error);
    }
    original._retry = true;

    // If another request already refreshed after this one was sent, just
    // retry with the current token instead of refreshing again.
    const sent = original.headers?.Authorization;
    const alreadyRefreshed = accessToken && sent && sent !== `Bearer ${accessToken}`;

    try {
      if (!alreadyRefreshed) await refreshAccessToken();
    } catch (refreshError) {
      if (isSessionInvalid(refreshError)) {
        clearSession();
        return Promise.reject(error); // original 401, so existing UI messages still apply
      }
      return Promise.reject(refreshError); // network/5xx: surface it, keep the session
    }

    return api(original); // request interceptor attaches the new token
  }
);

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
// POST /api/auth/register  { username, email, password, role }
export const registerUser = (payload) => api.post('/api/auth/register', payload).then((r) => r.data);

// POST /api/auth/verify-otp  { email, otp }
export const verifyOtp = (payload) => api.post('/api/auth/verify-otp', payload).then((r) => r.data);

// POST /api/auth/login  { email, password }
export const loginUser = (payload) => api.post('/api/auth/login', payload).then((r) => r.data);

// POST /api/auth/logout
export const logoutUser = () => api.post('/api/auth/logout').then((r) => r.data);

// GET /api/auth/me  (requires access token)
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