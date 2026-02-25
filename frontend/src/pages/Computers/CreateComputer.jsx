// @ts-nocheck

import { useState, useEffect } from "react";
import { Form, useNavigate } from "react-router";
import { useMemo } from 'react';
import { Box,
  Button,
  TextField,
  Typography,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL;

const CreateComputer = () => {
    const navigate = useNavigate();
    const [computer, setComputer] = useState({
        computerNumber: '',
        status: '',
        assignedTo: null,
        notes: ''
    });

    // Form state and validation
    const [formData, setFormData] = useState({
        computerNumber: '',
        status: '',
        assignedTo: '',
        notes: ''
    });
    // Separate state for form errors
    const [errors, setErrors] = useState({});

    // Fetch employees for the "Assigned To" dropdown
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch(`${API_URL}/employees`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch employees');
                }

                setEmployees(data.employees);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, []);

    // Handle input changes for both form data and computer state
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));

        setComputer((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Form validation logic
    const validateForm =() => {
        const newErrors = {};

        if (!formData.computerNumber.trim()) {
            newErrors.computerNumber = 'Computer Number is required';
        }

        if (!formData.status) {
            newErrors.status = 'Status is required';
        }

        if (formData.status === 'Assigned' && !formData.assignedTo) {
            newErrors.assignedTo = 'Assigned To is required when status is Assigned';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/computers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(computer),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create computer');
            }

            console.log('Computer created:', data);

            navigate('/computers', { state: { successMessage: 'Computer created successfully!' } });
        } catch (error) {
            console.error('Error creating computer:', error);
        }
    };

    // Filter employees to only include those without an assigned computer
    const selectableEmployees = useMemo(() => {
        if (!Array.isArray(employees)) return [];

        // Employees WITHOUT a computer
        let list = employees.filter(emp => !emp.newComputer);

        return list;
    }, [employees]);

    return (
        <Box sx={{maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Create New Computer</Typography>
            <TextField
                fullWidth
                label="Computer Number"
                name="computerNumber"
                value={computer.computerNumber ?? ''}
                onChange={handleInputChange}
                error={Boolean(errors.computerNumber)}
                helperText={errors.computerNumber}
                margin="normal"
            />

            <FormControl fullWidth error={Boolean(errors.status)} margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                    name="status"
                    value={computer.status}
                    onChange={handleInputChange}
                    label="Status"
                >
                    <MenuItem value="Available">Available</MenuItem>
                    <MenuItem value="Assigned">Assigned</MenuItem>
                    <MenuItem value="Maintenance">Maintenance</MenuItem>
                </Select>
                <FormHelperText>{errors.status}</FormHelperText>
            </FormControl>

            {computer.status === 'Assigned' && (
                <FormControl fullWidth error={Boolean(errors.assignedTo)} margin="normal">
                    <InputLabel>Assigned To</InputLabel>
                    <Select
                        name="assignedTo"
                        value={computer.assignedTo}
                        onChange={handleInputChange}
                        label="Assigned To"
                    >
                        <MenuItem value="">-- Select Employee --</MenuItem>
                        {selectableEmployees.map(employee => (
                            <MenuItem key={employee._id} value={employee._id}>
                                {employee.employeeName}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>{errors.assignedTo}</FormHelperText>
                </FormControl>
            )}

            <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={computer.notes ?? ''}
                onChange={handleInputChange}
                margin="normal"
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/computers')} sx={{ mt: 2 }}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>Create Computer</Button>
            </Box>
        </Box>
    );
};

export default CreateComputer;