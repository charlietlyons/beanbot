const chatLog = [];

socket.on("bot-message", (message) => {
  addToChatLog("BeansBot", message);
});

function sendMessage() {
  const messageBox = document.getElementById("message-box");
  const messageBoxContent = messageBox.value.trim();
  if (messageBoxContent.length > 0) {
    socket.emit("client-message", messageBoxContent);
    messageBox.value = "";
    addToChatLog("You", messageBoxContent);
  }
}

function addToChatLog(speaker, message) {
  chatLog.push(`${speaker}: ${message}\n`);

  let formattedChatLog = "";
  chatLog.forEach((message) => {
    formattedChatLog = formattedChatLog.concat(message);
  });

  document.getElementById("chat-log").innerText = formattedChatLog;
}
