// src/routes/messageRouts.js
const express = require('express');
const { sendMessage } = require('../controllers/messageController');

const router = express.Router();

/**
 * @swagger
 * /api/messages/send:
 *   post:
 *     summary: Send a message
 *     responses:
 *       200:
 *         description: Message sent successfully
 */
router.post('/send', sendMessage);

module.exports = router;
