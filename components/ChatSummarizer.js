const TRAINING_SUMMARIES = `You: What's your favorite type of bean?
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
`
class ChatSummarizer {
    constructor(openAiClient) {
        this.openAiClient = openAiClient;
    }

    summarize(chatHistory, successHandler) {
        this.openAiClient.generateText(
          `${TRAINING_SUMMARIES}
          ${chatHistory}
          \nSummary: `,
          0,
          (response) => {
            console.log(response.data.choices[0].text.trim());
            successHandler(response.data.choices[0].text.trim());
          }
        );
  }
}

module.exports = ChatSummarizer;