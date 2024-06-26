const express = require('express');
const { streamMedia, streamRealTimeMedia } = require('../controllers/mediaController');

const router = express.Router();

/**
 * @swagger
 * /api/media/stream:
 *   get:
 *     summary: Stream media
 *     responses:
 *       200:
 *         description: Media streamed successfully
 */
router.get('/stream', streamMedia);

/**
 * @swagger
 * /api/media/stream-realtime:
 *   get:
 *     summary: Stream real-time media
 *     responses:
 *       200:
 *         description: Real-time media streamed successfully
 */
router.get('/stream-realtime', streamRealTimeMedia);

module.exports = router;
