// @ts-nocheck

import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    Box,
    Button, 
    TextField, 
    Typography,
    Select,
    MenuItem,
    FormControl,
    FormHelperText,
    InputLabel,
} from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL;


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

    // Form state is separate to allow for validation errors
    const [formData, setFormData] = useState({
        employeeName: '',
        email: '',
        currentComputer: '',
        status: '',
        newComputer: '',
        notes: '',
    });
    const [errors, setErrors] = useState({});

    // Fetch employee and computers on mount
    useEffect(() => {
        const fetchEmployeeAndComputers = async () => {
            try {
                // Fetch employee
                const responseEmp = await fetch(`${API_URL}/employees/${id}`);
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
                const responseComp = await fetch(`${API_URL}/computers`);
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

    // Generate list of selectable computers based on status and current assignment
    const selectableComputers = useMemo(() => {
        if (!Array.isArray(computers)) return [];

        // Computers WITHOUT assigned employee
        let list = computers.filter(c => !c.assignedTo && c.status !== 'Maintenance');

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

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        setEmployee(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'status' && value !== 'Replaced') ? { newComputer: '' } : {}
        }));
    };

    // Validate form fields before submission
    const validateForm = () => {
        const newErrors = {};

        if (!employee.employeeName.trim()) {
            newErrors.employeeName = 'Employee Name is required';
        }

        if (!employee.currentComputer.trim()) {
            newErrors.currentComputer = 'Current Computer is required';
        }

        if (!employee.status) {
            newErrors.status = 'Status is required';
        }

        if (employee.status === 'Replaced' && !employee.newComputer) {
            newErrors.newComputer = 'New Computer is required when status is Replaced';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission to update employee
    const handleSave = async (e) => {
        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/employees/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employee),
            });

            console.log('Update response:', employee);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update employee');
            }
            navigate('/employees', { state: { successMessage: 'Employee updated successfully!' } });
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
                    error={Boolean(errors.employeeName)}
                    helperText={errors.employeeName}
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
                    error={Boolean(errors.currentComputer)}
                    helperText={errors.currentComputer}
                    fullWidth
                    margin="normal"
                />

                <FormControl fullWidth error={Boolean(errors.status)} margin="normal">
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
                    <FormHelperText>{errors.status}</FormHelperText>
                </FormControl>

                {employee.status === 'Replaced' && (
                    <FormControl fullWidth error={Boolean(errors.newComputer)} margin="normal">
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
                        <FormHelperText>{errors.newComputer}</FormHelperText>
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