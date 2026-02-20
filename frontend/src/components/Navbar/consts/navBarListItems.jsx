import PeopleIcon from '@mui/icons-material/People';
import ComputerIcon from '@mui/icons-material/Computer';
import DashboardIcon from '@mui/icons-material/Dashboard';

// This file contains the list of items to be rendered in the main navigation bar. Each item has an id, icon, label, and route.
export const mainNavBarItems = [
    {
        id: 0,
        icon: <DashboardIcon />,
        label: 'Dashboard',
        route: 'dashboard'
    },
    {
        id: 1,
        icon: <PeopleIcon />,
        label: 'Employees',
        route: 'employees'
    },
    {
        id: 2,
        icon: <ComputerIcon />,
        label: 'Computers',
        route: 'computers'
    }
]
