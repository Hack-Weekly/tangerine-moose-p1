import PropTypes from 'prop-types';
import React, { FC, forwardRef, useState } from 'react';
import styles from './LoginForm.module.css';
import { red } from '@mui/material/colors';
import { FormControl, FormHelperText, Input, InputLabel, Button, Checkbox, FormControlLabel, Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import { RootState } from 'store/store';
import { useSelector } from 'react-redux';
import LeaveRoomButton from 'components/LeaveRoomButton/LeaveRoomButton';
import DisconnectButton from 'components/DisconnectButton/DisconnectButton';

interface LoginFormProps {
  username: string;
  password: string;
  bypassLogin: boolean;
  usernameTaken: boolean;
  onSetPassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSetBypassLogin: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConnect: (e: React.MouseEvent<HTMLElement>) => void;
}

const css = {
  helper: {
    color: red[300],
  },
};

const LoginForm: FC<LoginFormProps> = ({
  username,
  password,
  onSetPassword,
  bypassLogin,
  onSetBypassLogin,
  onUsernameChange,
  onConnect,
  usernameTaken,
}) => {
  const joinedServer = useSelector((state: RootState) => state.user.joinedServer);
  const connected = useSelector((state: RootState) => state.user.connected);

  const handleSetPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSetPassword(e);
  };

  const handleSetBypassLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSetBypassLogin(e);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUsernameChange(e);
  };

  const handleConnect = (e: React.MouseEvent<HTMLElement>) => {
    onConnect(e);
  };

  return (
    <FormControl>
      <TextField
        margin='dense'
        required
        fullWidth
        name='username'
        label={bypassLogin ? 'Nickname' : 'Username'}
        type='text'
        id='username'
        autoComplete='current-username'
        variant='filled'
        value={username}
        onChange={handleUsernameChange}
        helperText={usernameTaken ? 'This username is currently taken' : ''}
        FormHelperTextProps={{
          style: css.helper,
        }}
      />

      {!bypassLogin && (
        <TextField
          margin='dense'
          required
          fullWidth
          name='password'
          label='Password'
          type='password'
          id='password'
          autoComplete='current-password'
          variant='filled'
          value={password}
          onChange={handleSetPassword}
        />
      )}

      <Button variant='contained' sx={{ mt: 2 }} onClick={handleConnect} disabled={joinedServer}>
        {bypassLogin ? 'Join' : 'Login'}
      </Button>
      <DisconnectButton sx={{ mt: 2 }}/>
      <FormControlLabel
        control={<Checkbox value='no-login' color='primary' checked={bypassLogin} onChange={handleSetBypassLogin} />}
        label='Join as a guest'
      />
    </FormControl>
  );
};

export default LoginForm;
