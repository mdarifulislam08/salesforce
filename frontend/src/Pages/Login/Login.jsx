import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Link,
  Container,
  Box,
  CssBaseline,
  Paper,
  InputAdornment,
  IconButton,
  //   Divider,
  useTheme,
  useMediaQuery,
  Fade,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Visibility,
  VisibilityOff,
  Mail,
  LockOutlined,
  //   Google,
  //   GitHub,
  //   Apple
} from "@mui/icons-material";
import axios from "axios";
import { URL } from "../../config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send login request to backend
      const response = await axios.post(`${URL}/api/login`, {
        email,
        password,
      });

      console.log(response.data);
      // Store the JWT token in localStorage
      localStorage.setItem("authToken", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Login error:",
        error.response ? error.response.data : error.message
      );
      setErrorMessage(
        error.response?.data?.message || "Invalid email or password"
      );
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Fade in timeout={800}>
        <Paper
          elevation={3}
          sx={{
            mt: isMobile ? 4 : 8,
            borderRadius: 2,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              p: 3,
              textAlign: "center",
            }}
          >
            <Box sx={{ display: "inline-block", position: "relative" }}>
              <Typography
                variant="h4"
                component="h1"
                fontWeight="500"
                sx={{ mb: 1 }}
              >
                Log In
              </Typography>
              <Box
                sx={{
                  position: "relative",
                  height: "6px",
                  width: "80%",
                  backgroundColor: theme.palette.primary.main,
                  mx: "auto",
                  borderRadius: "2px",
                }}
              />
            </Box>
          </Box>

          {/* Form Section */}
          <Box sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Email Address"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 1 }}
              />

              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <Link
                  href="#"
                  variant="body2"
                  underline="hover"
                  color="primary.main"
                >
                  Forgot password?
                </Link>
              </Box>

              {errorMessage && (
                <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
                  {errorMessage}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={isLoading}
                sx={{
                  mt: 2,
                  mb: 3,
                  py: 1.5,
                  borderRadius: 1.5,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              {/* <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider> */}
            </form>

            {/* Sign Up Link */}
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body1">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: "primary.main",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default Login;
