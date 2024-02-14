const { Sequelize } = require('sequelize');
const { sqlUri, database } = require('./vars');

/**
 *followed https://sequelize.org/docs/v6/getting-started/
 */

console.log(`this is the sql uri ${process.env.SQL_URI}${process.env.DATABASE}`);

const sequelize = new Sequelize(`${sqlUri}${database}`);

exports.sequelize = sequelize;
