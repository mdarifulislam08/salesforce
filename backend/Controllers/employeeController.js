const Employee = require('../Models/Employee');

// Create Employee
const createEmployee = async (req, res) => {
  const {
    code, name, department, designation, contact_no, role_name, company_code, 
    sh, ch, kam, rm, am, tm, so, parent_id, path_text
  } = req.body;

  const user_id = req.user ? req.user.id : null;

  try {
    // If parent_id is provided, ensure that it exists in the employee table
    let validParentId = null;
    if (parent_id) {
      const parentExists = await Employee.findByPk(parent_id);
      if (!parentExists) {
        return res.status(400).json({ error: `Parent with ID ${parent_id} does not exist.` });
      }
      validParentId = parent_id; // Use the valid parent_id if it exists
    }

    const newEmployee = await Employee.create({
      code,
      name,
      department,
      designation,
      contact_no,
      role_name,
      company_code,
      sh,
      ch,
      kam,
      rm,
      am,
      tm,
      so,
      parent_id: validParentId, // Save valid parent_id or null
      path_text,
      user_id,
    });

    res.status(201).json({
      message: 'Employee created successfully',
      employee: newEmployee,
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get Employee by ID
const getEmployeeById = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update Employee
const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const {
    code, name, department, designation, contact_no, role_name, company_code, 
    sh, ch, kam, rm, am, tm, so, parent_id, path_text
  } = req.body;

  const user_id = req.user ? req.user.id : null;

  try {
    // If parent_id is provided, ensure that it exists in the employee table
    let validParentId = null;
    if (parent_id) {
      const parentExists = await Employee.findByPk(parent_id);
      if (!parentExists) {
        return res.status(400).json({ error: `Parent with ID ${parent_id} does not exist.` });
      }
      if (parseInt(parent_id) === parseInt(id)) {
        return res.status(400).json({ error: 'Employee cannot be their own parent.' });
      }
      validParentId = parent_id; // Use the valid parent_id if it exists
    }

    const [updated] = await Employee.update(
      { 
        code, 
        name, 
        department, 
        designation, 
        contact_no, 
        role_name, 
        company_code, 
        sh, 
        ch, 
        kam, 
        rm, 
        am, 
        tm, 
        so, 
        parent_id: validParentId,
        path_text, 
        user_id 
      },
      { where: { id } }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const updatedEmployee = await Employee.findByPk(id);
    res.status(200).json({
      message: 'Employee updated successfully',
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete Employee
const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Employee.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get All Employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getAllEmployees,
};