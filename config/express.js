const express = require('express');
const routes = require('../routes');
const { handler: customHeader } = require('../middleware/customheaders');

const { validationError, notFoundError } = require('../middleware/error');

/**
* Express instance
* @public
*/
const app = express();


// parse body params and attache them to req.body
app.use(express.json());

//setting the required headers
app.use(customHeader);

// mount routes
app.use(routes);

// error Handling
app.use(validationError);

//error 
app.use(notFoundError);

module.exports = app;