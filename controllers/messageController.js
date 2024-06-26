const WebSocket = require('ws');

let wss;

const setupWebSocket = (server) => {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      console.log('received: %s', message);
      // Simulate processing time before broadcasting the message
      simulateProcessing(message, ws);
    });

    ws.send(JSON.stringify({ type: 'info', message: 'Welcome to the WebSocket server!' }));
  });
};

const simulateProcessing = (message, ws) => {
  const processingTime = Math.floor(Math.random() * 10000) + 1000; // Random delay between 1 to 10 seconds
  setTimeout(() => {
    const data = JSON.stringify({ type: 'message', text: `Processed: ${message}` });
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  }, processingTime);
};

const sendMessage = (req, res) => {
  const { message } = req.body;
  broadcastMessage(message);
  res.status(200).json({ message: 'Message sent to all clients' });
};

module.exports = {
  setupWebSocket,
  sendMessage,
};
