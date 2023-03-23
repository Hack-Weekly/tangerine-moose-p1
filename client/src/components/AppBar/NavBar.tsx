import { Button, IconButton, Toolbar, Typography,AppBar, Box } from '@mui/material';
import DisconnectButton from 'components/DisconnectButton/DisconnectButton';
import React, { FC } from 'react';
import styles from './NavBar.module.css';

interface NavBarProps {}

const NavBar: FC<NavBarProps> = () => (
  <Box>
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' component='div'  sx={{ flexGrow: 1 }}>
          The Tangerine Chatroom
        </Typography>
        <DisconnectButton/>
      </Toolbar>
    </AppBar>
  </Box>
);

export default NavBar;
