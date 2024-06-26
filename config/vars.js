const path = require('path');

const appPackage = require('../package.json');

if (process.env.NODE_ENV !== 'test') {
require('dotenv-safe').config({
  path: path.join(__dirname, '../.env'),
  sample: path.join(__dirname, '../.env.example'),
});
  }
module.exports = {
  appName: appPackage.name,
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  sqlUri: process.env.SQL_URI,
  database: process.env.DATABASE,
  topic: process.env.TOPIC,
  domain: process.env.DOMAIN,
  projectId: process.env.PROJECTID,
  expiry: parseInt(process.env.EXPIRY),
};