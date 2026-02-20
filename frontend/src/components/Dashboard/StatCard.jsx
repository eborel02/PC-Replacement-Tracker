import { Box, Typography } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

// StatCard component for displaying key metrics on the dashboard
const StatCard = ({ title, value, color = '#1976d2', onClick }) => {
    const theme = useTheme();

    return (
        <Box
            onClick={onClick}
            sx={{
                p: 2,
                bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.8) : theme.palette.background.paper, // adaptive background
                borderRadius: 2,
                boxShadow: 3,
                borderTop: `5px solid ${color}`, // vertical accent
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 120,
                cursor: onClick ? 'pointer' : 'default',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': onClick ? {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                } : {},
            }}
        >
            <Typography variant="subtitle2" color="textSecondary">
                {title}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
                {value}
            </Typography>
        </Box>
    );
};

export default StatCard;
