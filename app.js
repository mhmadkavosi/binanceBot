const mongoose = require('mongoose');
const dotenv = require('dotenv');

const controller = require('./api/controller');

dotenv.config({ path: './config.env' });

const db = process.env.DATABASE_URL;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: false,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database connect successfuly!'));
