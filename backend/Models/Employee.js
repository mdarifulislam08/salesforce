const { DataTypes } = require('sequelize');
const sequelize = require('../Server/config');

const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  designation: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  contact_no: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  role_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  company_code: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  sh: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  ch: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  kam: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  rm: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  am: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  tm: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  so: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Employee',
      key: 'id',
    },
  },
  path_text: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'User',
      key: 'id',
    },
  },
}, {
  timestamps: false,
  tableName: 'employee',
});

module.exports = Employee;
