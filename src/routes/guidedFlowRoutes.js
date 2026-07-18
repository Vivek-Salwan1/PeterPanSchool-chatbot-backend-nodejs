const router = require('express').Router();
const guidedFlowController = require('../controllers/guidedFlowController');

router.post('/', guidedFlowController.process);

module.exports = router;

