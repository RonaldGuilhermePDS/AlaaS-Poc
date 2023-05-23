import { envs } from './envs';

import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { ZeroShotAgent, AgentExecutor } from "langchain/agents";
import { DynamicTool } from "langchain/tools";

import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/* Inicia o ChatBot */
async function startChatBot () {
  /* Ferramentas do Agente */
  const tools = [
    new DynamicTool({
      name: "Realizar função",
      description:
        "Chame essa função se for requisitado para realizar função. a entrada deve ser uma string vazia.",
      func: async () => {
        return "Função realizada";
      },
    }),
  ];

  /* Prompt Inicial */
  const prompt = ZeroShotAgent.createPrompt(tools, {
    prefix: `
      Você é uma inteligência artificial que atua no surpote técnico.

      Você tem acesso as seguintes ferramentas:
    `,
    suffix: `Começar!`,
  });

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    new SystemMessagePromptTemplate(prompt),
    HumanMessagePromptTemplate.fromTemplate(`
      {input}

      {agent_scratchpad}
    `),
  ]);

  /* Core do ChatBot */
  const chat = new ChatOpenAI({
    openAIApiKey: envs.openApiKey,
    modelName: envs.modelName,
    temperature: 0,
    streaming: true,
  });

  /* LLM Chain */
  const llmChain = new LLMChain({
    prompt: chatPrompt,
    llm: chat,
  });

  /* Agente */
  const agent = new ZeroShotAgent({
    llmChain,
    allowedTools: tools.map((tool) => tool.name),
  });

  /* Executor do Agente */
  const executor = AgentExecutor.fromAgentAndTools({
    agent,
    tools,
    returnIntermediateSteps: true,
    maxIterations: 1,
  });

  while (true) {
    /* Mensagem do Cliente */
    const message = await new Promise(resolve => {
      rl.question('Cliente: ', (answer) => {
        resolve(answer);
      });
    });

    const response = await executor.run(message)

    /* Resposta da AI */
    console.log("Suporte: ", response);
  }
};

/* Default Export */
export { startChatBot };
