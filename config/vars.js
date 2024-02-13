const path = require('path');

const appPackage = require('../package.json');

require('dotenv').config({
  path: path.join(__dirname, '../.env'),
});

module.exports = {
  appName: appPackage.name,
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  sqlUri: process.env.SQL_URI,
  database: process.env.DATABASE
};