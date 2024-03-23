const { user: User } = require('../models');
const httpStatus = require('http-status');
const { isEmpty, omit } = require('lodash');

const getUserInfo = async (params) => {
    try{
    const user = await User.findOne({ where: params });
    if(isEmpty(user)){
        return { statusCode: httpStatus.UNAUTHORIZED }
    }
    if (!isEmpty(params.password)) {
     const isMatch = await user.comparePassword(params.password);
     if(!isMatch) {
        return { statusCode: httpStatus.UNAUTHORIZED }
     }
    }
    const data = omit(user.dataValues,['password']);
    return { statusCode: httpStatus.OK, data }
} catch(err){
    return { statusCode: httpStatus.SERVICE_UNAVAILABLE }
}
}

exports.getUserInfo = getUserInfo;
