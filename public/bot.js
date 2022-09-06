socket.on("bot-message", (message) => {
  alert(message);
});

function sendMessage() {
  const messageBox = document.getElementById("message-box");
  const messageBoxContent = messageBox.value.trim();
  if (messageBoxContent.length > 0) {
    socket.emit("client-message", messageBoxContent);
    messageBox.value = "";
  }
}
