import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Typography, Box, Grid } from '@mui/material';
import StatCard from '../../components/Dashboard/StatCard';
import SemiCircleProgress from '../../components/Dashboard/SemiCircleProgress';

const Dashboard = () => {
    const theme = useTheme();
    const panelBgColor = "#313144"; // Slightly lighter than the default background for better contrast
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);

    const employeeStats = [
        { title: 'Total Employees', value: dashboardData?.employees?.total || 0, color: '#1976D2' },
        { title: 'Replaced', value: dashboardData?.employees?.replaced || 0, color: theme.palette.success.main },
        { title: 'Awaiting Action', value: dashboardData?.employees?.awaiting || 0, color: theme.palette.warning.main },
        { title: 'Pulled Without Replacement', value: dashboardData?.employees?.pulled || 0, color: theme.palette.error.main }, 
    ]

    const computerStats = [
        { title: 'Total Computers', value: dashboardData?.computers?.total || 0, color: '#1976D2' },
        { title: 'Assigned', value: dashboardData?.computers?.assigned || 0, color: theme.palette.success.main },
        { title: 'Available', value: dashboardData?.computers?.available || 0, color: theme.palette.warning.main },
        { title: 'In Maintenance', value: dashboardData?.computers?.maintenance || 0, color: theme.palette.error.main }, 
    ]

    const statusColorMap = { 
        'Total Employees': '#1976D2',
        'Total Computers': '#1976D2',
        'Replaced': theme.palette.success.main,
        'Assigned': theme.palette.success.main,
        'Awaiting Action': theme.palette.warning.main,
        'Available': theme.palette.warning.main,
        'Pulled Without Replacement': theme.palette.error.main,
        'In Maintenance': theme.palette.error.main,
    }
    
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('http://localhost:4000/dashboard');
                const data = await response.json();
                console.log('Dashboard data:', data);
                setDashboardData(data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []); 

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            <Box sx={{ p:3, mb:4, bgcolor: panelBgColor, borderRadius: 4 }}>
            <Typography variant="h6" sx={{ mt: 3 }}>
                Employee Metrics
            </Typography>

            <Grid container spacing={3}>
                {employeeStats.map((stat) => (
                    <Grid key={stat.title} size={{ xs:12, md: 3 }}>
                        <StatCard title={stat.title} value={stat.value} color={stat.color} />
                    </Grid>
                ))}
            </Grid>
            </Box>

            <Box sx={{ mt:3 }}>
                <Typography variant="h6" fontWeight="bold" textAlign="center">
                    Overall Completion Rate:
                </Typography>
                <SemiCircleProgress
                    value={Math.round(dashboardData?.operational?.completionRate || 0)}
                    label="Completion Rate"
                />
            </Box>

            <Box sx={{ p:3, mb:4, bgcolor: panelBgColor, borderRadius: 4 }}>
            <Typography variant="h6" sx={{ mt: 3 }}>
                Computer Metrics
            </Typography>

            <Grid container spacing={3}>
                {computerStats.map((stat) => (
                    <Grid key={stat.title} size={{ xs:12, md: 3 }}>
                        <StatCard title={stat.title} value={stat.value} color={stat.color} />
                    </Grid>
                ))}
            </Grid>
            </Box>

            <Box sx={{ mt:3 }}>
                <Typography variant="h6" fontWeight="bold" textAlign="center">
                    Operational Shortage:
                </Typography>
                <Typography 
                    variant="h4" 
                    textAlign="center"
                    color=
                        {dashboardData?.operational?.shortage > 0 
                        ? theme.palette.error.main 
                        : theme.palette.success.main} 
                    fontWeight="bold">
                    {dashboardData?.operational?.shortage || 0} Computers
                </Typography>
            </Box>
        </>
    )

}

export default Dashboard;