const express = require('express');

const userRoutes = require('./user.route');

const router = express.Router();

router.use('/v1/user', userRoutes);

module.exports = router;
