const axios = require('axios');
const Binance = require('node-binance-api');
const dotenv = require('dotenv');
const balanceModel = require('./model/balanceModel');
const sellInfoModel = require('./model/sellinfoModel');
const buyInfoModel = require('./model/buyInfoModel');

dotenv.config({ path: './config.env' });

const binance = new Binance().options({
  APIKEY: process.env.API_KEY,
  APISECRET: process.env.API_SECRET,
});

let symbols = 'ETHUSDT';

exports.getLastPrice = async () => {
  try {
    const resp = await axios.get(
      `https://api.binance.com/api/v3/ticker/price?symbol=${symbols}`
    );
    await model.create({ price: resp.data.price, symbol: resp.data.symbol });
    let price = await model.findOne().sort('-createdAt');
    let orderTime = price.createdAt.getTime() + 10000; // add 10 sec to buy
    let sellTimeOne = orderTime + 480000; // add 8 minute to order one
    let sellTimeTwo = sellTimeOne + 120000; // add 2 minute to order two
    await model.findByIdAndUpdate(price.id, {
      orderTime,
      sellTimeOne,
      sellTimeTwo,
    });
    console.log(await model.findOne().sort('-createdAt'));
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

// @desc    get balance on btc
// @route   /api/balanceOnBTC GET
exports.balanceOnBTC = async () => {
  try {
    let lendingData = await binance.balance();
    // console.log(lendingData.BTC.available);
    lendingData = lendingData.BTC.available;
    await balanceModel.create({ balance: lendingData, symbol: 'BTC' });
  } catch (error) {
    console.log(error);
  }
};

exports.getAllOrders = async () => {
  try {
    await binance.allOrders('ETHBTC', (error, orders, symbol) => {
      console.info(`${symbol} orders:`, orders);
    });
  } catch (error) {
    console.log(error);
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
