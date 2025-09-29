const { DataTypes } = require('sequelize');
const sequelize = require('../Server/config'); 

const InvProduct = sequelize.define('InvProduct', {
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
  alternate_code: {
    type: DataTypes.STRING(50), 
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(255), 
    allowNull: true, 
  },
  uom: {
    type: DataTypes.STRING(50),
    allowNull: true, 
  },
  product_type: {
    type: DataTypes.STRING(50),
    allowNull: true, 
  },
  product_category: {
    type: DataTypes.STRING(50), 
    allowNull: true, 
  },
  brand_name: {
    type: DataTypes.STRING(100), 
    allowNull: true, 
  },
  has_serial: {
    type: DataTypes.BOOLEAN, 
    allowNull: true, 
  },
}, {
  timestamps: false,
  tableName: 'inv_product',
});

module.exports = InvProduct;
