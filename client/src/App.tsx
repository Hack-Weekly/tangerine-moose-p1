import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import { createTheme, CssBaseline } from '@mui/material'
import { ThemeProvider } from '@emotion/react'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Login/>
    </ThemeProvider>
  )
}

export default App
