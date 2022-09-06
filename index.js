const express = require('express');
const { Server } = require("socket.io");
const http = require("http");
const language = require("@google-cloud/language");

const PORT = 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const client = new language.LanguageServiceClient();

app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

io.on("connection", (socket) => {
  socket.on("client-message", (messageContent) => {
    console.log("Message received...");

    client
      .analyzeSentiment({
        document: {
          content: messageContent,
          type: "PLAIN_TEXT",
        },
      })
      .then((response) => {
        socket.emit(
          "bot-message",
          `I have a sentiment score of ${response[0].documentSentiment.score}`
        );
      });
  });
});

server.listen(PORT, () => {
  console.log(`BeansBot is running on port ${PORT}...`);
});