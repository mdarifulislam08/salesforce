require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./Server/config');

const { signUp, loginUser, verifyToken, getUserData } = require('./Controllers/authController');
const EmployeeController = require('./Controllers/employeeController');
const OrganizationController = require('./Controllers/organizationController');
const PurchaseOrderController = require('./Controllers/purchaseOrderController');
const PurchaseOrderDetailController = require('./Controllers/purchaseOrderDetailsController');
const InvProductController = require('./Controllers/invProductController');


const app = express();

// Middleware
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());


// User routes
app.post('/api/signup', signUp);
app.post('/api/login', loginUser);
app.get('/api/user', verifyToken, getUserData);


// Routes for Employee
app.post('/api/employee', verifyToken, EmployeeController.createEmployee);
app.get('/api/employee', verifyToken, EmployeeController.getAllEmployees);
app.get('/api/employee/:id', verifyToken, EmployeeController.getEmployeeById);
app.put('/api/employee/:id', verifyToken, EmployeeController.updateEmployee);
app.delete('/api/employee/:id', verifyToken, EmployeeController.deleteEmployee);


// Routes for Organization
app.post('/api/organization', verifyToken, OrganizationController.createOrganization); 
app.get('/api/organization', verifyToken, OrganizationController.getAllOrganizations); 
app.get('/api/organization/search', verifyToken, OrganizationController.searchOrganizations);
app.get('/api/organization/:id', verifyToken, OrganizationController.getOrganizationById);
app.put('/api/organization/:id', verifyToken, OrganizationController.updateOrganization); 
app.delete('/api/organization/:id', verifyToken, OrganizationController.deleteOrganization);


// Routes for PurchaseOrder
app.post('/api/purchaseorder', verifyToken, PurchaseOrderController.createPurchaseOrder);
app.get('/api/purchaseorder', verifyToken, PurchaseOrderController.getAllPurchaseOrders);
app.get('/api/purchaseorder/search', verifyToken, PurchaseOrderController.searchPurchaseOrders);
app.get('/api/purchaseorder/:id', verifyToken, PurchaseOrderController.getPurchaseOrderById);
app.put('/api/purchaseorder/:id', verifyToken, PurchaseOrderController.updatePurchaseOrder);
app.delete('/api/purchaseorder/:id', verifyToken, PurchaseOrderController.deletePurchaseOrder);



// Routes for PurchaseOrderDetail
app.post('/api/purchaseorderdetail', verifyToken, PurchaseOrderDetailController.createPurchaseOrderDetail);
app.get('/api/purchaseorderdetail', verifyToken, PurchaseOrderDetailController.getAllPurchaseOrderDetails);
app.get('/api/purchaseorderdetail/:id', verifyToken, PurchaseOrderDetailController.getPurchaseOrderDetailById);
app.put('/api/purchaseorderdetail/:id', verifyToken, PurchaseOrderDetailController.updatePurchaseOrderDetail);
app.delete('/api/purchaseorderdetail/:id', verifyToken, PurchaseOrderDetailController.deletePurchaseOrderDetail);


// Routes for InvProduct
app.post('/api/invproduct', verifyToken, InvProductController.createInvProduct);
app.get('/api/invproduct', verifyToken, InvProductController.getAllInvProducts);
app.get('/api/invproduct/search', verifyToken, InvProductController.searchInvProducts);
app.get('/api/invproduct/:id', verifyToken, InvProductController.getInvProductById);
app.put('/api/invproduct/:id', verifyToken, InvProductController.updateInvProduct);
app.delete('/api/invproduct/:id', verifyToken, InvProductController.deleteInvProduct);

// Health check route for Render
app.get('/health', (req, res) => {
  res.status(200).send('ok');
});


const PORT = process.env.PORT || 5000;

sequelize.sync()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });
