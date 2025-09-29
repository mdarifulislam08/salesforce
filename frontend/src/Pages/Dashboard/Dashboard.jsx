import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Receipt as ReceiptIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import Sidebar from "../../Components/Sidebar/Sidebar";
import axios from "axios";
import { URL } from "../../config";

const Dashboard = () => {
  const [totals, setTotals] = useState({
    employees: 0,
    organizations: 0,
    purchaseOrders: 0,
    purchaseOrderDetails: 0,
    invProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [
          employeesRes,
          organizationsRes,
          purchaseOrdersRes,
          purchaseOrderDetailsRes,
          invProductsRes,
        ] = await Promise.all([
          axios.get("${URL}/api/employee", { headers }),
          axios.get("${URL}/api/organization", { headers }),
          axios.get("${URL}/api/purchaseorder", { headers }),
          axios.get("${URL}/api/purchaseorderdetail", { headers }),
          axios.get("${URL}/api/invproduct", { headers }),
        ]);

        setTotals({
          employees: employeesRes.data.length,
          organizations: organizationsRes.data.length,
          // purchaseOrders: purchaseOrdersRes.data.length,
          purchaseOrders: purchaseOrdersRes.data.pagination.totalItems,
          purchaseOrderDetails: purchaseOrderDetailsRes.data.length,
          invProducts: invProductsRes.data.length,
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch dashboard data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Sidebar>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
          <CircularProgress />
        </Box>
      </Sidebar>
    );
  }

  if (error) {
    return (
      <Sidebar>
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Sidebar>
    );
  }

  const cards = [
    {
      title: "Total Employees",
      value: totals.employees,
      icon: <PeopleIcon fontSize="large" />,
      gradient: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
      shadow: "0 12px 20px rgba(99, 102, 241, 0.3)",
    },
    {
      title: "Purchase Orders",
      value: totals.purchaseOrders,
      icon: <ReceiptIcon fontSize="large" />,
      gradient: "linear-gradient(135deg, #22C55E 0%, #10B981 100%)",
      shadow: "0 12px 20px rgba(34, 197, 94, 0.3)",
    },
    {
      title: "Total Organizations",
      value: totals.organizations,
      icon: <BusinessIcon fontSize="large" />,
      gradient: "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",
      shadow: "0 12px 20px rgba(249, 115, 22, 0.3)",
    },
    {
      title: "Inventory Products",
      value: totals.invProducts,
      icon: <InventoryIcon fontSize="large" />,
      gradient: "linear-gradient(135deg, #EF4444 0%, #E11D48 100%)",
      shadow: "0 12px 20px rgba(239, 68, 68, 0.3)",
    },
  ];

  return (
    <Sidebar>
      <Box sx={{ width: "100%" }}>
        <Grid container spacing={2} sx={{ mb: 4, alignItems: 'stretch' }}>
          {cards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex' }}>
              <Card
                elevation={0}
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '16px',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  background: card.gradient,
                  color: 'white',
                  overflow: 'hidden',
                  position: 'relative',
                  minHeight: 180,
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: card.shadow,
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSI+PC9yZWN0PjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSI+PC9yZWN0Pjwvc3ZnPg==')",
                    opacity: 0.1,
                  },
                }}
              >
                <CardContent sx={{ p: 3, position: 'relative', zIndex: 1, flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
                      {card.title}
                    </Typography>
                    <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.2)', height: 48, width: 48 }}>
                      {card.icon}
                    </Avatar>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, fontFamily: 'Poppins, sans-serif', fontSize: '2.25rem' }}>
                    {card.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Sidebar>
  );
};

export default Dashboard;
