import PeopleIcon from '@mui/icons-material/People';
import ComputerIcon from '@mui/icons-material/Computer';
import DashboardIcon from '@mui/icons-material/Dashboard';

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
