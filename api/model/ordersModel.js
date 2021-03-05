const mongoose = require('mongoose');

const order = mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { versionKey: false }
);

const Order = mongoose.model('Order', order);
module.exports = Order;
