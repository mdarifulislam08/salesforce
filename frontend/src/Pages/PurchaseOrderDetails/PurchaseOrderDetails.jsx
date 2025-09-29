import React, { useState, useEffect } from "react";
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
  TablePagination,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Card,
  CardContent,
  Avatar,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  useTheme,               
  useMediaQuery, 
} from "@mui/material";
import {
  Search as SearchIcon,
  // FilterList as FilterListIcon,
  ShoppingCart as ShoppingCartIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import axios from "axios";
import { URL } from "../../config";
import Sidebar from "../../Components/Sidebar/Sidebar";

const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 50%)`; // Use HSL for vibrant, distinct colors
};

const PurchaseOrderDetails = () => {
  const theme = useTheme();                                      
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [purchaseOrderDetails, setPurchaseOrderDetails] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentDetail, setCurrentDetail] = useState(null);
  const [formData, setFormData] = useState({
    line_no: "",
    inv_product_id: "",
    quantity: "",
    unit_price: "",
    discount: "",
    discount_pct: "",
    total_price: "",
    vds_pct: "",
    vds: "",
    tds_pct: "",
    tds: "",
    po_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch purchase order details, purchase orders, and Invproducts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [podResponse, poResponse, productResponse] = await Promise.all([
          axios.get("${URL}/api/purchaseorderdetail", {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          }),
          axios.get("${URL}/api/purchaseorder", {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          }),
          axios.get("${URL}/api/invproduct", {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          }),
        ]);
        setPurchaseOrderDetails(podResponse.data || []);
        setPurchaseOrders(poResponse.data || []);
        setProducts(productResponse.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.response?.status === 401) {
          setError("Authentication failed. Please log in again.");
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        } else {
          setError(`Failed to fetch data: ${err.response?.data?.error || err.message}`);
          setPurchaseOrderDetails([]);
          setPurchaseOrders([]);
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate total_price dynamically
  useEffect(() => {
    const calculateTotalPrice = () => {
      const qty = parseFloat(formData.quantity) || 0;
      const price = parseFloat(formData.unit_price) || 0;
      const disc = parseFloat(formData.discount) || 0;
      const discPct = parseFloat(formData.discount_pct) || 0;
      return (qty * price - disc) * (1 - discPct / 100);
    };
    setFormData((prev) => ({
      ...prev,
      total_price: calculateTotalPrice().toFixed(2),
    }));
  }, [formData.quantity, formData.unit_price, formData.discount, formData.discount_pct]);

  // Define getProductColor dynamically
  const getProductColor = (productName) => {
    return productName ? stringToColor(productName) : "#6B7280";
  };

  // Compute product
  const productData = purchaseOrderDetails.reduce((acc, detail) => {
    const product = products.find((p) => p.id === detail.inv_product_id);
    if (product) {
      const existing = acc.find((d) => d.name === product.name);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({
          name: product.name,
          count: 1,
          color: getProductColor(product.name),
        });
      }
    }
    return acc;
  }, []);

  // Validate form for disabling Add/Update button
  const isFormValid = () => {
    return (
      formData.quantity &&
      formData.unit_price &&
      formData.total_price &&
      formData.po_id &&
      (isEdit || formData.inv_product_id)
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredDetails = purchaseOrderDetails.filter(
    (detail) =>
      (detail.line_no &&
        detail.line_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (detail.quantity &&
        detail.quantity.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
      (products.find((p) => p.id === detail.inv_product_id)?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const currentDetails = filteredDetails.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleAddDetail = () => {
    setIsEdit(false);
    setFormData({
      line_no: "",
      inv_product_id: "",
      quantity: "",
      unit_price: "",
      discount: "",
      discount_pct: "",
      total_price: "",
      vds_pct: "",
      vds: "",
      tds_pct: "",
      tds: "",
      po_id: "",
    });
    setOpenModal(true);
    setError(null);
  };

  const handleEdit = (detail) => {
    setIsEdit(true);
    setCurrentDetail(detail);
    setFormData({
      line_no: detail.line_no || "",
      inv_product_id: detail.inv_product_id ? detail.inv_product_id.toString() : "",
      quantity: detail.quantity || "",
      unit_price: detail.unit_price || "",
      discount: detail.discount || "",
      discount_pct: detail.discount_pct || "",
      total_price: detail.total_price || "",
      vds_pct: detail.vds_pct || "",
      vds: detail.vds || "",
      tds_pct: detail.tds_pct || "",
      tds: detail.tds || "",
      po_id: detail.po_id ? detail.po_id.toString() : "",
    });
    setOpenModal(true);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this purchase order detail?")) {
      try {
        await axios.delete(`${URL}/api/purchaseorderdetail/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setPurchaseOrderDetails(purchaseOrderDetails.filter((detail) => detail.id !== id));
        setError(null);
      } catch (err) {
        console.error("Error deleting purchase order detail:", err);
        setError(`Failed to delete purchase order detail: ${err.response?.data?.error || err.message}`);
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    if (!isFormValid()) {
      setError("Please fill all required fields: Quantity, Unit Price, Purchase Order, and Product (for new entries)");
      return;
    }

    setFormLoading(true);
    try {
      const payload = {
        line_no: formData.line_no || null,
        inv_product_id: formData.inv_product_id ? parseInt(formData.inv_product_id) : null,
        quantity: parseFloat(formData.quantity),
        unit_price: parseFloat(formData.unit_price),
        discount: formData.discount ? parseFloat(formData.discount) : null,
        discount_pct: formData.discount_pct ? parseFloat(formData.discount_pct) : null,
        total_price: parseFloat(formData.total_price),
        vds_pct: formData.vds_pct ? parseFloat(formData.vds_pct) : null,
        vds: formData.vds ? parseFloat(formData.vds) : null,
        tds_pct: formData.tds_pct ? parseFloat(formData.tds_pct) : null,
        tds: formData.tds ? parseFloat(formData.tds) : null,
        po_id: parseInt(formData.po_id),
      };

      if (isEdit && currentDetail) {
        const response = await axios.put(
          `${URL}/api/purchaseorderdetail/${currentDetail.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setPurchaseOrderDetails(
          purchaseOrderDetails.map((detail) =>
            detail.id === currentDetail.id ? response.data.purchaseOrderDetail : detail
          )
        );
      } else {
        const response = await axios.post(
          "${URL}/api/purchaseorderdetail",
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setPurchaseOrderDetails([...purchaseOrderDetails, response.data.purchaseOrderDetail]);
      }
      setOpenModal(false);
      setError(null);
    } catch (err) {
      console.error("Error saving purchase order detail:", err);
      setError(`Failed to ${isEdit ? "update" : "create"} purchase order detail: ${err.response?.data?.error || err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Sidebar>
      <Box sx={{ width: "100%" }}>
        {/* Page Header */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#111827",
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "1.25rem", sm: "2rem" },
            }}
          >
            Purchase Order Details
          </Typography>
          <Button
            variant="contained"
            startIcon={<ShoppingCartIcon />}
            onClick={handleAddDetail}
            sx={{
              backgroundColor: "#6366F1",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(99, 102, 241, 0.2)",
              textTransform: "none",
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              "&:hover": {
                backgroundColor: "#4F46E5",
              },
            }}
          >
            Add Purchase Order Detail
          </Button>
        </Box>

        {/* Error Message */}
        {error && (
          <Typography
            color="error"
            sx={{ mb: 2, fontFamily: "'Inter', sans-serif" }}
          >
            {error}
          </Typography>
        )}

        {/* Loading State */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={isMobile ? 24 : 40}/>
          </Box>
        ) : (
          <>
            {/* Product Summary Cards */}
            {productData.length > 0 ? (
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {productData.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={2.4} key={product.name}>
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: "16px",
                        height: "100%",
                        border: "1px solid rgba(0,0,0,0.05)",
                        "&:hover": {
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        },
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: isMobile ? 32 : 40,
                              height: isMobile ? 32 : 40,
                              backgroundColor: `${product.color}`,
                              color: "white",
                              fontWeight: 600,
                              mr: 1.5,
                            }}
                          >
                            {product.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                fontSize: "1rem",
                                fontFamily: "'Inter', sans-serif",
                              }}
                            >
                              {product.name}
                            </Typography>
                            <Typography
                              color="text.secondary"
                              variant="body2"
                              sx={{
                                fontFamily: "'Inter', sans-serif",
                              }}
                            >
                              {product.count} items
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography
                sx={{
                  mb: 4,
                  fontFamily: "'Inter', sans-serif",
                  color: "#6B7280",
                }}
              >
                No product summary available
              </Typography>
            )}

            {/* Search and Filter Tools */}
            <Box
              sx={{
                mb: 3,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TextField
                placeholder="Search purchase order details..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  width: { xs: "100%", sm: "320px" },
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />
              
              {/* <Button
                startIcon={<FilterListIcon />}
                sx={{
                  display: { xs: "none", sm: "flex" },
                  color: "#6366F1",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  border: "1px solid rgba(99, 102, 241, 0.2)",
                }}
              >
                Filters
              </Button> */}
            </Box>

            {/* Purchase Order Detail Table */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <TableContainer
                sx={{
                  maxHeight: {
                    xs: "60vh",
                    sm: "calc(100vh - 350px)",
                  },
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          backgroundColor: "#FAFAFA",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Line No
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          backgroundColor: "#FAFAFA",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Product
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          backgroundColor: "#FAFAFA",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Quantity
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          backgroundColor: "#FAFAFA",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Unit Price
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          backgroundColor: "#FAFAFA",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Discount
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          backgroundColor: "#FAFAFA",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Discount %
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          backgroundColor: "#FAFAFA",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Total Price
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          backgroundColor: "#FAFAFA",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        VDS %
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          backgroundColor: "#FAFAFA",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        VDS
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          backgroundColor: "#FAFAFA",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        TDS %
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          backgroundColor: "#FAFAFA",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        TDS
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          backgroundColor: "#FAFAFA",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Purchase Order
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          backgroundColor: "#FAFAFA",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentDetails.length > 0 ? (
                      currentDetails.map((detail) => (
                        <TableRow key={detail.id} hover>
                          <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>
                            {detail.line_no || "N/A"}
                          </TableCell>
                          <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>
                            {products.find(
                              (p) => p.id === detail.inv_product_id
                            )?.name || "N/A"}
                          </TableCell>
                          <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>
                            {detail.quantity}
                          </TableCell>
                          <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>
                            {detail.unit_price}
                          </TableCell>
                          <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>
                            {detail.discount || "N/A"}
                          </TableCell>
                          <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>
                            {detail.discount_pct || "N/A"}
                          </TableCell>
                          <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>
                            {detail.total_price}
                          </TableCell>
                          <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>
                            {detail.vds_pct || "N/A"}
                          </TableCell>
                          <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>
                            {detail.vds || "N/A"}
                          </TableCell>
                          <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>
                            {detail.tds_pct || "N/A"}
                          </TableCell>
                          <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>
                            {detail.tds || "N/A"}
                          </TableCell>
                          <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>
                            {purchaseOrders.find((po) => po.id === detail.po_id)
                              ?.po_no || "N/A"}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => handleEdit(detail)}
                              sx={{ color: "#6366F1" }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(detail.id)}
                              sx={{ color: "#EF4444" }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={13}
                          sx={{
                            textAlign: "center",
                            fontFamily: "'Inter', sans-serif",
                            color: "#6B7280",
                          }}
                        >
                          No purchase order details available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredDetails.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                    {
                      fontFamily: "'Inter', sans-serif",
                    },
                }}
              />
            </Paper>
          </>
        )}

        {/* Add/Edit Purchase Order Detail Modal */}
        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
            }}
          >
            {isEdit
              ? "Edit Purchase Order Detail"
              : "Add Purchase Order Detail"}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <TextField
                label="Line Number"
                name="line_no"
                value={formData.line_no}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
              />
              <FormControl fullWidth size="small">
                <InputLabel id="inv-product-id-label">Product</InputLabel>
                <Select
                  labelId="inv-product-id-label"
                  name="inv_product_id"
                  value={formData.inv_product_id}
                  onChange={handleFormChange}
                  label="Product"
                  required={!isEdit}
                >
                  <MenuItem value="">Select Product</MenuItem>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <MenuItem key={product.id} value={product.id.toString()}>
                        {product.name} ({product.code})
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      No products available. Please add products first.
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
              <TextField
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Unit Price"
                name="unit_price"
                type="number"
                value={formData.unit_price}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Discount"
                name="discount"
                type="number"
                value={formData.discount}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Discount %"
                name="discount_pct"
                type="number"
                value={formData.discount_pct}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
                inputProps={{ min: 0, max: 100 }}
              />
              <TextField
                label="Total Price"
                name="total_price"
                type="number"
                value={formData.total_price}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
                required
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="VDS %"
                name="vds_pct"
                type="number"
                value={formData.vds_pct}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
                inputProps={{ min: 0 }}
              />
              <TextField
                label="VDS"
                name="vds"
                type="number"
                value={formData.vds}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
                inputProps={{ min: 0 }}
              />
              <TextField
                label="TDS %"
                name="tds_pct"
                type="number"
                value={formData.tds_pct}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
                inputProps={{ min: 0 }}
              />
              <TextField
                label="TDS"
                name="tds"
                type="number"
                value={formData.tds}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
                inputProps={{ min: 0 }}
              />
              <FormControl fullWidth size="small">
                <InputLabel id="po-id-label">Purchase Order</InputLabel>
                <Select
                  labelId="po-id-label"
                  name="po_id"
                  value={formData.po_id}
                  onChange={handleFormChange}
                  label="Purchase Order"
                  required
                >
                  <MenuItem value="">Select Purchase Order</MenuItem>
                  {purchaseOrders.length > 0 ? (
                    purchaseOrders.map((po) => (
                      <MenuItem key={po.id} value={po.id.toString()}>
                        {po.po_no}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      No purchase orders available. Please add purchase orders
                      first.
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenModal(false)}
              disabled={formLoading}
              sx={{
                textTransform: "none",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              variant="contained"
              disabled={!isFormValid() || formLoading}
              sx={{
                backgroundColor: "#6366F1",
                textTransform: "none",
                fontFamily: "'Inter', sans-serif",
                "&:hover": {
                  backgroundColor: "#4F46E5",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#B0B0B0",
                },
              }}
            >
              {formLoading ? (
                <CircularProgress size={24} />
              ) : isEdit ? (
                "Update"
              ) : (
                "Add"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Sidebar>
  );
};

export default PurchaseOrderDetails;
