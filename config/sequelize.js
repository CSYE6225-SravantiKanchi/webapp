const { Sequelize } = require('sequelize');
const { sqlUri, database } = require('./vars');

/**
 *followed https://sequelize.org/docs/v6/getting-started/
 */
const sequelize = new Sequelize(`${sqlUri}${database}`, {
    logging: false
});

exports.sequelize = sequelize;
