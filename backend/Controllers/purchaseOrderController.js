const PurchaseOrder = require('../Models/PurchaseOrder');
const PurchaseOrderDetail = require('../Models/PurchaseOrderDetail');
const { Op } = require('sequelize');
const sequelize = require('../Server/config');

// Create a new Purchase Order
const createPurchaseOrder = async (req, res) => {
  const {
    po_date, po_type, pay_mode, discount, sub_total, grand_total,
    vds_total, tds_total, vendor_id, store_id, currency, subject, remarks,
    company_code
  } = req.body;

  try {
    // Generate po_no
    const lastPo = await PurchaseOrder.findOne({
      order: [['id', 'DESC']],
      attributes: ['po_no']
    });
    let poNumber = 'PO1'; // Default starting value
    if (lastPo && lastPo.po_no) {
      const lastNumber = parseInt(lastPo.po_no.replace('PO', '')) || 0;
      poNumber = `PO${lastNumber + 1}`;
    }

    // Get user ID from JWT
    const userId = req.user ? req.user.id : null;
    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    // Create Purchase Order
    const newPurchaseOrder = await PurchaseOrder.create({
      po_no: poNumber,
      po_date: po_date || null,
      po_type: po_type || null,
      pay_mode: pay_mode || null,
      discount: parseFloat(discount) || null,
      sub_total: parseFloat(sub_total) || null,
      grand_total: parseFloat(grand_total) || null,
      vds_total: parseFloat(vds_total) || null,
      tds_total: parseFloat(tds_total) || null,
      vendor_id: parseInt(vendor_id) || null,
      store_id: parseInt(store_id) || null,
      currency: currency || null,
      subject: subject || null,
      remarks: remarks || null,
      company_code: company_code || null,
      created_by: userId.toString(),
      modified_by: userId.toString(),
      created: new Date(),
      modified: new Date(),
      po_id: null
    });

    // Set po_id to the newly created purchase order's id
    await newPurchaseOrder.update({ po_id: newPurchaseOrder.id });

    res.status(201).json({
      message: 'Purchase Order created successfully',
      purchaseOrder: newPurchaseOrder,
    });
  } catch (error) {
    console.error('Error creating Purchase Order:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Update Purchase Order
const updatePurchaseOrder = async (req, res) => {
  const { id } = req.params;
  const {
    po_no, po_date, po_type, pay_mode, discount, sub_total, grand_total,
    vds_total, tds_total, vendor_id, store_id, currency, subject, remarks,
    company_code
  } = req.body;

  try {
    // Get user ID from JWT
    const userId = req.user ? req.user.id : null;
    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    if (!po_no) {
      return res.status(400).json({ error: 'Purchase Order number is required' });
    }

    // Check for po_no uniqueness
    const existingPo = await PurchaseOrder.findOne({
      where: { po_no, id: { [Op.ne]: id } },
    });
    if (existingPo) {
      return res.status(400).json({ error: `Purchase Order number ${po_no} is already in use` });
    }

    const [updated] = await PurchaseOrder.update(
      {
        po_no: po_no || null,
        po_date: po_date || null,
        po_type: po_type || null,
        pay_mode: pay_mode || null,
        discount: parseFloat(discount) || null,
        sub_total: parseFloat(sub_total) || null,
        grand_total: parseFloat(grand_total) || null,
        vds_total: parseFloat(vds_total) || null,
        tds_total: parseFloat(tds_total) || null,
        vendor_id: parseInt(vendor_id) || null,
        store_id: parseInt(store_id) || null,
        currency: currency || null,
        subject: subject || null,
        remarks: remarks || null,
        company_code: company_code || null,
        modified_by: userId.toString(),
        modified: new Date(),
        po_id: parseInt(id)
      },
      { where: { id } }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Purchase Order not found' });
    }

    const updatedPurchaseOrder = await PurchaseOrder.findByPk(id);
    res.status(200).json({
      message: 'Purchase Order updated successfully',
      purchaseOrder: updatedPurchaseOrder,
    });
  } catch (error) {
    console.error('Error updating Purchase Order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all Purchase Orders with pagination
const getAllPurchaseOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const offset = (page - 1) * limit;

    const { count, rows } = await PurchaseOrder.findAndCountAll({
      offset,
      limit,
      order: [['created', 'DESC']],
    });

    res.status(200).json({
      purchaseOrders: rows,
      pagination: {
        totalItems: count,
        currentPage: page,
        pageSize: limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching Purchase Orders:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Get Purchase Order by ID
const getPurchaseOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const purchaseOrder = await PurchaseOrder.findByPk(id);
    if (!purchaseOrder) {
      return res.status(404).json({ error: 'Purchase Order not found' });
    }
    res.status(200).json(purchaseOrder);
  } catch (error) {
    console.error('Error fetching Purchase Order:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Delete Purchase Order
const deletePurchaseOrder = async (req, res) => {
  const { id } = req.params;

  try {
    // transaction
    const result = await sequelize.transaction(async (t) => {
      // Find the Purchase Order
      const purchaseOrder = await PurchaseOrder.findByPk(id, { transaction: t });
      if (!purchaseOrder) {
        return { error: 'Purchase Order not found', status: 404 };
      }

      // Check for child PurchaseOrder
      const childOrdersCount = await PurchaseOrder.count({
        where: { po_id: id },
        transaction: t,
      });

      if (childOrdersCount > 0) {
        // Set po_id to null
        await PurchaseOrder.update(
          { po_id: null },
          { where: { po_id: id }, transaction: t }
        );
      }

      // Check PurchaseOrderDetails
      const detailsCount = await PurchaseOrderDetail.count({
        where: { po_id: id },
        transaction: t,
      });

      if (detailsCount > 0) {
        // Delete PurchaseOrderDetails
        await PurchaseOrderDetail.destroy({
          where: { po_id: id },
          transaction: t,
        });
      }

      // Delete the Purchase Order
      await purchaseOrder.destroy({ transaction: t });

      return { success: true };
    });

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    res.status(200).json({ message: 'Purchase Order and associated records deleted successfully' });
  } catch (error) {
    console.error('Error deleting Purchase Order:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Search Purchase Orders with pagination
const searchPurchaseOrders = async (req, res) => {
  const { query, page = 1, limit = 25 } = req.query;

  try {
    const pageNum = parseInt(page);
    const pageSize = parseInt(limit);
    const offset = (pageNum - 1) * pageSize;

    if (!query || query.trim() === '') {
      const { count, rows } = await PurchaseOrder.findAndCountAll({
        offset,
        limit: pageSize,
        order: [['created', 'DESC']],
      });
      return res.status(200).json({
        purchaseOrders: rows,
        pagination: {
          totalItems: count,
          currentPage: pageNum,
          pageSize,
          totalPages: Math.ceil(count / pageSize),
        },
      });
    }

    const { count, rows } = await PurchaseOrder.findAndCountAll({
      where: {
        [Op.or]: [
          { po_no: { [Op.like]: `%${query}%` } },
          { po_type: { [Op.like]: `%${query}%` } },
          { pay_mode: { [Op.like]: `%${query}%` } },
          { company_code: { [Op.like]: `%${query}%` } },
        ],
      },
      offset,
      limit: pageSize,
      order: [['created', 'DESC']],
    });

    res.status(200).json({
      purchaseOrders: rows,
      pagination: {
        totalItems: count,
        currentPage: pageNum,
        pageSize,
        totalPages: Math.ceil(count / pageSize),
      },
    });
  } catch (error) {
    console.error('Error searching purchase orders:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

module.exports = {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrder,
  deletePurchaseOrder,
  searchPurchaseOrders,
};