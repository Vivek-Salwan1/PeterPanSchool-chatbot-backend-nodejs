const router = require('express').Router();
const healthController = require('../controllers/healthController');

router.get('/', healthController.getStatus);

module.exports = router;

