const express = require('express');
const routes = require('../routes');
const { handler: customHeader } = require('../middleware/customheaders')

/**
* Express instance
* @public
*/
const app = express();


// parse body params and attache them to req.body
app.use(express.json({ limit: '10mb' }));

//setting the required headers
app.use(customHeader);

// mount routes
app.use(routes);

module.exports = app;