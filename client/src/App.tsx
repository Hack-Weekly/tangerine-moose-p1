import { useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import { createTheme, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Chatroom from './pages/Chatroom/Chatroom';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <Router>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Chatroom />
      </ThemeProvider>
    </Router>
  );
}

export default App;
