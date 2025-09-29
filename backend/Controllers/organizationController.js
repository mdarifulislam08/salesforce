const Organization = require('../Models/Organization');
const { Op } = require('sequelize');

// Create Organization
const createOrganization = async (req, res) => {
  const {
    code, name, address, contact_person, contact_no, channel, region, area,
    territory, company_code, org_id, org_type, path_text
  } = req.body;

  let validParentId = null;
  if (org_id) {
    const parent = await Organization.findByPk(org_id);
    if (!parent) {
      return res.status(400).json({ error: `Parent organization ID ${org_id} does not exist.` });
    }
    validParentId = org_id;
  }


  try {
    // Create the new organization
    const newOrganization = await Organization.create({
      code,
      name,
      address,
      contact_person,
      contact_no,
      channel,
      region,
      area,
      territory,
      company_code,
      org_id: validParentId, // Parent organization
      org_type,
      path_text
    });

    res.status(201).json({
      message: 'Organization created successfully',
      organization: newOrganization,
    });
  } catch (error) {
    console.error('Error creating organization:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get All Organizations
const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.findAll();
    res.status(200).json(organizations);
  } catch (error) {
    console.error('Error fetching organizations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get Organization by ID
const getOrganizationById = async (req, res) => {
  const { id } = req.params;

  try {
    const organization = await Organization.findByPk(id);
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    res.status(200).json(organization);
  } catch (error) {
    console.error('Error fetching organization:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update Organization
const updateOrganization = async (req, res) => {
  const { id } = req.params;
  const {
    code, name, address, contact_person, contact_no, channel, region, area,
    territory, company_code, org_id, org_type, path_text
  } = req.body;

  let validParentId = null;
  if (org_id) {
    if (parseInt(org_id) === parseInt(id)) {
      return res.status(400).json({ error: 'Organization cannot be its own parent.' });
    }
    const parent = await Organization.findByPk(org_id);
    if (!parent) {
      return res.status(400).json({ error: `Parent organization ID ${org_id} does not exist.` });
    }
    validParentId = org_id;
  }

  try {
    const [updated] = await Organization.update(
      { 
        code, name, address, contact_person, contact_no, channel, region, area, 
        territory, company_code, org_id: validParentId, org_type, path_text
      },
      { where: { id } }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const updatedOrganization = await Organization.findByPk(id);
    res.status(200).json({
      message: 'Organization updated successfully',
      organization: updatedOrganization,
    });
  } catch (error) {
    console.error('Error updating organization:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete Organization
const deleteOrganization = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Organization.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    res.status(200).json({ message: 'Organization deleted successfully' });
  } catch (error) {
    console.error('Error deleting organization:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const searchOrganizations = async (req, res) => {
  const { query } = req.query;

  // Require at least 2 characters for search
  if (!query || query.trim().length < 2) {
    return res.status(400).json({ error: 'Query must be at least 2 characters long' });
  }

  try {
    const organizations = await Organization.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { code: { [Op.like]: `%${query}%` } },
        ],
      },
      limit: 50, // Limit results for performance
    });

    res.status(200).json(organizations);
  } catch (error) {
    console.error('Error searching organizations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createOrganization,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
  searchOrganizations,
};
