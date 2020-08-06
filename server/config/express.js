const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('../route');
const config = require('./config');

const app = express();
const { APIerror } = require('../helpers/API-response');

if (config.env === 'development') app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/', routes);

app.use((req, res, next) => {
  return res.status(404).json(APIerror(404, `route doesn't exist.`));
});

app.use((err, req, res, next) => {
  return res.status(500).json(APIerror(500, { message: err.message }));
});

module.exports = app;