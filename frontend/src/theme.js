import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff4081', // Neon pink
    },
    background: {
      default: '#1c1c1c', // Dark background
    },
    text: {
      primary: '#ffffff',
      secondary: '#bdbdbd',
    },
  },
  typography: {
    h2: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 700,
    },
    h6: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontFamily: 'Roboto, sans-serif',
    },
  },
});

export default theme;