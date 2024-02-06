const { user: User } = require('../models');
const httpStatus = require('http-status');
const { isEmpty, omit } = require('lodash');

const getUserInfo = async (params) => {
    try{
    const user = await User.findOne({ where: { username: params.username } });
    if(isEmpty(user)){
        return { statusCode: httpStatus.NOT_FOUND }
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
    console.log(err);
    return { statusCode: httpStatus.SERVICE_UNAVAILABLE }
}
}

exports.getUserInfo = getUserInfo;
