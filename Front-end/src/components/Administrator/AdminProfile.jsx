import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Paper,
  Divider,
  CircularProgress,
} from '@mui/material';
import UserService from '../utils/UserService';
import { useNavigate } from 'react-router-dom';
import EnrollmentTrendsChart from './EnrollmentTrendsChart'; // Import your chart component

const AdminProfile = () => {
  const navigate = useNavigate();
  const [profileInfo, setProfileInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const BASE_URL = UserService.BASE_URL;

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const fetchProfileInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await UserService.getYourProfile(token);
      setProfileInfo(response.administrator);
    } catch (error) {
      console.error('Error fetching profile information:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    navigate(`/update/${profileInfo.id}`); // Pass the user ID to the edit page
  };

  const handleUserManagement = () => {
    navigate('/user-management');
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor="#f5f5f5"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      height="100vh"
      bgcolor="#f5f5f5"
      padding={2}
      width="100vw"
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 2,
          maxWidth: 600,
          width: '100%',
        }}
      >
        <Box display="flex" alignItems="center" marginBottom={2}>
          <Avatar
            alt={profileInfo.name}
            src={`${BASE_URL}${profileInfo?.photo?.url}`}
            sx={{ width: 100, height: 100, marginRight: 2 }}
          />
          <Box flexGrow={1}>
            <Typography variant="h4">{profileInfo.name}</Typography>
            <Typography variant="body1" color="textSecondary">
              @{profileInfo.username}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Administrator | {profileInfo?.department?.name}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleEditClick}
            sx={{ marginLeft: 2 }}
          >
            Edit
          </Button>
        </Box>
        <Divider />
        <Box marginTop={2}>
          <Typography variant="h6">Contact Information</Typography>
          <Typography variant="body1">Email: {profileInfo.email}</Typography>
          <Typography variant="body1">Phone: {profileInfo.phone}</Typography>
          <Typography variant="body1">Department: {profileInfo?.department?.name}</Typography>
        </Box>
        <Divider sx={{ marginY: 2 }} />

        <Button
          variant="contained"
          color="primary"
          onClick={handleUserManagement}
          fullWidth
        >
          User Management
        </Button>

        {/* Include the Enrollment Trends Chart here */}
        <Box marginTop={4}>
          <Typography variant="h5" gutterBottom>
            Enrollment Trends
          </Typography>
          <EnrollmentTrendsChart />
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminProfile;
