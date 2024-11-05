import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from './components/Authentication/LoginForm';
import RegistrationPage from './components/Authentication/RegistrationPage';
import StudentProfile from './components/Profile/StudentProfile';
import FacultyProfile from './components/Profile/FacultyProfile';
import UpdateForm from './components/Profile/UpdateForm';
import Navbar from './components/Navbar/Navbar';
import AdminProfile from './components/Administrator/AdminProfile';
import UserManagement from './components/Profile/UserManagement';
import EnrollmentTrendsChart from './components/Administrator/EnrollmentTrendsChart';
import ProtectedRoute from './components/Route/ProtectedRoute';// Adjust the path as necessary
import Forbidden from './components/Error/Forbidden'; // Adjust the path as necessary

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<LoginForm />} />
        <Route exact path="/login" element={<LoginForm />} />
        

        {/* Protected Routes */}
        <Route 
          path="/register" 
          element={<ProtectedRoute element={<RegistrationPage/>} allowedRoles={['ROLE_ADMINISTRATOR']} />} 
        />
        <Route 
          path="/student-dashboard" 
          element={<ProtectedRoute element={<StudentProfile />} allowedRoles={['ROLE_STUDENT']} />} 
        />
        <Route 
          path="/faculty-dashboard" 
          element={<ProtectedRoute element={<FacultyProfile />} allowedRoles={['ROLE_FACULTYMEMBER']} />} 
        />
        <Route 
          path="/admin-dashboard" 
          element={<ProtectedRoute element={<AdminProfile />} allowedRoles={['ROLE_ADMINISTRATOR']} />} 
        />
        <Route 
          path="/update/:userId" 
          element={<ProtectedRoute element={<UpdateForm />} allowedRoles={['ROLE_ADMINISTRATOR']} />} 
        />
        <Route 
          path="/user-management" 
          element={<ProtectedRoute element={<UserManagement />} allowedRoles={['ROLE_ADMINISTRATOR']} />} 
        />
        <Route 
          path="/enrollment-trends" 
          element={<ProtectedRoute element={<EnrollmentTrendsChart />} allowedRoles={['ROLE_ADMINISTRATOR']} />} 
        />
        <Route path="/forbidden" element={<Forbidden />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
