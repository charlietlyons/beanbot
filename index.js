const express = require('express');
const { Server } = require("socket.io");
const http = require("http");
const Chat = require('./components/Chat')

const PORT = 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.get("/about", (req, res) => {
	res.sendFile(`${__dirname}/views/about.html`);
});

io.on("connection", (socket) => {
  console.log("New Chat initiated...")
  const chat = new Chat();

  socket.on("client-message", (messageContent) => {
    console.log("Message received...");

    chat.generateBotResponse(messageContent, (botResponse) => {
      socket.emit("bot-message", botResponse);
    });
  });
});

server.listen(PORT, () => {
  console.log(`BeansBot is running on port ${PORT}...`);
});