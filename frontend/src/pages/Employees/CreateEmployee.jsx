import { useState } from 'react'
import { data, useNavigate } from 'react-router'
import { Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const CreateEmployee = () => {
    const navigate = useNavigate();
    const [employee, setEmployee] = useState({
        employeeName: '',
        email : '',
        currentComputer: '',
        status: '',
        newComputer: '',
        notes: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEmployee((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:4000/employees', {
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

            navigate('/employees');
        } catch (error) {
            console.error('Error creating employee:', error);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Create New Employee</Typography>
            <TextField
                fullWidth
                label="Employee Name"
                name="employeeName"
                value={employee.employeeName ?? ''}
                onChange={handleInputChange}
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
                margin="normal"
            />
            <FormControl fullWidth margin="normal">
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
            </FormControl>
            <TextField
                fullWidth
                label="New Computer"
                name="newComputer"
                value={employee.newComputer ?? ''}
                onChange={handleInputChange}
                margin="normal"
            />
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