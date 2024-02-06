const { v4 : uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      id: {
        type: Sequelize.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
    },{ 
      updatedAt: 'account_updated',
      createdAt: 'account_created',
    });

    // Class method to compare passwords
    User.prototype.comparePassword = async function(plaintextPassword) {
        return await bcrypt.compare(plaintextPassword, this.password);
    };

    return User;
};

