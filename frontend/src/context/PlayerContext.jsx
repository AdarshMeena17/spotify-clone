import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const PlayerContext = createContext(null);

const VOLUME_KEY = 'wavelength:volume';

export function PlayerProvider({ children }) {
  // A single <audio> element lives for the lifetime of the app so
  // playback survives route changes instead of being recreated per card.
  const audioRef = useRef(null);
  if (!audioRef.current && typeof window !== 'undefined') {
    audioRef.current = new Audio();
    audioRef.current.preload = 'metadata';
  }

  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolumeState] = useState(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(VOLUME_KEY) : null;
    const parsed = stored ? Number(stored) : 0.85;
    return Number.isFinite(parsed) ? parsed : 0.85;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]); // frontend-only, not persisted server-side

  const currentTrack = currentIndex >= 0 ? queue[currentIndex] : null;

  // Apply volume/mute to the audio element whenever they change.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const playIndex = useCallback(
    (index, list) => {
      const source = list || queue;
      const track = source[index];
      if (!track) return;
      const audio = audioRef.current;
      if (list) setQueue(list);
      setCurrentIndex(index);
      setIsLoading(true);
      audio.src = track.audioUrl;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
      setRecentlyPlayed((prev) => {
        const withoutDupe = prev.filter((t) => t._id !== track._id);
        return [track, ...withoutDupe].slice(0, 12);
      });
    },
    [queue]
  );

  // Start playing a track, replacing the queue with the given list
  // (defaults to just that one track).
  const playTrack = useCallback(
    (track, list) => {
      const effectiveList = list && list.length ? list : [track];
      const index = effectiveList.findIndex((t) => t._id === track._id);
      playIndex(index === -1 ? 0 : index, effectiveList);
    },
    [playIndex]
  );

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying, currentTrack]);

  const playNext = useCallback(() => {
    if (currentIndex < queue.length - 1) {
      playIndex(currentIndex + 1);
    } else {
      setIsPlaying(false);
    }
  }, [currentIndex, queue, playIndex]);

  const playPrevious = useCallback(() => {
    const audio = audioRef.current;
    // Standard UX: if more than 3s into the track, restart it instead
    // of skipping to the previous track.
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    if (currentIndex > 0) {
      playIndex(currentIndex - 1);
    }
  }, [currentIndex, playIndex]);

  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((value) => {
    setVolumeState(value);
    setIsMuted(false);
    if (typeof window !== 'undefined') localStorage.setItem(VOLUME_KEY, String(value));
  }, []);

  const toggleMute = useCallback(() => setIsMuted((m) => !m), []);

  // Removes a track from state if it was just deleted by its owning
  // artist, gracefully stopping playback if it was the active track.
  const removeTrackFromPlayer = useCallback(
    (musicId) => {
      setQueue((prev) => {
        const wasCurrent = currentTrack?._id === musicId;
        const next = prev.filter((t) => t._id !== musicId);
        if (wasCurrent) {
          audioRef.current?.pause();
          setIsPlaying(false);
          setCurrentIndex(-1);
          setCurrentTime(0);
        }
        return next;
      });
    },
    [currentTrack]
  );

  // Wire up native audio events once.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
    };
    const onEnded = () => playNext();
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => setIsLoading(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
    };
  }, [playNext]);

  const value = useMemo(
    () => ({
      queue,
      currentTrack,
      currentIndex,
      isPlaying,
      isLoading,
      currentTime,
      duration,
      volume,
      isMuted,
      recentlyPlayed,
      playTrack,
      togglePlayPause,
      playNext,
      playPrevious,
      seek,
      setVolume,
      toggleMute,
      removeTrackFromPlayer,
      hasNext: currentIndex < queue.length - 1,
      hasPrevious: currentIndex > 0,
    }),
    [
      queue,
      currentTrack,
      currentIndex,
      isPlaying,
      isLoading,
      currentTime,
      duration,
      volume,
      isMuted,
      recentlyPlayed,
      playTrack,
      togglePlayPause,
      playNext,
      playPrevious,
      seek,
      setVolume,
      toggleMute,
      removeTrackFromPlayer,
    ]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within a PlayerProvider');
  return ctx;
}
