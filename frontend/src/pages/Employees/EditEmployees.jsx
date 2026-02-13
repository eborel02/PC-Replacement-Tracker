import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useMemo } from 'react';

const EditEmployees = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [originalAssignedTo, setOriginalAssignedTo] = useState(null);
    const [computers, setComputers] = useState([]);
    const [employee, setEmployee] = useState({
        employeeName: '',
        email: '',
        currentComputer: '',
        status: 'Awaiting Action',
        newComputer: '',
        notes: '',
    });

    useEffect(() => {
        const fetchEmployeeAndComputers = async () => {
            try {
                // Fetch employee
                const responseEmp = await fetch(`http://localhost:4000/employees/${id}`);
                const dataEmp = await responseEmp.json();
                const assignedComputer = dataEmp.employee.newComputer;
                setOriginalAssignedTo(assignedComputer?._id || null);
                setEmployee({
                    employeeName: dataEmp.employee.employeeName,
                    email: dataEmp.employee.email,
                    currentComputer: dataEmp.employee.currentComputer,
                    status: dataEmp.employee.status,
                    newComputer: assignedComputer?._id || '',
                    notes: dataEmp.employee.notes || '',
                });

                // Fetch computers
                const responseComp = await fetch('http://localhost:4000/computers');
                const dataComp = await responseComp.json();

                // Add currently assigned computer if missing
                let compList = dataComp.computers;
                if (assignedComputer && !compList.find(c => c._id === assignedComputer._id)) {
                    compList = [...compList, assignedComputer];
                }
                setComputers(compList);
            } catch (error) {
                console.error("Error fetching employee:", error);
            }
        };
        
        fetchEmployeeAndComputers();
    }, [id]);

    const selectableComputers = useMemo(() => {
        if (!Array.isArray(computers)) return [];

        // Computers WITHOUT assigned employee
        let list = computers.filter(c => !c.assignedTo);

        // Allow currently assigned computer to be selectable
        if (originalAssignedTo) {
            const assigned = computers.find(
                c => c._id === originalAssignedTo
            );
            if (assigned && !list.some(c => c._id === assigned._id)) {
                list = [...list, assigned];
            }
        }
        return list;
    }, [computers, originalAssignedTo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'status' && value !== 'Replaced') ? { newComputer: '' } : {}
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:4000/employees/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employee),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update employee');
            }
            navigate('/employees');
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" mb={2}>Edit Employee {employee.employeeName}</Typography>
            <form onSubmit={handleSave}>
                <TextField
                    label="Employee Name"
                    name="employeeName"
                    value={employee.employeeName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />

                <TextField
                    label="Email"
                    name="email"
                    value={employee.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Current Computer"
                    name="currentComputer"
                    value={employee.currentComputer}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Status</InputLabel>
                    <Select
                        name="status"
                        value={employee.status}
                        onChange={handleChange}
                        label="Status"
                    >
                        <MenuItem value="Awaiting Action">Awaiting Action</MenuItem>
                        <MenuItem value="Pulled Without Replacement">Pulled Without Replacement</MenuItem>
                        <MenuItem value="Replaced">Replaced</MenuItem>
                    </Select>
                </FormControl>

                {employee.status === 'Replaced' && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel>New Computer</InputLabel>
                        <Select
                            name="newComputer"
                            value={employee.newComputer}
                            onChange={handleChange}
                            label="New Computer"
                        >
                            <MenuItem value="">-- Select Computer --</MenuItem>
                            {selectableComputers.map(computer => (
                                <MenuItem key={computer._id} value={computer._id}>
                                    {computer.computerNumber}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                <TextField
                    label="Notes"
                    name="notes"
                    value={employee.notes}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button variant="outlined" onClick={() => navigate('/employees')} sx={{ mt: 2 }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>Save Changes</Button>
                </Box>
            </form>
        </Box>
    )
}

export default EditEmployees;