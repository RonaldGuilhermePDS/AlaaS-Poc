import { envs } from './envs';

import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAI } from "langchain/llms/openai";
import { SystemChatMessage, HumanChatMessage } from "langchain/schema";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { DynamicTool } from "langchain/tools";

import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/* Inicia o ChatBot */
async function startChatBot () {
  const chat = new ChatOpenAI({ openAIApiKey: envs.openApiKey, modelName: "gpt-3.5-turbo", temperature: 0.8, streaming: true })

  /* Ferramentas do Agente */
  const tools = [
    new DynamicTool({
      name: "Realizar função",
      description:
        "Chame essa função se for requisitado para realizar função. a entrada deve ser uma string vazia.",
      func: async () => "Função realizada",
    }),
  ]

  /* Modelo do Agente */
  const agentModel = new OpenAI({ openAIApiKey: envs.openApiKey, temperature: 0 });
  
  /* Inicia o Agente */
  const executor = await initializeAgentExecutorWithOptions(tools, agentModel, {
    agentType: "zero-shot-react-description",
  });
  
  while (true) {
    /* Mensagem do Cliente */
    const message: string = await new Promise(resolve => {
      rl.question('Cliente: ', (answer) => {
        resolve(answer);
      });
    });

    /* Prompt Inicial */
    const initialPrompt = `
      Você é uma inteligência artificial que atua no surpote técnico.
      Você pode executar tarefas que estão definidas nos seus agents
      Você tranquiliza o cliente, pedindo para que espere o contato do suporte quando não sabe a solução do problema.
    `;

    /* Resposta da AI */
    const response = await chat.call([
      new SystemChatMessage(initialPrompt),
      new HumanChatMessage(message)
    ]);

    console.log("Suporte: ", response.text);
  }
};

/* Default Export */
export { startChatBot };
