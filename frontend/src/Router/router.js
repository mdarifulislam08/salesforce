import { createBrowserRouter } from "react-router-dom";
import Login from "../Pages/Login/Login";
import SignUp from "../Pages/SignUp/SignUp";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Employees from "../Pages/Employee/Employee";
import Organizations from "../Pages/Organizations/Organizations";
import PurchaseOrders from "../Pages/PurchaseOrder/PurchaseOrder";
// import PurchaseOrderDetails from "../Pages/PurchaseOrderDetails/PurchaseOrderDetails";
import InvProducts from "../Pages/InventoryProduct/InvProduct";
import CreatePurchaseOrder from "../Pages/CreatePurchaseOrder/CreatePurchaseorder";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "signup",
    element: <SignUp />,
  },
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "employees",
    element: <Employees />,
  },
  {
    path: "organizations",
    element: <Organizations />,
  },
  {
    path: "purchase-orders",
    element: <PurchaseOrders />,
  },
  // {
  //   path: "purchase-orders-details",
  //   element: <PurchaseOrderDetails />,
  // },
  {
    path: "inventory-product",
    element: <InvProducts />,
  },
  {
    path: "create-purchase-order",
    element: <CreatePurchaseOrder />,
  },
]);

export default router;
