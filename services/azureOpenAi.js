const OpenAI = require('openai');
const { env } = require('../src/config/env');

const endpoint = env.azureOpenAiEndpoint?.replace(/\/?$/, '/');

const client = new OpenAI({
  apiKey: env.azureOpenAiApiKey,
  baseURL: `${endpoint}openai/deployments/${env.azureOpenAiDeployment}`,
  defaultQuery: {
    'api-version': env.azureOpenAiApiVersion,
  },
  defaultHeaders: {
    'api-key': env.azureOpenAiApiKey,
  },
});

module.exports = client;
