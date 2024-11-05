import React, { useState } from 'react'; 
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
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const RegistrationForm = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [photo, setPhoto] = useState(null);
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [officeHours, setOfficeHours] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setLoading(true); // Start loading

    // Validate required fields
    if (!username) {
      setError('Username is required.');
      setLoading(false);
      return;
    }
    if (!name) {
      setError('Name is required.');
      setLoading(false);
      return;
    }
    if (!email) {
      setError('Email is required.');
      setLoading(false);
      return;
    }
    if (!password) {
      setError('Password is required.');
      setLoading(false);
      return;
    }
    if (!phone) {
      setError('Phone is required.');
      setLoading(false);
      return;
    }
    if (!role) {
      setError('Role is required.');
      setLoading(false);
      return;
    }
    if (!department) {
      setError('Department is required.');
      setLoading(false);
      return;
    }
    if (role === 'ROLE_STUDENT' && !year) {
      setError('Year is required for students.');
      setLoading(false);
      return;
    }
    if (role === 'ROLE_FACULTYMEMBER' && !officeHours) {
      setError('Office hours are required for faculty members.');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        username,
        email,
        password,
        name,
        phone,
        role,
        department,
        year: role === 'ROLE_STUDENT' ? year : null,
        officeHours: role === 'ROLE_FACULTYMEMBER' ? officeHours : null,
      };

      // Step 1: Register the user
      const token = localStorage.getItem('token');
      const response = await UserService.register(userData, token);

      if (response) {
        const registeredUserId = response.users.id; // Access user ID directly from response
        setUserId(registeredUserId);
        console.log(registeredUserId); // Log the user ID directly

        // Step 2: Prepare FormData for the photo upload
        if (photo) {
          const formData = new FormData();
          formData.append('file', photo);
          formData.append('userId', registeredUserId); // Use the user ID obtained from the response

          // Step 3: Upload the photo
          await UserService.uploadPhoto(formData, token);
        }

        // Optionally, handle successful registration/upload
        alert('Registration successful!');

        // Clear form fields
        setUsername('');
        setEmail('');
        setPassword('');
        setName('');
        setPhone('');
        setRole('');
        setPhoto(null);
        setDepartment('');
        setYear('');
        setOfficeHours('');
      } else {
        throw new Error('Error received from registration process.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleCancel = () => {
    // Navigate to the desired route on cancel
    navigate('/admin-dashboard'); // Change this to your desired route
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f5f5"
      padding={2}
      width="100vw"
    >
      <Box
        sx={{
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: 'white',
          width: '100%',
          maxWidth: 500,
          position: 'relative', // Position for overlay
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Registration
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
              bgcolor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1, // Ensure it's above other elements
            }}
          >
            <CircularProgress />
          </Box>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Photo Upload Field */}
          <Box display="flex" alignItems="center" marginY={2}>
            <Typography variant="h6" flex={1}>
              Profile Picture
            </Typography>
            <Typography variant="body2" flex={1} textAlign="center">
              {photo ? `Selected File: ${photo.name}` : 'No file selected'}
            </Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-photo"
              type="file"
              onChange={handleFileChange}
              required
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
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
              disabled={loading} // Disable button while loading
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              fullWidth
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default RegistrationForm;
