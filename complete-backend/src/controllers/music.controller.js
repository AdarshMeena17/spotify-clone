const Album = require('../models/album.model');
const Music = require('../models/music.model');
const { uploadMedia, deleteMedia } = require('../services/storage.service');

async function uploadMusic(req, res) {
  try {
    if (req.user.role !== 'artist') {
      return res.status(403).json({ message: 'Only artists can upload music' });
    }

    const { title, audioUrl, coverImage, duration } = req.body;
    const audioFile = req.files?.audio?.[0];
    const coverFile = req.files?.coverImage?.[0];
    if (!title || (!audioFile && !audioUrl)) {
      return res.status(400).json({ message: 'Title and audio URL are required' });
    }

    const uploadedAudio = audioFile ? await uploadMedia(audioFile, '/spotify-clone/music') : null;
    const uploadedCover = coverFile ? await uploadMedia(coverFile, '/spotify-clone/covers') : null;
    const music = await Music.create({
      title,
      artist: req.user.userId,
      audioUrl: uploadedAudio?.url || audioUrl,
      audioFileId: uploadedAudio?.fileId,
      coverImage: uploadedCover?.url || coverImage,
      coverFileId: uploadedCover?.fileId,
      duration
    });

    return res.status(201).json({ message: 'Music uploaded successfully', music });
  } catch (error) {
    return res.status(500).json({ message: 'Music upload failed', error: error.message });
  }
}

async function getAllMusic(req, res) {
  try {
    const music = await Music.find()
      .populate('artist', 'username email')
      .sort({ createdAt: -1 });
    return res.json({ music });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getMusic(req, res) {
  try {
    const music = await Music.findById(req.params.id).populate('artist', 'username');
    if (!music) {
      return res.status(404).json({ message: 'Music not found' });
    }
    return res.json({ music });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteMusic(req, res) {
  try {
    if (req.user.role !== 'artist') {
      return res.status(403).json({ message: 'Only artists can delete music' });
    }

    const music = await Music.findById(req.params.id);
    if (!music) {
      return res.status(404).json({ message: 'Music not found' });
    }

    if (music.artist.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'You cannot delete this song' });
    }

    await music.deleteOne();
    await Promise.allSettled([
      deleteMedia(music.audioFileId),
      deleteMedia(music.coverFileId)
    ]);
    return res.json({ message: 'Music deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createAlbum(req, res) {
  try {
    if (req.user.role !== 'artist') {
      return res.status(403).json({ message: 'Only artists can create albums' });
    }

    const { title, coverImage } = req.body;
    const uploadedCover = req.file ? await uploadMedia(req.file, '/spotify-clone/albums') : null;
    const album = await Album.create({
      title,
      artist: req.user.userId,
      coverImage: uploadedCover?.url || coverImage,
      coverFileId: uploadedCover?.fileId,
      songs: []
    });

    return res.status(201).json({ message: 'Album created successfully', album });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getAllAlbums(req, res) {
  try {
    const albums = await Album.find()
      .populate('artist', 'username')
      .populate('songs');
    return res.json({ albums });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function addSongToAlbum(req, res) {
  try {
    if (req.user.role !== 'artist') {
      return res.status(403).json({ message: 'Only artists can modify albums' });
    }

    const album = await Album.findById(req.params.albumId);
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    if (album.artist.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'You cannot modify this album' });
    }

    const song = await Music.findById(req.params.songId);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    if (!album.songs.includes(song._id)) {
      album.songs.push(song._id);
      await album.save();
    }

    return res.json({ message: 'Song added to album', album });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  uploadMusic,
  getAllMusic,
  getMusic,
  deleteMusic,
  createAlbum,
  getAllAlbums,
  addSongToAlbum
};
