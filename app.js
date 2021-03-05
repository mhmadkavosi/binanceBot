const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const routes = require('./api/routes');

dotenv.config({ path: './config.env' });
const app = express();
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});

app.use(express.json());
app.use(morgan('dev'));

const db = process.env.DATABASE_URL;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: false,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database connect successfuly!'));

// Routes
app.use('/api/', routes);
