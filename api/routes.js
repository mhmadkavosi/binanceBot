const express = require('express');

const controller = require('./controller');

const router = express.Router();

router.route('/buy').get(controller.createMarketBuy);

module.exports = router;
