import OpenAIAPIBot from "./OpenAIAPIBot";
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import store from "@/store";
export default class AzureOpenAIAPI35Bot extends OpenAIAPIBot  {
  static _brandId = "azureOpenaiApi";
  static _className = "AzureOpenAIAPIBot"; // Class name of the bot
  static _logoFilename = "openai-35-azure-logo.png"; // Place it in assets/bots/
  static _model = "gpt-35-turbo";
  constructor() {
    super();
  }

  async checkAvailability() {
    if (!store.state.openaiApi.azureApiKey && !store.state.openaiApi.alterUrl) {
      this.constructor._isAvailable = false;
    } else {
      this.constructor._isAvailable = true;
    }
    return this.isAvailable();
  }


  async _sendPrompt(prompt, onUpdateResponse, callbackParam) {
    const client = new OpenAIClient(store.state.openaiApi.alterUrl, new AzureKeyCredential(store.state.openaiApi.azureApiKey));
    let messages = [];
    let res = "";
    messages.push({ role: "user", content: `${prompt}` });
    const events = await client.listChatCompletions(this.constructor._model, messages, { maxTokens: 1000 });
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
