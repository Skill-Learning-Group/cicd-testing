const dotenv = require('dotenv');
dotenv.config();

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongo: {
    host: process.env.MONGO_HOST
  }
}

module.exports = config;