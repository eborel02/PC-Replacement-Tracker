export const navBarStyles = {
    drawer: {
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            color: 'rgba(255, 255, 255, 0.7)',
            backgroundColor: '#0c0c22',
        },
        '& .Mui-selected': {
            color: '#e4e3ec',
            backgroundColor: '#292955b9',
            '&:hover': {
                backgroundColor: '#7576a3b9',
            }
        },
    },

    icons: {
        color: 'rgba(255, 255, 255, 0.7)',
        marginLeft: '20px',
    },

    text: {
        '& span': {
            marginLeft: '-10px',
            fontWeight: '600',
            fontSize: '16px',
        }
    }
};