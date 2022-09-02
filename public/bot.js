function sendMessage() {
  const messageBox = document.getElementById("message-box");
  const messageBoxContent = messageBox.value.trim();
  if (messageBoxContent.length > 0) {
    socket.emit("message", messageBoxContent);
    messageBox.value = "";
  }
}
