import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Dashboard from "./pages/Dashboard/Dashboard";
import Employees from "./pages/Employees/Employees";
import EditEmployee from "./pages/Employees/EditEmployees";
import CreateEmployee from "./pages/Employees/CreateEmployee";
import Computers from "./pages/Computers/Computers";
import EditComputer from "./pages/Computers/EditComputer";
import CreateComputer from "./pages/Computers/CreateComputer";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme/theme.jsx";

// The main entry point of the React application. 
// It sets up the routing for the application using React Router and applies a custom Material-UI theme. 
// The App component serves as the layout for the application, and different pages are rendered based on the URL path.
const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/" element={<App />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="employees/:id/edit" element={<EditEmployee />} />
          <Route path="employees/new" element={<CreateEmployee />} />
          <Route path="computers" element={<Computers />} />
          <Route path="computers/:id/edit" element={<EditComputer />} />
          <Route path="computers/new" element={<CreateComputer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ThemeProvider>,
);
