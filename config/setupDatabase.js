const Sequelize = require('sequelize');

const { sqlUri, database } = require('./vars');

const setupDatabase = async () => {
    try {
        const sequelize = new Sequelize(sqlUri);
        await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        await sequelize.close();
    } catch (error) {
        console.error('Failed to create database:', error);
    }
};

exports.setupDatabase = setupDatabase;
