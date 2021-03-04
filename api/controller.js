const axios = require('axios');
const model = require('./model.js');

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

