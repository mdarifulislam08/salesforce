import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
  TextField,
  Card,
  CardContent,
  Avatar,
  Grid,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Button,
  Tooltip,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Print as PrintIcon,
  CloudDownload as CloudDownloadIcon,
} from "@mui/icons-material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Papa from "papaparse";
import { URL } from "../../config";
import Sidebar from "../../Components/Sidebar/Sidebar";
import PurchaseOrderDetailsDialog from "./PurchaseOrderDetailsDialog";
import EditPurchaseOrderDialog from "./EditPurchaseOrderDialog";
import { renderToString } from "react-dom/server";
import PurchaseOrderPrint from "./PurchaseOrderPrint";

const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 50%)`;
};

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const PurchaseOrders = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const searchInputRef = useRef(null);

  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPoId, setSelectedPoId] = useState(null);
  const [poDetails, setPoDetails] = useState([]);
  const [childOrders, setChildOrders] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [poToDelete, setPoToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [limit, setLimit] = useState(25);

  const authCheked = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded JWT:", decoded);
        setUserId(decoded.id);
      } catch (err) {
        console.error("Error decoding JWT:", err);
        setError("Invalid authentication token");
      }
    } else {
      console.warn("No auth token found");
      setError("No authentication token found");
    }
  };

  console.log("User ID:", userId);

  useEffect(() => {
    authCheked();
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found");
        }
        const [orgResponse, productResponse] = await Promise.all([
          axios.get(`${URL}/api/organization`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${URL}/api/invproduct`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setOrganizations(Array.isArray(orgResponse.data) ? orgResponse.data : []);
        setProducts(Array.isArray(productResponse.data) ? productResponse.data : []);
      } catch (err) {
        console.error("Error fetching data:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setError(`Failed to fetch required data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    fetchPurchaseOrders(1);
  }, []);

  const fetchPurchaseOrders = async (pageNum, limit = 25) => {
    setLoading(true);
    try {
      const response = await axios.get(`${URL}/api/purchaseorder`, {
        params: { page: pageNum, limit },
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      const purchaseOrders = Array.isArray(response.data.purchaseOrders) ? response.data.purchaseOrders : [];
      setPurchaseOrders(purchaseOrders);
      setTotalItems(response.data.pagination?.totalItems || 0);
      setPage(pageNum - 1);
      setLimit(limit);
    } catch (err) {
      console.error("Error fetching purchase orders:", err);
      setError("Failed to fetch purchase orders");
      setPurchaseOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const searchPurchaseOrders = async (query, pageNum, limit = 25) => {
    setSearchLoading(true);
    try {
      const response = await axios.get(`${URL}/api/purchaseorder/search`, {
        params: { query, page: pageNum, limit },
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      const purchaseOrders = Array.isArray(response.data.purchaseOrders) ? response.data.purchaseOrders : [];
      setPurchaseOrders(purchaseOrders);
      setTotalItems(response.data.pagination?.totalItems || 0);
      setPage(pageNum - 1);
      setLimit(limit);
    } catch (err) {
      console.error("Error searching purchase orders:", err);
      const errorMessage = err.response?.data?.error || "Failed to search purchase orders";
      setError(errorMessage);
      setPurchaseOrders([]);
    } finally {
      setSearchLoading(false);
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }
  };

  const debouncedSearch = debounce((query, pageNum) => {
    searchPurchaseOrders(query, pageNum);
  }, 500);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    // searchPurchaseOrders(query, 1);
    debouncedSearch(query, 1);
  };

  const fetchPoDetails = async (purchaseOrderId) => {
    setDetailsLoading(true);
    setDetailsError(null);
    setPoDetails([]);
    setChildOrders([]);
    try {
      const po = purchaseOrders.find((p) => p.id === purchaseOrderId);
      if (!po) {
        throw new Error(`Purchase Order with id ${purchaseOrderId} not found.`);
      }
      const poIdToFetch = po.po_id !== null ? po.po_id : po.id;
      const [detailsResponse, childOrdersResponse] = await Promise.all([
        axios.get(
          `${URL}/api/purchaseorderdetail?po_id=${poIdToFetch}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          }
        ),
        axios.get(
          `${URL}/api/purchaseorder/search`,
          {
            params: { query: `po_id:${purchaseOrderId}`, page: 1, limit: 1000 },
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          }
        ),
      ]);
      const filteredDetails = detailsResponse.data.filter((detail) => detail.po_id === poIdToFetch);
      const childOrders = Array.isArray(childOrdersResponse.data.purchaseOrders)
        ? childOrdersResponse.data.purchaseOrders
        : [];
      setPoDetails(filteredDetails || []);
      setChildOrders(childOrders || []);
      if (filteredDetails.length === 0 && childOrders.length === 0) {
        setDetailsError(
          `No product details or child orders found for Purchase Order (PO No: ${po.po_no || "N/A"}) with po_id=${poIdToFetch}.`
        );
      }
      return { details: filteredDetails, childOrders };
    } catch (err) {
      console.error(`Error fetching purchase order details for PurchaseOrder.id=${purchaseOrderId}:`, err);
      setDetailsError("Failed to fetch purchase order details or child orders.");
      return { details: [], childOrders: [] };
    } finally {
      setDetailsLoading(false);
    }
  };

  const getPoTypeColor = (poType) => {
    return poType ? stringToColor(poType) : "#6B7280";
  };

  const poTypeData = Array.isArray(purchaseOrders)
    ? purchaseOrders.reduce((acc, po) => {
        if (po.po_type) {
          const existing = acc.find((d) => d.name === po.po_type);
          if (existing) {
            existing.count += 1;
          } else {
            acc.push({
              name: po.po_type,
              count: 1,
              color: getPoTypeColor(po.po_type),
            });
          }
        }
        return acc;
      }, [])
    : [];

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
    const pageNum = newPage;
    if (searchTerm.trim().length >= 2) {
      searchPurchaseOrders(searchTerm, pageNum,limit);
    } else {
      fetchPurchaseOrders(pageNum, limit);
    }
  };

  const handleEdit = (poId) => {
    setSelectedPoId(poId);
    setEditOpen(true);
    fetchPoDetails(poId);
  };

  const handleDelete = async (id) => {
    setPoToDelete(id);
    setDeleteDialogOpen(true);
    setDeleteError(null);
    await fetchPoDetails(id);
  };

  const confirmDelete = async () => {
    if (!poToDelete) return;

    try {
      await axios.delete(`${URL}/api/purchaseorder/${poToDelete}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setPurchaseOrders(purchaseOrders.filter((po) => po.id !== poToDelete));
      setTotalItems((prev) => prev - 1);
      setDeleteDialogOpen(false);
      setPoToDelete(null);
      setDeleteError(null);
      setPoDetails([]);
      setChildOrders([]);
    } catch (err) {
      console.error("Error deleting purchase order:", err);
      const errorMessage = err.response?.data?.error || "Failed to delete purchase order.";
      setDeleteError(errorMessage);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setPoToDelete(null);
    setDeleteError(null);
    setPoDetails([]);
    setChildOrders([]);
  };

  const handleViewDetails = (poId) => {
    setSelectedPoId(poId);
    setViewDetailsOpen(true);
    fetchPoDetails(poId);
  };

  const handlePrint = async (po) => {
    await fetchPoDetails(po.id);
    const printWindow = window.open("", "_blank");
    const printContent = renderToString(
      <PurchaseOrderPrint
        po={po}
        poDetails={poDetails}
        organizations={organizations}
        purchaseOrders={purchaseOrders}
        products={products}
      />
    );
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Purchase Order ${po.po_no}</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = () => {
              window.print();
              window.onafterprint = () => window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleExport = async () => {
  try {
    const csvData = [];
    const headers = [
      "PO Number",
      "PO Date",
      "PO Type",
      "Pay Mode",
      "Discount",
      "Subtotal",
      "Grand Total",
      "VDS Total",
      "TDS Total",
      "Vendor",
      "Store",
      "Currency",
      "Subject",
      "Remarks",
      "Company Code",
      "Created By",
      "Modified By",
      "Parent PO",
      "Line",
      "Product Name",
      "Product Code",
      "Quantity",
      "Unit Price",
      "Discount (Detail)",
      "Discount %",
      "Total Price",
      "VDS %",
      "VDS",
      "TDS %",
      "TDS",
    ];
    csvData.push(headers);

    const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "N/A");

    // Fetch all purchase orders with large limit
    const poResponse = await axios.get(`${URL}/api/purchaseorder`, {
      params: { page: 1, limit: 1000 },
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    });
    const exportPurchaseOrders = Array.isArray(poResponse.data.purchaseOrders) ? poResponse.data.purchaseOrders : [];

    // Fetch all purchase order details at once (no filter)
    const detailsResponse = await axios.get(`${URL}/api/purchaseorderdetail`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    });
    const allDetails = Array.isArray(detailsResponse.data) ? detailsResponse.data : [];

    // Group details by po_id
    const detailsByPoId = allDetails.reduce((acc, detail) => {
      if (!acc[detail.po_id]) acc[detail.po_id] = [];
      acc[detail.po_id].push(detail);
      return acc;
    }, {});

    for (const po of exportPurchaseOrders) {
      const details = detailsByPoId[po.id] || [];
      const vendor = organizations.find((org) => org.id === po.vendor_id)?.name || "N/A";
      const store = organizations.find((org) => org.id === po.store_id)?.name || "N/A";
      const parentPo = po.po_id
        ? exportPurchaseOrders.find((p) => p.id === po.po_id)?.po_no || "N/A"
        : "N/A";

      if (details.length === 0) {
        csvData.push([
          po.po_no || "N/A",
          formatDate(po.po_date),
          po.po_type || "N/A",
          po.pay_mode || "N/A",
          po.discount || "N/A",
          po.sub_total || "N/A",
          po.grand_total || "N/A",
          po.vds_total || "N/A",
          po.tds_total || "N/A",
          vendor,
          store,
          po.currency || "N/A",
          po.subject || "N/A",
          po.remarks || "N/A",
          po.company_code || "N/A",
          po.created_by || "N/A",
          po.modified_by || "N/A",
          parentPo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ]);
      } else {
        details.forEach((detail) => {
          const product = products.find((p) => p.id === detail.inv_product_id);
          csvData.push([
            po.po_no || "N/A",
            formatDate(po.po_date),
            po.po_type || "N/A",
            po.pay_mode || "N/A",
            po.discount || "N/A",
            po.sub_total || "N/A",
            po.grand_total || "N/A",
            po.vds_total || "N/A",
            po.tds_total || "N/A",
            vendor,
            store,
            po.currency || "N/A",
            po.subject || "N/A",
            po.remarks || "N/A",
            po.company_code || "N/A",
            po.created_by || "N/A",
            po.modified_by || "N/A",
            parentPo,
            detail.line_no || "N/A",
            product?.name || "N/A",
            product?.code || "N/A",
            detail.quantity || "N/A",
            detail.unit_price || "N/A",
            detail.discount || "N/A",
            detail.discount_pct || "N/A",
            detail.total_price || "N/A",
            detail.vds_pct || "N/A",
            detail.vds || "N/A",
            detail.tds_pct || "N/A",
            detail.tds || "N/A",
          ]);
        });
      }
    }

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
      now.getDate()
    ).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(
      2,
      "0"
    )}${String(now.getSeconds()).padStart(2, "0")}`;
    const filename = `purchase_orders_${timestamp}.csv`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("Error exporting data:", err);
    setError("Failed to export purchase orders");
  }
};


  const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "N/A");

  return (
    <Sidebar>
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          p: { xs: 1, sm: 2 },
          pl: { xs: 1, sm: 1 },
          bgcolor: "#f9fafb",
          overflowX: "hidden",
        }}
      >
        <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#111827",
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "1.125rem", sm: "1.75rem" },
              textAlign: "left",
            }}
          >
            Purchase Orders
          </Typography>
        </Box>

        {error && (
          <Typography
            color="error"
            sx={{ mb: 2, fontFamily: "'Inter', sans-serif", fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          >
            {error}
          </Typography>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={isMobile ? 24 : 40} />
          </Box>
        ) : (
          <>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {poTypeData.map((type) => (
                <Grid item xs={12} sm={6} md={4} lg={2.4} key={type.name}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: "12px",
                      height: "100%",
                      border: "1px solid rgba(0,0,0,0.05)",
                      "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Avatar
                          sx={{
                            width: isMobile ? 28 : 36,
                            height: isMobile ? 28 : 36,
                            backgroundColor: type.color,
                            color: "white",
                            fontWeight: 600,
                            mr: 1,
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          }}
                        >
                          {type.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              fontSize: { xs: "0.8rem", sm: "0.9rem" },
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            {type.name}
                          </Typography>
                          <Typography
                            color="text.secondary"
                            variant="body2"
                            sx={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: { xs: "0.7rem", sm: "0.75rem" },
                            }}
                          >
                            {type.count} orders
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box
              sx={{
                mb: 2,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 1.5,
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
              }}
            >
              <TextField
                inputRef={searchInputRef}
                placeholder="Search purchase orders..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{
                  width: { xs: "100%", sm: "300px" },
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  fontSize: { xs: "0.7rem", sm: "0.875rem" },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "text.secondary", fontSize: { xs: "1rem", sm: "1.25rem" } }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchLoading ? (
                    <InputAdornment position="end">
                      <CircularProgress size={16} />
                    </InputAdornment>
                  ) : null,
                }}
              />
              <Tooltip title="Export to CSV">
                <Button
                  variant="contained"
                  startIcon={<CloudDownloadIcon />}
                  onClick={handleExport}
                  sx={{
                    bgcolor: "#3B82F6",
                    color: "white",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: { xs: "0.7rem", sm: "0.875rem" },
                    px: { xs: 1.5, sm: 2.5 },
                    py: 0.75,
                    "&:hover": {
                      bgcolor: "#2563EB",
                    },
                  }}
                >
                  Export
                </Button>
              </Tooltip>
            </Box>

            <Paper
              elevation={0}
              sx={{
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.05)",
                transition: "opacity 0.3s ease",
                opacity: searchLoading ? 0.7 : 1,
              }}
            >
              <TableContainer
                sx={{
                  maxHeight: { xs: "60vh", sm: "70vh", md: "calc(100vh - 400px)" },
                  maxWidth: "100%",
                  overflowX: "auto",
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {[
                        "PO Number",
                        "PO Date",
                        "PO Type",
                        "Pay Mode",
                        "Discount",
                        "Subtotal",
                        "Grand Total",
                        "VDS Total",
                        "TDS Total",
                        "Vendor",
                        "Store",
                        "Currency",
                        "Subject",
                        "Remarks",
                        "Company Code",
                        "Created By",
                        "Modified By",
                        "Parent PO ID",
                        "Actions",
                      ].map((header, index) => (
                        <TableCell
                          key={header}
                          sx={{
                            fontWeight: 600,
                            backgroundColor: index === 18 ? "#F5F5F5" : "#FAFAFA",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: { xs: "0.7rem", sm: "0.875rem" },
                            p: { xs: 0.5, sm: 1 },
                            whiteSpace: "nowrap",
                            minWidth: index === 18 ? 180 : 80,
                            ...(index === 18 && {
                              position: "sticky",
                              right: 0,
                              zIndex: 2,
                              borderLeft: "1px solid #e5e7eb",
                              boxShadow: "-2px 0 4px rgba(0,0,0,0.05)",
                            }),
                          }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {purchaseOrders.map((po) => (
                      <TableRow key={po.id} hover>
                        <TableCell
                          sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: { xs: "0.7rem", sm: "0.875rem" },
                            p: { xs: 0.5, sm: 1 },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {po.po_no}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: { xs: "0.7rem", sm: "0.875rem" },
                            p: { xs: 0.5, sm: 1 },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatDate(po.po_date)}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: { xs: "0.7rem", sm: "0.875rem" },
                            p: { xs: 0.5, sm: 1 },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {po.po_type || "N/A"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: { xs: "0.7rem", sm: "0.875rem" },
                            p: { xs: 0.5, sm: 1 },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {po.pay_mode || "N/A"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: { xs: "0.7rem", sm: "0.875rem" },
                            p: { xs: 0.5, sm: 1 },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {po.discount || "N/A"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: { xs: "0.7rem", sm: "0.875rem" },
                            p: { xs: 0.5, sm: 1 },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {po.sub_total}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: { xs: "0.7rem", sm: "0.875rem" },
                            p: { xs: 0.5, sm: 1 },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {po.grand_total}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: { xs: "0.7rem", sm: "0.875rem" },
                            p: { xs: 0.5, sm: 1 },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {po.vds_total || "N/A"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: { xs: "0.7rem", sm: "0.875rem" },
                            p: { xs: 0.5, sm: 1 },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {po.tds_total || "N/A"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: { xs: "0.7rem", sm: "0.875rem" },
                            p: { xs: 0.5, sm: 1 },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {organizations.find((org) => org.id === po.vendor_id)?.name || "N/A"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: { xs: "0.7rem", sm: "0.875rem" },
                            p: { xs: 0.5, sm: 1 },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {organizations.find((org) => org.id === po.store_id)?.name || "N/A"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: { xs: "0.7rem", sm: "0.875rem" },
                            p: { xs: 0.5, sm: 1 },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {po.currency || "N/A"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: { xs: "0.7rem", sm: "0.875rem" },
                            p: { xs: 0.5, sm: 1 },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {po.subject || "N/A"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: { xs: "0.7rem", sm: "0.875rem" },
                            p: { xs: 0.5, sm: 1 },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {po.remarks || "N/A"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: { xs: "0.7rem", sm: "0.875rem" },
                            p: { xs: 0.5, sm: 1 },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {po.company_code || "N/A"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: { xs: "0.7rem", sm: "0.875rem" },
                            p: { xs: 0.5, sm: 1 },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {po.created_by || "N/A"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: { xs: "0.7rem", sm: "0.875rem" },
                            p: { xs: 0.5, sm: 1 },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {po.modified_by || "N/A"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: { xs: "0.7rem", sm: "0.875rem" },
                            p: { xs: 0.5, sm: 1 },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {po.po_id ? purchaseOrders.find((p) => p.id === po.po_id)?.po_no || "N/A" : "N/A"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: { xs: "0.7rem", sm: "0.875rem" },
                            p: { xs: 0.5, sm: 1 },
                            whiteSpace: "nowrap",
                            position: "sticky",
                            right: 0,
                            backgroundColor: "#fff",
                            zIndex: 1,
                            borderLeft: "1px solid #e5e7eb",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              gap: { xs: 0.3, sm: 0.5 },
                              alignItems: "center",
                              bgcolor: "#f9fafb",
                              p: { xs: 0.3, sm: 0.5 },
                              borderRadius: 1,
                              border: "1px solid #e5e7eb",
                            }}
                          >
                            <IconButton
                              onClick={() => handleViewDetails(po.id)}
                              sx={{
                                color: "#10B981",
                                bgcolor: "rgba(16, 185, 129, 0.1)",
                                "&:hover": {
                                  bgcolor: "rgba(16, 185, 129, 0.2)",
                                },
                                borderRadius: "50%",
                                p: { xs: 0.3, sm: 0.5 },
                              }}
                            >
                              <VisibilityIcon fontSize={isMobile ? "small" : "medium"} />
                            </IconButton>
                            <IconButton
                              onClick={() => handlePrint(po)}
                              sx={{
                                color: "#3B82F6",
                                bgcolor: "rgba(59, 130, 246, 0.1)",
                                "&:hover": {
                                  bgcolor: "rgba(59, 130, 246, 0.2)",
                                },
                                borderRadius: "50%",
                                p: { xs: 0.3, sm: 0.5 },
                              }}
                            >
                              <PrintIcon fontSize={isMobile ? "small" : "medium"} />
                            </IconButton>
                            <IconButton
                              onClick={() => handleEdit(po.id)}
                              sx={{
                                color: "#6366F1",
                                bgcolor: "rgba(99, 102, 241, 0.1)",
                                "&:hover": {
                                  bgcolor: "rgba(99, 102, 241, 0.2)",
                                },
                                borderRadius: "50%",
                                p: { xs: 0.3, sm: 0.5 },
                              }}
                            >
                              <EditIcon fontSize={isMobile ? "small" : "medium"} />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(po.id)}
                              sx={{
                                color: "#EF4444",
                                bgcolor: "rgba(239, 68, 68, 0.1)",
                                "&:hover": {
                                  bgcolor: "rgba(239, 68, 68, 0.2)",
                                },
                                borderRadius: "50%",
                                p: { xs: 0.3, sm: 0.5 },
                              }}
                            >
                              <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  p: 2,
                  bgcolor: "#ffffff",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <Pagination
                  count={Math.ceil(totalItems / limit)}
                  page={page + 1}
                  onChange={handleChangePage}
                  sx={{
                    "& .MuiPagination-ul": {
                      justifyContent: "flex-end",
                    },
                    "& .MuiPaginationItem-root": {
                      fontFamily: "'Inter', sans-serif",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      color: "#6B7280",
                      "&:hover": {
                        bgcolor: "#E5E7EB",
                        color: "#111827",
                      },
                      "&.Mui-selected": {
                        bgcolor: "#3B82F6",
                        color: "#ffffff",
                        "&:hover": {
                          bgcolor: "#2563EB",
                        },
                      },
                    },
                    "& .MuiPaginationItem-ellipsis": {
                      display: "flex",
                      alignItems: "center",
                      height: "32px",
                    },
                    "& .MuiPaginationItem-previousNext": {
                      bgcolor: "#F3F4F6",
                      color: "#111827",
                      "&:hover": {
                        bgcolor: "#E5E7EB",
                      },
                      "&.Mui-disabled": {
                        bgcolor: "#F3F4F6",
                        color: "#D1D5DB",
                        opacity: 0.6,
                      },
                    },
                  }}
                  variant="outlined"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                />
              </Box>
            </Paper>

            <PurchaseOrderDetailsDialog
              open={viewDetailsOpen}
              onClose={() => setViewDetailsOpen(false)}
              selectedPoId={selectedPoId}
              purchaseOrders={purchaseOrders}
              products={products}
              poDetails={poDetails}
              detailsLoading={detailsLoading}
              detailsError={detailsError}
            />

            <EditPurchaseOrderDialog
              open={editOpen}
              onClose={() => setEditOpen(false)}
              selectedPoId={selectedPoId}
              purchaseOrders={purchaseOrders}
              organizations={organizations}
              products={products}
              poDetails={poDetails}
              fetchPoDetails={fetchPoDetails}
              setPurchaseOrders={setPurchaseOrders}
              setPoDetails={setPoDetails}
            />

            <Dialog
              open={deleteDialogOpen}
              onClose={cancelDelete}
              sx={{
                "& .MuiDialog-paper": {
                  borderRadius: "16px",
                  bgcolor: "#ffffff",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  m: { xs: 1, sm: 2 },
                  width: { xs: "90%", sm: "400px" },
                },
              }}
            >
              <DialogTitle
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: { xs: "1.125rem", sm: "1.25rem" },
                  bgcolor: "#FAFAFA",
                  color: "#111827",
                  py: { xs: 2, sm: 2.5 },
                  px: { xs: 2, sm: 3 },
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                Confirm Deletion
              </DialogTitle>
              <DialogContent sx={{ p: { xs: 2, sm: 3 }, bgcolor: "#f9fafb" }}>
                <Typography
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    color: "#111827",
                  }}
                >
                  Are you sure you want to delete Purchase Order {purchaseOrders.find((po) => po.id === poToDelete)?.po_no || "N/A"}?
                  {poDetails.length > 0 || childOrders.length > 0 ? (
                    <>
                      {" This order has "}
                      {poDetails.length > 0 && (
                        <>
                          <strong>{poDetails.length} detail{poDetails.length > 1 ? "s" : ""}</strong>
                          {childOrders.length > 0 && " and "}
                        </>
                      )}
                      {childOrders.length > 0 && (
                        <strong>{childOrders.length} child order{childOrders.length > 1 ? "s" : ""}</strong>
                      )}
                      {". Details will be deleted"}
                    </>
                  ) : (
                    " This action cannot be undone."
                  )}
                </Typography>
                {deleteError && (
                  <Typography
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      color: "#EF4444",
                      mt: 2,
                    }}
                  >
                    {deleteError}
                  </Typography>
                )}
              </DialogContent>
              <DialogActions
                sx={{
                  p: { xs: 2, sm: 3 },
                  bgcolor: "#FAFAFA",
                  borderTop: "1px solid #e5e7eb",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  onClick={cancelDelete}
                  sx={{
                    textTransform: "none",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    color: "#ffffff",
                    bgcolor: "#6b7280",
                    "&:hover": { bgcolor: "#4b5563" },
                    px: { xs: 2, sm: 2.5 },
                    py: 0.75,
                    borderRadius: "8px",
                    mr: 1,
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDelete}
                  sx={{
                    textTransform: "none",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    color: "#ffffff",
                    bgcolor: "#EF4444",
                    "&:hover": { bgcolor: "#DC2626" },
                    px: { xs: 2, sm: 2.5 },
                    py: 0.75,
                    borderRadius: "8px",
                  }}
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Box>
    </Sidebar>
  );
};

export default PurchaseOrders;
