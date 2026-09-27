import { SongCard } from './SongCard';

export function SongGrid({ songs, canDelete = false, onDeleteRequest }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {songs.map((song) => (
        <SongCard
          key={song._id}
          song={song}
          queue={songs}
          canDelete={canDelete}
          onDeleteRequest={onDeleteRequest}
        />
      ))}
    </div>
  );
}
