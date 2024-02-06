const { Sequelize } = require('sequelize');
const { sqlUri } = require('./vars');

/**
 *followed https://sequelize.org/docs/v6/getting-started/
 */
const sequelize = new Sequelize(sqlUri);

exports.sequelize = sequelize;
