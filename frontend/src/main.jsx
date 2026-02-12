import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Dashboard from "./pages/Dashboard/Dashboard";
import Employees from "./pages/Employees/Employees";
import EditEmployee from "./pages/Employees/EditEmployees";
import CreateEmployee from "./pages/Employees/CreateEmployee";
import Computers from "./pages/Computers/Computers";
import EditComputer from "./pages/Computers/EditComputer";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme/theme.jsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="employees/:id/edit" element={<EditEmployee />} />
          <Route path="employees/new" element={<CreateEmployee />} />
          <Route path="computers" element={<Computers />} />
          <Route path="computers/:id/edit" element={<EditComputer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ThemeProvider>,
);
