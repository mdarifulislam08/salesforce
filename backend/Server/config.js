require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL || `mysql://${process.env.MYSQLUSER || 'root'}:${process.env.MYSQLPASSWORD || ''}@${process.env.MYSQLHOST || 'localhost'}:${process.env.MYSQLPORT || 3306}/${process.env.MYSQLDATABASE || 'salesforce'}`, {
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false // Required for Railway's SSL proxy
    }
  }
});

module.exports = sequelize;
