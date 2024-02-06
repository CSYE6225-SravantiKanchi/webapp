const httpStatus = require('http-status');
const { isEmpty } = require('lodash');
const { getUserInfo } = require('../utils/user.util');


/**
 * Adding a custom middleware to validate the basic auth.
 * @public
 */

const handler = async (req, res, next) => {

    if (isEmpty(req.headers.authorization)) {
        return res.status(httpStatus.UNAUTHORIZED).json();
    }

    try {
        const basicAuth = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(basicAuth, 'base64').toString('utf-8');
        const [userName, password] = credentials.split(':');
        const {statusCode, data} = await getUserInfo({ username: userName, password});
        if (isEmpty(data)) {
            return res.status(statusCode).json();
        }
        req.data = data;
        next();
    } catch (err) {
        return res.status(httpStatus.UNAUTHORIZED).json();
    }
};

exports.handler= handler;
