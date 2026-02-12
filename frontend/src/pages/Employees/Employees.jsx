import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { visuallyHidden } from '@mui/utils';
import { useState, useEffect } from 'react';
import { Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import { keyframes, width } from '@mui/system';

const statusPulse = keyframes`
  0% {
    background-color: transparent;
  }
  30% {
    background-color: currentColor;
  }
  100% {
    background-color: transparent;
  }
`;


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

const headCells = [
    { id: 'employeeName', numeric: false, disablePadding: true, label: 'Employee Name' },
    { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
    { id: 'currentComputer', numeric: false, disablePadding: false, label: 'Current Computer' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status', width: '300px' },
    { id: 'newComputer', numeric: false, disablePadding: false, label: 'New Computer' },
    { id: 'notes', numeric: false, disablePadding: false, label: 'Notes'},
    { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' }
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell />
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
  const { numSelected, onAddEmployee } = props;
  
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
            <Tooltip title="Delete">
                <IconButton>
                <DeleteIcon />
                </IconButton>
            </Tooltip>
            ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Add Employee">
                <IconButton color="primary" onClick={onAddEmployee}>
                    <AddIcon />
                </IconButton>
                </Tooltip>

                <Tooltip title="Filter list">
                <IconButton>
                    <FilterListIcon />
                </IconButton>
                </Tooltip>
            </Box>
        )}

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

    const statusColors = {
        "Awaiting Action": theme.palette.warning.main,
        "Pulled Without Replacement": theme.palette.error.main,
        "Replaced": theme.palette.success.main,
    };

    // FETCHING EMPLOYEES FROM BACKEND
    const [employees, setEmployees] = useState([]);
    async function fetchEmployees() {
        try {
            const response = await fetch('http://localhost:4000/employees')
            const data = await response.json();
            console.log(data.employees);
            setEmployees(data.employees);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }}
    useEffect(() => {
        fetchEmployees();
    }, [])

    const navigate = useNavigate();

    // DELETE DIALOG STATE AND HANDLERS
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('employeeName');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [recentyUpdatedId, setRecentlyUpdatedId] = useState(null);
    
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = employees.map((n) => n.employeeName);
            setSelected(newSelecteds);
        } else {
            setSelected([]);
        }
    };

    const handleClick = (event, employeeName) => {
        const selectedIndex = selected.indexOf(employeeName);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = [...selected, employeeName];
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

    const handleChangeDense = () => {
        setDense(!dense);
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - employees.length) : 0;

    const visibleRows = React.useMemo(() => {
        return employees
            .slice()
            .sort(getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [employees, order, orderBy, page, rowsPerPage]);

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar numSelected={selected.length} onAddEmployee={() => navigate("/employees/new")} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
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
                                const isItemSelected = selected.indexOf(row.employeeName) !== -1;
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.employeeName}
                                        selected={isItemSelected}
                                        sx={{ 
                                            cursor: 'pointer',
                                            position: 'relative',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                bottom: 0,
                                                width: '4px',
                                                backgroundColor: statusColors[row.status] ?? 'transparent', 
                                                animation: recentyUpdatedId === row._id 
                                                    ? `${statusPulse} 0.6s ease` 
                                                    : 'none',
                                                // transition: 'opacity 200ms ease',
                                                },
                                            transition: 'background-color 0.2s ease, transform 0.2s ease',
                                            backgroundColor: recentyUpdatedId === row._id 
                                                ? alpha(statusColors[row.status] ?? theme.palette.primary.main, 0.12) 
                                                : 'inherit',
                                            // transform: recentyUpdatedId === row._id
                                            //     ? 'translateX(4px)' : 'translateX(0)',
                                            '&:hover': {
                                                backgroundColor: theme.palette.action.hover,
                                            }
                                        }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{ 'aria-labelledby': labelId }}
                                                onClick={(event) => {
                                                event.stopPropagation();
                                                handleClick(event, row.employeeName);
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
                                        <TableCell align="left">{row.email}</TableCell>
                                        <TableCell align="left">{row.currentComputer}</TableCell>

                                        <TableCell 
                                            align="left"
                                            sx={{
                                                width: '300px',
                                                maxWidth: '300px',
                                            }}
                                        >
                                            <Select
                                                value={row.status}
                                                onChange={async (e) => {
                                                    const newStatus = e.target.value;

                                                    try {
                                                        const response = await fetch(`http://localhost:4000/employees/${row._id}`, {
                                                            method: 'PATCH',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                            },
                                                            body: JSON.stringify({ status: newStatus }),
                                                        });

                                                        if (!response.ok) {
                                                            throw new Error(`Failed to update employee status: ${response.status}`);
                                                        }

                                                        // Update the row in the local state
                                                        const updatedEmployees = employees.map(emp => {
                                                            if (emp._id !== row._id) return emp;

                                                            return {
                                                                ...emp,
                                                                status: newStatus,
                                                                newComputer:
                                                                newStatus === "Replaced"
                                                                    ? emp.newComputer
                                                                    : null,
                                                            };
                                                            });

                                                            setEmployees(updatedEmployees);
                                                            setRecentlyUpdatedId(row._id);

                                                            // Clear the recently updated ID after a delay
                                                            setTimeout(() => {
                                                                setRecentlyUpdatedId(null);
                                                            }, 600);

                                                    } catch (error) {
                                                        console.error('Error updating employee status:', error);
                                                    }
                                                }}
                                                sx={{
                                                    color: statusColors[row.status] ?? 'inherit',
                                                    transition: 'color 200ms ease',
                                                    '& .MuiSelect-icon': {
                                                        color: statusColors[row.status] ?? 'inherit',
                                                        transition: 'color 200ms ease',
                                                    },
                                                }}
                                            >
                                                <MenuItem value="Awaiting Action" sx={{ color: theme.palette.warning.main }}>Awaiting Action</MenuItem>
                                                <MenuItem value="Pulled Without Replacement" sx={{ color: theme.palette.error.main }}>Pulled Without Replacement</MenuItem>
                                                <MenuItem value="Replaced" sx={{ color: theme.palette.success.main }}>Replaced</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell align="left">{row.newComputer}</TableCell>
                                        <TableCell align="left">{row.notes}</TableCell>
                                        <TableCell align="left">
                                            <IconButton 
                                                aria-label="edit" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRowEdit(row._id);}}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton aria-label="delete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenDeleteDialog(row._id);
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
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
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            />
        </Box>
    );
};

export default Employees;