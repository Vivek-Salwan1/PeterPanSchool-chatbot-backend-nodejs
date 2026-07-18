const client = require('../../services/azureOpenAi');
const { env } = require('../config/env');
const { OUT_OF_SCOPE_REPLY, SCHOOL_KEYWORDS, OUT_OF_SCOPE_PATTERNS, buildSystemPrompt } = require('../constants/chat');
const { getWebsiteContext } = require('./websiteContextService');

function isClearlyOutOfScope(message) {
  const normalized = message.toLowerCase();
  return !SCHOOL_KEYWORDS.some((keyword) => normalized.includes(keyword)) && OUT_OF_SCOPE_PATTERNS.some((pattern) => pattern.test(message));
}

async function getReply(message) {
  if (isClearlyOutOfScope(message)) {
    console.log(`[GUARDRAIL] Out-of-scope message blocked: "${message}"`);
    return OUT_OF_SCOPE_REPLY;
  }
  const websiteContext = await getWebsiteContext(message);
  const response = await client.chat.completions.create({
    model: env.azureOpenAiDeployment,
    messages: [
      { role: 'system', content: buildSystemPrompt(env.schoolWebsiteUrl) },
      { role: 'system', content: websiteContext
        ? `Use this official website context when answering Peter Pan Schools questions. Do not invent details that are not present here.\n\n${websiteContext}`
        : `The official website is ${env.schoolWebsiteUrl}, but no website content could be loaded right now. If you do not know an answer, say you do not have that information and ask the parent to contact admissions.` },
      { role: 'user', content: message },
    ],
    max_completion_tokens: 500,
  });
  return response.choices?.[0]?.message?.content || "I don't have that information. Please contact our admissions office.";
}

module.exports = { getReply, isClearlyOutOfScope };

