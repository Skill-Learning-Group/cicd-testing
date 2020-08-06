const app = require('./config/express');
const config = require('./config/config');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

const mongoUri = config.mongo.host;

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.on('connected', () => {
  console.log(`connected to database: ${mongoUri}`);
});

mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

app.listen(config.port, () => {
  console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
});