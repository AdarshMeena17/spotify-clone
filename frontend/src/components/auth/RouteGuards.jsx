import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FullscreenLoader } from '../common/Loader';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  if (initializing) return <FullscreenLoader />;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

export function ArtistRoute({ children }) {
  const { isAuthenticated, isArtist, initializing } = useAuth();
  const location = useLocation();

  if (initializing) return <FullscreenLoader />;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (!isArtist) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export function GuestOnlyRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  if (initializing) return <FullscreenLoader />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}
