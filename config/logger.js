const winston = require('winston');
const expressWinston = require('express-winston');
const _ = require('lodash');

const levelToSeverityMap = {
  error: 'ERROR',
  warn: 'WARNING',
  info: 'INFO',
  debug: 'DEBUG',
  silly: 'DEFAULT'
};

const commonLogInfoFormatter = winston.format((info, options) => {
  const topLevelKeysToRemapWhenPresent = [
    'level', 'timestamp', 'message', 'line', 'file', 'threadID',
  ];

  const logInfoToNest = _.chain(info)
    .pick(topLevelKeysToRemapWhenPresent)
    .merge({ type: options.type,
      severity: levelToSeverityMap[info.level]
     })
    .value();

  return _.merge(info, logInfoToNest);
});


const middlewareRequestResponseFormatter = winston.format((info) => {
 return  _.chain(info)
    .merge(
      {
        req: _.get(info, 'meta.req'),
        res: _.get(info, 'meta.res'),
        severity: levelToSeverityMap[info.level]
      },
    )
    .omit([
      'meta',
      'req.headers',
      'req.httpVersion',
      'req.body.password',
    ])
    .value();
});

/* middleware (req/response) logs */

exports.middlewareLogger = expressWinston.logger({
  format: winston.format.combine(
    winston.format.timestamp(),
    middlewareRequestResponseFormatter(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: process.env.NODE_ENV === 'test' ? './requests.log' : '/var/log/webapp/requests.log',
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
    commonLogInfoFormatter({ type: 'csye6225' }),
    winston.format((info) => {
      delete info.password;
      return info;
  })(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
        filename: process.env.NODE_ENV === 'test' ? './requests.log' : '/var/log/webapp/requests.log',
      }),  ],
});