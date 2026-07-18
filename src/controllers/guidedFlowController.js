const { processGuidedFlow } = require('../../services/guidedFlow/flowEngine');

function process(req, res, next) {
  try {
    const sessionId = typeof req.body?.sessionId === 'string' ? req.body.sessionId : null;
    const message = typeof req.body?.message === 'string' ? req.body.message : '';
    const action = req.body?.action && typeof req.body.action === 'object' ? req.body.action : null;
    return res.json(processGuidedFlow({ sessionId, message, action }));
  } catch (error) {
    return next(error);
  }
}

module.exports = { process };

