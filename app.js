const mongoose = require('mongoose');
const Binance = require('node-binance-api');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const binance = new Binance().options({
  APIKEY: process.env.API_KEY,
  APISECRET: process.env.API_SECRET,
});

const db = process.env.DATABASE_URL;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: false,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database connect successfuly!'));
