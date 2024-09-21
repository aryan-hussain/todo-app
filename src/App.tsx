import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import './App.css'
import Routing from './routing';
import { Provider } from 'react-redux';
import store from './store/store';

const theme = createTheme({
  // Customize your theme here
});

function App() {


  return (
    <>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routing />
        </ThemeProvider>
      </Provider>

    </>
  )
}

export default App
