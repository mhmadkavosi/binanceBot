const express = require('express');

const controller = require('./controller');

const router = express.Router();

router.route('/buy/:symbol').get(controller.createMarketBuy);
router.route('/sell/:symbol').get(controller.createMarketSell);
router.route('/balanceOnBTC').get(controller.balanceOnBTC);
router.route('/openOrders').get(controller.getOpenOrders);

module.exports = router;
