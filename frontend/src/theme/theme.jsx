import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#e4e3ec',
            contrastText: '#000000',
            dark: '#006664',
            light: '#9de6e4',
        },

        secondary: {
            main: '#BCB0E6',
            contrastText: '#2E254C',
            dark: '#3D3166',     // SecondaryContainer
            light: '#C8C0E6',    // OnSecondaryContainer
        },

        error: {
            main: '#D66660',
            contrastText: '#4C100D',
            dark: '#661511',     // ErrorContainer
            light: '#E6ACA9',    // OnErrorContainer
        },

        background: {
            default: '#080813',  // darker backdrop
            paper: '#070716',    // card/nav surface
        },

        text: {
            primary: '#E2E6E5',  // OnBackground / OnSurface
            secondary: '#E4EAEA', // OnSurfaceVariant
        },

        divider: '#DBE1E0',

        action: {
            hover: 'rgba(255, 255, 255, 0.08)',   // soft teal glow
            selected: 'rgba(127, 230, 227, 0.14)',
        },

    }
});

export default theme;