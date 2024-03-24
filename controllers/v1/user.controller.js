const httpStatus = require('http-status');
const { pick, omit, isEmpty } = require('lodash');
const { user: User } = require('../../models');
const { getUserInfo } = require('../../utils/user.util')
const bcrypt = require('bcrypt');
const { logger } = require('../../config/logger');
const { publishMessage } = require('../../utils/pubsub.util');
const { domain, port, expiry, env } = require('../../config/vars');
const moment = require('moment');


//time difference
const getTimeDifferenceInMinutes = (date1, date2=moment()) => {
 const value =  Math.abs(moment(date1).diff(moment(date2), 'minutes'), true);
 console.log(value, expiry);
 return value <= expiry
}

//verification link
const generateVerificationLink = (email, verification_token) => {
  return `http://${domain}:${port}/v1/user/${email}/${verification_token}/verification`;
}

//hashing password
const hashPassword = async (params) => {

  if(!isEmpty(params.password)) {
  params.password = await bcrypt.hash(params.password, 10);
  }
}

/**
 * create User
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    let { data } = await getUserInfo({ username: req.body.username});

    if(!isEmpty(data) && data.is_verified){
      logger.warn('User Exists already!', omit(data, ['password']));
      return res.status(httpStatus.BAD_REQUEST).json().send();
    } else if(isEmpty(data)) {
    const params = pick(req.body, ['first_name', 'last_name', 'username','password']);
    await hashPassword(params);
    data = await User.create(params);
    }

    if(env!=='test' && data.is_verified === false ) {
     
    await User.update({mail_sent : moment(), link_count: data.link_count +1 });
    await publishMessage({
       from: `mailgun@${domain}`, 
       to: user.username, 
       verificationLink: generateVerificationLink(data.username, data.verification_token),
       domain
     });
    }
    logger.info('User has been created with the following params!', data.dataValues);
    return res.status(httpStatus.CREATED).json(omit(data.dataValues, ['password'])).send();
  } catch (err) {
    logger.error('There is an internal server error while processing', err);
    return res.status(httpStatus.SERVICE_UNAVAILABLE).json().send();
  }
};

/**
 * read User
 * @public
 */
exports.read = async (req, res, next) => {
  try {
    const data = req.data;
    if(!isEmpty(data))
    {
    logger.info('User info has been fetched with the following params!', data);
    return res.status(httpStatus.OK).json({ ...data });
    }
    logger.warn('Bad Request!', datal);
    return res.status(httpStatus.BAD_REQUEST).json().send();
  } catch (err) {
    logger.error('Internal Server Error!', err);
    return res.status(httpStatus.SERVICE_UNAVAILABLE).json().send();
  }
};

/**
 * update User
 * @public
 */
exports.update = async (req, res, next) => {
  try {

    const params = pick(req.body, ['first_name', 'last_name','password']);
    const data = req.data;
    if (!isEmpty(data)) {
      await hashPassword(params);
      await User.update(params, { where: { username: data.username } });
      logger.info('User info has been updated with the following params!', data);
      return res.status(httpStatus.NO_CONTENT).send();
    }
    logger.warn('Bad Request!', data);
    return res.status(httpStatus.BAD_REQUEST).json().send();
  } catch (err) {
    logger.error('Internal server error!', err);
    return res.status(httpStatus.SERVICE_UNAVAILABLE).json().send();
  }
};


/**
 * verify User
 * @public
 */
exports.verify = async (req, res, next) => {
  try {

    const { emailId, tokenId } = req.params;
    const { data } = await getUserInfo({ username: emailId, verification_token: tokenId, is_verified: false });
    if (!isEmpty(data) && getTimeDifferenceInMinutes(data.mailVerification)) {
      await User.update({is_verified: true}, { where: { username: data.username } });
      return res.status(httpStatus.OK).send();
    }
    return res.status(httpStatus.UNAUTHORIZED).json().send();
  } catch (err) {
    logger.error('Internal server error!', err);
    return res.status(httpStatus.SERVICE_UNAVAILABLE).json().send();
  }
};
