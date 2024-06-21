const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require("socket.io");
const Koa = require("koa");
const Router = require("koa-router");

const app = express();
const port = process.env.PORT || 3030;

// Create an HTTP server
const server = http.createServer(app);

// Pass the server instance to Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Array to store RFID tag data
const tagDataArray = [];

// Route to handle POST requests to /tagData
app.post('/tagData', (req, res) => {
  const tagData = req.body.tagData;

  console.log('Received tag data:', tagData);
  tagDataArray.push(tagData);

  io.emit('tagData', tagData);

  res.send('Tag data received successfully');
});

// Koa setup
const koaApp = new Koa();
const router = new Router();

router.get('/', async (ctx) => {
  ctx.body = "Hello World from Railway this is Gymnesia";
});

koaApp.use(router.routes()).use(router.allowedMethods());

// Middleware to handle Koa routes in Express
app.use('/koa', (req, res) => {
  koaApp.callback()(req, res);
});

// Start the HTTP server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
