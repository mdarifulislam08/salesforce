const { DataTypes } = require('sequelize');
const sequelize = require('../Server/config');

const Organization = sequelize.define('Organization', {
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
  address: {
    type: DataTypes.STRING(255),
    allowNull: true, 
  },
  contact_person: {
    type: DataTypes.STRING(100),
    allowNull: true, 
  },
  contact_no: {
    type: DataTypes.STRING(15),
    allowNull: true, 
  },
  channel: {
    type: DataTypes.STRING(50),
    allowNull: true, 
  },
  region: {
    type: DataTypes.STRING(50),
    allowNull: true, 
  },
  area: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  territory: {
    type: DataTypes.STRING(50),
    allowNull: true, 
  },
  company_code: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  org_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Organization', 
      key: 'id',
    },
  },
  org_type: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  path_text: {
    type: DataTypes.STRING(255),
    allowNull: true, 
  },
}, {
  timestamps: false, 
  tableName: 'organization',
});

module.exports = Organization;
