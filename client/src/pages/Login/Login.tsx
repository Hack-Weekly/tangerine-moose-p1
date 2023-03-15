import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import React, { FC, useRef, useState } from 'react';
import styles from './Login.module.css';
import LoginForm from './LoginForm/LoginForm';

interface LoginProps {}

const Login: FC<LoginProps> = () => {
  const [bypassLogin, setBypassLogin] = useState(false);
  const [password, setPassword] = useState('');

  const handleSetByPassLogin = () => {
    if (!bypassLogin) {
      setPassword('');
    }
    setBypassLogin(!bypassLogin);
  };

  const handleSetPassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  return (
    <Box>
      <Typography
        component='h1'
        variant='h4'
        sx={{
          position: 'absolute',
          top: 40,
          left: 0,
          right: 0,
        }}
      >
        The Tangerine Moose Chatroom
      </Typography>

      <Typography component='h1' variant='h4'>
        {bypassLogin ? 'Let\'s chat!' : 'Login'}
      </Typography>

      <LoginForm
        password={password}
        bypassLogin={bypassLogin}
        onSetBypassLogin={handleSetByPassLogin}
        onSetPassword={handleSetPassword}
      />
    </Box>
  );
};

export default Login;
