require('dotenv').config({ quiet: true });

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
];

function toPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseOrigins(value) {
  if (!value) return DEFAULT_ALLOWED_ORIGINS;
  return value.split(',').map((origin) => origin.trim()).filter(Boolean);
}

const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toPositiveInteger(process.env.PORT, 8000),
  allowedOrigins: parseOrigins(process.env.ALLOWED_ORIGINS),
  azureOpenAiEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
  azureOpenAiApiKey: process.env.AZURE_OPENAI_API_KEY,
  azureOpenAiDeployment: process.env.AZURE_OPENAI_CHAT_DEPLOYMENT_NAME,
  azureOpenAiApiVersion: process.env.AZURE_OPENAI_API_VERSION,
  schoolWebsiteUrl: process.env.SCHOOL_WEBSITE_URL || 'https://www.littleseedschildrenscenter.com',
  websiteCacheTtlMs: toPositiveInteger(process.env.WEBSITE_CACHE_TTL_MS, 10 * 60 * 1000),
  maxWebsitePages: toPositiveInteger(process.env.MAX_WEBSITE_PAGES, 8),
  maxWebsiteContextChars: toPositiveInteger(process.env.MAX_WEBSITE_CONTEXT_CHARS, 6000),
});

module.exports = { env };
