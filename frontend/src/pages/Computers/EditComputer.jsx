// @ts-nocheck

import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    FormHelperText,
    Button,
    Typography,
} from '@mui/material';

const EditComputer = () => {
    // State for computer details, employees list, form errors, and original assigned employee
    const { id } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [originalAssignedTo, setOriginalAssignedTo] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [computer, setComputer] = useState({
        computerNumber: '',
        status: 'Available',
        assignedTo: '',
        notes: '',
    });

    // Separate form data state to manage validation errors without affecting the main computer state
    const [formData, setFormData] = useState({
        computerNumber: '',
        status: '',
        assignedTo: '',
        notes: '',
    });
    const [errors, setErrors] = useState({});

    // Fetch computer details and employees on component mount
    useEffect(() => {
        const fetchComputerAndEmployees = async () => {
            try {
                const responseComp = await fetch(`https://pc-replacement-tracker.onrender.com/computers/${id}`);
                const dataComp = await responseComp.json();
                const assignedEmployee = dataComp.computer.assignedTo;

                setOriginalAssignedTo(assignedEmployee?._id || null);
                setComputer({
                    computerNumber: dataComp.computer.computerNumber,
                    status: dataComp.computer.status,
                    assignedTo: assignedEmployee?._id || '',
                    notes: dataComp.computer.notes || '',
                });

                const responseEmp = await fetch('https://pc-replacement-tracker.onrender.com/employees');
                const dataEmp = await responseEmp.json();

                // Add currently assigned employee if missing
                let empList = dataEmp.employees;
                if (assignedEmployee && !empList.find(e => e._id === assignedEmployee._id)) {
                    empList = [...empList, assignedEmployee];
                }

                setEmployees(empList);
            } catch (error) {
                console.error('Error fetching computer or employees:', error);
            }
        };

        fetchComputerAndEmployees();
    }, [id]);

    // Memoized list of selectable employees based on current computer status and original assignment
    const selectableEmployees = useMemo(() => {
        if (!Array.isArray(employees)) return [];

        // Employees WITHOUT a computer
        let list = employees.filter(emp => !emp.newComputer);

        // Allow currently assigned employee to be selectable
        if (originalAssignedTo) {
            const assigned = employees.find(
                emp => emp._id === originalAssignedTo
            );

            if (assigned && !list.some(emp => emp._id === assigned._id)) {
                list = [...list, assigned];
            }
        }

        return list;
    }, [employees, originalAssignedTo]);

    // Handle form field changes and update both formData and computer state
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: value,  
        }));

        setComputer(prev => ({ 
            ...prev, 
            [name]: value,
            ...(name === 'status' && value !== 'Assigned') ? { assignedTo: '' } : {}    
        }));
    };

    // Validate form fields before submission
    const validateForm =() => {
        const newErrors = {};

        if (!computer.computerNumber.trim()) {
            newErrors.computerNumber = 'Computer Number is required';
        }

        if (!computer.status) {
            newErrors.status = 'Status is required';
        }

        if (computer.status === 'Assigned' && !computer.assignedTo) {
            newErrors.assignedTo = 'Assigned To is required when status is Assigned';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission to update computer details
    const handleSave = async (e) => {
        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(`https://pc-replacement-tracker.onrender.com/computers/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(computer),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update computer');
            }
            navigate('/computers', { state: { successMessage: 'Computer updated successfully!' } });
        } catch (error) {
            console.error('Error updating computer:', error);
            setError('Failed to update computer.');
        }
    };


    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" mb={2}>Edit Computer {computer.computerNumber}</Typography>
            {error && (
                <Typography color="error" sx={{ mt: 1 }}>
                    {error}
                </Typography>
            )}

            <form onSubmit={handleSave}>
                <TextField
                    label="Computer Number"
                    name="computerNumber"
                    value={computer.computerNumber}
                    onChange={handleChange}
                    error={Boolean(errors.computerNumber)}
                    helperText={errors.computerNumber}
                    fullWidth
                    margin="normal"
                    required
                />

                <FormControl fullWidth error={Boolean(errors.status)} margin="normal">
                    <InputLabel>Status</InputLabel>
                    <Select
                        name="status"
                        value={computer.status}
                        onChange={handleChange}
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
                            onChange={handleChange}
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
                    label="Notes"
                    name="notes"
                    value={computer.notes}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button variant="outlined" onClick={() => navigate('/computers')} sx={{ mt: 2 }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>Save Changes</Button>
                </Box>
            </form>
        </Box>
    );
};

export default EditComputer;