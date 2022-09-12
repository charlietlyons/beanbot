const express = require('express');
const { Server } = require("socket.io");
const http = require("http");
const OpenAiClient = require("./components/clients/OpenAiClient");

const PORT = 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const openAiClient = new OpenAiClient();

app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

io.on("connection", (socket) => {
  socket.on("client-message", (messageContent) => {
    console.log("Message received...");

    openAiClient.generateBotResponse(messageContent, (botResponse) => {
      socket.emit("bot-message", botResponse);
    });
  });
});

server.listen(PORT, () => {
  console.log(`BeansBot is running on port ${PORT}...`);
});