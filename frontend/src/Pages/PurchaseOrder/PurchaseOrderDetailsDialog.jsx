import React from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const PurchaseOrderDetailsDialog = ({
  open,
  onClose,
  selectedPoId,
  purchaseOrders,
  products,
  poDetails,
  detailsLoading,
  detailsError,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const selectedPo = purchaseOrders.find((po) => po.id === selectedPoId);

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
        Purchase Order Details - #{selectedPo?.po_no || "N/A"}
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 2, sm: 4 }, bgcolor: "#f9fafb" }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: "12px",
            border: "1px solid rgba(0,0,0,0.05)",
            overflow: "hidden",
            bgcolor: "#ffffff",
          }}
        >
          {detailsError && (
            <Typography
              color="error"
              sx={{
                p: 2,
                fontFamily: "'Inter', sans-serif",
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              {detailsError}
            </Typography>
          )}
          {detailsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={isMobile ? 24 : 40} />
            </Box>
          ) : poDetails.length === 0 ? (
            <Typography
              sx={{
                p: 2,
                fontFamily: "'Inter', sans-serif",
                fontSize: { xs: "0.875rem", sm: "1rem" },
                color: "#6b7280",
              }}
            >
              No product details found for Purchase Order ID {selectedPoId}
            </Typography>
          ) : (
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
                          color: "#111827",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {poDetails.map((detail) => (
                    <TableRow
                      key={detail.id}
                      hover
                      sx={{
                        "&:hover": { bgcolor: "#f4f5f7" },
                      }}
                    >
                      <TableCell
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          p: { xs: 1, sm: 1.5 },
                          color: "#374151",
                        }}
                      >
                        {detail.line_no || "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          p: { xs: 1, sm: 1.5 },
                          color: "#374151",
                        }}
                      >
                        {products.find((p) => p.id === detail.inv_product_id)?.name || "N/A"} (
                        {products.find((p) => p.id === detail.inv_product_id)?.code || "N/A"})
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          p: { xs: 1, sm: 1.5 },
                          color: "#374151",
                        }}
                      >
                        {detail.quantity || "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          p: { xs: 1, sm: 1.5 },
                          color: "#374151",
                        }}
                      >
                        {detail.unit_price || "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          p: { xs: 1, sm: 1.5 },
                          color: "#374151",
                        }}
                      >
                        {detail.discount || "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          p: { xs: 1, sm: 1.5 },
                          color: "#374151",
                        }}
                      >
                        {detail.discount_pct || "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          p: { xs: 1, sm: 1.5 },
                          color: "#374151",
                        }}
                      >
                        {detail.total_price || "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          p: { xs: 1, sm: 1.5 },
                          color: "#374151",
                        }}
                      >
                        {detail.vds_pct || "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          p: { xs: 1, sm: 1.5 },
                          color: "#374151",
                        }}
                      >
                        {detail.vds || "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          p: { xs: 1, sm: 1.5 },
                          color: "#374151",
                        }}
                      >
                        {detail.tds_pct || "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          p: { xs: 1, sm: 1.5 },
                          color: "#374151",
                        }}
                      >
                        {detail.tds || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
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
            px: { xs: 2, sm: 3 },
            py: 1,
            borderRadius: "8px",
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseOrderDetailsDialog;