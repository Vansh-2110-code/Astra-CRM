const { Sequelize } = require('sequelize');
const { url, nodeEnv } = require('./dbConfig');
const path = require('path');

let sequelize;

if (process.env.USE_SQLITE === 'true' || url.includes('sqlite')) {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../astra_crm_dev.sqlite'),
    logging: false
  });
} else {
  sequelize = new Sequelize(url, {
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
}

module.exports = sequelize;
