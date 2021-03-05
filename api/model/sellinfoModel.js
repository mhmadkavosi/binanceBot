const mongoose = require('mongoose');

const sellInfo = mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { versionKey: false }
);

const SellInfo = mongoose.model('sellInfo', sellInfo);
module.exports = SellInfo;
