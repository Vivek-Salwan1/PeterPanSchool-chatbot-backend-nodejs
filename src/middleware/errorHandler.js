function notFoundHandler(req, res) {
  console.warn(`[404] No route matched ${req.method} ${req.originalUrl}`);
  res.status(404).json({ success: false, error: 'Not found', method: req.method, path: req.originalUrl });
}

function errorHandler(error, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(`[ERROR] ${req.method} ${req.originalUrl}`, {
    message: error.message,
    name: error.name,
    status: error.status,
    code: error.code,
    type: error.type,
    stack: error.stack,
    response: error.response?.data || error.response,
  });

  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    code: error.code,
    type: error.type,
  });
}

module.exports = { notFoundHandler, errorHandler };

