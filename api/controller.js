const axios = require('axios');
const Binance = require('node-binance-api');
const dotenv = require('dotenv');
const model = require('./model.js');

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

exports.balanceOnBTC = async () => {
  try {
    let lendingData = await binance.balance();
    console.log(lendingData.BTC);
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

exports.createMarketSell = async () => {
  try {
    let quantity = 1;
    const sell = await binance.marketSell('BNBBTC', quantity);
    console.log(sell);
  } catch (error) {
    console.log(error);
  }
};

exports.createMarketBuy = async () => {
  try {
    let quantity = 1;
    const buy = await binance.marketBuy('BNBBTC', quantity);
    console.log(buy);
  } catch (error) {
    console.log(error);
  }
};
