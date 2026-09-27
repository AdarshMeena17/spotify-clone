import { useState } from 'react';
import { Volume2, Volume1, VolumeX, ChevronDown, ChevronUp } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { CoverImage } from '../common/CoverImage';
import { PlayerControls } from './PlayerControls';
import { ProgressBar } from './ProgressBar';

function VolumeIcon({ volume, isMuted }) {
  if (isMuted || volume === 0) return <VolumeX className="h-4 w-4" />;
  if (volume < 0.5) return <Volume1 className="h-4 w-4" />;
  return <Volume2 className="h-4 w-4" />;
}

export function MusicPlayer() {
  const player = usePlayer();
  const [expanded, setExpanded] = useState(false);
  const { currentTrack } = player;

  if (!currentTrack) return null;

  const artistName =
    typeof currentTrack.artist === 'object' ? currentTrack.artist?.username : 'Unknown artist';

  return (
    <>
      {/* Desktop / tablet bar */}
      <div className="fixed inset-x-0 bottom-16 z-40 hidden h-20 items-center border-t border-base-border bg-base-raised px-4 shadow-player sm:flex lg:bottom-0">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <CoverImage
            src={currentTrack.coverImage}
            alt={currentTrack.title}
            seed={currentTrack._id}
            className="h-14 w-14 shrink-0 rounded-md object-cover"
            iconClassName="h-5 w-5"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{currentTrack.title}</p>
            <p className="truncate text-xs text-ink-faint">{artistName}</p>
          </div>
        </div>

        <div className="flex flex-[2] flex-col items-center gap-2">
          <PlayerControls
            isPlaying={player.isPlaying}
            isLoading={player.isLoading}
            hasNext={player.hasNext}
            hasPrevious={player.hasPrevious}
            onPlayPause={player.togglePlayPause}
            onNext={player.playNext}
            onPrevious={player.playPrevious}
          />
          <ProgressBar
            currentTime={player.currentTime}
            duration={player.duration}
            onSeek={player.seek}
          />
        </div>

        <div className="hidden flex-1 items-center justify-end gap-2 md:flex">
          <button
            onClick={player.toggleMute}
            aria-label={player.isMuted ? 'Unmute' : 'Mute'}
            className="text-ink-dim hover:text-ink"
          >
            <VolumeIcon volume={player.volume} isMuted={player.isMuted} />
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={player.isMuted ? 0 : player.volume}
            onChange={(e) => player.setVolume(Number(e.target.value))}
            aria-label="Volume"
            className="h-1 w-24 cursor-pointer accent-moss"
          />
        </div>
      </div>

      {/* Mobile compact bar */}
      <button
        onClick={() => setExpanded(true)}
        className="fixed inset-x-0 bottom-16 z-40 flex h-16 items-center gap-3 border-t border-base-border bg-base-raised px-3 text-left sm:hidden"
        aria-label="Expand player"
      >
        <CoverImage
          src={currentTrack.coverImage}
          alt={currentTrack.title}
          seed={currentTrack._id}
          className="h-11 w-11 shrink-0 rounded object-cover"
          iconClassName="h-4 w-4"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{currentTrack.title}</p>
          <p className="truncate text-xs text-ink-faint">{artistName}</p>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            player.togglePlayPause();
          }}
        >
          <PlayerControls
            isPlaying={player.isPlaying}
            isLoading={player.isLoading}
            hasNext={player.hasNext}
            hasPrevious={player.hasPrevious}
            onPlayPause={player.togglePlayPause}
            onNext={player.playNext}
            onPrevious={player.playPrevious}
          />
        </div>
        <ChevronUp className="h-4 w-4 text-ink-faint" />
      </button>

      {/* Mobile full-screen expanded player */}
      {expanded && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-base p-6 animate-slide-up sm:hidden">
          <button
            onClick={() => setExpanded(false)}
            aria-label="Collapse player"
            className="self-end text-ink-dim"
          >
            <ChevronDown className="h-6 w-6" />
          </button>

          <div className="flex flex-1 flex-col items-center justify-center gap-8">
            <CoverImage
              src={currentTrack.coverImage}
              alt={currentTrack.title}
              seed={currentTrack._id}
              className="aspect-square w-full max-w-xs rounded-xl2 object-cover shadow-lift"
              iconClassName="h-12 w-12"
            />
            <div className="w-full max-w-xs text-center">
              <h2 className="truncate text-xl font-semibold text-ink">{currentTrack.title}</h2>
              <p className="mt-1 truncate text-sm text-ink-faint">{artistName}</p>
            </div>

            <div className="w-full max-w-xs">
              <ProgressBar
                currentTime={player.currentTime}
                duration={player.duration}
                onSeek={player.seek}
              />
            </div>

            <PlayerControls
              isPlaying={player.isPlaying}
              isLoading={player.isLoading}
              hasNext={player.hasNext}
              hasPrevious={player.hasPrevious}
              onPlayPause={player.togglePlayPause}
              onNext={player.playNext}
              onPrevious={player.playPrevious}
              size="large"
            />

            <div className="flex w-full max-w-xs items-center gap-2">
              <VolumeIcon volume={player.volume} isMuted={player.isMuted} />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={player.isMuted ? 0 : player.volume}
                onChange={(e) => player.setVolume(Number(e.target.value))}
                aria-label="Volume"
                className="h-1 flex-1 cursor-pointer accent-moss"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
