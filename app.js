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
    let price = await Eth.find();
    console.log(price);
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

getLastPrice();
