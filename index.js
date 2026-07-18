const { createApp } = require('./src/app');
const { env } = require('./src/config/env');

const app = createApp();

app.listen(env.port, () => {
  console.log(`Chatbot API running on http://localhost:${env.port}`);
});
