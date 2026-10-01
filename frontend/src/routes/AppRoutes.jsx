import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute, ArtistRoute, GuestOnlyRoute } from '../components/auth/RouteGuards';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Search from '../pages/Search';
import Albums from '../pages/Albums';
import AlbumDetails from '../pages/AlbumDetails';
import Profile from '../pages/Profile';
import ArtistDashboard from '../pages/ArtistDashboard';
import UploadMusic from '../pages/UploadMusic';
import CreateAlbum from '../pages/CreateAlbum';
import NotFound from '../pages/NotFound';
import VerifyOtp from '../pages/VerifyOtp';
export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestOnlyRoute>
            <Login />
          </GuestOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestOnlyRoute>
            <Register />
          </GuestOnlyRoute>
        }
      />

      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/album/:id" element={<AlbumDetails />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
         
      <Route
        path="/verify-otp"
        element={
          <GuestOnlyRoute>
            <VerifyOtp />
          </GuestOnlyRoute>
        }
      />

        <Route
          path="/dashboard"
          element={
            <ArtistRoute>
              <ArtistDashboard />
            </ArtistRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ArtistRoute>
              <UploadMusic />
            </ArtistRoute>
          }
        />
        <Route
          path="/create-album"
          element={
            <ArtistRoute>
              <CreateAlbum />
            </ArtistRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
