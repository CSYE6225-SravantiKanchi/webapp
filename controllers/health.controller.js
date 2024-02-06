const {isEmpty} = require('lodash');
const httpStatus = require('http-status');
const { sequelize } = require('../config/sequelize.js');

const health = async (req, res) => {

    try {
        //to check if the sql is connected
        await sequelize.authenticate();
      } catch (error) {
        //else throw error
        res.status(httpStatus.SERVICE_UNAVAILABLE).json().send();
      }
    res.status(httpStatus.OK).json().send();
}

exports.healthController = health;
