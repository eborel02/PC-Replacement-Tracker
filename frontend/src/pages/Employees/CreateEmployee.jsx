// @ts-nocheck

import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
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

const CreateEmployee = () => {
    const navigate = useNavigate();
    const [employee, setEmployee] = useState({
        employeeName: '',
        email : null,
        currentComputer: '',
        status: '',
        newComputer: null,
        notes: '',
    });

    // Separate state for form data and errors to manage validation
    const [formData, setFormData] = useState({
        employeeName: '',
        email : null,
        currentComputer: '',
        status: '',
        newComputer: '',
        notes: '',
    });
    const [errors, setErrors] = useState({});

    const [computers, setComputers] = useState([]);

    // Fetch computers on component mount to populate the dropdown for "New Computer"
    useEffect(() => {
        const fetchComputers = async () => {
            try {
                const response = await fetch('https://pc-replacement-tracker.onrender.com/computers');
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch computers');
                }

                setComputers(data.computers);
            } catch (error) {
                console.error('Error fetching computers:', error);
            }
        };

        fetchComputers();
    }, []);

    // Handle input changes for all form fields
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));

        setEmployee((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    // Validate form fields before submission
    const validateForm = () => {
        const newErrors = {};

        if (!formData.employeeName.trim()) {
            newErrors.employeeName = 'Employee Name is required';
        }

        if (!formData.currentComputer.trim()) {
            newErrors.currentComputer = 'Current Computer is required';
        }

        if (!formData.status) {
            newErrors.status = 'Status is required';
        }

        if (formData.status === 'Replaced' && !formData.newComputer) {
            newErrors.newComputer = 'New Computer is required when status is Replaced';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // 
    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch('https://pc-replacement-tracker.onrender.com/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employee),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create employee');
            }

            console.log('Employee created:', data);

            navigate('/employees', { state: { successMessage: 'Employee created successfully!' } });
        } catch (error) {
            console.error('Error creating employee:', error);
        }
    };

    // Memoize the list of selectable computers to avoid unnecessary computations on re-renders
    const selectableComputers = useMemo(() => {
        if (!Array.isArray(computers)) return [];

        // Computers WITHOUT an assigned employee
        let list = computers.filter(comp => !comp.assignedTo);

        return list;
    }, [computers]);

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Create New Employee</Typography>
            <TextField
                fullWidth
                label="Employee Name"
                name="employeeName"
                value={employee.employeeName ?? ''}
                onChange={handleInputChange}
                error={Boolean(errors.employeeName)}
                helperText={errors.employeeName}
                margin="normal"
            />
            
            <TextField
                fullWidth
                label="Email"
                name="email"
                value={employee.email ?? ''}
                onChange={handleInputChange}
                margin="normal"
            />

            <TextField
                fullWidth
                label="Current Computer"
                name="currentComputer"
                value={employee.currentComputer ?? ''}
                onChange={handleInputChange}
                error={Boolean(errors.currentComputer)}
                helperText={errors.currentComputer}
                margin="normal"
            />

            <FormControl fullWidth error={Boolean(errors.status)} margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                    name="status"
                    value={employee.status}
                    onChange={handleInputChange}
                    label="Status"
                >
                    <MenuItem value="Awaiting Action">Awaiting Action</MenuItem>
                    <MenuItem value="Pulled Without Replacement">Pulled Without Replacement</MenuItem>
                    <MenuItem value="Replaced">Replaced</MenuItem>
                </Select>
                <FormHelperText>{errors.status}</FormHelperText>
            </FormControl>

            {employee.status === 'Replaced' && (
                <FormControl fullWidth error={Boolean(errors.newComputer)} margin="normal">
                    <InputLabel>New Computer</InputLabel>
                    <Select
                        name="newComputer"
                        value={employee.newComputer}
                        onChange={handleInputChange}
                        label="New Computer"
                    >
                        <MenuItem value="">-- Select Computer --</MenuItem>
                        {selectableComputers.map(computer => (
                            <MenuItem key={computer._id} value={computer._id}>
                                {computer.computerNumber}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>{errors.newComputer}</FormHelperText>
                </FormControl>
            )}

            <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={employee.notes ?? ''}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={4}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/employees')} sx={{ mt: 2 }}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>Create Employee</Button>
            </Box>
        </Box>
    );
};

export default CreateEmployee