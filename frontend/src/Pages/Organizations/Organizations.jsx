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
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,               
  useMediaQuery,
} from "@mui/material";
import {
  Search as SearchIcon,
  // FilterList as FilterListIcon,
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
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

const Organizations = () => {
  const theme = useTheme();                                      
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [organizations, setOrganizations] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentOrganization, setCurrentOrganization] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    address: "",
    contact_person: "",
    contact_no: "",
    channel: "",
    region: "",
    area: "",
    territory: "",
    company_code: "",
    org_id: "", // Initialize as empty string for Select
    org_type: "",
    path_text: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Decode JWT to get user_id
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (err) {
        console.error("Error decoding JWT:", err);
        setError("Invalid authentication token");
      }
    }
  }, []);
  console.log(userId);

  // Fetch all organizations
  useEffect(() => {
    const fetchOrganizations = async () => {
      setLoading(true);
      try {
        const response = await axios.get("${URL}/api/organization", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setOrganizations(response.data);
      } catch (err) {
        console.error("Error fetching organizations:", err);
        setError("Failed to fetch organizations");
      } finally {
        setLoading(false);
      }
    };
    fetchOrganizations();
  }, []);

  // Define getOrgTypeColor dynamically
  const getOrgTypeColor = (orgType) => {
    return orgType ? stringToColor(orgType) : "#6B7280"; 
  };

  // Compute organizations
  const orgTypeData = organizations.reduce((acc, org) => {
    if (org.org_type) {
      const existing = acc.find((d) => d.name === org.org_type);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({
          name: org.org_type,
          count: 1,
          color: getOrgTypeColor(org.org_type),
        });
      }
    }
    return acc;
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredOrganizations = organizations.filter(
    (org) =>
      (org.code &&
        org.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (org.name &&
        org.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (org.address &&
        org.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (org.contact_person &&
        org.contact_person.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (org.org_type &&
        org.org_type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const currentOrganizations = filteredOrganizations.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleAddOrganization = () => {
    setIsEdit(false);
    setFormData({
      code: "",
      name: "",
      address: "",
      contact_person: "",
      contact_no: "",
      channel: "",
      region: "",
      area: "",
      territory: "",
      company_code: "",
      org_id: "",
      org_type: "",
      path_text: "",
    });
    setOpenModal(true);
  };

  const handleEdit = (organization) => {
    setIsEdit(true);
    setCurrentOrganization(organization);
    setFormData({
      code: organization.code || "",
      name: organization.name || "",
      address: organization.address || "",
      contact_person: organization.contact_person || "",
      contact_no: organization.contact_no || "",
      channel: organization.channel || "",
      region: organization.region || "",
      area: organization.area || "",
      territory: organization.territory || "",
      company_code: organization.company_code || "",
      org_id: organization.org_id ? organization.org_id.toString() : "",
      org_type: organization.org_type || "",
      path_text: organization.path_text || "",
    });
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this organization?")) {
      try {
        await axios.delete(`${URL}/api/organization/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setOrganizations(organizations.filter((org) => org.id !== id));
      } catch (err) {
        console.error("Error deleting organization:", err);
        setError("Failed to delete organization");
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    if (!formData.code || !formData.name) {
      setError("Organization code and name are required");
      return;
    }

    try {
      const payload = {
        code: formData.code,
        name: formData.name,
        address: formData.address || null,
        contact_person: formData.contact_person || null,
        contact_no: formData.contact_no || null,
        channel: formData.channel || null,
        region: formData.region || null,
        area: formData.area || null,
        territory: formData.territory || null,
        company_code: formData.company_code || null,
        org_id: formData.org_id ? parseInt(formData.org_id) : null,
        org_type: formData.org_type || null,
        path_text: formData.path_text || null,
      };

      if (isEdit && currentOrganization) {
        const response = await axios.put(
          `${URL}/api/organization/${currentOrganization.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setOrganizations(
          organizations.map((org) =>
            org.id === currentOrganization.id ? response.data.organization : org
          )
        );
      } else {
        const response = await axios.post(
          "${URL}/api/organization",
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setOrganizations([...organizations, response.data.organization]);
      }
      setOpenModal(false);
      setError(null);
    } catch (err) {
      console.error("Error saving organization:", err);
      setError(`Failed to ${isEdit ? "update" : "create"} organization: ${err.response?.data?.error || err.message}`);
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
              fontSize: { xs: "1.25rem", sm: "2rem" } 
            }}
          >
            Organizations
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={handleAddOrganization}
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
            Add Organization
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
            {/* Org Type Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {orgTypeData.map((type) => (
                <Grid item xs={12} sm={6} md={4} lg={2.4} key={type.name}>
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
                            backgroundColor: `${type.color}`,
                            color: "white",
                            fontWeight: 600,
                            mr: 1.5,
                          }}
                        >
                          {type.name.charAt(0)}
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
                            {type.name}
                          </Typography>
                          <Typography
                            color="text.secondary"
                            variant="body2"
                            sx={{
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            {type.count} organizations
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

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
                placeholder="Search organizations..."
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

            {/* Organization Table */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <TableContainer sx={{ maxHeight: {
                    xs: "60vh",                  
                    sm: "calc(100vh - 350px)",
                  } }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Code</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Address</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Contact Person</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Contact No</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Channel</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Region</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Area</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Territory</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Company Code</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Parent Org ID</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Org Type</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Path Text</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentOrganizations.map((org) => (
                      <TableRow key={org.id} hover>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{org.code}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{org.name}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{org.address || "N/A"}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{org.contact_person || "N/A"}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{org.contact_no || "N/A"}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{org.channel || "N/A"}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{org.region || "N/A"}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{org.area || "N/A"}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{org.territory || "N/A"}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{org.company_code || "N/A"}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{org.org_id || "N/A"}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{org.org_type || "N/A"}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{org.path_text || "N/A"}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleEdit(org)}
                            sx={{ color: "#6366F1" }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(org.id)}
                            sx={{ color: "#EF4444" }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredOrganizations.length}
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

        {/* Add/Edit Organization Modal */}
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
            {isEdit ? "Edit Organization" : "Add Organization"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <TextField
                label="Organization Code"
                name="code"
                value={formData.code}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
                required
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
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
              />
              <TextField
                label="Contact Person"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
              />
              <TextField
                label="Contact Number"
                name="contact_no"
                value={formData.contact_no}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
              />
              <TextField
                label="Channel"
                name="channel"
                value={formData.channel}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
              />
              <TextField
                label="Region"
                name="region"
                value={formData.region}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
              />
              <TextField
                label="Area"
                name="area"
                value={formData.area}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
              />
              <TextField
                label="Territory"
                name="territory"
                value={formData.territory}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
              />
              <TextField
                label="Company Code"
                name="company_code"
                value={formData.company_code}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
              />
              <FormControl fullWidth size="small">
                <InputLabel id="org-id-label">Parent Organization</InputLabel>
                <Select
                  labelId="org-id-label"
                  name="org_id"
                  value={formData.org_id}
                  onChange={handleFormChange}
                  label="Parent Organization"
                >
                  <MenuItem value="">None</MenuItem>
                  {organizations
                    .filter((org) => !isEdit || org.id !== currentOrganization?.id)
                    .map((org) => (
                      <MenuItem key={org.id} value={org.id.toString()}>
                        {org.name} ({org.code})
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <TextField
                label="Organization Type"
                name="org_type"
                value={formData.org_type}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
              />
              <TextField
                label="Path Text"
                name="path_text"
                value={formData.path_text}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
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
              sx={{
                backgroundColor: "#6366F1",
                textTransform: "none",
                fontFamily: "'Inter', sans-serif",
                "&:hover": {
                  backgroundColor: "#4F46E5",
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

export default Organizations;
