const { Sequelize } = require('sequelize');
const { url, nodeEnv } = require('./dbConfig');

const sequelize = new Sequelize(url, {
  dialect: 'mysql',
  logging: nodeEnv === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;
