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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import UserService from '../utils/UserService';
import FacultyService from '../utils/FacultyService';

const FacultyProfile = () => {
  const [role, setRole] = useState('');
  const [profileInfo, setProfileInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(true); // New loading state for students
  const [studentsInfo, setStudentsInfo] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    email: '',
    phone: '',
    officeHours: '',
  });
  const BASE_URL = UserService.BASE_URL;

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const fetchProfileInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await UserService.getYourProfile(token);
      setProfileInfo(response.faculty);
      setRole(response.role);
      setFormValues({
        email: response.faculty.email,
        phone: response.faculty.phone,
        officeHours: response.faculty.officeHours,
      });
      fetchStudentInfo(response.faculty.id, token);
    } catch (error) {
      console.error('Error fetching profile information:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentInfo = async (facultyId, token) => {
    setStudentsLoading(true); // Start loading
    try {
      const response = await FacultyService.getCourseAndStudents(facultyId, token);
      setStudentsInfo(response.students || []);
    } catch (error) {
      console.error('Error fetching student information:', error);
    } finally {
      setStudentsLoading(false); // Stop loading
    }
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userId = profileInfo.id; // Assuming profileInfo has the user ID
    try {
      // Include the role when updating the user profile
      await UserService.updateUser(userId, { ...formValues, role }, token);
      setProfileInfo({ ...profileInfo, ...formValues });
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
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
          <Box display="flex" alignItems="center">
            <Avatar alt={profileInfo.name} src={`${BASE_URL}${profileInfo?.photo?.url}`} sx={{ width: 100, height: 100, marginRight: 2 }} />
            <Box>
              <Typography variant="h4">{profileInfo.name}</Typography>
              <Typography variant="body1" color="textSecondary">@{profileInfo.username}</Typography>
              <Typography variant="body2" color="textSecondary">{role === 'ROLE_STUDENT' ? 'Student' : 'Faculty Member'} | {profileInfo?.department?.name}</Typography>
            </Box>
          </Box>
          {!editing && (
            <Button variant="outlined" color="primary" onClick={handleEditClick}>
              Edit Profile
            </Button>
          )}
        </Box>

        <Divider />

        {editing ? (
          <Box component="form" onSubmit={handleSubmit} marginTop={2}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Phone"
              name="phone"
              value={formValues.phone}
              onChange={handleChange}
              variant="outlined"
            />
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Office Hours</InputLabel>
              <Select
                name="officeHours"
                value={formValues.officeHours}
                onChange={handleChange}
                label="Office Hours"
              >
                <MenuItem value="9:00 am to 2:00 pm">9:00 am to 2:00 pm</MenuItem>
                <MenuItem value="2:00 pm to 7:00 pm">2:00 pm to 7:00 pm</MenuItem>
                {/* Add more options as needed*/}
              </Select>
            </FormControl>
            <Box display="flex" justifyContent="flex-end" marginTop={2}>
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => setEditing(false)} sx={{ marginLeft: 2 }}>
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Box marginTop={2}>
            <Typography variant="h6">Contact Information</Typography>
            <Typography variant="body1">Email: {profileInfo.email}</Typography>
            <Typography variant="body1">Phone: {profileInfo.phone}</Typography>
            <Typography variant="body1">Department: {profileInfo?.department?.name}</Typography>
            <Typography variant="body1">Office Hours: {profileInfo.officeHours}</Typography>
          </Box>
        )}

        <Divider sx={{ marginY: 2 }} />

        <Typography variant="h5">Enrolled Students</Typography>

        {studentsLoading ? ( // Show loading spinner for students
          <Box display="flex" justifyContent="center" alignItems="center" marginTop={2}>
            <CircularProgress />
          </Box>
        ) : studentsInfo.length > 0 ? (
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Photo</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentsInfo.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Avatar alt={student.name} src={`${BASE_URL}${student.photo?.url}`} />
                    </TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.department?.name}</TableCell>
                    <TableCell>{student.year}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No students found.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default FacultyProfile;
