import { envs } from './envs';

import { OpenAI } from "langchain/llms/openai";

import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/* Model */
const model = new OpenAI({ openAIApiKey: envs.openApiKey, temperature: 0.9 });

/* Start ChatBot */
async function startChatBot () {
  while (true) {
    const message: string = await new Promise(resolve => {
      rl.question('Cliente: ', (answer) => {
        resolve(answer);
      });
    });

    const response = await model.call(message);

    console.log(response);
  }
};

/* Default Export */
export { startChatBot };
