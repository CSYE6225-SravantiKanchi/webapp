const express = require('express');
const { celebrate: validate } = require('celebrate');
const controller = require('../../controllers/v1/user.controller');
const httpStatus = require('http-status');
const {  handler : authorize, authNotRequired } = require('../../middleware/authorize');
const { noPayload } = require('../../middleware/payload.js');

const router = express.Router();
const {
  create,
  update,
} = require('../../validations/v1/user.validation');


router
  .route('/self')
  /**
   * @api {post} v1/user/self add feature for user collection
   * @apiDescription to create users
   * @apiVersion 1.0.0
   * @apiName create
   * @apiGroup User
   * @apiPermission public
   *
   * @apiHeader {String} Authorization  No Authorization
   *
   * @apiSuccess {Object} Users
   */
  .post(authNotRequired, validate(create), controller.create);

router
  .route('/self')
  /**
   * @api {get} v1/user/self add feature for user collection
   * @apiDescription to fetch users
   * @apiVersion 1.0.0
   * @apiName create
   * @apiGroup User
   * @apiPermission public
   *
   * @apiHeader {String} Authorization  user's basic auth
   *
   * @apiSuccess {Object} Users
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   */
  .get(noPayload, authorize, controller.read);

router
  .route('/self')
  /**
   * @api {put} api/v1/config/update add feature for config collection
   * @apiDescription to update user info
   * @apiVersion 1.0.0
   * @apiName update
   * @apiGroup User
   * @apiPermission public
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object} Users
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   */
  .put(validate(update), authorize, controller.update).
  all((req, res, next) => res.status(httpStatus.METHOD_NOT_ALLOWED).json().send());;

module.exports = router;