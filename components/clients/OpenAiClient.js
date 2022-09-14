const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const API_KEY = process.env.OPEN_AI_API_KEY;

class OpenAiClient {
  constructor() {
    const configuration = new Configuration({
      apiKey: API_KEY,
    });

    this.openai = new OpenAIApi(configuration);
  }

  generateText(prompt, temperature, successHandler) {
    this.openai
      .createCompletion({
        model: "text-davinci-002",
        prompt,
        temperature,
        max_tokens: 256
      })
      .then((responseText) => successHandler(responseText));
  }
}

module.exports = OpenAiClient;
