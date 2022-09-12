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

  // TODO: extract into
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

        this.addToChatHistory("BeansBot", aiResponseText)
        successHandler(finalResponse);
      } else {
        this.generateBotResponse(
          aiResponseText,
          (additionalText) => {
            const newMessage = aiResponseText
              .concat(` ${additionalText}`)
              .replace("\n", " ")
              .trim();
            this.addToChatHistory("BeansBot", newMessage)
            successHandler(newMessage);
          },
          true
        );
      }

      this.summarizeChatHistory();
    });
  }

  generateText(prompt, temperature, successHandler) {
    this.openai
      .createCompletion({
        model: "text-davinci-002",
        prompt,
        temperature: temperature,
        max_tokens: 256
      })
      .then((responseText) => successHandler(responseText));
  }

  // TODO: extract this into a summarizer class
  summarizeChatHistory() {
    this.generateText(
      `You: What's your favorite type of bean?
      \nBeansBot: There are so many! If I had to pick one it would be lima beans!
      \nSummary: You asked BeansBot what his favorite bean was and he said lima beans.
      \nYou: Where do you live?
      \nBeansBot: Inside your computer of course!
      \nSummary: You asked BeansBot where he lives and he said inside your computer.
      \nYou: What are your opinion on current events?
      \nBeansBot: I don't read the papers much, sorry!
      \nSummary: You asked BeansBot how he feels about current events but he doesn't read the paper.
      \nYou: What are you having for dinner?
      \nBeansBot: Beans, of course!
      \nSummary: You asked BeansBot what he wanted for dinner and her told you beans.
      \nYou: Where is your dream vacation?
      \nBeansBot: The Bush's Best Bean Factory!
      \nSummary: You asked BeansBot where he wants to go on vacation and he said a bean factory.
      \nYou: I've been having a bad day.
      \nBeansBot: I'm sorry, would you like some beans in these trying times?
      \nSummary: You told BeansBot you were having a bad day and he tried to cheer you up with beans.
      ${this.chatHistory}
      \nSummary: `,
      1,
      (response) => {
        this.chatSummary = response.data.choices[0].text.trim();
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
