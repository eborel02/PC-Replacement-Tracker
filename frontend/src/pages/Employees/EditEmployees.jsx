import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import PropTypes from 'prop-types';

const EditEmployees = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await fetch(`http://localhost:4000/employees/${id}`);
                const data = await response.json();
                setEmployee(data.employee);
            } catch (error) {
                console.error("Error fetching employee:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchEmployee();
    }, [id]);

    if (loading) {
        return <Typography variant="h6">Loading...</Typography>;
    }
    if (!employee) {
        return <Typography variant="h6">Employee not found</Typography>;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployee({ ...employee, [name]: value });
    }

    const handleSave = async () => {
        const payload = {
            ...employee,
            newComputer:
                employee.status === "Awaiting Action"
                    ? null
                    : employee.newComputer || null,
        };
        
        try {
            await fetch(`http://localhost:4000/employees/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            navigate('/employees');
        } catch (error) {
            console.error("Error updating employee:", error);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Edit Employee</Typography>
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
            <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                    labelId="status-label"
                    name="status"
                    value={employee.status ?? ''} // fallback if undefined
                    onChange={(event) => {
                    const newStatus = event.target.value;
                    setEmployee(prev => ({ ...prev, status: newStatus }));
                    }}
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
                value={employee.notes}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={4}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/employees')}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleSave}>
                    Save Changes
                </Button>
            </Box>
        </Box>
    )
}

export default EditEmployees;