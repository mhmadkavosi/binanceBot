const mongoose = require('mongoose');

const crypto = mongoose.Schema(
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

const Crypto = mongoose.model('crypto', crypto);

module.exports = Crypto;
