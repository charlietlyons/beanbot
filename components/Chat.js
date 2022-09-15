const OpenAiClient = require("./clients/OpenAiClient");
const ChatSummarizer = require("./ChatSummarizer");

class Chat {
	constructor() {
		this.openAiClient = new OpenAiClient();
		this.chatSummarizer = new ChatSummarizer(this.openAiClient);
		this.history = [];
		this.summary = '';
	}

	addToChatHistory(speaker, message) {
		this.history = this.history.concat(`\n${speaker}: ${message}`);
	}

	generateBotResponse(message, successHandler, doContinue = false) {
		const prompt = doContinue
			? message
			: `BeansBot is a robot who is obsessed with beans. ${this.summary}\nYou: ${message}\nBeansBot: `;

		if (!doContinue) {
			this.addToChatHistory("You", message);
		}

		this.openAiClient.generateText(prompt, 0.05, (response) => {
			const aiResponseText = response.data.choices[0].text.trim();
			const responseEndPunctuation = aiResponseText.match(/[.!?]/);

			if (responseEndPunctuation) {
				const finalResponse = aiResponseText.slice(
					0,
					responseEndPunctuation.index + 1
				);

				this.addToChatHistory("BeansBot", aiResponseText);
				successHandler(finalResponse);
			} else {
				this.openAiClient.generateBotResponse(
					aiResponseText,
					(additionalText) => {
						const newMessage = aiResponseText
							.concat(` ${additionalText}`)
							.replace("\n", " ")
							.trim();
						this.addToChatHistory("BeansBot", newMessage);
						successHandler(newMessage);
					},
					true
				);
			}
		});
		this.chatSummarizer.summarize(this.history, (summary) => {
			this.summary = summary;
		});
	}
}

module.exports = Chat;