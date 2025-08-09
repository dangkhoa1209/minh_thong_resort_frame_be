const express = require('express');
const { sendMailController } = require('../controllers/mailController');

const router = express.Router();

router.post('/send', sendMailController);

module.exports = router;
