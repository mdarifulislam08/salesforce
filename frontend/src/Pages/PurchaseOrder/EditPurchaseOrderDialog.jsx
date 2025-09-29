import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import axios from "axios";
import { URL } from "../../config";

// === NEW: Added useDebounce hook to debounce search inputs ===
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const EditPurchaseOrderDialog = ({
  open,
  onClose,
  selectedPoId,
  purchaseOrders,
  organizations,
  products,
  poDetails,
  fetchPoDetails,
  setPurchaseOrders,
  setPoDetails,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const selectedPo = purchaseOrders.find((po) => po.id === selectedPoId);

  // State for Purchase Order form
  const [poForm, setPoForm] = useState({
    po_no: "",
    po_date: "",
    po_type: "",
    pay_mode: "",
    discount: "0",
    sub_total: "0",
    grand_total: "0",
    vds_total: "0",
    tds_total: "0",
    vendor_id: "",
    store_id: "",
    currency: "BDT",
    subject: "",
    remarks: "",
    company_code: "",
    modified_by: "",
    po_id: "",
  });

  // State for Purchase Order Details
  const [detailsForm, setDetailsForm] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // === NEW: State for Vendor and Store search ===
  const [vendors, setVendors] = useState([]);
  const [stores, setStores] = useState([]);
  const [vendorSearch, setVendorSearch] = useState("");
  const [storeSearch, setStoreSearch] = useState("");
  const debouncedVendorSearch = useDebounce(vendorSearch, 300);
  const debouncedStoreSearch = useDebounce(storeSearch, 300);

  // Initialize form with existing data
  useEffect(() => {
    if (selectedPo) {
      setPoForm({
        po_no: selectedPo.po_no || "",
        po_date: selectedPo.po_date ? new Date(selectedPo.po_date).toISOString().split("T")[0] : "",
        po_type: selectedPo.po_type || "",
        pay_mode: selectedPo.pay_mode || "",
        discount: selectedPo.discount?.toString() || "0",
        sub_total: selectedPo.sub_total?.toString() || "0",
        grand_total: selectedPo.grand_total?.toString() || "0",
        vds_total: selectedPo.vds_total?.toString() || "0",
        tds_total: selectedPo.tds_total?.toString() || "0",
        vendor_id: selectedPo.vendor_id?.toString() || "",
        store_id: selectedPo.store_id?.toString() || "",
        currency: selectedPo.currency || "BDT",
        subject: selectedPo.subject || "",
        remarks: selectedPo.remarks || "",
        company_code: selectedPo.company_code || "",
        modified_by: selectedPo.modified_by || "",
        po_id: selectedPo.po_id?.toString() || "",
      });

      // === NEW: Initialize vendors/stores with selected data ===
      const selectedVendor = organizations.find((org) => org.id.toString() === selectedPo.vendor_id?.toString());
      const selectedStore = organizations.find((org) => org.id.toString() === selectedPo.store_id?.toString());
      setVendors(selectedVendor ? [selectedVendor] : []);
      setStores(selectedStore ? [selectedStore] : []);
      setVendorSearch(selectedVendor ? selectedVendor.name : "");
      setStoreSearch(selectedStore ? selectedStore.name : "");
    }
  }, [selectedPo, selectedPoId, organizations]);

  // === NEW: Fetch vendors based on search ===
  useEffect(() => {
    const fetchVendors = async () => {
      // Show "No options" when input is cleared or has < 2 characters
      if (!debouncedVendorSearch || debouncedVendorSearch.length < 2) {
        setVendors([]);
        return;
      }

      try {
        const response = await axios.get("${URL}/api/organization/search", {
          params: { query: debouncedVendorSearch },
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setVendors(response.data || []);
      } catch (err) {
        console.error("Error fetching vendors:", err);
        setError("Failed to fetch vendors.");
      }
    };
    fetchVendors();
  }, [debouncedVendorSearch]);

  // === NEW: Fetch stores based on search ===
  useEffect(() => {
    const fetchStores = async () => {
      // Show "No options" when input is cleared or has < 2 characters
      if (!debouncedStoreSearch || debouncedStoreSearch.length < 2) {
        setStores([]);
        return;
      }

      try {
        const response = await axios.get("${URL}/api/organization/search", {
          params: { query: debouncedStoreSearch },
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setStores(response.data || []);
      } catch (err) {
        console.error("Error fetching stores:", err);
        setError("Failed to fetch stores.");
      }
    };
    fetchStores();
  }, [debouncedStoreSearch]);

  // Update details form when poDetails changes
  useEffect(() => {
    setDetailsForm(
      poDetails.map((detail) => ({
        id: detail.id,
        isNew: false,
        isModified: false,
        line_no: detail.line_no?.toString() || "",
        inv_product_id: detail.inv_product_id?.toString() || "",
        quantity: detail.quantity?.toString() || "",
        unit_price: detail.unit_price?.toString() || "",
        discount: detail.discount?.toString() || "",
        discount_pct: detail.discount_pct?.toString() || "",
        total_price: detail.total_price?.toString() || "",
        vds_pct: detail.vds_pct?.toString() || "",
        vds: detail.vds?.toString() || "",
        tds_pct: detail.tds_pct?.toString() || "",
        tds: detail.tds?.toString() || "",
        manual_total_price: false,
        manual_vds: false,
        manual_tds: false,
      }))
    );
  }, [poDetails]);

  // Handle Purchase Order form changes
  const handlePoFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setPoForm((prev) => {
      const updated = { ...prev, [name]: value };
      console.log(`Field ${name} updated to:`, value); // Debug log
      return updated;
    });
  }, []);

  // Handle Vendor and Store changes
  const handleVendorChange = useCallback((event, newValue) => {
    setPoForm((prev) => ({
      ...prev,
      vendor_id: newValue ? newValue.id.toString() : "",
    }));
    setVendorSearch(newValue ? newValue.name : ""); // === NEW: Update search input ===
    console.log("Vendor updated to:", newValue ? newValue.id : ""); // Debug log
  }, []);

  const handleStoreChange = useCallback((event, newValue) => {
    setPoForm((prev) => ({
      ...prev,
      store_id: newValue ? newValue.id.toString() : "",
    }));
    setStoreSearch(newValue ? newValue.name : ""); // === NEW: Update search input ===
    console.log("Store updated to:", newValue ? newValue.id : ""); // Debug log
  }, []);

  // Handle Purchase Order Detail form changes
  const handleDetailChange = useCallback((index, field, value) => {
    setDetailsForm((prev) => {
      const updatedDetails = [...prev];
      updatedDetails[index] = { ...updatedDetails[index], [field]: value, isModified: true };

      // Mark manual overrides
      if (field === "total_price") updatedDetails[index].manual_total_price = true;
      if (field === "vds") updatedDetails[index].manual_vds = true;
      if (field === "tds") updatedDetails[index].manual_tds = true;

      return updatedDetails;
    });
  }, []);

  // Handle Product change in details
  const handleProductChange = useCallback((index, newValue) => {
    setDetailsForm((prev) => {
      const updatedDetails = [...prev];
      updatedDetails[index] = {
        ...updatedDetails[index],
        inv_product_id: newValue ? newValue.id.toString() : "",
        isModified: true,
      };
      return updatedDetails;
    });
  }, []);

  // Calculate item values
  const calculateItemValues = useCallback(
    (item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const unit_price = parseFloat(item.unit_price) || 0;
      const discount = parseFloat(item.discount) || 0;
      const vds_pct = parseFloat(item.vds_pct) || 0;
      const tds_pct = parseFloat(item.tds_pct) || 0;

      const total_price = item.manual_total_price
        ? parseFloat(item.total_price) || 0
        : (quantity * unit_price - discount).toFixed(2);
      const discount_pct =
        quantity * unit_price > 0
          ? Math.min((discount / (quantity * unit_price)) * 100, 100).toFixed(2)
          : item.discount_pct || "0";
      const base_amount = quantity * unit_price - discount;
      const vds = item.manual_vds
        ? parseFloat(item.vds) || 0
        : (base_amount * (vds_pct / 100)).toFixed(2);
      const tds = item.manual_tds
        ? parseFloat(item.tds) || 0
        : (base_amount * (tds_pct / 100)).toFixed(2);

      return {
        total_price: total_price || "",
        discount_pct: discount_pct || "",
        vds: vds || "",
        tds: tds || "",
      };
    },
    []
  );

  // Calculate PO totals from items
  const calculatePoTotals = useMemo(() => {
    const totals = detailsForm.reduce(
      (acc, item) => {
        const calculated = calculateItemValues(item);
        const quantity = parseFloat(item.quantity) || 0;
        const unit_price = parseFloat(item.unit_price) || 0;
        const discount = parseFloat(item.discount) || 0;

        acc.sub_total += quantity * unit_price;
        acc.discount += discount;
        acc.vds_total += parseFloat(calculated.vds) || 0;
        acc.tds_total += parseFloat(calculated.tds) || 0;

        return acc;
      },
      { sub_total: 0, discount: 0, vds_total: 0, tds_total: 0 }
    );

    const grand_total = (totals.sub_total - totals.discount).toFixed(2);
    return {
      sub_total: totals.sub_total.toFixed(2),
      discount: totals.discount.toFixed(2),
      grand_total,
      vds_total: totals.vds_total.toFixed(2),
      tds_total: totals.tds_total.toFixed(2),
    };
  }, [detailsForm, calculateItemValues]);

  // Update PO form data with calculated totals
  useEffect(() => {
    setPoForm((prev) => ({
      ...prev,
      sub_total: calculatePoTotals.sub_total,
      discount: calculatePoTotals.discount,
      grand_total: calculatePoTotals.grand_total,
      vds_total: calculatePoTotals.vds_total,
      tds_total: calculatePoTotals.tds_total,
    }));
  }, [calculatePoTotals]);

  // Update items with calculated values
  const updatedItems = useMemo(() => {
    return detailsForm.map((item) => ({
      ...item,
      ...calculateItemValues(item),
    }));
  }, [detailsForm, calculateItemValues]);

  // Add new detail row
  const addDetailRow = useCallback(() => {
    setDetailsForm((prev) => [
      ...prev,
      {
        id: null,
        isNew: true,
        isModified: true,
        line_no: (prev.length + 1).toString(),
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
        manual_total_price: false,
        manual_vds: false,
        manual_tds: false,
      },
    ]);
  }, []);

  // Remove detail row
  const removeDetailRow = useCallback(
    async (index) => {
      const detail = detailsForm[index];
      if (detail.id && !detail.isNew) {
        try {
          await axios.delete(`${URL}/api/purchaseorderdetail/${detail.id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          });
          await fetchPoDetails(selectedPoId);
        } catch (err) {
          console.error("Error deleting Purchase Order Detail:", err);
          setError("Failed to delete order detail.");
          return;
        }
      }
      setDetailsForm((prev) => prev.filter((_, i) => i !== index));
    },
    [detailsForm, selectedPoId, fetchPoDetails]
  );

  // Validate form
  const isFormValid = useCallback(() => {
    const poValid =
      poForm.po_no &&
      poForm.po_date &&
      poForm.vendor_id &&
      poForm.store_id &&
      parseFloat(poForm.sub_total) > 0 &&
      parseFloat(poForm.grand_total) > 0;
    const itemsValid = updatedItems.every(
      (item) =>
        item.inv_product_id &&
        item.quantity &&
        item.unit_price &&
        item.total_price
    );
    return poValid && updatedItems.length > 0 && itemsValid;
  }, [poForm, updatedItems]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!isFormValid()) {
      setError(
        "Please fill all required fields: PO Number, PO Date, Vendor, Store, and at least one item with Product, Quantity, Unit Price, and Total Price"
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      const poIdToUse = selectedPo.po_id !== null ? selectedPo.po_id : selectedPo.id;

      // Log the payload to debug
      const poPayload = {
        po_no: poForm.po_no,
        po_date: poForm.po_date || null,
        po_type: poForm.po_type || null,
        pay_mode: poForm.pay_mode || null,
        discount: parseFloat(poForm.discount) || null,
        sub_total: parseFloat(poForm.sub_total) || null,
        grand_total: parseFloat(poForm.grand_total) || null,
        vds_total: parseFloat(poForm.vds_total) || null,
        tds_total: parseFloat(poForm.tds_total) || null,
        vendor_id: parseInt(poForm.vendor_id) || null,
        store_id: parseInt(poForm.store_id) || null,
        currency: poForm.currency || null,
        subject: poForm.subject || null,
        remarks: poForm.remarks || null,
        company_code: poForm.company_code || null,
        po_id: poIdToUse,
        modified_by: poForm.modified_by || null,
      };
      console.log("Updating Purchase Order with payload:", poPayload);

      // Update Purchase Order
      const poResponse = await axios.put(
        `${URL}/api/purchaseorder/${selectedPoId}`,
        poPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Process Purchase Order Details (only new or modified rows)
      const updatedDetails = [];
      for (const detail of updatedItems) {
        // Skip unchanged existing rows
        if (!detail.isNew && !detail.isModified) {
          updatedDetails.push(detail);
          continue;
        }

        const detailData = {
          line_no: detail.line_no || null,
          inv_product_id: parseInt(detail.inv_product_id) || null,
          quantity: parseFloat(detail.quantity) || null,
          unit_price: parseFloat(detail.unit_price) || null,
          discount: parseFloat(detail.discount) || null,
          discount_pct: parseFloat(detail.discount_pct) || null,
          total_price: parseFloat(detail.total_price) || null,
          vds_pct: parseFloat(detail.vds_pct) || null,
          vds: parseFloat(detail.vds) || null,
          tds_pct: parseFloat(detail.tds_pct) || null,
          tds: parseFloat(detail.tds) || null,
          po_id: poIdToUse,
        };

        try {
          if (detail.isNew) {
            // Create new detail
            const response = await axios.post(
              `${URL}/api/purchaseorderdetail`,
              detailData,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            updatedDetails.push({ ...response.data.purchaseOrderDetail, isNew: false, isModified: false });
          } else if (detail.id && detail.isModified) {
            // Update existing detail
            const response = await axios.put(
              `${URL}/api/purchaseorderdetail/${detail.id}`,
              detailData,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            updatedDetails.push({ ...response.data.purchaseOrderDetail, isNew: false, isModified: false });
          }
        } catch (err) {
          console.error(`Error processing detail id=${detail.id || 'new'}:`, err);
          throw new Error(`Failed to process Purchase Order Detail: ${err.message}`);
        }
      }

      // Update frontend state
      setPurchaseOrders((prev) =>
        prev.map((po) => (po.id === selectedPoId ? poResponse.data.purchaseOrder : po))
      );

      // Update poDetails to reflect saved changes
      setPoDetails(updatedDetails);

      onClose();
    } catch (err) {
      console.error("Error updating purchase order:", err);
      setError(`Failed to update purchase order: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "16px",
          bgcolor: "#ffffff",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          m: { xs: 1, sm: 2 },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 600,
          fontSize: { xs: "1.25rem", sm: "1.5rem" },
          bgcolor: "#FAFAFA",
          color: "#111827",
          py: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 4 },
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        Edit Purchase Order - #{selectedPo?.po_no || "N/A"}
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 2, sm: 4 }, bgcolor: "#f9fafb" }}>
        {error && (
          <Typography
            color="error"
            sx={{
              mb: 2,
              fontFamily: "'Inter', sans-serif",
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
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
            {/* Purchase Order Form */}
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                mb: 2,
                color: "#111827",
              }}
            >
              Purchase Order Details
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
                mb: 4,
              }}
            >
              <TextField
                label="PO Number"
                name="po_no"
                value={poForm.po_no}
                onChange={handlePoFormChange}
                size="small"
                required
                sx={{ bgcolor: "#ffffff", borderRadius: "8px" }}
              />
              <TextField
                label="PO Date"
                name="po_date"
                type="date"
                value={poForm.po_date}
                onChange={handlePoFormChange}
                size="small"
                required
                InputLabelProps={{ shrink: true }}
                sx={{ bgcolor: "#ffffff", borderRadius: "8px" }}
              />
              <TextField
                label="PO Type"
                name="po_type"
                value={poForm.po_type}
                onChange={handlePoFormChange}
                size="small"
                sx={{ bgcolor: "#ffffff", borderRadius: "8px" }}
              />
              <TextField
                label="Pay Mode"
                name="pay_mode"
                value={poForm.pay_mode}
                onChange={handlePoFormChange}
                size="small"
                sx={{ bgcolor: "#ffffff", borderRadius: "8px" }}
              />
              <TextField
                label="Discount"
                name="discount"
                type="number"
                value={poForm.discount}
                // onChange={handlePoFormChange}
                disabled
                size="small"
                sx={{ bgcolor: "#ffffff", borderRadius: "8px" }}
              />
              <TextField
                label="Subtotal"
                name="sub_total"
                type="number"
                value={poForm.sub_total}
                disabled
                size="small"
                required
                sx={{ bgcolor: "#ffffff", borderRadius: "8px" }}
              />
              <TextField
                label="Grand Total"
                name="grand_total"
                type="number"
                value={poForm.grand_total}
                disabled
                size="small"
                required
                sx={{ bgcolor: "#ffffff", borderRadius: "8px" }}
              />
              <TextField
                label="VDS Total"
                name="vds_total"
                type="number"
                value={poForm.vds_total}
                disabled
                size="small"
                sx={{ bgcolor: "#ffffff", borderRadius: "8px" }}
              />
              <TextField
                label="TDS Total"
                name="tds_total"
                type="number"
                value={poForm.tds_total}
                disabled
                size="small"
                sx={{ bgcolor: "#ffffff", borderRadius: "8px" }}
              />
              {/* === UPDATED: Vendor Autocomplete with search functionality === */}
              <Autocomplete
                options={vendors}
                getOptionLabel={(option) => option.name || ""}
                value={vendors.find((org) => org.id.toString() === poForm.vendor_id) || null}
                onChange={handleVendorChange}
                onInputChange={(event, value) => setVendorSearch(value)}
                noOptionsText="No options"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Vendor"
                    size="small"
                    required
                    sx={{ bgcolor: "#ffffff", borderRadius: "8px" }}
                  />
                )}
              />
              {/* === UPDATED: Store Autocomplete with search functionality === */}
              <Autocomplete
                options={stores}
                getOptionLabel={(option) => option.name || ""}
                value={stores.find((org) => org.id.toString() === poForm.store_id) || null}
                onChange={handleStoreChange}
                onInputChange={(event, value) => setStoreSearch(value)}
                noOptionsText="No options"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Store"
                    size="small"
                    required
                    sx={{ bgcolor: "#ffffff", borderRadius: "8px" }}
                  />
                )}
              />
              <TextField
                label="Currency"
                name="currency"
                value={poForm.currency}
                onChange={handlePoFormChange}
                size="small"
                sx={{ bgcolor: "#ffffff", borderRadius: "8px" }}
              />
              <TextField
                label="Subject"
                name="subject"
                value={poForm.subject}
                onChange={handlePoFormChange}
                size="small"
                sx={{ bgcolor: "#ffffff", borderRadius: "8px" }}
              />
              <TextField
                label="Remarks"
                name="remarks"
                value={poForm.remarks}
                onChange={handlePoFormChange}
                size="small"
                sx={{ bgcolor: "#ffffff", borderRadius: "8px" }}
              />
              <TextField
                label="Company Code"
                name="company_code"
                value={poForm.company_code}
                onChange={handlePoFormChange}
                size="small"
                sx={{ bgcolor: "#ffffff", borderRadius: "8px" }}
              />
              <TextField
                label="Parent PO ID"
                name="po_id"
                type="number"
                value={poForm.po_id}
                onChange={handlePoFormChange}
                size="small"
                sx={{ bgcolor: "#ffffff", borderRadius: "8px" }}
              />
            </Box>

            {/* Purchase Order Details Form */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                Order Items
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addDetailRow}
                sx={{
                  textTransform: "none",
                  bgcolor: "#10B981",
                  "&:hover": { bgcolor: "#059669" },
                  fontFamily: "'Inter', sans-serif",
                  borderRadius: "8px",
                }}
              >
                Add Item
              </Button>
            </Box>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "12px",
                border: "1px solid rgba(0,0,0,0.05)",
                overflow: "hidden",
                bgcolor: "#ffffff",
              }}
            >
              <TableContainer sx={{ maxHeight: "400px", overflowY: "auto" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {[
                        "Line",
                        "Product",
                        "Quantity",
                        "Unit Price",
                        "Discount",
                        "Discount %",
                        "Total Price",
                        "VDS %",
                        "VDS",
                        "TDS %",
                        "TDS",
                        "Actions",
                      ].map((header) => (
                        <TableCell
                          key={header}
                          sx={{
                            fontWeight: 600,
                            backgroundColor: "#FAFAFA",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            p: { xs: 1, sm: 1.5 },
                            minWidth: header === "Product" ? 200 : 100,
                          }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {updatedItems.map((detail, index) => (
                      <TableRow key={index} hover>
                        <TableCell sx={{ p: { xs: 1, sm: 1.5 } }}>
                          <TextField
                            value={detail.line_no}
                            onChange={(e) => handleDetailChange(index, "line_no", e.target.value)}
                            size="small"
                            sx={{ width: "80px" }}
                          />
                        </TableCell>
                        <TableCell sx={{ p: { xs: 1, sm: 1.5 } }}>
                          <Autocomplete
                            options={products}
                            getOptionLabel={(option) => `${option.name} (${option.code})` || ""}
                            value={products.find((product) => product.id.toString() === detail.inv_product_id) || null}
                            onChange={(event, newValue) => handleProductChange(index, newValue)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                required
                                sx={{ minWidth: "150px" }}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell sx={{ p: { xs: 1, sm: 1.5 } }}>
                          <TextField
                            type="number"
                            value={detail.quantity}
                            onChange={(e) => handleDetailChange(index, "quantity", e.target.value)}
                            size="small"
                            required
                            inputProps={{ min: 0 }}
                            sx={{ width: "100px" }}
                          />
                        </TableCell>
                        <TableCell sx={{ p: { xs: 1, sm: 1.5 } }}>
                          <TextField
                            type="number"
                            value={detail.unit_price}
                            onChange={(e) => handleDetailChange(index, "unit_price", e.target.value)}
                            size="small"
                            required
                            inputProps={{ min: 0 }}
                            sx={{ width: "100px" }}
                          />
                        </TableCell>
                        <TableCell sx={{ p: { xs: 1, sm: 1.5 } }}>
                          <TextField
                            type="number"
                            value={detail.discount}
                            onChange={(e) => handleDetailChange(index, "discount", e.target.value)}
                            size="small"
                            inputProps={{ min: 0 }}
                            sx={{ width: "100px" }}
                          />
                        </TableCell>
                        <TableCell sx={{ p: { xs: 1, sm: 1.5 } }}>
                          <TextField
                            type="number"
                            value={detail.discount_pct}
                            disabled
                            size="small"
                            sx={{ width: "100px" }}
                          />
                        </TableCell>
                        <TableCell sx={{ p: { xs: 1, sm: 1.5 } }}>
                          <TextField
                            type="number"
                            value={detail.total_price}
                            onChange={(e) => handleDetailChange(index, "total_price", e.target.value)}
                            size="small"
                            required
                            inputProps={{ min: 0 }}
                            sx={{ width: "100px" }}
                          />
                        </TableCell>
                        <TableCell sx={{ p: { xs: 1, sm: 1.5 } }}>
                          <TextField
                            type="number"
                            value={detail.vds_pct}
                            onChange={(e) => handleDetailChange(index, "vds_pct", e.target.value)}
                            size="small"
                            inputProps={{ min: 0 }}
                            sx={{ width: "100px" }}
                          />
                        </TableCell>
                        <TableCell sx={{ p: { xs: 1, sm: 1.5 } }}>
                          <TextField
                            type="number"
                            value={detail.vds}
                            onChange={(e) => handleDetailChange(index, "vds", e.target.value)}
                            size="small"
                            inputProps={{ min: 0 }}
                            sx={{ width: "100px" }}
                          />
                        </TableCell>
                        <TableCell sx={{ p: { xs: 1, sm: 1.5 } }}>
                          <TextField
                            type="number"
                            value={detail.tds_pct}
                            onChange={(e) => handleDetailChange(index, "tds_pct", e.target.value)}
                            size="small"
                            inputProps={{ min: 0 }}
                            sx={{ width: "100px" }}
                          />
                        </TableCell>
                        <TableCell sx={{ p: { xs: 1, sm: 1.5 } }}>
                          <TextField
                            type="number"
                            value={detail.tds}
                            onChange={(e) => handleDetailChange(index, "tds", e.target.value)}
                            size="small"
                            inputProps={{ min: 0 }}
                            sx={{ width: "100px" }}
                          />
                        </TableCell>
                        <TableCell sx={{ p: { xs: 1, sm: 1.5 } }}>
                          <IconButton
                            onClick={() => removeDetailRow(index)}
                            sx={{
                              color: "#EF4444",
                              "&:hover": { bgcolor: "rgba(239, 68, 68, 0.1)" },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          p: { xs: 2, sm: 4 },
          bgcolor: "#FAFAFA",
          borderTop: "1px solid #e5e7eb",
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
            fontFamily: "'Inter', sans-serif",
            fontSize: { xs: "0.875rem", sm: "1rem" },
            color: "#ffffff",
            bgcolor: "#6b7280",
            "&:hover": { bgcolor: "#4b5563" },
            px: { xs: 2, sm: 2 },
            py: 1,
            borderRadius: "8px",
            mr: 1,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || !isFormValid()}
          sx={{
            textTransform: "none",
            fontFamily: "'Inter', sans-serif",
            fontSize: { xs: "0.875rem", sm: "1rem" },
            color: "#ffffff",
            bgcolor: "#10B981",
            "&:hover": { bgcolor: "#059669" },
            px: { xs: 2, sm: 3 },
            py: 1,
            borderRadius: "8px",
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPurchaseOrderDialog;
