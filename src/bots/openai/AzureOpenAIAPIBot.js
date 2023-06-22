import Bot from "@/bots/Bot";
// import { SSE } from "sse.js";
// import store from "@/store";
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

export default class AzureOpenAIAPIBot extends Bot  {
  static _brandId = "azureOpenaiApi";
  static _className = "AzureOpenAIAPIBot"; // Class name of the bot
  static _logoFilename = "default-logo.svg"; // Place it in assets/bots/
  static _model = "gpt-3.5-turbo";
  static _endpoint = "https://brianopenai.openai.azure.com/";
  static _azureApiKey = "b40e6aee7db246db8f2a1cffbd2a6b5b";
  static _deploymentId = "brianGPT35Turbo";
  static _appVersion = "2023-03-15-preview";
  
  constructor() {
    super();
  }

  async checkAvailability() {
    this.constructor._isAvailable = true;
    return this.isAvailable();
  }

  async _sendPrompt(prompt, onUpdateResponse, callbackParam) {
    const client = new OpenAIClient(this.constructor._endpoint, new AzureKeyCredential(this.constructor._azureApiKey));
    let messages = [];
    let res = "";
    messages.push({ role: "user", content: `${prompt}` });
    const events = await client.listChatCompletions(this.constructor._deploymentId, messages, { maxTokens: 1000 });
    for await (const event of events) {
      for (const choice of event.choices) {
        const partialText = choice.delta?.content;
        if (partialText) {
          res += partialText;
          onUpdateResponse(callbackParam, { content: res, done: false });
        }
      }
    }
    onUpdateResponse(callbackParam, { done: true });
  }

  async createChatContext() {
    return [];
  }
}
