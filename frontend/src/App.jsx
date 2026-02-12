import React from 'react';
import Navbar from './components/Navbar/Navbar';
import { Outlet } from 'react-router';
import { Box, Toolbar } from '@mui/material';

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