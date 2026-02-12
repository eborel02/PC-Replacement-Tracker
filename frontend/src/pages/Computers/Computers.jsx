import { use, useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const Computers = () => {
    const theme = useTheme();
    const [computers, setComputers] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchComputer();
    }, []);

    const fetchComputer = async () => {
        try {
            const response = await fetch("http://localhost:4000/computers");
            const data = await response.json();
            setComputers(data.computers);
        } catch (error) {
            console.error("Error fetching computers:", error);
        }
    };

    const statusColors = {
        Available: theme.palette.success.main,
        Assigned: theme.palette.warning.main,
        'Under Maintenance': theme.palette.error.main,
    };

    const handleRowEdit = (computerId) => {
        navigate(`/computers/${computerId}/edit`);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Computer Inventory
            </Typography>

            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Computer</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Assigned To</TableCell>
                                <TableCell>Notes</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {computers.map((computer) => (
                                <TableRow key={computer._id} hover>
                                    <TableCell>{computer.computerNumber}</TableCell>

                                    <TableCell>
                                        <Chip
                                            label={computer.status}
                                            sx={{
                                                color: statusColors[computer.status],
                                                borderColor: statusColors[computer.status],
                                            }}
                                            variant="outlined"
                                            size="small"
                                        />
                                    </TableCell>

                                    <TableCell>
                                        {computer.assignedTo
                                            ? computer.assignedTo.employeeName
                                            : '—'}
                                    </TableCell>

                                    <TableCell>{computer.notes || '—'}</TableCell>

                                    <TableCell align="right">
                                        <IconButton 
                                            aria-label="edit"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRowEdit(computer._id);
                                            }}
                                            size="small">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton size="small" color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {computers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No computers found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default Computers;