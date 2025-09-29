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
  Checkbox,
  FormControlLabel,
  CircularProgress,
  useTheme,               
  useMediaQuery, 
} from "@mui/material";
import {
  Search as SearchIcon,
  // Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  // FilterList as FilterListIcon,
  Inventory as InventoryIcon,
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

const InvProducts = () => {
  const theme = useTheme();                                      
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    alternate_code: "",
    name: "",
    description: "",
    uom: "",
    product_type: "",
    product_category: "",
    brand_name: "",
    has_serial: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("${URL}/api/invproduct", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setProducts(response.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        if (err.response?.status === 401) {
          setError("Authentication failed. Please log in again.");
        } else {
          setError("Failed to fetch products. Please try again.");
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Define getCategoryColor dynamically
  const getCategoryColor = (category) => {
    return category ? stringToColor(category) : "#6B7280";
    // const colors = {
    //   "Office Furniture": "#6366F1",
    //   Computers: "#10B981",
    //   Peripherals: "#F59E0B",
    // };
    // return colors[category] || "#6B7280";
  };

  // Compute category
  const categoryData = products.reduce((acc, product) => {
    const category = product.product_category || "Uncategorized";
    const existing = acc.find((d) => d.name === category);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({
        name: category,
        count: 1,
        color: getCategoryColor(category),
      });
    }
    return acc;
  }, []);

  // Validate form for disabling Add/Update button
  const isFormValid = () => {
    return formData.code && formData.name;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredProducts = products.filter(
    (product) =>
      (product.code &&
        product.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.name &&
        product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.brand_name &&
        product.brand_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const currentProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleAddProduct = () => {
    setIsEdit(false);
    setFormData({
      code: "",
      alternate_code: "",
      name: "",
      description: "",
      uom: "",
      product_type: "",
      product_category: "",
      brand_name: "",
      has_serial: false,
    });
    setOpenModal(true);
  };

  const handleEdit = (product) => {
    setIsEdit(true);
    setCurrentProduct(product);
    setFormData({
      code: product.code || "",
      alternate_code: product.alternate_code || "",
      name: product.name || "",
      description: product.description || "",
      uom: product.uom || "",
      product_type: product.product_type || "",
      product_category: product.product_category || "",
      brand_name: product.brand_name || "",
      has_serial: product.has_serial || false,
    });
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${URL}/api/invproduct/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setProducts(products.filter((product) => product.id !== id));
        setError(null);
      } catch (err) {
        console.error("Error deleting product:", err);
        setError("Failed to delete product: " + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = async () => {
    if (!isFormValid()) {
      setError("Code and Name are required");
      return;
    }

    try {
      const payload = {
        code: formData.code,
        alternate_code: formData.alternate_code || null,
        name: formData.name,
        description: formData.description || null,
        uom: formData.uom || null,
        product_type: formData.product_type || null,
        product_category: formData.product_category || null,
        brand_name: formData.brand_name || null,
        has_serial: formData.has_serial,
      };

      if (isEdit && currentProduct) {
        const response = await axios.put(
          `${URL}/api/invproduct/${currentProduct.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setProducts(
          products.map((product) =>
            product.id === currentProduct.id ? response.data.invProduct : product
          )
        );
      } else {
        const response = await axios.post(
          "${URL}/api/invproduct",
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setProducts([...products, response.data.invProduct]);
      }
      setOpenModal(false);
      setError(null);
    } catch (err) {
      console.error("Error saving product:", err);
      setError("Failed to " + (isEdit ? "update" : "create") + " product: " + (err.response?.data?.error || err.message));
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
            Inventory Products
          </Typography>
          <Button
            variant="contained"
            startIcon={<InventoryIcon />}
            onClick={handleAddProduct}
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
            Add Product
          </Button>
        </Box>

        {/* Error Message */}
        {error && (
          <Typography color="error" sx={{ mb: 2, fontFamily: "'Inter', sans-serif" }}>
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
            {/* Category Summary Cards */}
            {categoryData.length > 0 ? (
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {categoryData.map((category) => (
                  <Grid item xs={12} sm={6} md={4} lg={2.4} key={category.name}>
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
                              backgroundColor: `${category.color}`,
                              color: "white",
                              fontWeight: 600,
                              mr: 1.5,
                            }}
                          >
                            {category.name.charAt(0)}
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
                              {category.name}
                            </Typography>
                            <Typography
                              color="text.secondary"
                              variant="body2"
                              sx={{
                                fontFamily: "'Inter', sans-serif",
                              }}
                            >
                              {category.count} products
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography sx={{ mb: 4, fontFamily: "'Inter', sans-serif", color: "#6B7280" }}>
                No product categories available
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
                placeholder="Search products..."
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

            {/* Product Table */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <TableContainer sx={{ maxHeight: "calc(100vh - 350px)" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Code</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Alternate Code</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>UOM</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Product Type</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Brand</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Has Serial</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentProducts.length > 0 ? (
                      currentProducts.map((product) => (
                        <TableRow key={product.id} hover>
                          <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{product.code}</TableCell>
                          <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{product.alternate_code || "N/A"}</TableCell>
                          <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{product.name}</TableCell>
                          <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{product.description || "N/A"}</TableCell>
                          <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{product.uom || "N/A"}</TableCell>
                          <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{product.product_type || "N/A"}</TableCell>
                          <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{product.product_category || "N/A"}</TableCell>
                          <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{product.brand_name || "N/A"}</TableCell>
                          <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{product.has_serial ? "Yes" : "No"}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => handleEdit(product)}
                              sx={{ color: "#6366F1" }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(product.id)}
                              sx={{ color: "#EF4444" }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} sx={{ textAlign: "center", fontFamily: "'Inter', sans-serif", color: "#6B7280" }}>
                          No products available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredProducts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                    fontFamily: "'Inter', sans-serif",
                  },
                }}
              />
            </Paper>
          </>
        )}

        {/* Add/Edit Product Modal */}
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
            {isEdit ? "Edit Product" : "Add Product"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <TextField
                label="Code"
                name="code"
                value={formData.code}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
                required
              />
              <TextField
                label="Alternate Code"
                name="alternate_code"
                value={formData.alternate_code}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
              />
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
                required
              />
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
                multiline
                rows={3}
              />
              <TextField
                label="Unit of Measure"
                name="uom"
                value={formData.uom}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
              />
              <TextField
                label="Product Type"
                name="product_type"
                value={formData.product_type}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
              />
              <TextField
                label="Product Category"
                name="product_category"
                value={formData.product_category}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
              />
              <TextField
                label="Brand Name"
                name="brand_name"
                value={formData.brand_name}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="has_serial"
                    checked={formData.has_serial}
                    onChange={handleFormChange}
                    color="primary"
                  />
                }
                label="Has Serial Number"
                sx={{ fontFamily: "'Inter', sans-serif" }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenModal(false)}
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
              disabled={!isFormValid()}
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
              {isEdit ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Sidebar>
  );
};

export default InvProducts;
