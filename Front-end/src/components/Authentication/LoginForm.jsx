import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../utils/UserService';
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Alert,
  CircularProgress,
} from '@mui/material';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // State for user role
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation with specific field messages
    if (!username) {
      setError('Username is required!');
      return;
    }
    if (!password) {
      setError('Password is required!');
      return;
    }
    if (!role) {
      setError('Role selection is required!');
      return;
    }

    setLoading(true); // Start loading
    setError(''); // Clear previous error

    try {
      const userData = await UserService.login(username, password, role);
      if (userData.token) {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('role', userData.role);
        if (role === 'ROLE_STUDENT') {
          navigate('/student-dashboard');
        } else if (role === 'ROLE_FACULTYMEMBER') {
          navigate('/faculty-dashboard');
        } else if (role === 'ROLE_ADMINISTRATOR') {
          navigate('/admin-dashboard');
        }
        
      } else {
        setError(userData.message);
      }
    } catch (error) {
      
      setError(error.message);
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f5f5"
      paddingX={2}
      width="100vw"
    >
      <Box
        sx={{
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: 'white',
          width: '100%', // Take full width up to maxWidth
          maxWidth: 400, // Set max width for the inner box
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!username && Boolean(error)}
            helperText={!username && error === 'Username is required!' ? error : ''}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!password && Boolean(error)}
            helperText={!password && error === 'Password is required!' ? error : ''}
          />
          <FormControl fullWidth margin="normal">
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              displayEmpty
              error={!role && Boolean(error)}
            >
              <MenuItem value="">
                --Select a role--
              </MenuItem>
              <MenuItem value="ROLE_ADMINISTRATOR">Administrator</MenuItem>
              <MenuItem value="ROLE_FACULTYMEMBER">Faculty Member</MenuItem>
              <MenuItem value="ROLE_STUDENT">Student</MenuItem>
            </Select>
            {!role && error === 'Role selection is required!' && (
              <Typography color="error" variant="caption">
                {error}
              </Typography>
            )}
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
            disabled={loading} // Disable button while loading
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default LoginForm;
