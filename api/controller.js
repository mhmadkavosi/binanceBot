const axios = require('axios');
const Binance = require('node-binance-api');
const dotenv = require('dotenv');
const balanceModel = require('./model/balanceModel');
const sellInfoModel = require('./model/sellinfoModel');
const buyInfoModel = require('./model/buyInfoModel');
const order = require('./model/ordersModel');

dotenv.config({ path: './config.env' });

const binance = new Binance().options({
  APIKEY: process.env.API_KEY,
  APISECRET: process.env.API_SECRET,
});

// @desc    get last price
// @route   /api/lastPrice/:symbols GET

exports.getLastPrice = async (req, res, next) => {
  try {
    const { symbols } = req.params;
    const resp = await axios.get(
      `https://api.binance.com/api/v3/ticker/price?symbol=${symbols.toUpperCase()}`
    );
    await balanceModel.create({
      balance: resp.data.price,
      symbol: resp.data.symbol,
    });
    let data = await balanceModel.findOne().sort('-createdAt');
    res.status(200).json({
      status: 'Ok',
      body: {
        data,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      error,
    });
  }
};

// @desc    get balance on btc
// @route   /api/balanceOnBTC GET
exports.balanceOnBTC = async (req, res, next) => {
  try {
    let lendingData = await binance.balance();
    // console.log(lendingData.BTC.available);
    lendingData = lendingData.BTC.available;
    await balanceModel.create({ balance: lendingData, symbol: 'BTC' });
    let data = await balanceModel.findOne().sort('-createdAt');
    res.status(200).json({
      status: 'OK',
      body: {
        data,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'Fail',
      error,
    });
  }
};

// @desc    get open orders
// @route   /api/openOrders GET

exports.getOpenOrders = async (req, res, next) => {
  let openOrder;
  try {
    await binance.openOrders(false, (error, openOrders) => {
      openOrder = openOrders;
    });
    await order.create(openOrder);
    let data = await order.find();
    res.status(200).json({
      status: 'Ok',
      body: {
        data,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'Fail',
      error,
    });
  }
};

// @desc    Create a Market buy
// @route   /api/buy GET

exports.createMarketBuy = async (req, res, next) => {
  try {
    let { symbol } = req.params;
    let quantity = await balanceModel.findOne().sort('-createdAt');

    const buy = await binance.marketBuy(`${symbol.toUpper()}BTC`, quantity);
    await buyInfoModel.create(buy);
    res.status(200).json({
      status: 'OK',
      body: {
        buy,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'Fail',
      error,
    });
  }
};

// @desc    Create a Market sell
// @route   /api/sell GET

exports.createMarketSell = async (req, res, next) => {
  try {
    let { symbol } = req.params;
    let quantity = await buyInfoModel.findOne().sort('-createdAt');
    quantity = quantity.quantity;
    const sell = await binance.marketSell(
      `${symbol.toUpperCase()}BTC`,
      quantity
    );
    await sellInfoModel.create(sell);
    res.status(200).json({
      status: 'OK',
      body: {
        sell,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'Fail',
      error,
    });
  }
};
