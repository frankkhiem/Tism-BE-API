const express = require('express');
const { createServer } = require("http");
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const { ValidationError} = require('express-validation');

const db = require('./helpers/db');
const router = require('./routes');
const socketServer = require('./helpers/socketServer');

const app = express();
const httpServer = createServer(app);
const port = 3000;

// Setup socket.io server
global.io = socketServer.createSocketServer({ httpServer });

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
