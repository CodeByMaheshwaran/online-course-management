import React, { useState, useEffect } from 'react'; 
import {
  Box,
  Typography,
  Avatar,
  Button,
  Paper,
  Divider,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserService from '../utils/UserService';

const UserManagement = () => {
  const BASE_URL = UserService.BASE_URL;
  const [usersInfo, setUsersInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsersInfo();
  }, []);

  const fetchUsersInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await UserService.getAllUsers(token);
      
      const usersWithRoles = response.usersList.map(user => {
        const roles = user.authorities.map(auth => {
          switch (auth.authority) {
            case 'ROLE_STUDENT':
              return 'Student';
            case 'ROLE_FACULTYMEMBER':
              return 'Faculty';
            case 'ROLE_ADMINISTRATOR':
              return 'Administrator';
            default:
              return auth.authority;
          }
        }).join(', ');

        return {
          ...user,
          role: roles,
        };
      });
      
      setUsersInfo(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users information:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    // Navigate to the update page with user ID
    navigate(`/update/${user.id}`);
  };

  const handleDeleteClick = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      await UserService.deleteUser(userId, token);
      fetchUsersInfo(); // Refresh user list
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleGoToProfile = () => {
    navigate('/admin-dashboard');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f5f5f5">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="flex-start" height="100vh" bgcolor="#f5f5f5" padding={2} width="100vw">
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, maxWidth: 800, width: '100%' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
          <Typography variant="h4">User Management</Typography>
          <Box display="flex" gap={2}>
            <Button variant="contained" color="primary" onClick={handleGoToProfile}>
              Go to Profile
            </Button>
            <Button variant="contained" color="primary" onClick={() => navigate('/register')}>
              Add User
            </Button>
          </Box>
        </Box>

        <Divider />

        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Photo</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usersInfo.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar alt={user.name} src={`${BASE_URL}${user?.photo?.url}`} />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button 
                      variant="contained"
                      onClick={() => handleEditClick(user)} 
                      sx={{ bgcolor: 'primary.main', color: 'white', width: '100px', height: '40px', marginBottom: 1, '&:hover': { bgcolor: 'primary.dark' } }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outlined" 
                      onClick={() => handleDeleteClick(user.id)} 
                      sx={{ bgcolor: '#b22222', color: 'white', width: '100px', height: '40px', '&:hover': { bgcolor: '#dc143c' } }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default UserManagement;
