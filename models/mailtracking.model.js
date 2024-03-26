module.exports = (sequelize, Sequelize) => {
    const MailTracking = sequelize.define("MailTracking", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      mail_sent: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        defaultValue: false,
        unique: true,
      },
    });
    return MailTracking;
  };
  