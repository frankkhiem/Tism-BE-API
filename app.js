const express = require('express');
const { createServer } = require("http");
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

const db = require('./helpers/db');
const router = require('./routes');
const { createSocketServer } = require('./helpers/socketServer');
const { createPeerServer } = require('./helpers/peerServer');

const app = express();
const httpServer = createServer(app);
const port = 3000;

// Setup socket.io server
global.io = createSocketServer({ httpServer });

// Setup peerjs server
createPeerServer();

// Config .env
dotenv.config();

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Connect MongoDB server
db.connect();

// Use body-parser
app.use(express.json()); // for parsing application/json

// Enable All CORS Requests
app.use(cors()); 

// Use router
app.use(router);

// Handler validation error
app.use(function(err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }
  next();
})

httpServer.listen(port, () => {
  console.log(`Tism app listening on port ${port}`);
});
