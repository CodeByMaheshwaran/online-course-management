import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import UserService from '../utils/UserService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Box, CircularProgress, Typography } from '@mui/material'; // Import CircularProgress

// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EnrollmentTrendsChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const token = localStorage.getItem('token');
        const response = await UserService.getEnrollmentTrends(token);
        const data = response;

        // Prepare data for Chart.js
        const labels = data.map(item => item.courseName);
        const counts = data.map(item => item.count);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Number of Enrollments',
              data: counts,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching enrollment trends:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
        <Typography variant="h6" sx={{ marginLeft: 2 }}>
          Loading Enrollment Trends...
        </Typography>
      </Box>
    ); // Show loading indicator
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Enrollment Trends by Course',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Courses',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Enrollments',
        },
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default EnrollmentTrendsChart;
