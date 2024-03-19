const httpStatus = require('http-status');
const { pick, omit, isEmpty } = require('lodash');
const { user: User } = require('../../models');
const { getUserInfo } = require('../../utils/user.util')
const bcrypt = require('bcrypt');
const { logger } = require('../../config/logger');

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
    const {data} = await getUserInfo({ username: req.body.username});

    if(!isEmpty(data)){
      logger.error('Bad Request for the following Data!', omit(data, ['password']));
      return res.status(httpStatus.BAD_REQUEST).json().send();
    }
    const params = pick(req.body, ['first_name', 'last_name', 'username','password']);
    await hashPassword(params);
    const user = await User.create(params);
    logger.info('User has been created with the following params!', user.dataValues);
    return res.status(httpStatus.CREATED).json(omit(user.dataValues, ['password'])).send();
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
    logger.error('Bad Request!', data);
    return res.status(httpStatus.BAD_REQUEST).json().send();
  } catch (err) {
    logger.error('Service Unavailable!', err);
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
    logger.error('Bad Request!', data);
    return res.status(httpStatus.BAD_REQUEST).json().send();
  } catch (err) {
    logger.error('Internal server error!', err);
    return res.status(httpStatus.SERVICE_UNAVAILABLE).json().send();
  }
};
