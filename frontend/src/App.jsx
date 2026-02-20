import React from 'react';
import Navbar from './components/Navbar/Navbar';
import { Outlet } from 'react-router';
import { Box, Toolbar } from '@mui/material';

// The App component serves as the main layout for the application, including the Navbar and a container for the main content. 
// The Outlet component is used to render the matched child route components based on the current URL path.
export default function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, pl: 3, pr: 10 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}