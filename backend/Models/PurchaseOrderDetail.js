const { DataTypes } = require('sequelize');
const sequelize = require('../Server/config');

const PurchaseOrderDetail = sequelize.define('PurchaseOrderDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  line_no: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  inv_product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'inv_product',
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  unit_price: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  discount: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  discount_pct: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  total_price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  vds_pct: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  vds: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tds_pct: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tds: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  po_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'purchase_order',
      key: 'id',
    },
  },
}, {
  timestamps: false,
  tableName: 'purchase_order_detail',
});

module.exports = PurchaseOrderDetail;