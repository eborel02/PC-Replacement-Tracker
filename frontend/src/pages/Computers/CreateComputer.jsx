import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useMemo } from 'react';
import { Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const CreateComputer = () => {
    const navigate = useNavigate();
    const [computer, setComputer] = useState({
        computerNumber: '',
        status: '',
        assignedTo: '',
        notes: ''
    });

    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('http://localhost:4000/employees');
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
    }), [];

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setComputer((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:4000/computers', {
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

            navigate('/computers');
        } catch (error) {
            console.error('Error creating computer:', error);
        }
    };

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
                margin="normal"
            />

            <FormControl fullWidth margin="normal">
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
            </FormControl>

            {computer.status === 'Assigned' && (
                <FormControl fullWidth margin="normal">
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