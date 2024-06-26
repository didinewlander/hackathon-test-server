// src/routes/fileRoutes.js
const express = require('express');
const multer = require('multer');
const { uploadFile, downloadFile } = require('../controllers/fileController');

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: Upload a file
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         description: The file to upload
 *       - in: formData
 *         name: fileName
 *         type: string
 *         description: The original file name
 *     responses:
 *       200:
 *         description: File uploaded successfully
 */
router.post('/upload', upload.single('file'), uploadFile);

/**
 * @swagger
 * /api/files/download/{filename}:
 *   get:
 *     summary: Download a file
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the file to download
 *     responses:
 *       200:
 *         description: File downloaded successfully
 */
router.get('/download/:filename', downloadFile);

module.exports = router;
