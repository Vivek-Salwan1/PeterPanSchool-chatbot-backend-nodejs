const chatService = require('../services/chatService');

function sayHello(req, res) { // eslint-disable-line no-unused-vars
  res.json({ message: 'Hello how can i help you today welcome' });
}

async function sendMessage(req, res, next) {
  try {
    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    if (!message) {
      return res.status(400).json({ success: false, message: 'Request body must include a non-empty "message" string.' });
    }

    const reply = await chatService.getReply(message);
    return res.json({ success: true, reply });
  } catch (error) {
    return next(error);
  }
}

module.exports = { sayHello, sendMessage };

