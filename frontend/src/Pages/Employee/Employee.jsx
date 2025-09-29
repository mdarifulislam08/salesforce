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
  // Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  // FilterList as FilterListIcon,
  PersonAdd as PersonAddIcon,
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

const Employees = () => {
  const theme = useTheme();                                      
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    department: "",
    designation: "",
    contact_no: "",
    role_name: "",
    company_code: "",
    sh: "",
    ch: "",
    kam: "",
    rm: "",
    am: "",
    tm: "",
    so: "",
    parent_id: "", // Initialize as empty string for Select
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
        setUserId(decoded.id); // Assuming JWT payload has 'id' field
      } catch (err) {
        console.error("Error decoding JWT:", err);
        setError("Invalid authentication token");
      }
    }
  }, []);

  // Fetch all employees
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${URL}/api/employee`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setEmployees(response.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Define getDepartmentColor dynamically
  const getDepartmentColor = (department) => {
    return department ? stringToColor(department) : "#6B7280";
    // const colors = {
    //   Sales: "#6366F1",
    //   Marketing: "#F59E0B",
    //   IT: "#22C55E",
    //   HR: "#EF4444",
    //   Finance: "#8B5CF6",
    // };
    // return colors[department] || "#6B7280";
  };

  // Compute department
  const departmentData = Array.isArray(employees)
  ? employees.reduce((acc, emp) => {
      if (emp.department) {
        const existing = acc.find((d) => d.name === emp.department);
        if (existing) {
          existing.count += 1;
        } else {
          acc.push({
            name: emp.department,
            count: 1,
            color: getDepartmentColor(emp.department),
          });
        }
      }
      return acc;
    }, [])
  : [];


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      (employee.code &&
        employee.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (employee.name &&
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (employee.department &&
        employee.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (employee.designation &&
        employee.designation.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (employee.role_name &&
        employee.role_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const currentEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleAddEmployee = () => {
    setIsEdit(false);
    setFormData({
      code: "",
      name: "",
      department: "",
      designation: "",
      contact_no: "",
      role_name: "",
      company_code: "",
      sh: "",
      ch: "",
      kam: "",
      rm: "",
      am: "",
      tm: "",
      so: "",
      parent_id: "",
      path_text: "",
    });
    setOpenModal(true);
  };

  const handleEdit = (employee) => {
    setIsEdit(true);
    setCurrentEmployee(employee);
    setFormData({
      code: employee.code || "",
      name: employee.name || "",
      department: employee.department || "",
      designation: employee.designation || "",
      contact_no: employee.contact_no || "",
      role_name: employee.role_name || "",
      company_code: employee.company_code || "",
      sh: employee.sh || "",
      ch: employee.ch || "",
      kam: employee.kam || "",
      rm: employee.rm || "",
      am: employee.am || "",
      tm: employee.tm || "",
      so: employee.so || "",
      parent_id: employee.parent_id ? employee.parent_id.toString() : "",
      path_text: employee.path_text || "",
    });
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`${URL}/api/employee/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setEmployees(employees.filter((emp) => emp.id !== id));
      } catch (err) {
        console.error("Error deleting employee:", err);
        setError("Failed to delete employee");
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    if (!formData.code || !formData.name) {
      setError("Employee code and name are required");
      return;
    }

    try {
      const payload = {
        code: formData.code,
        name: formData.name,
        department: formData.department || null,
        designation: formData.designation || null,
        contact_no: formData.contact_no || null,
        role_name: formData.role_name || null,
        company_code: formData.company_code || null,
        sh: formData.sh || null,
        ch: formData.ch || null,
        kam: formData.kam || null,
        rm: formData.rm || null,
        am: formData.am || null,
        tm: formData.tm || null,
        so: formData.so || null,
        parent_id: formData.parent_id ? parseInt(formData.parent_id) : null,
        path_text: formData.path_text || null,
        user_id: userId,
      };

      if (isEdit && currentEmployee) {
        const response = await axios.put(
          `${URL}/api/employee/${currentEmployee.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setEmployees(
          employees.map((emp) =>
            emp.id === currentEmployee.id ? response.data.employee : emp
          )
        );
      } else {
        const response = await axios.post(
          `${URL}/api/employee`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setEmployees([...employees, response.data.employee]);
      }
      setOpenModal(false);
      setError(null);
    } catch (err) {
      console.error("Error saving employee:", err);
      setError(`Failed to ${isEdit ? "update" : "create"} employee: ${err.response?.data?.error || err.message}`);
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
            Employees
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={handleAddEmployee}
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
            Add Employee
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
            {/* Department Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {departmentData.map((dept) => (
                <Grid item xs={12} sm={6} md={4} lg={2.4} key={dept.name}>
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
                            backgroundColor: `${dept.color}`,
                            // color: dept.color,
                            color: "white",
                            fontWeight: 600,
                            mr: 1.5,
                          }}
                        >
                          {dept.name.charAt(0)}
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
                            {dept.name}
                          </Typography>
                          <Typography
                            color="text.secondary"
                            variant="body2"
                            sx={{
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            {dept.count} employees
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
                placeholder="Search employees..."
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

            {/* Employee Table */}
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
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Designation</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Contact No</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Role Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Company Code</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>SH</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>CH</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>KAM</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>RM</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>AM</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>TM</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>SO</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Parent ID</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Path Text</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentEmployees.map((employee) => (
                      <TableRow key={employee.id} hover>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{employee.code}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{employee.name}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{employee.department || "N/A"}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{employee.designation || "N/A"}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{employee.contact_no || "N/A"}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{employee.role_name || "N/A"}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{employee.company_code || "N/A"}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{employee.sh || "N/A"}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{employee.ch || "N/A"}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{employee.kam || "N/A"}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{employee.rm || "N/A"}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{employee.am || "N/A"}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{employee.tm || "N/A"}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{employee.so || "N/A"}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{employee.parent_id || "N/A"}</TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{employee.path_text || "N/A"}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleEdit(employee)}
                            sx={{ color: "#6366F1" }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(employee.id)}
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
                count={filteredEmployees.length}
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

        {/* Add/Edit Employee Modal */}
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
            {isEdit ? "Edit Employee" : "Add Employee"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <TextField
                label="Employee Code"
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
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
              />
              <TextField
                label="Designation"
                name="designation"
                value={formData.designation}
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
                label="Role Name"
                name="role_name"
                value={formData.role_name}
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
              <TextField
                label="Sales Head (SH)"
                name="sh"
                value={formData.sh}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
              />
              <TextField
                label="Channel Head (CH)"
                name="ch"
                value={formData.ch}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
              />
              <TextField
                label="Key Account Manager (KAM)"
                name="kam"
                value={formData.kam}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
              />
              <TextField
                label="Regional Manager (RM)"
                name="rm"
                value={formData.rm}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
              />
              <TextField
                label="Area Manager (AM)"
                name="am"
                value={formData.am}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
              />
              <TextField
                label="Territory Manager (TM)"
                name="tm"
                value={formData.tm}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
              />
              <TextField
                label="Sales Officer (SO)"
                name="so"
                value={formData.so}
                onChange={handleFormChange}
                fullWidth
                size="small"
                variant="outlined"
              />
              <FormControl fullWidth size="small">
                <InputLabel id="parent-id-label">Parent Employee</InputLabel>
                <Select
                  labelId="parent-id-label"
                  name="parent_id"
                  value={formData.parent_id}
                  onChange={handleFormChange}
                  label="Parent Employee"
                >
                  <MenuItem value="">None</MenuItem>
                  {employees
                    .filter((emp) => !isEdit || emp.id !== currentEmployee?.id) // Set self in edit mode
                    .map((employee) => (
                      <MenuItem key={employee.id} value={employee.id.toString()}>
                        {employee.name} ({employee.code})
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
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

export default Employees;
