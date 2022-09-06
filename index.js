const express = require('express');
const { Server } = require("socket.io");
const http = require("http");

const PORT = 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// For html templates
app.use(express.static(__dirname + "/views"));
// For assets
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

io.on("connection", (socket) => {
  socket.on("client-message", (messageContent) => {
    console.log(messageContent);

    socket.emit("bot-message", "I'm a robot!");
  });
});

server.listen(PORT, () => {
  console.log(`BeansBot is running on port ${PORT}...`);
});