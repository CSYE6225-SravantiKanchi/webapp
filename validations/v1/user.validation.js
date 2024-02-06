const { Joi, Segments } = require('celebrate');

module.exports = {
  // POST /api/v1/config/
  create: {
    [Segments.QUERY]:Joi.object().keys({}).unknown(false),
    [Segments.BODY]: Joi.object().keys({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      password: Joi.string().required(),
      username: Joi.string().required(),
    }).unknown(false),
  },

  // PUT /api/v1/config/
  update: {
    [Segments.QUERY]:Joi.object().keys({}).unknown(false),
    [Segments.BODY]:  Joi.object().keys({
      first_name: Joi.string(),
      last_name: Joi.string(),
      password: Joi.string(),
    }).or('first_name', 'last_name', 'password').unknown(false),
  },
};
