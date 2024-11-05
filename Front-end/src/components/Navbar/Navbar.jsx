import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../utils/UserService';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = UserService.isAuthenticated();

  const handleLogout = () => {
    const confirm = window.confirm('Are you sure you want to logout?');
    if (confirm) {
      UserService.logout();
      navigate('/login'); // Redirect to login page
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
          College Directory Application
        </Typography>
        {isAuthenticated && (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
