function sendMessage() {
	event.preventDefault();
	const messageBox = document.getElementById("message-box");
	const messageBoxContent = messageBox.value.trim();
	if (messageBoxContent.length > 0) {
		socket.emit("client-message", messageBoxContent);
		messageBox.value = "";
		addToChatLog("You", messageBoxContent);
	}
}

function addToChatLog(speaker, message) {
	const chatLogElement = document.getElementById("chat-log");
	const messageNode = document.createElement("p");
  const isBeansBot = speaker === "BeansBot";
  messageNode.className = `${
		isBeansBot ? "beansbot-message" : "you-message"
  } message`;
  messageNode.innerHTML = `
  ${isBeansBot ? `<img src="/beansbot_v2.png" />` : `<b>${speaker}: </b>`}
  ${message}`;
	chatLogElement.prepend(messageNode);
}

socket.on("bot-message", (message) => {
	addToChatLog("BeansBot", message);
});
