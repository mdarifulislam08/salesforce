const InvProduct = require('../Models/InvProduct');
const { Op } = require('sequelize');


// Create a new InvProduct
const createInvProduct = async (req, res) => {
  const {
    code,
    alternate_code,
    name,
    description,
    uom,
    product_type,
    product_category,
    brand_name,
    has_serial,
  } = req.body;

  try {
    const newInvProduct = await InvProduct.create({
      code,
      alternate_code,
      name,
      description,
      uom,
      product_type,
      product_category,
      brand_name,
      has_serial,
    });

    res.status(201).json({
      message: 'Inventory Product created successfully',
      invProduct: newInvProduct,
    });
  } catch (error) {
    console.error('Error creating Inventory Product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all InvProducts
const getAllInvProducts = async (req, res) => {
  try {
    const invProducts = await InvProduct.findAll();
    res.status(200).json(invProducts);
  } catch (error) {
    console.error('Error fetching Inventory Products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get InvProduct by ID
const getInvProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const invProduct = await InvProduct.findByPk(id);
    if (!invProduct) {
      return res.status(404).json({ error: 'Inventory Product not found' });
    }
    res.status(200).json(invProduct);
  } catch (error) {
    console.error('Error fetching Inventory Product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update InvProduct
const updateInvProduct = async (req, res) => {
  const { id } = req.params;
  const {
    code,
    alternate_code,
    name,
    description,
    uom,
    product_type,
    product_category,
    brand_name,
    has_serial,
  } = req.body;

  try {
    const [updated] = await InvProduct.update(
      {
        code,
        alternate_code,
        name,
        description,
        uom,
        product_type,
        product_category,
        brand_name,
        has_serial,
      },
      { where: { id } }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Inventory Product not found' });
    }

    const updatedInvProduct = await InvProduct.findByPk(id);
    res.status(200).json({
      message: 'Inventory Product updated successfully',
      invProduct: updatedInvProduct,
    });
  } catch (error) {
    console.error('Error updating Inventory Product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete InvProduct
const deleteInvProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await InvProduct.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ error: 'Inventory Product not found' });
    }
    res.status(200).json({ message: 'Inventory Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting Inventory Product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const searchInvProducts = async (req, res) => {
  const { query } = req.query;

  // Require at least 2 characters for search
  if (!query || query.trim().length < 2) {
    return res.status(400).json({ error: 'Query must be at least 2 characters long' });
  }

  try {
    const products = await InvProduct.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { code: { [Op.like]: `%${query}%` } },
        ],
      },
      limit: 50, // Limit results for performance
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createInvProduct,
  getAllInvProducts,
  getInvProductById,
  updateInvProduct,
  deleteInvProduct,
  searchInvProducts,
};
