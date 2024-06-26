const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
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

      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      verification_token: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4       
      },
      verified_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
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

