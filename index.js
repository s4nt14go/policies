require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser');
const logger = require('morgan');

const  app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

routes(app);

const port = process.env.PORT;
const server = app.listen(port, () =>
  console.log(`Your server is running on port ${port}`)
);

module.exports = { server };
