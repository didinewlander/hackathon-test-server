const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const axios = require('axios');
const WebSocket = require("ws");

let wss;

const setupWebSocket = (server) => {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected for real-time streaming");

    axios({
      url: 'http://localhost:5000/video_feed',
      responseType: 'stream',
    }).then(response => {
      response.data.on('data', chunk => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(chunk);
        }
      });

      response.data.on('end', () => {
        console.log('Streaming ended');
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      });

      ws.on('close', () => {
        console.log('Client disconnected from real-time streaming');
      });
    }).catch(error => {
      console.error('Error fetching video stream:', error.message);
      ws.close();
    });
  });
};

const streamMedia = (req, res) => {
  const filePath = path.join(__dirname, "../media/sample.mp4");
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res
        .status(416)
        .send("Requested range not satisfiable\n" + start + " >= " + fileSize);
      return;
    }

    const chunksize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
};

const streamRealTimeMedia = (req, res) => {
  res.send("Use WebSocket connection for real-time streaming.");
};

module.exports = {
  setupWebSocket,
  streamMedia,
  streamRealTimeMedia,
};
