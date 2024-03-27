const httpStatus = require('http-status');
const { pick, omit, isEmpty } = require('lodash');
const { user: User, MailTracking } = require('../../models');
const { getUserInfo } = require('../../utils/user.util')
const bcrypt = require('bcrypt');
const { logger } = require('../../config/logger');
const { publishMessage } = require('../../utils/pubsub.util');
const { domain, port, expiry, env } = require('../../config/vars');
const moment = require('moment');
const { v4 : uuidv4 } = require('uuid');

//time difference
const getTimeDifferenceInMinutes = (date1, date2=moment()) => {
 const value =  Math.abs(moment(date1).diff(moment(date2), 'minutes', true));
 logger.info("minutes difference" , value );
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
    // Check if user already exists
    let userInfo = await getUserInfo({ username: req.body.username });

    if (!isEmpty(userInfo.data)) {
      logger.warn('User already exists!', omit(userInfo.data, ['password']));
      return res.status(httpStatus.BAD_REQUEST).send();
    }

    // If user doesn't exist, create a new user
    if (isEmpty(userInfo.data)) {
      const userData = pick(req.body, ['first_name', 'last_name', 'username', 'password']);
      await hashPassword(userData);
      userInfo.data = (await User.create(userData)).dataValues;
    }

    if(env!=='test') {
    await publishMessage({
        from: `mailgun@${domain}`,
        to: userInfo.data.username,
        verificationLink: generateVerificationLink(userInfo.data.username, userInfo.data.verification_token),
        domain,
        name: userInfo.data.first_name,
      });
    }
    logger.info('User has been created with the following params:', userInfo.data);
    return res.status(httpStatus.CREATED).json(omit(userInfo.data, ['password']));
  } catch (err) {
    logger.error('Internal server error occurred while processing:', err);
    return res.status(httpStatus.SERVICE_UNAVAILABLE).send();
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
    const mailData = await MailTracking.findOne({ where: {email : emailId}});
   
    if (!isEmpty(data)) {
      // for say the mail_sent exists we compare with that, otherwise we wll assume that the link has been verified even prior the mail_sent is updated in Database. So, we will take the time stamp.
      if(getTimeDifferenceInMinutes(mailData.dataValues.mail_sent || new moment())) {
          await User.update({is_verified: true, verified_at: new moment()}, { where: { username: data.username } });
          return res.status(httpStatus.OK).send({ message: 'Your email has een Verified!'});
      } else {
        const newToken = uuidv4();
        await User.update({verification_token: newToken}, { where: { username: data.username } });
        await publishMessage({
          from: `mailgun@${domain}`,
          to: emailId,
          verificationLink: generateVerificationLink(data.username, newToken),
          domain,
          name: data.first_name
       });
      }
    return res.status(httpStatus.UNAUTHORIZED).json({ message: 'The link has expired, and generated a new link!'}).send();
    }

    return res.status(httpStatus.UNAUTHORIZED).json({ message: 'The link has expired'}).send();

  } catch (err) {
    logger.error('Internal server error!', err);
    return res.status(httpStatus.SERVICE_UNAVAILABLE).json().send();
  }
};
