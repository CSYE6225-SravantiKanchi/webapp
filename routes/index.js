const express = require('express');
const router = express.Router();
const httpStatus = require('http-status');


const { healthController : health } = require('../controllers/health.controller');


/**
 * GET health checkup
 */
router.route('/healthz').
get(health).all((req, res, next) => res.status(httpStatus.METHOD_NOT_ALLOWED).json().send());


module.exports = router;