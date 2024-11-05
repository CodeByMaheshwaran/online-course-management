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
  Tabs,
  Tab,
} from '@mui/material';
import UserService from '../utils/UserService';
import StudentService from '../utils/StudentService';

const StudentProfile = () => {
  const [role, setRole] = useState('');
  const [profileInfo, setProfileInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [academicInfo, setAcademicInfo] = useState([]);
  const [facultyInfo, setFacultyInfo] = useState([]);
  const [tabValue, setTabValue] = useState(0); // State for tab value
  const BASE_URL = UserService.BASE_URL;

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const fetchProfileInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await UserService.getYourProfile(token);
      setProfileInfo(response.student);
      setRole(response.role);
      await fetchAcademicInfo(response.student.id, token);
      await fetchFacultyInfo(response.student.id, token); // Fetch faculty info
    } catch (error) {
      console.error('Error fetching profile information:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAcademicInfo = async (userId, token) => {
    try {
      const response = await StudentService.getCourseAndGradeWithAttendance(userId, token);
      setAcademicInfo(response); // Assuming response has a `courses` array
    } catch (error) {
      console.error('Error fetching academic information:', error);
    }
  };

  const fetchFacultyInfo = async (userId, token) => {
    try {
      const response = await StudentService.getFacultiesByStudentId(userId, token); // Adjust the API call as needed
      setFacultyInfo(response); // Assuming response has a faculty array
    } catch (error) {
      console.error('Error fetching faculty information:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
          <Box>
            <Typography variant="h4">{profileInfo.name}</Typography>
            <Typography variant="body1" color="textSecondary">
              @{profileInfo.username}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {role === 'ROLE_STUDENT' ? 'Student' : 'Faculty Member'} | {profileInfo?.department?.name} | {profileInfo.year}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box marginTop={2}>
          <Typography variant="h6">Contact Information</Typography>
          <Typography variant="body1">Email: {profileInfo.email}</Typography>
          <Typography variant="body1">Phone: {profileInfo.phone}</Typography>
          <Typography variant="body1">Department: {profileInfo?.department?.name}</Typography>
          <Typography variant="body1">Year: {profileInfo.year}</Typography>
        </Box>
        <Divider sx={{ marginY: 2 }} />

        {/* Tabs for Academic and Faculty Details */}
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="tabs">
          <Tab label="Academic Details" />
          <Tab label="Faculty Details" />
        </Tabs>

        {tabValue === 0 && ( // Academic Details Tab
          <Box marginTop={2}>
            <Typography variant="h6">Academic Details</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Course</TableCell>
                    <TableCell align="right">Grade</TableCell>
                    <TableCell align="right">Attendance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {academicInfo.map((course) => (
                    <TableRow key={course.courseTitle}>
                      <TableCell>{course.courseTitle}</TableCell>
                      <TableCell align="right">{course.grade}</TableCell>
                      <TableCell align="right">{course.attendance}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {tabValue === 1 && ( // Faculty Details Tab
          <Box marginTop={2}>
            <Typography variant="h6">Faculty Details</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Department</TableCell>
                    <TableCell align="right">Email</TableCell>
                    <TableCell align="right">Phone</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {facultyInfo.map((faculty) => (
                    <TableRow key={faculty.id}>
                      <TableCell>
                        <Avatar
                          alt={faculty.name}
                          src={`${BASE_URL}${faculty.photo?.url}`}
                          sx={{ width: 40, height: 40, marginRight: 1 }}
                        />
                        {faculty.name}
                      </TableCell>
                      <TableCell align="right">{faculty.department?.name}</TableCell>
                      <TableCell align="right">{faculty.email}</TableCell>
                      <TableCell align="right">{faculty.phone}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        <Divider sx={{ marginY: 2 }} />
        
      </Paper>
    </Box>
  );
};

export default StudentProfile;
