import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import { ToastProvider } from './context/ToastContext';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <PlayerProvider>
            <AppRoutes />
          </PlayerProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
