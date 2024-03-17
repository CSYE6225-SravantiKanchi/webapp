const winston = require('winston');
const expressWinston = require('express-winston');
const _ = require('lodash');

const commonLogInfoFormatter = winston.format((info, options) => {
  const topLevelKeysToRemapWhenPresent = [
    'level', 'timestamp', 'message', 'line', 'file', 'threadID',
  ];

  const logInfoToNest = _.chain(info)
    .pick(topLevelKeysToRemapWhenPresent)
    .merge({ type: options.type })
    .value();
  return _.chain(info)
    .merge({ log: logInfoToNest })
    .omit(topLevelKeysToRemapWhenPresent)
    .value();
});


const middlewareRequestResponseFormatter = winston.format((info) => {
 return  _.chain(info)
    .merge(
      {
        req: _.get(info, 'meta.req'),
        res: _.get(info, 'meta.res'),
      },
    )
    .omit([
      'meta',
      'req.headers.authorization',
      'req.headers.cookie',
      'req.headers["x-auth-token"]',
      'req.headers["x-consumer-profile"]',
    ])
    .value();
});

/* middleware logs */

exports.middlewareLogger = expressWinston.logger({
  format: winston.format.combine(
    winston.format.timestamp(),
    middlewareRequestResponseFormatter(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
        level: 'debug' 
    }),
    new winston.transports.File({
        filename: './requests.log', // Specify your log file path here
      }),
  ],
  expressFormat: true,
  requestWhitelist: [...expressWinston.requestWhitelist, 'body'],
  responseWhitelist: [...expressWinston.responseWhitelist, 'body'],
});

/* Application Logger */

exports.logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    // commonLogInfoFormatter({ type: 'app' }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
        level: 'debug' 
    }),
    new winston.transports.File({
        filename: process.env.NODE_ENV === 'test' ? './requests.log' : '/var/log/webapp/requests.log',
      }),  ],
});