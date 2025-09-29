const { DataTypes } = require('sequelize');
const sequelize = require('../Server/config');

const Lookup = sequelize.define('Lookup', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, 
  },
  code: {
    type: DataTypes.STRING(50), 
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100), 
    allowNull: false,
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Organization', 
      key: 'id',
    },
  },
  path_text: {
    type: DataTypes.STRING(255), 
    allowNull: true, 
  },
}, {
  timestamps: false, 
  tableName: 'lookup', 
});


module.exports = Lookup;
