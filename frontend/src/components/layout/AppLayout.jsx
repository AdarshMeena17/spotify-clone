import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { MusicPlayer } from '../player/MusicPlayer';
import { usePlayer } from '../../context/PlayerContext';

export function AppLayout() {
  const { currentTrack } = usePlayer();

  return (
    <div className="flex h-screen overflow-hidden bg-base">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main
          className={`flex-1 overflow-y-auto px-4 pb-24 pt-6 sm:px-6 lg:px-8 ${
            currentTrack ? 'lg:pb-28' : 'lg:pb-8'
          }`}
        >
          <div className="mx-auto w-full max-w-6xl animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
      <MusicPlayer />
      <MobileNav />
    </div>
  );
}
