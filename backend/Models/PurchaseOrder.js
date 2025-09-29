const { DataTypes } = require('sequelize');
const sequelize = require('../Server/config');

const PurchaseOrder = sequelize.define('PurchaseOrder', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  po_no: {
    type: DataTypes.STRING(50),
    allowNull: false, 
  },
  po_date: {
    type: DataTypes.DATE,
    allowNull: true, 
  },
  po_type: {
    type: DataTypes.STRING(50),
    allowNull: true, 
  },
  pay_mode: {
    type: DataTypes.STRING(50),
    allowNull: true, 
  },
  discount: {
    type: DataTypes.INTEGER,
    allowNull: true, 
  },
  sub_total: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  grand_total: {
    type: DataTypes.INTEGER,
    allowNull: false, 
  },
  vds_total: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tds_total: {
    type: DataTypes.INTEGER,
    allowNull: true, 
  },
  vendor_id: {
    type: DataTypes.INTEGER,
    allowNull: false, 
    references: {
      model: 'organization', 
      key: 'id',
    },
  },
  store_id: {
    type: DataTypes.INTEGER,
    allowNull: false, 
    references: {
      model: 'organization', 
      key: 'id',
    },
  },
  currency: {
    type: DataTypes.STRING(10),
    allowNull: true, 
  },
  subject: {
    type: DataTypes.STRING(255),
    allowNull: true, 
  },
  remarks: {
    type: DataTypes.STRING(255),
    allowNull: true, 
  },
  company_code: {
    type: DataTypes.STRING(50),
    allowNull: true, 
  },
  created: {
    type: DataTypes.DATE,
    allowNull: true, 
    defaultValue: DataTypes.NOW, 
  },
  created_by: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  modified: {
    type: DataTypes.DATE,
    allowNull: true, 
    defaultValue: DataTypes.NOW, 
  },
  modified_by: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  po_id: {
    type: DataTypes.INTEGER,
    allowNull: true, 
    references: {
      model: 'purchase_order', 
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  timestamps: false, 
  tableName: 'purchase_order',
});

module.exports = PurchaseOrder;