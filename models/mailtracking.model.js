module.exports = (sequelize, Sequelize) => {
    const MailTracking = sequelize.define("MailTracking", {
      mail_sent: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
    },{
      timestamps: false,
    });
    return MailTracking;
  };
  