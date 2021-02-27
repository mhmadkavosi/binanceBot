const mongoose = require('mongoose');
const Binance = require('node-binance-api');
const axios = require('axios');

const binance = new Binance().options({
  APIKEY: 'v5FwYDkW8SPp4a8nw9E33pNYUukelEHGAxtI800rxKOZUfMMVC7ByBn4DRf7tH4Z',
  APISECRET: 'YTx5HC4fVWOSPHTeNm58lGOoKIUaxCPMAGcE65BtoGV3Owm7otUHgE4v3P2WdNyg',
});

const db = 'mongodb://localhost:27017/binanceBot';
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: false,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database connect successfuly!'));

const ethSchema = mongoose.Schema(
  {
    price: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    orderTime: Date,
    sellTimeOne: Date,
    sellTimeTwo: Date,
    symbol: String,
  },
  { versionKey: false }
);

const Eth = mongoose.model('eth', ethSchema);

const getLastPrice = async () => {
  try {
    const resp = await axios.get(
      'https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT'
    );
    await Eth.create({ price: resp.data.price, symbol: resp.data.symbol });
    let price = await Eth.findOne().sort('-createdAt');
    let orderTime = price.createdAt.getTime() + 10000; // add 10 sec to buy
    let sellTimeOne = orderTime + 480000; // add 8 minute to order one
    let sellTimeTwo = sellTimeOne + 120000; // add 2 minute to order two
    await Eth.findByIdAndUpdate(price.id, {
      orderTime,
      sellTimeOne,
      sellTimeTwo,
    });
    console.log(await Eth.findOne().sort('-createdAt'));
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

// setInterval(() => {
//   getLastPrice();
// }, 1000);
getLastPrice();
