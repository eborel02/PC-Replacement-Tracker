import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import {
    Box,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Button,
    Typography,
} from '@mui/material';

const EditComputer = () => {
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

    useEffect(() => {
        const fetchComputerAndEmployees = async () => {
            try {
                // 1️⃣ Fetch computer
                const responseComp = await fetch(`http://localhost:4000/computers/${id}`);
                const dataComp = await responseComp.json();
                const assignedEmployee = dataComp.computer.assignedTo;

                setOriginalAssignedTo(assignedEmployee?._id || null);
                setComputer({
                    computerNumber: dataComp.computer.computerNumber,
                    status: dataComp.computer.status,
                    assignedTo: assignedEmployee?._id || '',
                    notes: dataComp.computer.notes || '',
                });

                // 2️⃣ Fetch employees
                const responseEmp = await fetch('http://localhost:4000/employees');
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setComputer(prev => ({ 
            ...prev, 
            [name]: value,
            ...(name === 'status' && value !== 'Assigned') ? { assignedTo: '' } : {}    
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:4000/computers/${id}`, {
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
            navigate('/computers');
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
                    fullWidth
                    margin="normal"
                    required
                />

                <FormControl fullWidth margin="normal">
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
                </FormControl>
                
                {computer.status === 'Assigned' && (
                    <FormControl fullWidth margin="normal">
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