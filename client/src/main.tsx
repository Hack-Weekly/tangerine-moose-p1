import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '@fontsource/roboto'; // Defaults to weight 400.
import { store } from './store/store';
import { Provider } from 'react-redux';
import { BrowserRouter, createBrowserRouter, Route, Router, RouterProvider, Routes } from 'react-router-dom';
import Login from 'pages/Login/Login';
import { Container, createTheme, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import Chatroom from 'pages/Chatroom/Chatroom';
import PrivateRoutes from 'utils/PrivateRoutes';
import SocketIO from 'utils/SocketIO';
import NavBar from 'components/AppBar/NavBar';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true; // removes the `xs` breakpoint
    sm: true;
    md: true;
    lg: true;
    xl: true;
  }
}
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <Provider store={store}>
        <SocketIO>
          <BrowserRouter>
            <NavBar></NavBar>
            <Container className="main-container">
              <Routes>
                <Route>
                  <Route element={<PrivateRoutes />}>
                    <Route element={<Chatroom></Chatroom>} path='chatroom'></Route>
                  </Route>
                </Route>
                <Route element={<Login></Login>} path='/'></Route>
              </Routes>
            </Container>
          </BrowserRouter>
        </SocketIO>
        <CssBaseline />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
