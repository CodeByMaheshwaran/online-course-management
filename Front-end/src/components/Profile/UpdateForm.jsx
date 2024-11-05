import React, { useState, useEffect } from 'react'; 
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import UserService from '../utils/UserService';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateForm = () => {
  const { userId } = useParams(); // Get userId from URL parameters
  const navigate = useNavigate();
  const BASE_URL = UserService.BASE_URL;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [officeHours, setOfficeHours] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await UserService.getUserById(userId, token);
        if (response) {
          const userData = response.users;
          
          setUsername(userData.username);
          setEmail(userData.email);
          setName(userData.name);
          setPhone(userData.phone);
          setRole(response.role);
          setDepartment(userData.department?.name);
          setYear(userData.year || '');
          setOfficeHours(userData.officeHours || '');

          if (userData?.photo?.url) {
            setPhotoUrl(`${BASE_URL}${userData.photo.url}`);
          }

          setInitialDataLoaded(true);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data.');
      }
    };

    fetchUserData();
  }, [userId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const userData = {
        username,
        email,
        name,
        phone,
        role,
        department,
        year: role === 'ROLE_STUDENT' ? year : null,
        officeHours: role === 'ROLE_FACULTYMEMBER' ? officeHours : null,
      };

      await UserService.updateUser(userId, userData, token);

      if (photo) {
        const formData = new FormData();
        formData.append('file', photo);
        formData.append('userId', userId);
        await UserService.uploadPhoto(formData,token);
      }

      alert('User updated successfully!');
      navigate('/user-management');

    } catch (error) {
      console.error('Error during update:', error);
      setError(error.message || 'Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/user-management');
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f5f5f5" padding={2} width="100vw">
      <Box
        sx={{
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: 'white',
          width: '100%',
          maxWidth: 500,
          position: 'relative',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Update User
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}

        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {initialDataLoaded && (
          <form onSubmit={handleSubmit}>
            {/* Photo Display */}
            <Box display="flex" alignItems="center" marginY={2}>
              <Typography variant="h6" flex={1}>
                Profile Picture
              </Typography>
              {photoUrl && (
                <img src={photoUrl} alt="Profile" style={{ width: 50, height: 50, borderRadius: '50%', marginLeft: 10 }} />
              )}
              <Typography variant="body2" flex={1} textAlign="center">
                {photo ? `Selected File: ${photo.name}` : 'No file selected'}
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="upload-photo"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="upload-photo">
                <Box
                  sx={{
                    border: '1px dashed #1976d2',
                    borderRadius: 2,
                    padding: 0.5,
                    textAlign: 'center',
                    width: '100%',
                    cursor: 'pointer',
                    transition: '0.3s',
                    flex: 1,
                  }}
                >
                  <Typography variant="body1" color="#1976d2">
                    Click to Upload Photo
                  </Typography>
                </Box>
              </label>
            </Box>

            {/* Other Fields */}
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal" required>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                displayEmpty
              >
                <MenuItem value="">
                  --Select a role--
                </MenuItem>
                <MenuItem value="ROLE_ADMINISTRATOR">Administrator</MenuItem>
                <MenuItem value="ROLE_FACULTYMEMBER">Faculty Member</MenuItem>
                <MenuItem value="ROLE_STUDENT">Student</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
              <Select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                displayEmpty
              >
                <MenuItem value="">
                  --Select a Department--
                </MenuItem>
                <MenuItem value="Computer Science">Computer Science</MenuItem>
                <MenuItem value="Mathematics">Mathematics</MenuItem>
                <MenuItem value="Physics">Physics</MenuItem>
                <MenuItem value="Chemistry">Chemistry</MenuItem>
              </Select>
            </FormControl>

            {role === 'ROLE_STUDENT' && (
              <FormControl fullWidth margin="normal" required>
                <Select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">
                    --Select Year--
                  </MenuItem>
                  <MenuItem value="Freshman">Freshman</MenuItem>
                  <MenuItem value="Sophomore">Sophomore</MenuItem>
                  <MenuItem value="Junior">Junior</MenuItem>
                  <MenuItem value="Senior">Senior</MenuItem>
                </Select>
              </FormControl>
            )}
            {role === 'ROLE_FACULTYMEMBER' && (
              <FormControl fullWidth margin="normal" required>
                <Select
                  value={officeHours}
                  onChange={(e) => setOfficeHours(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">
                    --Select Office Hours--
                  </MenuItem>
                  <MenuItem value="9:00 am to 2:00 pm">9:00 am to 2:00 pm</MenuItem>
                  <MenuItem value="2:00 pm to 7:00 pm">2:00 pm to 7:00 pm</MenuItem>
                </Select>
              </FormControl>
            )}
            <Box display="flex" justifyContent="space-between" marginTop={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginRight: 1 }}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
                fullWidth
                sx={{ marginLeft: 1 }}
              >
                Cancel
              </Button>
            </Box>
          </form>
        )}
      </Box>
    </Box>
  );
};

export default UpdateForm;
