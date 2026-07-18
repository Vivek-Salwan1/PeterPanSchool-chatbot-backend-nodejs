const router = require('express').Router();
const chatController = require('../controllers/chatController');

router.post('/', chatController.sendMessage);
router.post('/hello', chatController.sayHello);

module.exports = router;

