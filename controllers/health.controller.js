const {isEmpty} = require('lodash');
const httpStatus = require('http-status');
const { sequelize } = require('../config/sequelize.js');
const { logger } = require('../config/logger.js');

const health = async (req, res) => {

    try {
        //to check if the sql is connected
        await sequelize.authenticate();
      } catch (error) {
        logger.error('There is an internal server error while processing', err);
        res.status(httpStatus.SERVICE_UNAVAILABLE).json().send();
      }
    
      logger.info('There is an internal server error while processing');

    res.status(httpStatus.OK).json().send();
}

exports.healthController = health;
