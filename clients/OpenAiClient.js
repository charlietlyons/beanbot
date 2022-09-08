const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const API_KEY = process.env.OPEN_AI_API_KEY;

class OpenAiClient {
  constructor() {
    const configuration = new Configuration({
      apiKey: API_KEY,
    });

    this.openai = new OpenAIApi(configuration);
    this.chatHistory =
      "A casual exchange between you and a man named BeansBot who likes beans.";
  }

  generateResponse(message, successHandler, doContinue = false) {
    const prompt = doContinue ? message : `${this.chatHistory}\nBeansBot: `;
    doContinue ? () => {} : this.addToChatHistory("You", message);

    this.openai
      .createCompletion({
        model: "text-davinci-002",
        prompt,
        temperature: 0.15,
      })
      .then((response) => {
        const aiResponseText = response.data.choices[0].text.trim();
        if (aiResponseText.match(/[.!?]$/) <= 0) {
          console.log("Still generating...");
          this.continueGeneratedMessage(aiResponseText, (finalMessage) => {
            successHandler(finalMessage);
            this.addToChatHistory("BeansBot", finalMessage);
          });
        } else {
          successHandler(aiResponseText.replace("\n", " "));
          this.addToChatHistory("BeansBot", aiResponseText);
        }
      });
  }

  continueGeneratedMessage(baseMessage, successHandler) {
    this.generateResponse(
      baseMessage,
      (additionalMessages) => {
        const newMessage = baseMessage.concat(` ${additionalMessages}`).trim();
        successHandler(newMessage.replace("\n", " "));
      },
      true
    );
  }

  addToChatHistory(speaker, message) {
    this.chatHistory = this.chatHistory.concat(`\n${speaker}: ${message}`);
  }
}

module.exports = OpenAiClient;
