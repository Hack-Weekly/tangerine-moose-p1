import PropTypes from "prop-types"
import React, { FC, forwardRef, useState } from 'react';
import styles from './LoginForm.module.css';
import {
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Button,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import TextField from '@mui/material/TextField';

interface LoginFormProps {
  bypassLogin: boolean;
  password: string;
  onSetPassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSetBypassLogin: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LoginForm: FC<LoginFormProps> = ({ password, onSetPassword, bypassLogin, onSetBypassLogin}) => {
  const handleSetPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSetPassword(e);
  };

  const handleSetBypassLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSetBypassLogin(e);
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

      <Button variant='contained' sx={{ mt: 2 }}>
        {bypassLogin ? 'Join' : 'Login'}
      </Button>

      <FormControlLabel
        control={
          <Checkbox
            value='no-login'
            color='primary'
            checked={bypassLogin}
            onChange={handleSetBypassLogin}
          />
        }
        label='Join as a guest'
      />
    </FormControl>
  );
};

export default LoginForm;
