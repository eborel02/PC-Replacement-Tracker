import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Typography,
    Chip,
    Button,
    IconButton,
    Checkbox,
    Toolbar,
    Tooltip,
    TablePagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Menu,
    MenuItem,
    Alert,
    Snackbar
} from "@mui/material";
import PropTypes from 'prop-types';
import { FilterList } from '@mui/icons-material';

const headCells = [
    { id: 'employeeName', numeric: false, disablePadding: true, label: 'Employee Name' },
    { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
    { id: 'currentComputer', numeric: false, disablePadding: false, label: 'Current Computer' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
    { id: 'newComputer', numeric: false, disablePadding: false, label: 'New Computer' },
    { id: 'notes', numeric: false, disablePadding: false, label: 'Notes'},
    { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' },
]

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all employees',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{
                            width: headCell.width,
                            maxWidth: headCell.width,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onAddEmployee: PropTypes.func.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
}

function EnhancedTableToolbar(props) {
    const { numSelected, onAddEmployee, statusFilter, onBulkDelete } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setAnchorEl(null);
    }

    const open = Boolean(anchorEl);
  
    return (
        <Toolbar
        sx={[
            {
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            },
            numSelected > 0 && {
            bgcolor: (theme) =>
                alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            },
        ]}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant = "subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Employees
                </Typography>
            )}
            {numSelected > 0 ? (
                <Tooltip title="Delete Selected">
                    <IconButton color="error" onClick={onBulkDelete}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
                ) : (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Tooltip title="Filter by Status">
                        <IconButton onClick={handleFilterClick} color={statusFilter ? 'primary' : 'default'}>
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Add Employee">
                    <IconButton color="primary" onClick={onAddEmployee}>
                        <AddIcon />
                    </IconButton>
                    </Tooltip>
                </Box>
            )}

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleFilterClose}
                sx={{ fontSize: '0.9rem' }}
            >
                <MenuItem onClick={() => {
                    navigate(`/employees`);
                    handleFilterClose();
                }}>
                    All
                </MenuItem>

                <MenuItem onClick={() => {
                    navigate(`/employees?status=Awaiting%20Action`);
                    handleFilterClose();
                }}>
                    Awaiting Action
                </MenuItem>

                <MenuItem onClick={() => {
                    navigate(`/employees?status=Pulled%20Without%20Replacement`);
                    handleFilterClose();
                }}>
                    Pulled Without Replacement
                </MenuItem>

                <MenuItem onClick={() => {
                    navigate(`/employees?status=Replaced`);
                    handleFilterClose();
                }}>
                    Replaced
                </MenuItem>
            </Menu>
        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

/*=========================/
/    EMPLOYEE COMPONENT    /
/=========================*/
const Employees = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [statusFilter, setStatusFilter] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const status = params.get('status');

        if (status) {
            setStatusFilter(status);
        } else {
            setStatusFilter(null);
        }
    })

    // FETCHING EMPLOYEES FROM BACKEND
    const [employees, setEmployees] = useState([]);
    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:4000/employees')
            const data = await response.json();
            setEmployees(data.employees);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };
    useEffect(() => {
        fetchEmployees();
    }, [])

    const filteredEmployees = employees.filter(employee => 
        statusFilter ? employee.status === statusFilter : true
    );

    const statusColors = {
        "Awaiting Action": theme.palette.warning.main,
        "Pulled Without Replacement": theme.palette.error.main,
        "Replaced": theme.palette.success.main,
    };

    // DELETE DIALOG STATE AND HANDLERS
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);

    const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('employeeName');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    useEffect(() => {
        if (location.state?.successMessage) {
            showSnackbar(location.state.successMessage);
        }
    }, [location.state]);
    
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = filteredEmployees.map((n) => n._id);
            setSelected(newSelecteds);
        } else {
            setSelected([]);
        }
    };

    const handleClick = (event, employeeId) => {
        const selectedIndex = selected.indexOf(employeeId);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = [...selected, employeeId];
        } else if (selectedIndex === 0) {
            newSelected = selected.slice(1);
        } else if (selectedIndex === selected.length - 1) {
            newSelected = selected.slice(0, -1);
        } else {
            newSelected = [
                ...selected.slice(0, selectedIndex),
                ...selected.slice(selectedIndex + 1),
            ];
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRowEdit = (employeeId) => {
        navigate (`/employees/${employeeId}/edit`);
    };

    const handleOpenDeleteDialog = (employeeId) => {
        setEmployeeToDelete(employeeId);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setEmployeeToDelete(null);
        setDeleteDialogOpen(false);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:4000/employees/${employeeToDelete}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete employee');
            }

            setEmployees(employees.filter(employee => employee._id !== employeeToDelete));
            setSelected(selected.filter(name => name !== employeeToDelete));
        } catch (error) {
            console.error('Error deleting employee:', error);
        } finally {
            handleCloseDeleteDialog();
        }
    };

    const handleOpenBulkDeleteDialog = () => {
        setBulkDeleteDialogOpen(true);
    };

    const handleCloseBulkDeleteDialog = () => {
        setBulkDeleteDialogOpen(false);
    };

    const handleConfirmBulkDelete = async () => {
        try {
            const response = await fetch(`http://localhost:4000/employees/bulk-delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ employeeIDs: selected}),
            });

            if (!response.ok) {
                throw new Error('Failed to delete employees');
            }

            setEmployees(employees.filter(employee => !selected.includes(employee._id)));
            setSelected([]);
        } catch (error) {
            console.error('Error deleting employees:', error);
        } finally {
            handleCloseBulkDeleteDialog();
        }    
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - employees.length) : 0;

    const visibleRows = useMemo(() => {
        return filteredEmployees
            .slice()
            .sort(getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [filteredEmployees, order, orderBy, page, rowsPerPage]);

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Employees
            </Typography>

            {/* INFO ALERT */}
            <Alert severity="info" sx={{ mb: 2 }} variant="outlined">
                Note: This list shows the last known employee assigned to each computer.
                Replacing the computer listed does not necessarily mean replacing that employee's current computer.
                If you find a computer that is assigned to someone other than who is currently listed, please update the employee's record with the correct employee info.
            </Alert>

            {statusFilter && (
                <Chip
                    label={`Filtered: ${statusFilter}`}
                    onDelete={() => navigate(`/employees`)}
                    color="primary"
                    sx={{ mb: 2 }}
                />
            )}


            <Paper>
                <EnhancedTableToolbar 
                    numSelected={selected.length} 
                    onAddEmployee={() => navigate("/employees/new")} 
                    statusFilter={statusFilter} 
                    setStatusFilter={setStatusFilter} 
                    onBulkDelete={handleOpenBulkDeleteDialog} 
                />
                <TableContainer>
                    <Table>
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={employees.length}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {
                                const isItemSelected = selected.indexOf(row._id) !== -1;
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row._id}
                                        selected={isItemSelected}
                                        sx={{ 
                                            cursor: 'pointer',
                                            position: 'relative',
                                        }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{ 'aria-labelledby': labelId }}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleClick(event, row._id);
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                        >
                                            {row.employeeName}
                                        </TableCell>

                                        <TableCell>{row.email}</TableCell>

                                        <TableCell>{row.currentComputer}</TableCell>

                                        <TableCell>
                                            <Chip
                                                label={row.status}
                                                sx={{
                                                    color: statusColors[row.status],
                                                    borderColor: statusColors[row.status],
                                                }}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </TableCell>

                                        <TableCell>
                                            {row.newComputer
                                                ? row.newComputer.computerNumber
                                                : '—'}
                                        </TableCell>

                                        <TableCell>{row.notes || '—'}</TableCell>

                                        <TableCell align="right">
                                            <IconButton 
                                                aria-label="edit" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRowEdit(row._id);
                                                }}
                                                size='small'
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton 
                                                aria-label="delete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenDeleteDialog(row._id);
                                                }}
                                                size="small"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={employees.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete Employee?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this employee?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} autoFocus color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={bulkDeleteDialogOpen}
                onClose={handleCloseBulkDeleteDialog}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle>
                    Delete {selected.length} Employees?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseBulkDeleteDialog}>Cancel</Button>
                    <Button onClick={handleConfirmBulkDelete} autoFocus color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Employees;