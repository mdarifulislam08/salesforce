const PurchaseOrderDetail = require('../Models/PurchaseOrderDetail');
const PurchaseOrder = require('../Models/PurchaseOrder');

// Create a new PurchaseOrderDetail
const createPurchaseOrderDetail = async (req, res) => {
  const {
    line_no, inv_product_id, quantity, unit_price, discount, discount_pct,
    total_price, vds_pct, vds, tds_pct, tds, po_id,
  } = req.body;

  try {
    // Validate if the Purchase Order exists
    const purchaseOrder = await PurchaseOrder.findByPk(po_id);
    if (!purchaseOrder) {
      return res.status(400).json({ error: 'Purchase Order does not exist' });
    }

    const newPurchaseOrderDetail = await PurchaseOrderDetail.create({
      line_no,
      inv_product_id,
      quantity,
      unit_price,
      discount,
      discount_pct,
      total_price,
      vds_pct,
      vds,
      tds_pct,
      tds,
      po_id,
    });

    res.status(201).json({
      message: 'Purchase Order Detail created successfully',
      purchaseOrderDetail: newPurchaseOrderDetail,
    });
  } catch (error) {
    console.error('Error creating Purchase Order Detail:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all PurchaseOrderDetails
const getAllPurchaseOrderDetails = async (req, res) => {
  try {
    const purchaseOrderDetails = await PurchaseOrderDetail.findAll();
    res.status(200).json(purchaseOrderDetails);
  } catch (error) {
    console.error('Error fetching Purchase Order Details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get PurchaseOrderDetail by ID
const getPurchaseOrderDetailById = async (req, res) => {
  const { id } = req.params;

  try {
    const purchaseOrderDetail = await PurchaseOrderDetail.findByPk(id);
    if (!purchaseOrderDetail) {
      return res.status(404).json({ error: 'Purchase Order Detail not found' });
    }
    res.status(200).json(purchaseOrderDetail);
  } catch (error) {
    console.error('Error fetching Purchase Order Detail:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update PurchaseOrderDetail
const updatePurchaseOrderDetail = async (req, res) => {
  const { id } = req.params;
  const {
    line_no, inv_product_id, quantity, unit_price, discount, discount_pct,
    total_price, vds_pct, vds, tds_pct, tds, po_id,
  } = req.body;

  try {
    // Validate if the Purchase Order exists
    const purchaseOrder = await PurchaseOrder.findByPk(po_id);
    if (!purchaseOrder) {
      return res.status(400).json({ error: 'Purchase Order does not exist' });
    }

    const [updated] = await PurchaseOrderDetail.update(
      { 
        line_no, 
        inv_product_id, 
        quantity, 
        unit_price, 
        discount, 
        discount_pct, 
        total_price, 
        vds_pct, 
        vds, 
        tds_pct, 
        tds, 
        po_id
      },
      { where: { id } }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Purchase Order Detail not found' });
    }

    const updatedPurchaseOrderDetail = await PurchaseOrderDetail.findByPk(id);
    res.status(200).json({
      message: 'Purchase Order Detail updated successfully',
      purchaseOrderDetail: updatedPurchaseOrderDetail,
    });
  } catch (error) {
    console.error('Error updating Purchase Order Detail:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete PurchaseOrderDetail
const deletePurchaseOrderDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await PurchaseOrderDetail.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ error: 'Purchase Order Detail not found' });
    }
    res.status(200).json({ message: 'Purchase Order Detail deleted successfully' });
  } catch (error) {
    console.error('Error deleting Purchase Order Detail:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createPurchaseOrderDetail,
  getAllPurchaseOrderDetails,
  getPurchaseOrderDetailById,
  updatePurchaseOrderDetail,
  deletePurchaseOrderDetail,
};
