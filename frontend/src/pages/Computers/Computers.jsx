import { use, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { visuallyHidden } from "@mui/utils";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
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
    DialogActions
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";


const headCells = [
    { id: 'computerNumber', numeric: false, disablePadding: true, label: 'Computer Number' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
    { id: 'assignedTo', numeric: false, disablePadding: false, label: 'Assigned To' },
    { id: 'notes', numeric: false, disablePadding: false, label: 'Notes' },
    { id: 'actions', numeric: false, disablePadding: false, label: 'Actions'},
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
                        color = "primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all computers',
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
                            maxWidth: headCell.maxWidth,
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
    onAddComputer: PropTypes.func.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { numSelected, onAddComputer } = props;

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
                    color = "inherit"
                    variant = "subtitle1"
                    component = "div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant = "h6"
                    id = "tableTitle"
                    component = "div"
                >
                    Computers
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
                    <Tooltip title="Add Computer">
                        <IconButton onClick={onAddComputer}>
                            <AddIcon />
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

const Computers = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    // FETCHING COMPUTERS FROM BACKEND
    const [computers, setComputers] = useState([]);
    const fetchComputer = async () => {
        try {
            const response = await fetch("http://localhost:4000/computers");
            const data = await response.json();
            setComputers(data.computers);
        } catch (error) {
            console.error("Error fetching computers:", error);
        }
    };
    useEffect(() => {
        fetchComputer();
    }, []);

    const statusColors = {
        Available: theme.palette.success.main,
        Assigned: theme.palette.warning.main,
        'Under Maintenance': theme.palette.error.main,
    };

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [computerToDelete, setComputerToDelete] = useState(null);

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('computerNumber');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = computers.map((n) => n.computerNumber);
            setSelected(newSelecteds);
        } else {
            setSelected([]);
        }
    };

    const handleClick = (event, computerNumber) => {
        const selectedIndex = selected.indexOf(computerNumber);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = [...selected, computerNumber];
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

    const handleRowEdit = (computerId) => {
        navigate(`/computers/${computerId}/edit`);
    };

    const handleOpenDeleteDialog = (computer) => {
        setComputerToDelete(computer);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setComputerToDelete(null);
        setDeleteDialogOpen(false);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:4000/computers/${computerToDelete}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete computer');
            }

            setComputers(computers.filter(computer => computer._id !== computerToDelete));
            setSelected(selected.filter(id => id !== computerToDelete));
        } catch (error) {
            console.error('Error deleting computer:', error);
        } finally {
            handleCloseDeleteDialog();
        }
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - computers.length) : 0;

    const visibleRows = useMemo(() => {
        return computers
            .slice()
            .sort(getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [computers, order, orderBy, page, rowsPerPage]);

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Computer Inventory
            </Typography>

            <Paper>
                <EnhancedTableToolbar numSelected={selected.length} onAddComputer={() => navigate('/computers/new')} />
                <TableContainer>
                    <Table>
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={computers.length}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {
                                const isItemSelected = selected.indexOf(row.computerNumber) !== -1;
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.computerNumber}
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
                                                    handleClick(event, row.computerName);
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                        >
                                            {row.computerNumber}
                                        </TableCell>
                                        
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
                                            {row.assignedTo
                                                ? row.assignedTo.employeeName
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
                                                size="small"
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
                    count={computers.length}
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
                    {"Delete Computer?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this computer?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} autoFocus color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Computers;