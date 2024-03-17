const httpStatus = require('http-status');
const { isEmpty } = require('lodash');
const { getUserInfo } = require('../utils/user.util');
const { logger } = require('../config/logger');

/**
 * Adding a custom middleware to validate the basic auth.
 * @public
 */

const handler = async (req, res, next) => {

    if (isEmpty(req.headers.authorization)) {
        logger.error('Unauthorized!');
        return res.status(httpStatus.UNAUTHORIZED).json();
    }

    try {
        const basicAuth = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(basicAuth, 'base64').toString('utf-8');
        const [userName, password] = credentials.split(':');
        const {statusCode, data} = await getUserInfo({ username: userName, password});
        if (isEmpty(data)) {
            logger.error('Unauthorized!');
            return res.status(statusCode).json();
        }
        req.data = data;
        next();
    } catch (err) {
        logger.error('Unauthorized!');
        return res.status(httpStatus.UNAUTHORIZED).json();
    }
};

const authNotRequired = async ( req,res, next) => {
    if (!isEmpty(req.headers.authorization)) {
        logger.error('Authorization not required!');
        return res.status(httpStatus.BAD_REQUEST).json();
    }
    next();
}

exports.handler= handler;
exports.authNotRequired = authNotRequired;
