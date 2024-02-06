const { port, env } = require('./config/vars');
const app = require('./config/express');
const { sequelize } = require('./models'); // listen to requests

sequelize.sync({ force: false }).then( () => {
    app.listen(port, () => console.log(`Server started on port ${port} (${env})`));
  });

module.exports = app;