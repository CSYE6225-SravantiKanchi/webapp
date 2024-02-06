const {isEmpty} = require('lodash');
const httpStatus = require('http-status');
const { sequelize } = require('../config/sequelize.js');

const health = async (req, res) => {
    //To make sure the body, query even the empty {} is not allowed
    if(!isEmpty(req.body) || !isEmpty(req.query) || req.headers['content-length'] >0 ) {
        res.status(httpStatus.BAD_REQUEST).json().send();
      }
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
