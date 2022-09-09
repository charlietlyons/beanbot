const e = require("express");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const API_KEY = process.env.OPEN_AI_API_KEY;

class OpenAiClient {
  constructor() {
    const configuration = new Configuration({
      apiKey: API_KEY,
    });

    this.openai = new OpenAIApi(configuration);
    this.chatSummary = "";
    this.chatHistory = "";
  }

  generateText(prompt, temperature, successHandler) {
    this.openai
      .createCompletion({
        model: "text-davinci-002",
        prompt,
        temperature: temperature,
      })
      .then((responseText) => successHandler(responseText));
  }

  generateBotResponse(message, successHandler, doContinue = false) {
    const prompt = doContinue
      ? message
      : `${this.chatSummary}\nYou: ${message}\nBeansBot, who is obsessed with beans: `;
    doContinue ? () => {} : this.addToChatHistory("You", message);

    this.generateText(prompt, 0.15, (response) => {
      const aiResponseText = response.data.choices[0].text.trim();

      const responseEndPunctuation = aiResponseText.match(/[.!?]/);

      if (responseEndPunctuation) {
        const finalResponse = aiResponseText.slice(
          0,
          responseEndPunctuation.index + 1
        );

        successHandler(finalResponse);
      } else {
        this.generateBotResponse(
          aiResponseText,
          (additionalText) => {
            const newMessage = aiResponseText
              .concat(` ${additionalText}`)
              .replace("\n", " ")
              .trim();
            successHandler(newMessage);
          },
          true
        );
      }
    });

    this.summarizeChatHistory();
  }

  summarizeChatHistory() {
    this.generateText(
      `${this.chatHistory}
      \nSummary: You and BeansBot had a riveting discussion about different types of beans.
      \nSummary: You and BeansBot talked about your favorite films with beans in them.
      \nSummary: You and BeansBot made a promise to love one another forever, but he stipulated beans had to be a part of it.
      \nSummary: You and BeansBot argued about jellybeans.
      \nSummary: You and BeansBot talked about your dream home made of beans.
      \nSummary: You and BeansBot enjoyed talking about government policy on bean production.
      \nSummary: `,
      1,
      (response) => {
        console.log(response.data.choices[0].text.trim());
        this.chatSummary = response;
      }
    );
  }

  addToChatHistory(speaker, message) {
    this.chatHistory = this.chatHistory.concat(`\n${speaker}: ${message}`);
  }

  cutUnfinishedSentence() {
    // TODO: implement
  }
}

module.exports = OpenAiClient;
