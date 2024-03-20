const httpStatus = require('http-status');
const {isEmpty } = require('lodash');


exports.noPayload = (req, res, next) => {
  try{
    if(!isEmpty(req.body) || !isEmpty(req.query) || req.headers['content-length'] >0 ) {
        return res.status(httpStatus.BAD_REQUEST).json().send();
      } 
    next();
    } catch(err) {
      console.log(err);
    }
  };
