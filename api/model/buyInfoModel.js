const mongoose = require('mongoose');

const buyInfo = mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { versionKey: false }
);

const BuyInfo = mongoose.model('buyInfo', buyInfo);
module.exports = BuyInfo;
