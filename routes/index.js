const express = require('express');
const router = express.Router();

const routesV1 = require('./v1');

const httpStatus = require('http-status');

const { noPayload } = require('../middleware/payload.js');



const { healthController : health } = require('../controllers/health.controller');


/**
 * GET health checkup
 */
router.route('/healthz').
get(noPayload, health).all((req, res, next) => res.status(httpStatus.METHOD_NOT_ALLOWED).json().send());

router.use(routesV1);


module.exports = router;