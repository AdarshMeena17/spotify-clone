const express = require('express');
const musicController = require('../controllers/music.controller');
const requireAuth = require('../middlewares/auth.middleware');
const { upload } = require('../services/storage.service');

const router = express.Router();

router.post('/api/music/upload', requireAuth, upload.fields([
	{ name: 'audio', maxCount: 1 },
	{ name: 'coverImage', maxCount: 1 }
]), musicController.uploadMusic);
router.get('/api/music', musicController.getAllMusic);
router.get('/api/music/:id', musicController.getMusic);
router.delete('/api/music/:id', requireAuth, musicController.deleteMusic);
router.post('/api/albums', requireAuth, upload.single('coverImage'), musicController.createAlbum);
router.get('/api/albums', musicController.getAllAlbums);
router.post('/api/albums/:albumId/songs/:songId', requireAuth, musicController.addSongToAlbum);

module.exports = router;
