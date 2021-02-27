const mongoose = require('mongoose');
const Binance = require('node-binance-api');

const binance = new Binance().options({
  APIKEY: 'v5FwYDkW8SPp4a8nw9E33pNYUukelEHGAxtI800rxKOZUfMMVC7ByBn4DRf7tH4Z',
  APISECRET: 'YTx5HC4fVWOSPHTeNm58lGOoKIUaxCPMAGcE65BtoGV3Owm7otUHgE4v3P2WdNyg',
});

const db = 'mongodb://localhost:27017/binanceBot';
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database connect successfuly!'));

const ethSchema = mongoose.Schema({
  price: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Eth = mongoose.model('eth', ethSchema);

function getLastPrice() {
  binance.prices('ETHUSDT', (error, ticker) => {
    Eth.create({ price: ticker.ETHUSDT });
  });
}
getLastPrice();

const cl = async () => {
  console.log(await Eth.find());
};
cl();
