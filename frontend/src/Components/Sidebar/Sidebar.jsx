// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Drawer,
//   AppBar,
//   Toolbar,
//   List,
//   Typography,
//   Divider,
//   IconButton,
//   ListItemIcon,
//   ListItemText,
//   Avatar,
//   Menu,
//   MenuItem,
//   Badge,
//   Tooltip,
//   Button,
//   alpha,
//   ListItemButton,
// } from "@mui/material";
// import {
//   Menu as MenuIcon,
//   Dashboard as DashboardIcon,
//   // ShoppingCart as ShoppingCartIcon,
//   AddShoppingCart as AddShoppingCartIcon,
//   People as PeopleIcon,
//   Inventory as InventoryIcon,
//   Store as StoreIcon,
//   Settings as SettingsIcon,
//   Person as PersonIcon,
//   Notifications as NotificationsIcon,
//   Receipt as ReceiptIcon,
// } from "@mui/icons-material";
// import { useNavigate, useLocation } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import axios from "axios";

// const Sidebar = ({ children }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [user, setUser] = useState(null);
//   const [open, setOpen] = useState(true);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 960);
//   const drawerWidth = 300;

//   // Check if window is mobile size
//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 960;
//       setIsMobile(mobile);
//       if (mobile) {
//         setOpen(false);
//       } else {
//         setOpen(true);
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     handleResize(); // Call on initial render
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   // Fetch user data
//   useEffect(() => {
//     const fetchUserData = async () => {
//       const token = localStorage.getItem("authToken");

//       if (token) {
//         try {
//           // Decode the token to get user info
//           const decodedToken = jwtDecode(token);
//           setUser(decodedToken);

//           // Fetch user data from the backend
//           const response = await axios.get("${URL}/api/user", {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });

//           // Set the fetched user data to state
//           setUser(response.data);
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleDrawerToggle = () => {
//     setOpen(!open);
//   };

//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleNotificationOpen = (event) => {
//     setNotificationAnchorEl(event.currentTarget);
//   };

//   const handleNotificationClose = () => {
//     setNotificationAnchorEl(null);
//   };

//   const handleLogout = () => {
//     // Remove the JWT token from localStorage
//     localStorage.removeItem("authToken");

//     // Redirect to login page
//     navigate("/login");
//   };

//   // Check if the current path matches the nav item
//   const isSelected = (path) => {
//     return location.pathname === path;
//   };

//   // Navigation items
//   const navItems = [
//     { 
//       text: "Dashboard", 
//       icon: <DashboardIcon />, 
//       path: "/dashboard" 
//     },
//     { 
//       text: "Create Purchase order", 
//       icon: <AddShoppingCartIcon />, 
//       path: "/create-purchase-order" 
//     },
//     { 
//       text: "Purchase Orders", 
//       icon: <InventoryIcon />, 
//       path: "/purchase-orders" 
//     },
//     // { 
//     //   text: "Purchase Order Details", 
//     //   icon: <InventoryIcon />, 
//     //   path: "/purchase-orders-details" 
//     // },
//     { 
//       text: "Organizations", 
//       icon: <StoreIcon />, 
//       path: "/organizations" 
//     },
//     { 
//       text: "Employees", 
//       icon: <PeopleIcon />, 
//       path: "/employees" 
//     },
//     { 
//       text: "Inventory Product", 
//       icon: <InventoryIcon />, 
//       path: "/inventory-product" 
//     },
//   ];

//   // Secondary navigation items
//   const secondaryNavItems = [
//     { 
//       text: "Reports", 
//       icon: <ReceiptIcon />, 
//       path: "/reports" 
//     },
//     { 
//       text: "Settings", 
//       icon: <SettingsIcon />, 
//       path: "/settings" 
//     },
//   ];

//   return (
//     <Box sx={{ display: "flex", backgroundColor: "#f1f5f9", minHeight: "100vh", overflow: "hidden" }}>
//       {/* App Bar */}
//       <AppBar
//         position="fixed"
//         elevation={0}
//         sx={{
//           zIndex: (theme) => theme.zIndex.drawer + 1,
//           backgroundColor: "#ffffff",
//           color: (theme) => theme.palette.text.primary,
//           borderBottom: "1px solid",
//           borderColor: "rgba(0,0,0,0.06)",
//         }}
//       >
//         <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }}>
//           <IconButton 
//             color="inherit" 
//             aria-label="open drawer" 
//             edge="start" 
//             onClick={handleDrawerToggle} 
//             sx={{ mr: 2 }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             <Typography
//               variant="h5"
//               noWrap
//               component="div"
//               sx={{
//                 display: { xs: "none", sm: "block" },
//                 fontWeight: 800,
//                 color: "#6366F1",
//                 letterSpacing: "-0.5px",
//                 fontFamily: "'Poppins', sans-serif",
//               }}
//             >
//               SalesForce
//             </Typography>
//           </Box>
//           <Box sx={{ flexGrow: 1 }} />
//           {/* Notification Icon */}
//           <Tooltip title="Notifications">
//             <IconButton
//               color="inherit"
//               onClick={handleNotificationOpen}
//               sx={{
//                 backgroundColor: notificationAnchorEl ? alpha("#6366F1", 0.1) : "transparent",
//                 mr: 1,
//               }}
//             >
//               <Badge badgeContent={4} sx={{ "& .MuiBadge-badge": { backgroundColor: "#6366F1" } }}>
//                 <NotificationsIcon />
//               </Badge>
//             </IconButton>
//           </Tooltip>
//           {/* Settings Icon */}
//           {/* <Tooltip title="Settings">
//             <IconButton color="inherit" sx={{ mr: 2 }}>
//               <SettingsIcon />
//             </IconButton>
//           </Tooltip> */}
//           {/* User Profile Menu */}
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             {/* <Box sx={{ display: { xs: "none", sm: "block" }, mr: 1.5 }}>
//               <Typography
//                 variant="body2"
//                 sx={{
//                   fontWeight: 600,
//                   lineHeight: 1.2,
//                   fontFamily: "'Inter', sans-serif",
//                   fontSize: "0.875rem",
//                 }}
//               >
//                 {user ? user.name : "Loading..."}
//               </Typography>
//               <Typography
//                 variant="caption"
//                 color="text.secondary"
//                 sx={{
//                   fontFamily: "'Inter', sans-serif",
//                   fontSize: "0.75rem",
//                 }}
//               >
//                 {user ? user.email : "Administrator"}
//               </Typography>
//             </Box> */}
//             <IconButton
//               edge="end"
//               aria-label="account of current user"
//               aria-haspopup="true"
//               onClick={handleMenuOpen}
//               color="inherit"
//             >
//               <Avatar
//                 sx={{
//                   width: 38,
//                   height: 38,
//                   backgroundColor: "#6366F1",
//                 }}
//               >
//                 <PersonIcon />
//               </Avatar>
//             </IconButton>
//             <Menu
//               anchorEl={anchorEl}
//               anchorOrigin={{
//                 vertical: "bottom",
//                 horizontal: "right",
//               }}
//               keepMounted
//               transformOrigin={{
//                 vertical: "top",
//                 horizontal: "right",
//               }}
//               open={Boolean(anchorEl)}
//               onClose={handleMenuClose}
//               PaperProps={{
//                 elevation: 2,
//                 sx: {
//                   mt: 1.5,
//                   borderRadius: 2,
//                   minWidth: 180,
//                   fontFamily: "'Inter', sans-serif",
//                 },
//               }}
//             >
//               <MenuItem onClick={handleMenuClose}>
//                 <ListItemIcon>
//                   <PersonIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText primary="Profile" />
//               </MenuItem>
//               <MenuItem onClick={handleMenuClose}>
//                 <ListItemIcon>
//                   <SettingsIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText primary="Settings" />
//               </MenuItem>
//               <Divider />
//               <MenuItem onClick={handleLogout}>
//                 <ListItemText primary="Logout" />
//               </MenuItem>
//             </Menu>
//           </Box>
//           {/* Notifications Menu */}
//           <Menu
//             anchorEl={notificationAnchorEl}
//             anchorOrigin={{
//               vertical: "bottom",
//               horizontal: "right",
//             }}
//             keepMounted
//             transformOrigin={{
//               vertical: "top",
//               horizontal: "right",
//             }}
//             open={Boolean(notificationAnchorEl)}
//             onClose={handleNotificationClose}
//             PaperProps={{
//               elevation: 2,
//               sx: {
//                 width: 320,
//                 maxHeight: 400,
//                 overflow: "auto",
//                 mt: 1.5,
//                 borderRadius: 2,
//               },
//             }}
//           >
//             <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//               <Typography
//                 variant="subtitle1"
//                 sx={{
//                   fontWeight: 600,
//                   fontFamily: "'Inter', sans-serif",
//                 }}
//               >
//                 Notifications
//               </Typography>
//               <Box
//                 sx={{
//                   height: 24,
//                   fontWeight: 600,
//                   backgroundColor: alpha("#6366F1", 0.1),
//                   color: "#6366F1",
//                   fontFamily: "'Inter', sans-serif",
//                   fontSize: "0.75rem",
//                   borderRadius: "12px",
//                   px: 1,
//                   display: "flex",
//                   alignItems: "center",
//                 }}
//               >
//                 4 new
//               </Box>
//             </Box>
//             <Divider />
//             <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
//               <Box>
//                 <Typography variant="body2" fontWeight={600} sx={{ fontFamily: "'Inter', sans-serif" }}>
//                   New purchase order received
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "'Inter', sans-serif" }}>
//                   PO-2023-006 from Tech Solutions Inc. - 10 minutes ago
//                 </Typography>
//               </Box>
//             </MenuItem>
//             <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
//               <Box>
//                 <Typography variant="body2" fontWeight={600} sx={{ fontFamily: "'Inter', sans-serif" }}>
//                   Purchase order approved
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "'Inter', sans-serif" }}>
//                   PO-2023-003 has been approved - 2 hours ago
//                 </Typography>
//               </Box>
//             </MenuItem>
//             <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
//               <Box>
//                 <Typography variant="body2" fontWeight={600} sx={{ fontFamily: "'Inter', sans-serif" }}>
//                   Low inventory alert
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "'Inter', sans-serif" }}>
//                   Office Chair Deluxe is running low - 5 hours ago
//                 </Typography>
//               </Box>
//             </MenuItem>
//             <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
//               <Box>
//                 <Typography variant="body2" fontWeight={600} sx={{ fontFamily: "'Inter', sans-serif" }}>
//                   Order delivered
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "'Inter', sans-serif" }}>
//                   PO-2023-001 has been delivered - Yesterday
//                 </Typography>
//               </Box>
//             </MenuItem>
//             <Divider />
//             <Box sx={{ p: 1.5, textAlign: "center" }}>
//               <Button
//                 variant="text"
//                 sx={{
//                   fontWeight: 600,
//                   color: "#6366F1",
//                   fontFamily: "'Inter', sans-serif",
//                   textTransform: "none",
//                 }}
//                 size="small"
//                 onClick={handleNotificationClose}
//               >
//                 View All Notifications
//               </Button>
//             </Box>
//           </Menu>
//         </Toolbar>
//       </AppBar>

//       {/* Side Drawer / Navigation */}
//       <Drawer
//         variant={isMobile ? "temporary" : "persistent"}
//         open={open}
//         onClose={isMobile ? handleDrawerToggle : undefined}
//         sx={{
//           width: drawerWidth,
//           flexShrink: 0,
//           "& .MuiDrawer-paper": {
//             width: drawerWidth,
//             boxSizing: "border-box",
//             backgroundColor: "#ffffff",
//             borderRight: "1px solid",
//             borderColor: "rgba(0,0,0,0.06)",
//             boxShadow: open && !isMobile ? "4px 0 4px -4px rgba(0,0,0,0.05)" : "none",
//           },
//         }}
//       >
//         <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }} />
//         <Box sx={{ overflow: "auto", mt: 2, px: 2 }}>
//           {/* User Profile Section */}
//           <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
//             <Avatar
//               sx={{
//                 width: 50,
//                 height: 50,
//                 backgroundColor: "#6366F1",
//                 boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
//               }}
//             >
//               <PersonIcon />
//             </Avatar>
//             <Box sx={{ ml: 2 }}>
//               <Typography
//                 variant="subtitle1"
//                 sx={{
//                   fontWeight: 600,
//                   lineHeight: 1.2,
//                   fontFamily: "'Inter', sans-serif",
//                 }}
//               >
//                 {user ? user.name : "Loading..."}
//               </Typography>
//               <Typography 
//                 variant="body2" 
//                 color="text.secondary" 
//                 sx={{ fontFamily: "'Inter', sans-serif" }}
//               >
//                 {user ? user.email : "Administrator"}
//               </Typography>
//             </Box>
//           </Box>
//           <Divider sx={{ mx: -2 }} />
//           {/* Navigation Items */}
//           <List sx={{ pt: 2, pb: 0 }} component="nav">
//             {navItems.map((item) => (
//               <ListItemButton
//                 key={item.text}
//                 onClick={() => navigate(item.path)}
//                 selected={isSelected(item.path)}
//                 sx={{
//                   borderRadius: 2,
//                   mb: 0.5,
//                   "&.Mui-selected": {
//                     backgroundColor: alpha("#6366F1", 0.1),
//                     "&:hover": {
//                       backgroundColor: alpha("#6366F1", 0.15),
//                     },
//                   },
//                   "&:hover": {
//                     backgroundColor: alpha("#6366F1", 0.05),
//                   },
//                 }}
//               >
//                 <ListItemIcon >
//                   {React.cloneElement(item.icon, { 
//                     sx: { color: isSelected(item.path) ? "#6366F1" : "inherit" } 
//                   })}
//                 </ListItemIcon>
//                 <ListItemText
//                   primary={item.text}
//                   primaryTypographyProps={{
//                     fontWeight: isSelected(item.path) ? 600 : 400,
//                     fontFamily: "'Inter', sans-serif",
//                     fontSize: "0.9rem",
//                   }}
//                 />
//               </ListItemButton>
//             ))}
//           </List>
//           <Divider sx={{ my: 2, mx: -2 }} />
//           <List sx={{ pt: 0, pb: 2 }} component="nav">
//             {secondaryNavItems.map((item) => (
//               <ListItemButton
//                 key={item.text}
//                 onClick={() => navigate(item.path)}
//                 selected={isSelected(item.path)}
//                 sx={{
//                   borderRadius: 2,
//                   mb: 0.5,
//                   "&.Mui-selected": {
//                     backgroundColor: alpha("#6366F1", 0.1),
//                     "&:hover": {
//                       backgroundColor: alpha("#6366F1", 0.15),
//                     },
//                   },
//                   "&:hover": {
//                     backgroundColor: alpha("#6366F1", 0.05),
//                   },
//                 }}
//               >
//                 <ListItemIcon>
//                   {React.cloneElement(item.icon, { 
//                     sx: { color: isSelected(item.path) ? "#6366F1" : "inherit" } 
//                   })}
//                 </ListItemIcon>
//                 <ListItemText
//                   primary={item.text}
//                   primaryTypographyProps={{
//                     fontWeight: isSelected(item.path) ? 600 : 400,
//                     fontFamily: "'Inter', sans-serif",
//                     fontSize: "0.9rem",
//                   }}
//                 />
//               </ListItemButton>
//             ))}
//           </List>
//         </Box>
//       </Drawer>

//       {/* Main Content */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           width: { xs: "100%", sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
//           transition: (theme) => theme.transitions.create(["width", "margin"], {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.leavingScreen,
//           }),
//           backgroundColor: "#f1f5f9",
//           p: 0,
//           overflow: "auto", // scrolling in the main content area
//         }}
//       >
//         <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }} />
//         {/* Main Content Wrapper - Render Child Components */}
//         <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: "100%" }}>
//           {children}
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Sidebar;














// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Drawer,
//   AppBar,
//   Toolbar,
//   List,
//   Typography,
//   Divider,
//   IconButton,
//   ListItemIcon,
//   ListItemText,
//   Avatar,
//   Menu,
//   MenuItem,
//   Badge,
//   Tooltip,
//   Button,
//   alpha,
//   ListItemButton,
// } from "@mui/material";
// import {
//   Menu as MenuIcon,
//   Dashboard as DashboardIcon,
//   AddShoppingCart as AddShoppingCartIcon,
//   People as PeopleIcon,
//   Inventory as InventoryIcon,
//   Store as StoreIcon,
//   Settings as SettingsIcon,
//   Person as PersonIcon,
//   Notifications as NotificationsIcon,
//   Receipt as ReceiptIcon,
//   ChevronLeft as ChevronLeftIcon,
// } from "@mui/icons-material";
// import { useNavigate, useLocation } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import axios from "axios";

// const Sidebar = ({ children }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [user, setUser] = useState(null);
//   const [open, setOpen] = useState(true);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 960);
//   const openedDrawerWidth = 300;
//   const closedDrawerWidth = 65; // Width when mini drawer is displayed

//   // Check if window is mobile size
//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 960;
//       setIsMobile(mobile);
//       if (mobile) {
//         setOpen(false);
//       } else {
//         setOpen(true);
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     handleResize(); // Call on initial render
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   // Fetch user data
//   useEffect(() => {
//     const fetchUserData = async () => {
//       const token = localStorage.getItem("authToken");

//       if (token) {
//         try {
//           // Decode the token to get user info
//           const decodedToken = jwtDecode(token);
//           setUser(decodedToken);

//           // Fetch user data from the backend
//           const response = await axios.get("${URL}/api/user", {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });

//           // Set the fetched user data to state
//           setUser(response.data);
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleDrawerToggle = () => {
//     setOpen(!open);
//   };

//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleNotificationOpen = (event) => {
//     setNotificationAnchorEl(event.currentTarget);
//   };

//   const handleNotificationClose = () => {
//     setNotificationAnchorEl(null);
//   };

//   const handleLogout = () => {
//     // Remove the JWT token from localStorage
//     localStorage.removeItem("authToken");

//     // Redirect to login page
//     navigate("/login");
//   };

//   // Check if the current path matches the nav item
//   const isSelected = (path) => {
//     return location.pathname === path;
//   };

//   // Navigation items
//   const navItems = [
//     { 
//       text: "Dashboard", 
//       icon: <DashboardIcon />, 
//       path: "/dashboard" 
//     },
//     { 
//       text: "Create Purchase order", 
//       icon: <AddShoppingCartIcon />, 
//       path: "/create-purchase-order" 
//     },
//     { 
//       text: "Purchase Orders", 
//       icon: <InventoryIcon />, 
//       path: "/purchase-orders" 
//     },
//     { 
//       text: "Organizations", 
//       icon: <StoreIcon />, 
//       path: "/organizations" 
//     },
//     { 
//       text: "Employees", 
//       icon: <PeopleIcon />, 
//       path: "/employees" 
//     },
//     { 
//       text: "Inventory Product", 
//       icon: <InventoryIcon />, 
//       path: "/inventory-product" 
//     },
//   ];

//   // Secondary navigation items
//   const secondaryNavItems = [
//     { 
//       text: "Reports", 
//       icon: <ReceiptIcon />, 
//       path: "/reports" 
//     },
//     { 
//       text: "Settings", 
//       icon: <SettingsIcon />, 
//       path: "/settings" 
//     },
//   ];

//   return (
//     <Box sx={{ display: "flex", backgroundColor: "#f1f5f9", minHeight: "100vh", overflow: "hidden" }}>
//       {/* App Bar */}
//       <AppBar
//         position="fixed"
//         elevation={0}
//         sx={{
//           zIndex: (theme) => theme.zIndex.drawer + 1,
//           backgroundColor: "#ffffff",
//           color: (theme) => theme.palette.text.primary,
//           borderBottom: "1px solid",
//           borderColor: "rgba(0,0,0,0.06)",
//           width: "100%",
//           transition: (theme) => theme.transitions.create(['margin', 'width'], {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.leavingScreen,
//           }),
//         }}
//       >
//         <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }}>
//           <IconButton 
//             color="inherit" 
//             aria-label="open drawer" 
//             edge="start" 
//             onClick={handleDrawerToggle} 
//             sx={{ mr: 2 }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             <Typography
//               variant="h5"
//               noWrap
//               component="div"
//               sx={{
//                 display: { xs: "none", sm: "block" },
//                 fontWeight: 800,
//                 color: "#6366F1",
//                 letterSpacing: "-0.5px",
//                 fontFamily: "'Poppins', sans-serif",
//               }}
//             >
//               SalesForce
//             </Typography>
//           </Box>
//           <Box sx={{ flexGrow: 1 }} />
//           {/* Notification Icon */}
//           <Tooltip title="Notifications">
//             <IconButton
//               color="inherit"
//               onClick={handleNotificationOpen}
//               sx={{
//                 backgroundColor: notificationAnchorEl ? alpha("#6366F1", 0.1) : "transparent",
//                 mr: 1,
//               }}
//             >
//               <Badge badgeContent={4} sx={{ "& .MuiBadge-badge": { backgroundColor: "#6366F1" } }}>
//                 <NotificationsIcon />
//               </Badge>
//             </IconButton>
//           </Tooltip>
//           {/* User Profile Menu */}
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             <IconButton
//               edge="end"
//               aria-label="account of current user"
//               aria-haspopup="true"
//               onClick={handleMenuOpen}
//               color="inherit"
//             >
//               <Avatar
//                 sx={{
//                   width: 38,
//                   height: 38,
//                   backgroundColor: "#6366F1",
//                 }}
//               >
//                 <PersonIcon />
//               </Avatar>
//             </IconButton>
//             <Menu
//               anchorEl={anchorEl}
//               anchorOrigin={{
//                 vertical: "bottom",
//                 horizontal: "right",
//               }}
//               keepMounted
//               transformOrigin={{
//                 vertical: "top",
//                 horizontal: "right",
//               }}
//               open={Boolean(anchorEl)}
//               onClose={handleMenuClose}
//               PaperProps={{
//                 elevation: 2,
//                 sx: {
//                   mt: 1.5,
//                   borderRadius: 2,
//                   minWidth: 180,
//                   fontFamily: "'Inter', sans-serif",
//                 },
//               }}
//             >
//               <MenuItem onClick={handleMenuClose}>
//                 <ListItemIcon>
//                   <PersonIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText primary="Profile" />
//               </MenuItem>
//               <MenuItem onClick={handleMenuClose}>
//                 <ListItemIcon>
//                   <SettingsIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText primary="Settings" />
//               </MenuItem>
//               <Divider />
//               <MenuItem onClick={handleLogout}>
//                 <ListItemText primary="Logout" />
//               </MenuItem>
//             </Menu>
//           </Box>
//           {/* Notifications Menu */}
//           <Menu
//             anchorEl={notificationAnchorEl}
//             anchorOrigin={{
//               vertical: "bottom",
//               horizontal: "right",
//             }}
//             keepMounted
//             transformOrigin={{
//               vertical: "top",
//               horizontal: "right",
//             }}
//             open={Boolean(notificationAnchorEl)}
//             onClose={handleNotificationClose}
//             PaperProps={{
//               elevation: 2,
//               sx: {
//                 width: 320,
//                 maxHeight: 400,
//                 overflow: "auto",
//                 mt: 1.5,
//                 borderRadius: 2,
//               },
//             }}
//           >
//             <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//               <Typography
//                 variant="subtitle1"
//                 sx={{
//                   fontWeight: 600,
//                   fontFamily: "'Inter', sans-serif",
//                 }}
//               >
//                 Notifications
//               </Typography>
//               <Box
//                 sx={{
//                   height: 24,
//                   fontWeight: 600,
//                   backgroundColor: alpha("#6366F1", 0.1),
//                   color: "#6366F1",
//                   fontFamily: "'Inter', sans-serif",
//                   fontSize: "0.75rem",
//                   borderRadius: "12px",
//                   px: 1,
//                   display: "flex",
//                   alignItems: "center",
//                 }}
//               >
//                 4 new
//               </Box>
//             </Box>
//             <Divider />
//             <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
//               <Box>
//                 <Typography variant="body2" fontWeight={600} sx={{ fontFamily: "'Inter', sans-serif" }}>
//                   New purchase order received
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "'Inter', sans-serif" }}>
//                   PO-2023-006 from Tech Solutions Inc. - 10 minutes ago
//                 </Typography>
//               </Box>
//             </MenuItem>
//             <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
//               <Box>
//                 <Typography variant="body2" fontWeight={600} sx={{ fontFamily: "'Inter', sans-serif" }}>
//                   Purchase order approved
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "'Inter', sans-serif" }}>
//                   PO-2023-003 has been approved - 2 hours ago
//                 </Typography>
//               </Box>
//             </MenuItem>
//             <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
//               <Box>
//                 <Typography variant="body2" fontWeight={600} sx={{ fontFamily: "'Inter', sans-serif" }}>
//                   Low inventory alert
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "'Inter', sans-serif" }}>
//                   Office Chair Deluxe is running low - 5 hours ago
//                 </Typography>
//               </Box>
//             </MenuItem>
//             <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
//               <Box>
//                 <Typography variant="body2" fontWeight={600} sx={{ fontFamily: "'Inter', sans-serif" }}>
//                   Order delivered
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "'Inter', sans-serif" }}>
//                   PO-2023-001 has been delivered - Yesterday
//                 </Typography>
//               </Box>
//             </MenuItem>
//             <Divider />
//             <Box sx={{ p: 1.5, textAlign: "center" }}>
//               <Button
//                 variant="text"
//                 sx={{
//                   fontWeight: 600,
//                   color: "#6366F1",
//                   fontFamily: "'Inter', sans-serif",
//                   textTransform: "none",
//                 }}
//                 size="small"
//                 onClick={handleNotificationClose}
//               >
//                 View All Notifications
//               </Button>
//             </Box>
//           </Menu>
//         </Toolbar>
//       </AppBar>

//       {/* Side Drawer / Navigation - Mini Variant */}
//       <Drawer
//         variant={isMobile ? "temporary" : "permanent"}
//         open={isMobile ? open : true}
//         onClose={isMobile ? handleDrawerToggle : undefined}
//         sx={{
//           width: isMobile ? openedDrawerWidth : (open ? openedDrawerWidth : closedDrawerWidth),
//           flexShrink: 0,
//           whiteSpace: 'nowrap',
//           boxSizing: 'border-box',
//           '& .MuiDrawer-paper': {
//             width: isMobile ? openedDrawerWidth : (open ? openedDrawerWidth : closedDrawerWidth),
//             overflowX: 'hidden',
//             backgroundColor: "#ffffff",
//             borderRight: "1px solid",
//             borderColor: "rgba(0,0,0,0.06)",
//             boxShadow: "4px 0 4px -4px rgba(0,0,0,0.05)",
//             transition: theme => theme.transitions.create('width', {
//               easing: theme.transitions.easing.sharp,
//               duration: theme.transitions.duration.enteringScreen,
//             }),
//           },
//         }}
//       >
//         <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }}>
//           {!isMobile && (
//             <IconButton onClick={handleDrawerToggle} sx={{ ml: 'auto' }}>
//               <ChevronLeftIcon />
//             </IconButton>
//           )}
//         </Toolbar>
//         <Divider />
//         <Box sx={{ overflow: "auto", mt: 2, px: open ? 2 : 1 }}>
//           {/* User Profile Section - Only show when drawer is open */}
//           {(open || isMobile) && (
//             <>
//               <Box sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: open ? "flex-start" : "center" }}>
//                 <Avatar
//                   sx={{
//                     width: 50,
//                     height: 50,
//                     backgroundColor: "#6366F1",
//                     boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
//                   }}
//                 >
//                   <PersonIcon />
//                 </Avatar>
//                 {open && (
//                   <Box sx={{ ml: 2 }}>
//                     <Typography
//                       variant="subtitle1"
//                       sx={{
//                         fontWeight: 600,
//                         lineHeight: 1.2,
//                         fontFamily: "'Inter', sans-serif",
//                       }}
//                     >
//                       {user ? user.name : "Loading..."}
//                     </Typography>
//                     <Typography 
//                       variant="body2" 
//                       color="text.secondary" 
//                       sx={{ fontFamily: "'Inter', sans-serif" }}
//                     >
//                       {user ? user.email : "Administrator"}
//                     </Typography>
//                   </Box>
//                 )}
//               </Box>
//               <Divider sx={{ mx: -2 }} />
//             </>
//           )}
          
//           {/* Navigation Items */}
//           <List sx={{ pt: 2, pb: 0 }} component="nav">
//             {navItems.map((item) => (
//               <ListItemButton
//                 key={item.text}
//                 onClick={() => navigate(item.path)}
//                 selected={isSelected(item.path)}
//                 sx={{
//                   borderRadius: 2,
//                   mb: 0.5,
//                   px: 2.5,
//                   justifyContent: open ? 'initial' : 'center',
//                   "&.Mui-selected": {
//                     backgroundColor: alpha("#6366F1", 0.1),
//                     "&:hover": {
//                       backgroundColor: alpha("#6366F1", 0.15),
//                     },
//                   },
//                   "&:hover": {
//                     backgroundColor: alpha("#6366F1", 0.05),
//                   },
//                 }}
//               >
//                 <ListItemIcon 
//                   sx={{ 
//                     minWidth: 0, 
//                     mr: open ? 3 : 'auto', 
//                     justifyContent: 'center',
//                     color: isSelected(item.path) ? "#6366F1" : "inherit" 
//                   }}
//                 >
//                   {item.icon}
//                 </ListItemIcon>
//                 {(open || isMobile) && (
//                   <ListItemText
//                     primary={item.text}
//                     primaryTypographyProps={{
//                       fontWeight: isSelected(item.path) ? 600 : 400,
//                       fontFamily: "'Inter', sans-serif",
//                       fontSize: "0.9rem",
//                       noWrap: true,
//                     }}
//                     sx={{ 
//                       opacity: open ? 1 : 0,
//                       display: open ? 'block' : 'none'
//                     }}
//                   />
//                 )}
//               </ListItemButton>
//             ))}
//           </List>
//           <Divider sx={{ my: 2, mx: -2 }} />
//           <List sx={{ pt: 0, pb: 2 }} component="nav">
//             {secondaryNavItems.map((item) => (
//               <ListItemButton
//                 key={item.text}
//                 onClick={() => navigate(item.path)}
//                 selected={isSelected(item.path)}
//                 sx={{
//                   borderRadius: 2,
//                   mb: 0.5,
//                   px: 2.5,
//                   justifyContent: open ? 'initial' : 'center',
//                   "&.Mui-selected": {
//                     backgroundColor: alpha("#6366F1", 0.1),
//                     "&:hover": {
//                       backgroundColor: alpha("#6366F1", 0.15),
//                     },
//                   },
//                   "&:hover": {
//                     backgroundColor: alpha("#6366F1", 0.05),
//                   },
//                 }}
//               >
//                 <ListItemIcon 
//                   sx={{ 
//                     minWidth: 0, 
//                     mr: open ? 3 : 'auto', 
//                     justifyContent: 'center',
//                     color: isSelected(item.path) ? "#6366F1" : "inherit"
//                   }}
//                 >
//                   {item.icon}
//                 </ListItemIcon>
//                 {(open || isMobile) && (
//                   <ListItemText
//                     primary={item.text}
//                     primaryTypographyProps={{
//                       fontWeight: isSelected(item.path) ? 600 : 400,
//                       fontFamily: "'Inter', sans-serif",
//                       fontSize: "0.9rem",
//                       noWrap: true,
//                     }}
//                     sx={{ 
//                       opacity: open ? 1 : 0,
//                       display: open ? 'block' : 'none'
//                     }}
//                   />
//                 )}
//               </ListItemButton>
//             ))}
//           </List>
//         </Box>
//       </Drawer>

//       {/* Main Content */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           padding: 0,
//           width: '100%',
//           transition: theme => theme.transitions.create(['margin', 'width'], {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.leavingScreen,
//           }),
//           marginLeft: isMobile ? 0 : (open ? `${openedDrawerWidth}px` : `${closedDrawerWidth}px`),
//           backgroundColor: "#f1f5f9",
//           overflow: "auto", // scrolling in the main content area
//         }}
//       >
//         <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }} />
//         {/* Main Content Wrapper - Render Child Components */}
//         <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: "100%" }}>
//           {children}
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Sidebar;



import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Button,
  alpha,
  ListItemButton,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AddShoppingCart as AddShoppingCartIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Store as StoreIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Receipt as ReceiptIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { URL } from "../../config";

const Sidebar = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 960);
  const openedDrawerWidth = 300;
  const closedDrawerWidth = 65; // Width when mini drawer is displayed

  // Check if window is mobile size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 960;
      setIsMobile(mobile);
      if (mobile) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call on initial render
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          // Decode the token to get user info
          const decodedToken = jwtDecode(token);
          setUser(decodedToken);

          // Fetch user data from the backend
          const response = await axios.get("${URL}/api/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Set the fetched user data to state
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    // Remove the JWT token from localStorage
    localStorage.removeItem("authToken");

    // Redirect to login page
    navigate("/login");
  };

  // Check if the current path matches the nav item
  const isSelected = (path) => {
    return location.pathname === path;
  };

  // Navigation items
  const navItems = [
    { 
      text: "Dashboard", 
      icon: <DashboardIcon />, 
      path: "/dashboard" 
    },
    { 
      text: "Create Purchase order", 
      icon: <AddShoppingCartIcon />, 
      path: "/create-purchase-order" 
    },
    { 
      text: "Purchase Orders", 
      icon: <InventoryIcon />, 
      path: "/purchase-orders" 
    },
    { 
      text: "Organizations", 
      icon: <StoreIcon />, 
      path: "/organizations" 
    },
    { 
      text: "Employees", 
      icon: <PeopleIcon />, 
      path: "/employees" 
    },
    { 
      text: "Inventory Product", 
      icon: <InventoryIcon />, 
      path: "/inventory-product" 
    },
  ];

  // Secondary navigation items
  const secondaryNavItems = [
    { 
      text: "Reports", 
      icon: <ReceiptIcon />, 
      path: "/reports" 
    },
    { 
      text: "Settings", 
      icon: <SettingsIcon />, 
      path: "/settings" 
    },
  ];

  return (
    <Box sx={{ display: "flex", backgroundColor: "#f1f5f9", minHeight: "100vh", overflow: "hidden" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#ffffff",
          color: (theme) => theme.palette.text.primary,
          borderBottom: "1px solid",
          borderColor: "rgba(0,0,0,0.06)",
          width: "100%",
          transition: (theme) => theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }}>
          <IconButton 
            color="inherit" 
            aria-label="open drawer" 
            edge="start" 
            onClick={handleDrawerToggle} 
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{
                display: { xs: "none", sm: "block" },
                fontWeight: 800,
                color: "#6366F1",
                letterSpacing: "-0.5px",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              SalesForce
              {/* ZForce */}
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {/* Notification Icon */}
          <Tooltip title="Notifications">
            <IconButton
              color="inherit"
              onClick={handleNotificationOpen}
              sx={{
                backgroundColor: notificationAnchorEl ? alpha("#6366F1", 0.1) : "transparent",
                mr: 1,
              }}
            >
              <Badge badgeContent={4} sx={{ "& .MuiBadge-badge": { backgroundColor: "#6366F1" } }}>
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          {/* User Profile Menu */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  backgroundColor: "#6366F1",
                }}
              >
                <PersonIcon />
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 2,
                sx: {
                  mt: 1.5,
                  borderRadius: 2,
                  minWidth: 180,
                  fontFamily: "'Inter', sans-serif",
                },
              }}
            >
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </MenuItem>
            </Menu>
          </Box>
          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationAnchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationClose}
            PaperProps={{
              elevation: 2,
              sx: {
                width: 320,
                maxHeight: 400,
                overflow: "auto",
                mt: 1.5,
                borderRadius: 2,
              },
            }}
          >
            <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Notifications
              </Typography>
              <Box
                sx={{
                  height: 24,
                  fontWeight: 600,
                  backgroundColor: alpha("#6366F1", 0.1),
                  color: "#6366F1",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.75rem",
                  borderRadius: "12px",
                  px: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                4 new
              </Box>
            </Box>
            <Divider />
            <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
              <Box>
                <Typography variant="body2" fontWeight={600} sx={{ fontFamily: "'Inter', sans-serif" }}>
                  New purchase order received
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "'Inter', sans-serif" }}>
                  PO-2023-006 from Tech Solutions Inc. - 10 minutes ago
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
              <Box>
                <Typography variant="body2" fontWeight={600} sx={{ fontFamily: "'Inter', sans-serif" }}>
                  Purchase order approved
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "'Inter', sans-serif" }}>
                  PO-2023-003 has been approved - 2 hours ago
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
              <Box>
                <Typography variant="body2" fontWeight={600} sx={{ fontFamily: "'Inter', sans-serif" }}>
                  Low inventory alert
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "'Inter', sans-serif" }}>
                  Office Chair Deluxe is running low - 5 hours ago
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
              <Box>
                <Typography variant="body2" fontWeight={600} sx={{ fontFamily: "'Inter', sans-serif" }}>
                  Order delivered
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "'Inter', sans-serif" }}>
                  PO-2023-001 has been delivered - Yesterday
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <Box sx={{ p: 1.5, textAlign: "center" }}>
              <Button
                variant="text"
                sx={{
                  fontWeight: 600,
                  color: "#6366F1",
                  fontFamily: "'Inter', sans-serif",
                  textTransform: "none",
                }}
                size="small"
                onClick={handleNotificationClose}
              >
                View All Notifications
              </Button>
            </Box>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Side Drawer / Navigation - Mini Variant */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? open : true}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: isMobile ? openedDrawerWidth : (open ? openedDrawerWidth : closedDrawerWidth),
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          '& .MuiDrawer-paper': {
            width: isMobile ? openedDrawerWidth : (open ? openedDrawerWidth : closedDrawerWidth),
            overflowX: 'hidden',
            backgroundColor: "#ffffff",
            borderRight: "1px solid",
            borderColor: "rgba(0,0,0,0.06)",
            boxShadow: "4px 0 4px -4px rgba(0,0,0,0.05)",
            transition: theme => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }}>
          {!isMobile && (
            <IconButton onClick={handleDrawerToggle} sx={{ ml: 'auto' }}>
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Toolbar>
        <Divider />
        <Box sx={{ overflow: "auto", mt: 2, px: open ? 2 : 1 }}>
          {/* User Profile Section - Only show when drawer is open */}
          {(open || isMobile) && (
            <>
              <Box sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: open ? "flex-start" : "center" }}>
                <Avatar
                  sx={{
                    width: 50,
                    height: 50,
                    backgroundColor: "#6366F1",
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                  }}
                >
                  <PersonIcon />
                </Avatar>
                {open && (
                  <Box sx={{ ml: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        lineHeight: 1.2,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {user ? user.name : "Loading..."}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {user ? user.email : "Administrator"}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Divider sx={{ mx: -2 }} />
            </>
          )}
          
          {/* Navigation Items */}
          <List sx={{ pt: 2, pb: 0 }} component="nav">
            {navItems.map((item) => (
              <ListItemButton
                key={item.text}
                onClick={() => navigate(item.path)}
                selected={isSelected(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  px: 2.5,
                  justifyContent: open ? 'initial' : 'center',
                  "&.Mui-selected": {
                    backgroundColor: alpha("#6366F1", 0.1),
                    "&:hover": {
                      backgroundColor: alpha("#6366F1", 0.15),
                    },
                  },
                  "&:hover": {
                    backgroundColor: alpha("#6366F1", 0.05),
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 0, 
                    mr: open ? 3 : 'auto', 
                    justifyContent: 'center',
                    color: isSelected(item.path) ? "#6366F1" : "inherit" 
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {(open || isMobile) && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isSelected(item.path) ? 600 : 400,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.9rem",
                      noWrap: true,
                    }}
                    sx={{ 
                      opacity: open ? 1 : 0,
                      display: open ? 'block' : 'none'
                    }}
                  />
                )}
              </ListItemButton>
            ))}
          </List>
          <Divider sx={{ my: 2, mx: -2 }} />
          <List sx={{ pt: 0, pb: 2 }} component="nav">
            {secondaryNavItems.map((item) => (
              <ListItemButton
                key={item.text}
                onClick={() => navigate(item.path)}
                selected={isSelected(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  px: 2.5,
                  justifyContent: open ? 'initial' : 'center',
                  "&.Mui-selected": {
                    backgroundColor: alpha("#6366F1", 0.1),
                    "&:hover": {
                      backgroundColor: alpha("#6366F1", 0.15),
                    },
                  },
                  "&:hover": {
                    backgroundColor: alpha("#6366F1", 0.05),
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 0, 
                    mr: open ? 3 : 'auto', 
                    justifyContent: 'center',
                    color: isSelected(item.path) ? "#6366F1" : "inherit"
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {(open || isMobile) && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isSelected(item.path) ? 600 : 400,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.9rem",
                      noWrap: true,
                    }}
                    sx={{ 
                      opacity: open ? 1 : 0,
                      display: open ? 'block' : 'none'
                    }}
                  />
                )}
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: 0,
          width: { xs: '100%', md: `calc(100% - ${isMobile ? 0 : (open ? openedDrawerWidth : closedDrawerWidth)}px)` },
          transition: theme => theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: 0, // Remove the extra margin since drawer already takes physical space
          backgroundColor: "#f1f5f9",
          overflow: "auto", // scrolling in the main content area
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }} />
        {/* Main Content Wrapper - Render Child Components */}
        <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 }, maxWidth: "100%" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
