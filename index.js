const { port, env } = require('./config/vars');
const app = require('./config/express');

const { setupDatabase } = require('./config/setupDatabase');
const { logger } = require('./config/logger')
// listen to requests

setupDatabase().then(()=> {
  const { sequelize } = require('./models'); 
  sequelize.sync({ alter: true }).then( () => {

    app.listen(port, () => logger.info(`DB Connected and Server started on port ${port} (${env})`));
  });
});


module.exports = app;