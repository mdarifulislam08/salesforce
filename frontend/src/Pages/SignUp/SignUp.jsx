import React, { useState } from 'react';
import axios from 'axios';
import { URL } from '../../config';
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
  useTheme,
  useMediaQuery,
  Fade
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Visibility,
  VisibilityOff,
  Mail,
  LockOutlined,
  Person
} from '@mui/icons-material';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Send POST request to backend with user sign-up data
      const response = await axios.post(`${URL}/api/signup`, {
        name: username,
        email,
        password,
      });

      console.log(response.data);
      setIsLoading(false);
      navigate('/login');
    } catch (error) {
      console.error('Sign-up error:', error.response ? error.response.data : error.message);
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
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              p: 3,
              textAlign: 'center',
            }}
          > 
            <Box sx={{ display: 'inline-block', position: 'relative' }}>
              <Typography 
                variant="h4" 
                component="h1" 
                fontWeight="500"
                sx={{ mb: 1 }}
              >
                Sign Up
              </Typography>
              <Box 
                sx={{
                  position: 'relative',
                  height: '6px',
                  width: '80%',
                  backgroundColor: theme.palette.primary.main,
                  mx: 'auto',
                  borderRadius: '2px',
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
                label="Username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
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
                label="Email Address"
                autoComplete="email"
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
                type={showPassword ? 'text' : 'password'}
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
                sx={{ mb: 2 }}
              />
              
              <Box sx={{ mt: 1, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  By signing up, you agree to our{' '}
                  <Link href="#" underline="hover" color="primary.main">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" underline="hover" color="primary.main">
                    Privacy Policy
                  </Link>
                </Typography>
              </Box>
              
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
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem'
                }}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
            
            {/* Sign In Link */}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body1">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Log In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default SignUp;
