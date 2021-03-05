const mongoose = require('mongoose');

const balanceAccount = mongoose.Schema(
  {
    balance: String,
    symbol: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { versionKey: false }
);

const BalanceAccount = mongoose.model('balanceAccount', balanceAccount);

module.exports = BalanceAccount;
